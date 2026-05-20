<template>
	<ProductForm
		:form="form"
		:options="productOptionsValue"
		:is-loading="isPageLoading"
		:is-saving="isSaving"
		:is-edit-mode="isEditMode"
		:api-base="apiConfig.apiBase"
		:server-error="serverError"
		:key="formRenderKey"
		:form-render-key="formRenderKey"
		@submit="onSubmit"
		@cancel="goToProducts"
		@add-variant="addVariant"
		@remove-variant="removeVariant"
		@variant-files-selected="onVariantFilesSelected"
		@remove-existing-image="removeExistingImage"
		@remove-new-image="removeNewImage"
	/>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { v4 as uuidv4 } from 'uuid'
import { useI18n } from 'vue-i18n'

import routeNames from '@/router/routeNames'
import apiConfig from '@/config/api'

import { useProductsStore } from '@/stores/products'
import { useGeneralStore } from '@/stores/general'

import ProductForm from './ProductForm.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const { t } = useI18n()

const productsStore = useProductsStore()
const generalStore = useGeneralStore()

const {
	productOptionsValue,
	isProductOptionsLoading,
	isAdminProductLoading,
	isCreateProductLoading,
	isUpdateProductLoading,
} = storeToRefs(productsStore)

const {
	getProductOptions,
	getAdminProduct,
	createProduct,
	updateProduct,
	getDefaultProducts,
	clearEditableProduct,
} = productsStore

const isEditMode = computed(() => Boolean(route.params.id))

const isPageLoading = computed(
	() =>
		isProductOptionsLoading.value ||
		(isEditMode.value && isAdminProductLoading.value),
)

const isSaving = computed(() =>
	isEditMode.value
		? isUpdateProductLoading.value
		: isCreateProductLoading.value,
)

const createEmptyVariant = () => ({
	localId: uuidv4(),
	_id: null,
	color: '',
	price: null,
	oldPrice: null,
	count: 0,
	rating: null,
	sizes: [],
	images: [],
	newImages: [],
	newImagePreviews: [],
})

const createEmptyFormState = () => ({
	title: {
		en: '',
		uk: '',
	},
	description: {
		en: '',
		uk: '',
	},
	category: '',
	style: '',
	variants: [createEmptyVariant()],
})

const form = reactive(createEmptyFormState())

const serverError = computed(() => {
	const operationName = isEditMode.value
		? productsStore.queryPresets.updateProduct.name
		: productsStore.queryPresets.createProduct.name

	const error = generalStore.hasError(operationName)

	return error?.response?.data?.error?.message || ''
})

const revokePreviewUrls = (variant) => {
	variant.newImagePreviews.forEach((preview) =>
		URL.revokeObjectURL(preview.url),
	)
}

const resetForm = () => {
	form.variants.forEach(revokePreviewUrls)

	const nextForm = createEmptyFormState()

	Object.assign(form, nextForm)
}

const hydrateForm = (product) => {
	resetForm()

	form.title = {
		en: product?.title?.en || '',
		uk: product?.title?.uk || '',
	}

	form.description = {
		en: product?.description?.en || '',
		uk: product?.description?.uk || '',
	}

	form.category = product?.category?._id || product?.category || ''
	form.style = product?.style?._id || product?.style || ''

	form.variants = (product?.variants || []).map((variant) => ({
		localId: uuidv4(),
		_id: variant?._id || null,
		color: variant?.color?._id || variant?.color || '',
		price: Number(variant?.price ?? 0),
		oldPrice:
			variant?.oldPrice === null || variant?.oldPrice === undefined
				? null
				: Number(variant.oldPrice),
		count: Number(variant?.count ?? 0),
		rating: Number(variant?.rating ?? 0),
		sizes: (variant?.sizes || []).map((size) => size?._id || size),
		images: [...(variant?.images || [])],
		newImages: [],
		newImagePreviews: [],
	}))

	if (!form.variants.length) {
		form.variants = [createEmptyVariant()]
	}
}

const addVariant = () => {
	form.variants.push(createEmptyVariant())
}

const removeVariant = (index) => {
	const variant = form.variants[index]

	if (!variant) return

	revokePreviewUrls(variant)

	form.variants.splice(index, 1)
}

const onVariantFilesSelected = ({ index, files }) => {
	const variant = form.variants[index]

	if (!variant) return

	files.forEach((file) => {
		variant.newImages.push(file)

		variant.newImagePreviews.push({
			url: URL.createObjectURL(file),
			name: file.name,
		})
	})
}

const removeExistingImage = ({ index, imageIndex }) => {
	form.variants[index]?.images.splice(imageIndex, 1)
}

const removeNewImage = ({ index, imageIndex }) => {
	const variant = form.variants[index]

	if (!variant) return

	const [preview] = variant.newImagePreviews.splice(imageIndex, 1)

	variant.newImages.splice(imageIndex, 1)

	if (preview?.url) {
		URL.revokeObjectURL(preview.url)
	}
}

const buildFormData = (values) => {
	const payload = {
		title: values.title,
		description: values.description,
		category: values.category,
		style: values.style,
		variants: form.variants.map((variant) => ({
			...(variant._id ? { _id: variant._id } : {}),
			color: variant.color,
			price: Number(variant.price),
			oldPrice:
				variant.oldPrice === null || variant.oldPrice === ''
					? null
					: Number(variant.oldPrice),
			count: Number(variant.count),
			rating: Number(variant.rating),
			images: [...variant.images],
			sizes: [...variant.sizes],
		})),
	}

	const formData = new FormData()

	formData.append('title', JSON.stringify(payload.title))
	formData.append('description', JSON.stringify(payload.description))
	formData.append('category', payload.category)
	formData.append('style', payload.style)
	formData.append('variants', JSON.stringify(payload.variants))

	form.variants.forEach((variant, index) => {
		variant.newImages.forEach((file) => {
			formData.append(`variantImages-${index}`, file)
		})
	})

	return formData
}

const goToProducts = () => {
	router.push({
		name: routeNames.dashboardProducts,
	})
}

const onSubmit = async (values) => {
	const formData = buildFormData(values)

	const savedProduct = isEditMode.value
		? await updateProduct(route.params.id, formData)
		: await createProduct(formData)

	if (!savedProduct) {
		return
	}

	await getDefaultProducts()

	toast.add({
		severity: 'success',
		summary: t('pages.dashboard.products.form.successTitle'),
		detail: isEditMode.value
			? t('pages.dashboard.products.form.updateSuccess')
			: t('pages.dashboard.products.form.createSuccess'),
		life: 3000,
	})

	goToProducts()
}
const formRenderKey = ref(0)
onMounted(async () => {
	await getProductOptions()

	if (isEditMode.value) {
		const product = await getAdminProduct(route.params.id)

		if (product) {
			hydrateForm(product)
		}
		formRenderKey.value++
		return
	}
})

onBeforeUnmount(() => {
	form.variants.forEach(revokePreviewUrls)

	clearEditableProduct()
})
</script>
