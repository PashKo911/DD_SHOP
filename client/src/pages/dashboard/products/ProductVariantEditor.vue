<template>
	<div class="border-border-color bg-surface-50 rounded-2xl border p-4">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h3 class="font-heading text-primary text-xl font-semibold">
				{{ title }}
			</h3>

			<SecondaryButton
				v-if="canRemove"
				type="button"
				size="small"
				:label="t('buttons.remove')"
				variant="outlined"
				@click="$emit('remove')"
			/>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<div class="flex flex-col gap-1">
				<label
					:id="fieldId('color')"
					class="font-heading text-primary text-sm font-semibold"
				>
					{{ t('pages.dashboard.products.form.fields.color') }}
				</label>

				<Select
					:aria-labelledby="fieldId('color')"
					v-model="variant.color"
					:options="colors"
					optionLabel="label"
					optionValue="_id"
					fluid
					filter
				/>

				<p v-if="errors?.color" class="text-sm text-red-500">
					{{ errors.color }}
				</p>
			</div>

			<div class="flex flex-col gap-1">
				<label
					:id="fieldId('rating')"
					class="font-heading text-primary text-sm font-semibold"
				>
					{{ t('pages.dashboard.products.form.fields.rating') }}
				</label>

				<InputNumber
					:aria-labelledby="fieldId('rating')"
					v-model="variant.rating"
					:min="0"
					:max="5"
					:minFractionDigits="1"
					:maxFractionDigits="1"
					fluid
					size="small"
				/>

				<p v-if="errors?.rating" class="text-sm text-red-500">
					{{ errors.rating }}
				</p>
			</div>

			<div class="flex flex-col gap-1">
				<label
					:for="fieldId('price')"
					class="font-heading text-primary text-sm font-semibold"
				>
					{{ t('pages.dashboard.products.form.fields.price') }}
				</label>

				<InputNumber
					:inputId="fieldId('price')"
					v-model="variant.price"
					:min="0"
					size="small"
					fluid
				/>

				<p v-if="errors?.price" class="text-sm text-red-500">
					{{ errors.price }}
				</p>
			</div>

			<div class="flex flex-col gap-1">
				<label
					:for="fieldId('old-price')"
					class="font-heading text-primary text-sm font-semibold"
				>
					{{ t('pages.dashboard.products.form.fields.oldPrice') }}
				</label>

				<InputNumber
					:inputId="fieldId('old-price')"
					v-model="variant.oldPrice"
					:min="0"
					size="small"
					fluid
				/>
			</div>

			<div class="flex flex-col gap-1">
				<label
					:for="fieldId('count')"
					class="font-heading text-primary text-sm font-semibold"
				>
					{{ t('pages.dashboard.products.form.fields.count') }}
				</label>

				<InputNumber
					:inputId="fieldId('count')"
					size="small"
					v-model="variant.count"
					:min="0"
					fluid
				/>

				<p v-if="errors?.count" class="text-sm text-red-500">
					{{ errors.count }}
				</p>
			</div>
		</div>

		<div class="mt-4 flex flex-col gap-2">
			<label
				:id="fieldId('sizes-label')"
				class="font-heading text-primary text-sm font-semibold"
			>
				{{ t('pages.dashboard.products.form.fields.sizes') }}
			</label>

			<RadioGroup
				v-model="variant.sizes"
				:items="sizes"
				multiple
				:aria-labelledby="fieldId('sizes-label')"
				group-class="flex flex-wrap gap-2"
				label-class="outline-none"
			>
				<template #item="{ item, checked }">
					<span
						class="font-heading inline-flex min-w-12 justify-center rounded-full border px-3 py-2 text-sm font-semibold transition-colors"
						:class="
							checked
								? 'border-primary bg-primary text-creamy-cloud'
								: 'border-border-color text-primary bg-white'
						"
					>
						{{ item.label }}
					</span>
				</template>
			</RadioGroup>

			<p v-if="errors?.sizes" class="text-sm text-red-500">
				{{ errors.sizes }}
			</p>
		</div>

		<div class="mt-4 flex flex-col gap-2">
			<label
				:id="fieldId('images-label')"
				class="font-heading text-primary text-sm font-semibold"
			>
				{{ t('pages.dashboard.products.form.fields.images') }}
			</label>

			<label
				:for="fieldId('images')"
				class="border-border-color hover:border-primary flex cursor-pointer items-center justify-center rounded-2xl border border-dashed bg-white px-4 py-5 text-center transition-colors"
			>
				<input
					:id="fieldId('images')"
					type="file"
					accept="image/*"
					multiple
					class="hidden"
					@change="onFilesChange"
				/>

				<span class="font-heading text-primary text-sm font-semibold">
					{{ t('pages.dashboard.products.form.uploadHint') }}
				</span>
			</label>

			<div
				v-if="variant.images.length || variant.newImagePreviews.length"
				class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
			>
				<div
					v-for="(imagePath, imageIndex) in variant.images"
					:key="`${variant._id || index}-existing-${imagePath}`"
					class="border-surface-200 overflow-hidden rounded-2xl border bg-white"
				>
					<img
						:src="`${apiBase}${imagePath}`"
						alt="Product preview"
						class="h-36 w-full object-cover"
					/>

					<div class="flex items-center justify-between gap-2 p-3">
						<span class="text-surface-500 truncate text-xs">
							{{ getFileName(imagePath) }}
						</span>

						<SecondaryButton
							size="small"
							type="button"
							variant="outlined"
							:label="t('buttons.remove')"
							severity="secondary"
							@click="$emit('remove-existing-image', imageIndex)"
						/>
					</div>
				</div>

				<div
					v-for="(preview, imageIndex) in variant.newImagePreviews"
					:key="`${variant._id || index}-new-${preview.url}`"
					class="border-surface-200 overflow-hidden rounded-2xl border bg-white"
				>
					<img
						:src="preview.url"
						alt="New product preview"
						class="h-36 w-full object-cover"
					/>

					<div class="flex items-center justify-between gap-2 p-3">
						<span class="text-surface-500 truncate text-xs">
							{{ preview.name }}
						</span>

						<Button
							type="button"
							severity="secondary"
							variant="text"
							size="small"
							@click="$emit('remove-new-image', imageIndex)"
						>
							{{ t('buttons.remove') }}
						</Button>
					</div>
				</div>
			</div>

			<p v-if="errors?.images" class="text-sm text-red-500">
				{{ errors.images }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed, useId } from 'vue'
