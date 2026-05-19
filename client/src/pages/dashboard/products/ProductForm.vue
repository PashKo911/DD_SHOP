<template>
	<form class="flex flex-col gap-6" @submit.prevent="$emit('submit')">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 class="font-heading text-3xl font-semibold text-primary">
					{{ pageTitle }}
				</h1>
				<p class="mt-1 text-sm text-surface-500">
					{{ pageDescription }}
				</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<Button type="button" variant="outlined" @click="$emit('cancel')">
					{{ t('buttons.cancel') }}
				</Button>
				<Button type="submit" :loading="isSaving" :disabled="isSaving">
					{{ submitLabel }}
				</Button>
			</div>
		</div>

		<Message v-if="errors.general" severity="error">
			{{ errors.general }}
		</Message>

		<div v-if="isLoading" class="py-12 text-center text-surface-500">
			{{ t('pages.dashboard.products.form.loading') }}
		</div>

		<template v-else>
			<section class="grid gap-4 rounded-2xl bg-surface-50 p-4 lg:grid-cols-2">
				<div class="flex flex-col gap-1">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.titleEn') }}
					</label>
					<InputText v-model="form.title.en" fluid />
					<p v-if="errors.titleEn" class="text-sm text-red-500">
						{{ errors.titleEn }}
					</p>
				</div>

				<div class="flex flex-col gap-1">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.titleUk') }}
					</label>
					<InputText v-model="form.title.uk" fluid />
					<p v-if="errors.titleUk" class="text-sm text-red-500">
						{{ errors.titleUk }}
					</p>
				</div>

				<div class="flex flex-col gap-1 lg:col-span-2">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.descriptionEn') }}
					</label>
					<textarea
						v-model="form.description.en"
						rows="4"
						class="border-border-color focus:border-primary rounded-2xl border bg-white px-4 py-3 outline-none transition-colors"
					/>
					<p v-if="errors.descriptionEn" class="text-sm text-red-500">
						{{ errors.descriptionEn }}
					</p>
				</div>

				<div class="flex flex-col gap-1 lg:col-span-2">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.descriptionUk') }}
					</label>
					<textarea
						v-model="form.description.uk"
						rows="4"
						class="border-border-color focus:border-primary rounded-2xl border bg-white px-4 py-3 outline-none transition-colors"
					/>
					<p v-if="errors.descriptionUk" class="text-sm text-red-500">
						{{ errors.descriptionUk }}
					</p>
				</div>

				<div class="flex flex-col gap-1">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.category') }}
					</label>
					<Select
						v-model="form.category"
						:options="options.categories"
						optionLabel="label"
						optionValue="_id"
						fluid
					/>
					<p v-if="errors.category" class="text-sm text-red-500">
						{{ errors.category }}
					</p>
				</div>

				<div class="flex flex-col gap-1">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.style') }}
					</label>
					<Select
						v-model="form.style"
						:options="options.styles"
						optionLabel="label"
						optionValue="_id"
						fluid
					/>
					<p v-if="errors.style" class="text-sm text-red-500">
						{{ errors.style }}
					</p>
				</div>

				<div class="flex flex-col gap-1">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.minPrice') }}
					</label>
					<InputNumber v-model="form.minPrice" :min="0" fluid />
					<p v-if="errors.minPrice" class="text-sm text-red-500">
						{{ errors.minPrice }}
					</p>
				</div>

				<div class="flex flex-col gap-1">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.maxPrice') }}
					</label>
					<InputNumber v-model="form.maxPrice" :min="0" fluid />
					<p v-if="errors.maxPrice" class="text-sm text-red-500">
						{{ errors.maxPrice }}
					</p>
				</div>

				<div class="flex max-w-64 flex-col gap-1">
					<label class="font-heading text-sm font-semibold text-primary">
						{{ t('pages.dashboard.products.form.fields.maxRating') }}
					</label>
					<InputNumber
						v-model="form.maxRating"
						:min="0"
						:max="5"
						:minFractionDigits="1"
						:maxFractionDigits="1"
						fluid
					/>
					<p v-if="errors.maxRating" class="text-sm text-red-500">
						{{ errors.maxRating }}
					</p>
				</div>
			</section>

			<section class="flex flex-col gap-4">
				<div class="flex items-center justify-between gap-3">
					<div>
						<h2 class="font-heading text-2xl font-semibold text-primary">
							{{ t('pages.dashboard.products.form.variantsTitle') }}
						</h2>
						<p class="text-sm text-surface-500">
							{{ t('pages.dashboard.products.form.variantsHint') }}
						</p>
					</div>
					<Button type="button" variant="outlined" @click="$emit('add-variant')">
						{{ t('pages.dashboard.products.form.addVariant') }}
					</Button>
				</div>

				<div class="flex flex-col gap-4">
					<ProductVariantEditor
						v-for="(variant, index) in form.variants"
						:key="variant.localId"
						:index="index"
						:variant="variant"
						:colors="options.colors"
						:sizes="options.sizes"
						:errors="errors.variants?.[index] || {}"
						:apiBase="apiBase"
						:canRemove="form.variants.length > 1"
						@remove="$emit('remove-variant', index)"
						@files-selected="$emit('variant-files-selected', { index, files: $event })"
						@remove-existing-image="$emit('remove-existing-image', { index, imageIndex: $event })"
						@remove-new-image="$emit('remove-new-image', { index, imageIndex: $event })"
					/>
				</div>
			</section>
		</template>
	</form>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import InputText from '@/components/ui/InputText.vue'
import InputNumber from '@/components/ui/InputNumber.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/buttons/Button.vue'
import Message from '@/components/ui/Message.vue'
import ProductVariantEditor from './ProductVariantEditor.vue'

const props = defineProps({
	form: {
		type: Object,
		required: true,
	},
	options: {
		type: Object,
		required: true,
	},
	errors: {
		type: Object,
		default: () => ({}),
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	isSaving: {
		type: Boolean,
		default: false,
	},
	isEditMode: {
		type: Boolean,
		default: false,
	},
	apiBase: {
		type: String,
		required: true,
	},
})

defineEmits([
	'submit',
	'cancel',
	'add-variant',
	'remove-variant',
	'variant-files-selected',
	'remove-existing-image',
	'remove-new-image',
])

const { t } = useI18n()

const pageTitle = computed(() =>
	props.isEditMode
		? t('pages.dashboard.products.form.editTitle')
		: t('pages.dashboard.products.form.createTitle'),
)

const pageDescription = computed(() =>
	props.isEditMode
		? t('pages.dashboard.products.form.editDescription')
		: t('pages.dashboard.products.form.createDescription'),
)

const submitLabel = computed(() =>
	props.isEditMode ? t('buttons.save') : t('buttons.create'),
)
</script>
