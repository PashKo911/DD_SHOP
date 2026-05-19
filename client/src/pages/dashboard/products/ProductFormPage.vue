<template>
	<ProductForm
		:form="form"
		:options="productOptionsValue"
		:errors="formErrors"
		:is-loading="isPageLoading"
		:is-saving="isSaving"
		:is-edit-mode="isEditMode"
		:api-base="apiConfig.apiBase"
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
import { computed, onBeforeUnmount, onMounted, reactive, watch } from 'vue'
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
	isEditMode.value ? isUpdateProductLoading.value : isCreateProductLoading.value,
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
	title: { en: '', uk: '' },
	description: { en: '', uk: '' },
	category: '',
	categoryKey: '',
	style: '',
	minPrice: null,
	maxPrice: null,
	maxRating: null,
	variants: [createEmptyVariant()],
})

const form = reactive(createEmptyFormState())
const formErrors = reactive({
	general: '',
	variants: [],
})

const revokePreviewUrls = (variant) => {
	variant.newImagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url))
}

const resetForm = () => {
	form.variants.forEach(revokePreviewUrls)
	const nextForm = createEmptyFormState()

	form.title = nextForm.title
	form.description = nextForm.description
	form.category = nextForm.category
	form.categoryKey = nextForm.categoryKey
	form.style = nextForm.style
	form.minPrice = nextForm.minPrice
	form.maxPrice = nextForm.maxPrice
	form.maxRating = nextForm.maxRating
	form.variants = nextForm.variants

	formErrors.general = ''
	formErrors.variants = []
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
	form.categoryKey = product?.categoryKey || ''
	form.style = product?.style?._id || product?.style || ''
	form.minPrice = Number(product?.minPrice ?? 0)
	form.maxPrice = Number(product?.maxPrice ?? 0)
	form.maxRating = Number(product?.maxRating ?? 0)
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

const setCategoryKey = () => {
	const category = productOptionsValue.value.categories.find(
		(item) => item._id === form.category,
	)

	form.categoryKey = category?.key || ''
}

watch(
	() => form.category,
	() => {
		setCategoryKey()
	},
)

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

const clearErrors = () => {
	formErrors.general = ''
	formErrors.titleEn = ''
	formErrors.titleUk = ''
	formErrors.descriptionEn = ''
	formErrors.descriptionUk = ''
	formErrors.category = ''
	formErrors.style = ''
	formErrors.minPrice = ''
	formErrors.maxPrice = ''
	formErrors.maxRating = ''
	formErrors.variants = []
}

const validateForm = () => {
	clearErrors()
	let isValid = true

	if (!form.title.en.trim()) {
		formErrors.titleEn = t('pages.dashboard.products.form.validation.required')
		isValid = false
	}

	if (!form.title.uk.trim()) {
		formErrors.titleUk = t('pages.dashboard.products.form.validation.required')
		isValid = false
	}

	if (form.description.en.trim().length < 10) {
		formErrors.descriptionEn = t(
			'pages.dashboard.products.form.validation.description',
		)
		isValid = false
	}

	if (form.description.uk.trim().length < 10) {
		formErrors.descriptionUk = t(
			'pages.dashboard.products.form.validation.description',
		)
		isValid = false
	}

	if (!form.category) {
		formErrors.category = t('pages.dashboard.products.form.validation.required')
		isValid = false
	}

	if (!form.style) {
		formErrors.style = t('pages.dashboard.products.form.validation.required')
		isValid = false
	}

	if (form.minPrice == null || form.minPrice < 0) {
		formErrors.minPrice = t('pages.dashboard.products.form.validation.number')
		isValid = false
	}

	if (form.maxPrice == null || form.maxPrice < 0) {
		formErrors.maxPrice = t('pages.dashboard.products.form.validation.number')
		isValid = false
	}

	if (
		form.minPrice != null &&
		form.maxPrice != null &&
		Number(form.maxPrice) < Number(form.minPrice)
	) {
		formErrors.maxPrice = t(
			'pages.dashboard.products.form.validation.maxPriceRange',
		)
		isValid = false
	}

	if (form.maxRating == null || form.maxRating < 0 || form.maxRating > 5) {
		formErrors.maxRating = t('pages.dashboard.products.form.validation.rating')
		isValid = false
	}

	formErrors.variants = form.variants.map((variant) => {
		const variantErrors = {}
		const imagesCount = variant.images.length + variant.newImages.length

		if (!variant.color) {
			variantErrors.color = t('pages.dashboard.products.form.validation.required')
			isValid = false
		}

		if (variant.price == null || variant.price < 0) {
			variantErrors.price = t('pages.dashboard.products.form.validation.number')
			isValid = false
		}

		if (variant.count == null || variant.count < 0) {
			variantErrors.count = t('pages.dashboard.products.form.validation.number')
			isValid = false
		}

		if (variant.rating == null || variant.rating < 0 || variant.rating > 5) {
			variantErrors.rating = t('pages.dashboard.products.form.validation.rating')
			isValid = false
		}

		if (!variant.sizes.length) {
			variantErrors.sizes = t('pages.dashboard.products.form.validation.required')
			isValid = false
		}

		if (!imagesCount) {
			variantErrors.images = t('pages.dashboard.products.form.validation.images')
			isValid = false
		}

		return variantErrors
	})

	return isValid
}

const buildFormData = () => {
	const payload = {
		title: form.title,
		description: form.description,
		category: form.category,
		categoryKey: form.categoryKey,
		style: form.style,
		minPrice: Number(form.minPrice),
		maxPrice: Number(form.maxPrice),
		maxRating: Number(form.maxRating),
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
	formData.append('categoryKey', payload.categoryKey)
	formData.append('style', payload.style)
	formData.append('minPrice', String(payload.minPrice))
	formData.append('maxPrice', String(payload.maxPrice))
	formData.append('maxRating', String(payload.maxRating))
	formData.append('variants', JSON.stringify(payload.variants))

	form.variants.forEach((variant, index) => {
		variant.newImages.forEach((file) => {
			formData.append(`variantImages-${index}`, file)
		})
	})

	return formData
}

const setOperationError = (operationName) => {
	const error = generalStore.hasError(operationName)

	formErrors.general =
		error?.response?.data?.error?.message ||
		t('pages.dashboard.products.form.submitError')
}

const goToProducts = () => {
	router.push({ name: routeNames.dashboardProducts })
}

const onSubmit = async () => {
	if (!validateForm()) return

	const formData = buildFormData()
	const savedProduct = isEditMode.value
		? await updateProduct(route.params.id, formData)
		: await createProduct(formData)

	if (!savedProduct) {
		setOperationError(
			isEditMode.value
				? productsStore.queryPresets.updateProduct.name
				: productsStore.queryPresets.createProduct.name,
		)
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

onMounted(async () => {
	await getProductOptions()

	if (isEditMode.value) {
		const product = await getAdminProduct(route.params.id)
		if (product) {
			hydrateForm(product)
		} else {
			setOperationError(productsStore.queryPresets.adminProduct.name)
		}
		return
	}

	setCategoryKey()
})

onBeforeUnmount(() => {
	form.variants.forEach(revokePreviewUrls)
	clearEditableProduct()
})
</script>