import { useI18n } from 'vue-i18n'

import Select from '@/components/ui/Select.vue'
import InputNumber from '@/components/ui/InputNumber.vue'
import Button from '@/components/ui/buttons/Button.vue'
import RadioGroup from '@/components/ui/RadioGroup.vue'
import SecondaryButton from '@/components/ui/buttons/SecondaryButton.vue'

const props = defineProps({
	index: {
		type: Number,
		required: true,
	},
	variant: {
		type: Object,
		required: true,
	},
	colors: {
		type: Array,
		default: () => [],
	},
	sizes: {
		type: Array,
		default: () => [],
	},
	errors: {
		type: Object,
		default: () => ({}),
	},
	apiBase: {
		type: String,
		required: true,
	},
	canRemove: {
		type: Boolean,
		default: true,
	},
})

const emit = defineEmits([
	'remove',
	'files-selected',
	'remove-existing-image',
	'remove-new-image',
])

const { t } = useI18n()

const baseId = useId()
const fieldId = (name) => `${baseId}-${name}`

const title = computed(() =>
	t('pages.dashboard.products.form.variantTitle', {
		index: props.index + 1,
	}),
)

const getFileName = (value) => value.split('/').pop()

const onFilesChange = (event) => {
	const files = Array.from(event.target.files || [])

	if (!files.length) return

	event.target.value = ''

	emit('files-selected', files)
}
</script>
