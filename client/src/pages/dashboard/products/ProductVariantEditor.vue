<template>
	<div class="border-border-color rounded-2xl border bg-surface-50 p-4">
		<div class="mb-4 flex items-center justify-between gap-3">
			<h3 class="font-heading text-xl font-semibold text-primary">
				{{ title }}
			</h3>
			<Button
				v-if="canRemove"
				type="button"
				severity="secondary"
				variant="text"
				size="small"
				@click="$emit('remove')"
			>
				{{ t('buttons.remove') }}
			</Button>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<div class="flex flex-col gap-1">
				<label class="font-heading text-sm font-semibold text-primary">
					{{ t('pages.dashboard.products.form.fields.color') }}
				</label>
				<Select
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
				<label class="font-heading text-sm font-semibold text-primary">
					{{ t('pages.dashboard.products.form.fields.rating') }}
				</label>
				<InputNumber
					v-model="variant.rating"
					:min="0"
					:max="5"
					:minFractionDigits="1"
					:maxFractionDigits="1"
					fluid
				/>
				<p v-if="errors?.rating" class="text-sm text-red-500">
					{{ errors.rating }}
				</p>
			</div>

			<div class="flex flex-col gap-1">
				<label class="font-heading text-sm font-semibold text-primary">
					{{ t('pages.dashboard.products.form.fields.price') }}
				</label>
				<InputNumber v-model="variant.price" :min="0" fluid />
				<p v-if="errors?.price" class="text-sm text-red-500">
					{{ errors.price }}
				</p>
			</div>

			<div class="flex flex-col gap-1">
				<label class="font-heading text-sm font-semibold text-primary">
					{{ t('pages.dashboard.products.form.fields.oldPrice') }}
				</label>
				<InputNumber v-model="variant.oldPrice" :min="0" fluid />
			</div>

			<div class="flex flex-col gap-1">
				<label class="font-heading text-sm font-semibold text-primary">
					{{ t('pages.dashboard.products.form.fields.count') }}
				</label>
				<InputNumber v-model="variant.count" :min="0" fluid />
				<p v-if="errors?.count" class="text-sm text-red-500">
					{{ errors.count }}
				</p>
			</div>
		</div>

		<div class="mt-4 flex flex-col gap-2">
			<label class="font-heading text-sm font-semibold text-primary">
				{{ t('pages.dashboard.products.form.fields.sizes') }}
			</label>
			<RadioGroup
				v-model="variant.sizes"
				:items="sizes"
				multiple
				:aria-label="t('pages.dashboard.products.form.fields.sizes')"
				group-class="flex flex-wrap gap-2"
				label-class="outline-none"
			>
				<template #item="{ item, checked }">
					<span
						class="font-heading inline-flex min-w-12 justify-center rounded-full border px-3 py-2 text-sm font-semibold transition-colors"
						:class="
							checked
								? 'border-primary bg-primary text-creamy-cloud'
								: 'border-border-color bg-white text-primary'
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
			<label class="font-heading text-sm font-semibold text-primary">
				{{ t('pages.dashboard.products.form.fields.images') }}
			</label>
			<label
				class="border-border-color hover:border-primary flex cursor-pointer items-center justify-center rounded-2xl border border-dashed bg-white px-4 py-5 text-center transition-colors"
			>
				<input
					type="file"
					accept="image/*"
					multiple
					class="hidden"
					@change="onFilesChange"
				/>
				<span class="font-heading text-sm font-semibold text-primary">
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
					class="overflow-hidden rounded-2xl border border-surface-200 bg-white"
				>
					<img
						:src="`${apiBase}${imagePath}`"
						alt="Product preview"
						class="h-36 w-full object-cover"
					/>
					<div class="flex items-center justify-between gap-2 p-3">
						<span class="truncate text-xs text-surface-500">
							{{ getFileName(imagePath) }}
						</span>
						<Button
							type="button"
							severity="secondary"
							variant="text"
							size="small"
							@click="$emit('remove-existing-image', imageIndex)"
						>
							{{ t('buttons.remove') }}
						</Button>
					</div>
				</div>

				<div
					v-for="(preview, imageIndex) in variant.newImagePreviews"
					:key="`${variant._id || index}-new-${preview.url}`"
					class="overflow-hidden rounded-2xl border border-surface-200 bg-white"
				>
					<img
						:src="preview.url"
						alt="New product preview"
						class="h-36 w-full object-cover"
					/>
					<div class="flex items-center justify-between gap-2 p-3">
						<span class="truncate text-xs text-surface-500">
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import Select from '@/components/ui/Select.vue'
import InputNumber from '@/components/ui/InputNumber.vue'
import Button from '@/components/ui/buttons/Button.vue'
import RadioGroup from '@/components/ui/RadioGroup.vue'

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
