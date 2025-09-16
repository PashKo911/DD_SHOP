<template>
	<Form
		v-slot="$form"
		:resolver="resolver"
		@submit="onFormSubmit"
		:validateOnSubmit="true"
		:validateOnValueUpdate="false"
		class="flex w-full flex-col gap-4"
	>
		<div class="relative flex flex-col gap-1">
			<icon-field>
				<template #input>
					<input-text
						name="email"
						contrast
						size="large"
						:placeholder="t('placeholders.emailField')"
						class="rounded-2xl! ps-12!"
						fluid
					/>
					<Message
						v-if="
							$form.email?.invalid || subscriberServerValidationErrors?.email
						"
						severity="error"
						size="small"
						variant="simple"
						class="absolute top-0 left-2 -translate-y-[calc(100%_+_.0625rem)]"
					>
						{{
							t(
								$form.email?.error?.message ||
									`errors.email.${subscriberServerValidationErrors?.email?.validationCode}`,
								{
									value: duplicateKeyVal,
								},
							)
						}}
					</Message>
				</template>
			</icon-field>
		</div>
		<Button
			type="submit"
			contrast
			size="large"
			:loading="isSubscriberLoading"
			:label="t('buttons.subscribe')"
			class="rounded-2xl! before:rounded-[20px]!"
		>
			<template #icon>
				<subscribe-icon
					class="relative shrink-0 transition-colors group-hover:fill-white"
				/>
			</template>
		</Button>
	</Form>
</template>

<script setup>
import { computed } from 'vue'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object } from 'yup'
import authSchema from '@/schemas/auth'
import { errorCodes } from '@/constants/errorCodes'
import apiEndpoints from '@/api/apiEndpoints'

import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'
import { useGeneralStore } from '@/stores/general'

import InputText from '@/components/ui/InputText.vue'
import Button from '@/components/ui/buttons/Button.vue'
import { Form } from '@primevue/forms'
import Message from '@/components/ui/Message.vue'
import IconField from '@/components/formControls/IconField.vue'
import SubscribeIcon from '@/components/icons/SubscribeIcon.vue'
import serverErrorsFormatter from '@/utils/errorHelpers/serverErrorsFormatter'
import apiClient from '@/config/axios'

const toast = useToast()
const { t } = useI18n()

const resolver = yupResolver(object().shape({ email: authSchema.email }))

const generalStore = useGeneralStore()
const { isLoading, hasError, generalApiOperation } = generalStore
//========================================================================================================================================================
const operationName = 'createSubscriber'

const supportedSubscriberCodes = [
	errorCodes.DUPLICATE_KEY,
	errorCodes.VALIDATION_ERROR,
]

const isSubscriberLoading = computed(() => {
	return isLoading(operationName)
})

const subscriberServerValidationErrors = computed(() => {
	const axiosErr = hasError(operationName)

	return serverErrorsFormatter(axiosErr, supportedSubscriberCodes)
})

const duplicateKeyVal = computed(() => {
	return subscriberServerValidationErrors.value?.email?.value ?? null
})

const subscribe = async ({ email }) => {
	console.log(email)
	return generalApiOperation({
		operationName,
		operation: async () => {
			await apiClient.post(apiEndpoints.subscriber.subscribe, { email })
		},
		successCallback: () =>
			toast.add({
				severity: 'success',
				summary: t('partials.subscribeSection.successSubscribe'),
				life: 3000,
			}),
	})
}

const onFormSubmit = async ({ valid, values }) => {
	if (valid) {
		await subscribe(values)
	}
}
</script>
