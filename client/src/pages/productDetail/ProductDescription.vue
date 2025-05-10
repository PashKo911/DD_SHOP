<template>
	<Form
		v-slot="$form"
		:resolver="resolver"
		:validateOnSubmit="true"
		:validateOnValueUpdate="false"
		:initial-values="initialValues"
		@submit="onFormSubmit"
		class="lg:pt-5"
	>
		<h1
			class="font-heading text-50-28 lg:text-lg-50-30 leading-tight font-medium uppercase"
		>
			{{ productData.title }}
		</h1>

		<div class="flex items-center gap-4 not-last:mb-4">
			<rating-comp
				v-model="productData.rating"
				:aria-label="ratingAriaLabel"
				:readonly="true"
			/>
			<span class="text-lg leading-tight font-bold md:text-xl">
				{{ productData.rating }}
			</span>
		</div>
		<div class="flex flex-wrap items-center gap-3 not-last:mb-4">
			<span class="text-32-26 leading-tight font-semibold">
				${{ productData.price }}
			</span>
			<span
				class="text-32-26 text-dark-grey leading-tight font-semibold line-through decoration-2"
			>
				${{ productData.oldPrice }}
			</span>
			<Badge
				severity="success"
				circle
				size="xlarge"
				:value="getDiscount(productData.oldPrice, productData.price)"
			/>
		</div>
		<div
			class="not-last:mb-24-16 pb-24-16 not-last:border-border-color not-last:border-b"
		>
			<p class="text-lg leading-tight not-last:mb-2.5 md:text-xl">
				{{ productData.description }}
			</p>
		</div>
		<FormField
			v-slot="$field"
			name="color"
			class="not-last:mb-24-16 pb-24-16 not-last:border-border-color grid gap-4 not-last:border-b"
		>
			<div class="flex items-end justify-between gap-4">
				<h3 class="text-24-18 leading-tight">
					{{ t('accessibility.colorRadioGroup.title') }}
				</h3>
				<Message
					v-if="$form.color?.invalid"
					severity="error"
					size="small"
					variant="simple"
				>
					{{ $form.color?.error.message }}
				</Message>
			</div>
			<color-radio-group
				v-model="$field.value"
				:items="productData.colors"
				@input="$field.onInput"
			/>
		</FormField>
		<FormField
			v-slot="$field"
			name="size"
			class="not-last:mb-24-16 not-last:pb-24-16 not-last:border-border-color relative grid gap-4 not-last:border-b"
		>
			<div class="flex items-end justify-between gap-4">
				<h3 class="text-24-18 leading-tight">
					{{ t('accessibility.sizeRadioGroup.title') }}
				</h3>
				<Message
					v-if="$form.size?.invalid"
					severity="error"
					size="small"
					variant="simple"
				>
					{{ $form.size?.error.message }}
				</Message>
			</div>
			<size-radio-group :items="productData.sizes" @input="$field.onInput" />
		</FormField>
		<div class="flex items-center gap-4 sm:gap-8">
			<div class="relative">
				<InputNumber
					:inputId="productData._id"
					showButtons
					buttonLayout="horizontal"
					:step="1"
					:min="1"
					:initialValue="1"
					name="count"
					class="rounded-md shadow-lg sm:min-w-[10.625rem]"
				/>
				<Message
					v-if="$form.count?.invalid"
					severity="error"
					size="small"
					variant="simple"
					class="absolute bottom-0 left-1 translate-y-[calc(100%_+_.3125rem)]"
				>
					{{ $form.count?.error.message }}
				</Message>
			</div>
			<Button
				fluid
				type="submit"
				:label="t('buttons.addToCart')"
				class="max-w-[25rem] shadow-lg"
			/>
		</div>
	</Form>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import getDiscount from '@/utils/getDiscount'

import RatingComp from '@/components/ui/rating/RatingComp.vue'
import SizeRadioGroup from '@/components/formControls/SizeRadioGroup.vue'
import ColorRadioGroup from '@/components/formControls/ColorRadioGroup.vue'
import InputNumber from '@/components/ui/inputNumber/InputNumber.vue'
import Button from '@/components/ui/button/Button.vue'
import Badge from '@/components/ui/budge/Badge.vue'
import { Form } from '@primevue/forms'
import { FormField } from '@primevue/forms'
import Message from '@/components/ui/message/Message.vue'

const { t } = useI18n()
const toast = useToast()

const props = defineProps({
	productData: {
		type: Object,
		required: true,
	},
})

const initialValues = reactive({
	color: null,
	size: null,
	count: 1,
})

const schema = yup.object().shape({
	color: yup.string().required(t('errors.colorInputGroup.required')),
	size: yup.string().required(t('errors.sizeInputGroup.required')),
	count: yup.number().required(t('errors.countInput.required')),
})

const resolver = ref(yupResolver(schema))

const onFormSubmit = ({ values, valid }) => {
	if (valid) {
		console.log(values)
		toast.add({
			severity: 'success',
			summary: 'Form is submitted.',
			life: 3000,
		})
	}
}

const ratingAriaLabel = computed(() => {
	return `${t('accessibility.ratingLabel.start')} ${props.productData.rating} ${t('accessibility.ratingLabel.end')}`
})
</script>
