<template>
	<Form
		v-slot="$form"
		:initialValues="form"
		:resolver="resolver"
		:validateOnValueUpdate="false"
		:validateOnBlur="true"
		class="flex flex-col gap-6"
		@submit="onFormSubmit"
	>
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 class="font-heading text-primary text-3xl font-semibold">
					{{ pageTitle }}
				</h1>

				<p class="text-surface-500 mt-1 text-sm">
					{{ pageDescription }}
				</p>
			</div>

			<div class="flex flex-wrap gap-3">
				<SecondaryButton
					size="small"
					type="button"
					variant="outlined"
					@click="$emit('cancel')"
				>
					{{ t('buttons.cancel') }}
				</SecondaryButton>

				<Button
					:label="submitLabel"
					type="submit"
					size="small"
					:loading="isSaving"
					:disabled="isSaving"
				/>
			</div>
		</div>

		<Message v-if="serverError" severity="error">
			{{ serverError }}
		</Message>

		<div v-if="isLoading" class="text-surface-500 py-12 text-center">
			{{ t('pages.dashboard.products.form.loading') }}
		</div>

		<template v-else>
			<section class="bg-surface-50 grid gap-4 rounded-2xl p-4 lg:grid-cols-2">
				<div class="flex flex-col gap-1">
					<label
						:for="fieldId('title-en')"
						class="font-heading text-primary text-sm font-semibold"
					>
						{{ t('pages.dashboard.products.form.fields.titleEn') }}
					</label>

					<InputText
						:id="fieldId('title-en')"
						name="title.en"
						variant="surface"
						v-model="form.title.en"
						fluid
					/>
					<Message
						v-if="$form.title?.en?.invalid"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.title?.en?.error?.message }}
					</Message>
				</div>

				<div class="flex flex-col gap-1">
					<label
						:for="fieldId('title-uk')"
						class="font-heading text-primary text-sm font-semibold"
					>
						{{ t('pages.dashboard.products.form.fields.titleUk') }}
					</label>

					<InputText
						:id="fieldId('title-uk')"
						name="title.uk"
						variant="surface"
						v-model="form.title.uk"
						fluid
					/>

					<Message
						v-if="$form.title?.uk?.invalid"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.title?.uk?.error?.message }}
					</Message>
				</div>

				<div class="flex flex-col gap-1 lg:col-span-2">
					<label
						:for="fieldId('description-en')"
						class="font-heading text-primary text-sm font-semibold"
					>
						{{ t('pages.dashboard.products.form.fields.descriptionEn') }}
					</label>

					<Textarea
						v-model="form.description.en"
						:id="fieldId('description-en')"
						name="description.en"
						rows="4"
					/>

					<Message
						v-if="$form.description?.en?.invalid"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.description?.en?.error?.message }}
					</Message>
				</div>

				<div class="flex flex-col gap-1 lg:col-span-2">
					<label
						:for="fieldId('description-uk')"
						class="font-heading text-primary text-sm font-semibold"
					>
						{{ t('pages.dashboard.products.form.fields.descriptionUk') }}
					</label>

					<Textarea
						v-model="form.description.uk"
						:id="fieldId('description-uk')"
						name="description.uk"
						rows="4"
					/>

					<Message
						v-if="$form.description?.uk?.invalid"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.description?.uk?.error?.message }}
					</Message>
				</div>

				<div class="flex flex-col gap-1">
					<label
						:id="fieldId('category-label')"
						class="font-heading text-primary text-sm font-semibold"
					>
						{{ t('pages.dashboard.products.form.fields.category') }}
					</label>

					<Select
						name="category"
						:aria-labelledby="fieldId('category-label')"
						:options="options.categories"
						:optionLabel="`label.${locale}`"
						optionValue="_id"
						fluid
					/>

					<Message
						v-if="$form.category?.invalid"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.category?.error?.message }}
					</Message>
				</div>

				<div class="flex flex-col gap-1">
					<label
						:id="fieldId('style-label')"
						class="font-heading text-primary text-sm font-semibold"
					>
						{{ t('pages.dashboard.products.form.fields.style') }}
					</label>

					<Select
						name="style"
						:aria-labelledby="fieldId('style-label')"
						:options="options.styles"
						optionLabel="label"
						optionValue="_id"
						fluid
					/>

					<Message
						v-if="$form.style?.invalid"
						severity="error"
						size="small"
						variant="simple"
					>
						{{ $form.style?.error?.message }}
					</Message>
				</div>
			</section>

			<section class="flex flex-col gap-4">
				<div class="flex items-center justify-between gap-3">
					<div>
						<h2 class="font-heading text-primary text-2xl font-semibold">
							{{ t('pages.dashboard.products.form.variantsTitle') }}
						</h2>

						<p class="text-surface-500 text-sm">
							{{ t('pages.dashboard.products.form.variantsHint') }}
						</p>
					</div>

					<SecondaryButton
						:label="t('pages.dashboard.products.form.addVariant')"
						type="button"
						size="small"
						variant="outlined"
						@click="$emit('add-variant')"
					/>
				</div>

				<div class="flex flex-col gap-4">
					<ProductVariantEditor
						v-for="(variant, index) in form.variants"
						:key="variant.localId"
						:index="index"
						:variant="variant"
						:colors="options.colors"
						:sizes="options.sizes"
						:apiBase="apiBase"
						:canRemove="form.variants.length > 1"
						@remove="$emit('remove-variant', index)"
						@files-selected="
							$emit('variant-files-selected', { index, files: $event })
						"
						@remove-existing-image="
							$emit('remove-existing-image', { index, imageIndex: $event })
						"
						@remove-new-image="
							$emit('remove-new-image', { index, imageIndex: $event })
						"
					/>
				</div>
			</section>
		</template>
	</Form>
</template>

<script setup>
import { computed, useId } from 'vue'
import { useI18n } from 'vue-i18n'

import { Form } from '@primevue/forms'
import { yupResolver } from '@primevue/forms/resolvers/yup'

import { object, string } from 'yup'

import InputText from '@/components/ui/InputText.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/buttons/Button.vue'
import Message from '@/components/ui/Message.vue'
import ProductVariantEditor from './ProductVariantEditor.vue'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton.vue'

const props = defineProps({
	form: {
		type: Object,
		required: true,
	},
	options: {
		type: Object,
		required: true,
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
	serverError: {
		type: String,
		default: '',
	},
	formRenderKey: {
		type: Number,
		required: true,
	},
})

const emit = defineEmits([
	'submit',
	'cancel',
	'add-variant',
	'remove-variant',
	'variant-files-selected',
	'remove-existing-image',
	'remove-new-image',
])

const { t, locale } = useI18n()

const baseId = useId()

const fieldId = (name) => `${baseId}-${name}`

const resolver = yupResolver(
	object({
		title: object({
			en: string()
				.trim()
				.required(t('pages.dashboard.products.form.validation.required')),
			uk: string()
				.trim()
				.required(t('pages.dashboard.products.form.validation.required')),
		}),
		description: object({
			en: string()
				.trim()
				.min(10, t('pages.dashboard.products.form.validation.description')),
			uk: string()
				.trim()
				.min(10, t('pages.dashboard.products.form.validation.description')),
		}),
		category: string().required(
			t('pages.dashboard.products.form.validation.required'),
		),
		style: string().required(
			t('pages.dashboard.products.form.validation.required'),
		),
	}),
)

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

const onFormSubmit = ({ valid, values }) => {
	if (!valid) return

	emit('submit', values)
}
</script>
