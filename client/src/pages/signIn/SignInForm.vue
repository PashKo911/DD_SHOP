<template>
	<Form
		v-slot="$form"
		:resolver="resolver"
		:validateOnValueUpdate="false"
		:validateOnBlur="true"
		@submit="onFormSubmit"
		class="p-50-15 bg-primary w-full rounded-xl"
	>
		<h1
			class="text-creamy-cloud font-heading text-50-28 not-last:mb-50-20 leading-tight font-semibold capitalize"
		>
			{{ t('pages.signin.title.page') }}
		</h1>
		<div class="not-last:mb-4 md:mb-6">
			<continue-with-google-button type="button" />
		</div>
		<div class="flex items-center justify-center gap-8 not-last:mb-4 md:mb-6">
			<span class="h-[.0625rem] w-[26.236882%] bg-[#A5A5A5]"> </span>
			<span
				class="font-heading text-24-18 leading-tight text-[#595757] uppercase"
			>
				{{ t('pages.signin.separator') }}
			</span>
			<span class="h-[.0625rem] w-[26.236882%] bg-[#A5A5A5]"> </span>
		</div>
		<div class="relative flex flex-col gap-1 not-last:mb-6">
			<label
				for="email"
				class="text-creamy-cloud text-24-18 font-heading mb-1.5 w-max leading-tight"
			>
				{{ t('inputLabels.emailFieldLabel') }}
			</label>
			<input-text
				id="email"
				name="email"
				size="large"
				contrast
				placeholder="hello@email.com"
				fluid
			/>
			<message
				v-if="$form.email?.invalid || serverErrorMessages.email"
				severity="error"
				size="small"
				class="absolute bottom-0 left-2 translate-y-[calc(100%_+_.0625rem)]"
				variant="simple"
			>
				{{ t($form.email?.error?.message || serverErrorMessages.email) }}
			</message>
		</div>
		<div class="not-last:mb-50-30 relative flex flex-col gap-1">
			<label
				for="password"
				class="text-creamy-cloud text-24-18 font-heading mb-1.5 w-max leading-tight"
			>
				{{ t('inputLabels.passwordFieldLabel') }}
			</label>
			<password
				input-id="password"
				type="text"
				:placeholder="t('placeholders.passwordField')"
				toggleMask
				fluid
				contrast=""
				:promptLabel="t('accessibility.passwordFieldTips.promptLabel')"
				:weakLabel="t('accessibility.passwordFieldTips.level.weakLabel')"
				:mediumLabel="t('accessibility.passwordFieldTips.level.mediumLabel')"
				:strongLabel="t('accessibility.passwordFieldTips.level.strongLabel')"
				size="large"
				name="password"
			>
				<template #footer>
					<ul class="my-0 list-disc pl-2 leading-normal">
						<li v-for="t in passwordTips" :key="t">
							{{ t }}
						</li>
					</ul>
				</template>
			</password>
			<message
				v-if="$form.password?.invalid || serverErrorMessages.password"
				severity="error"
				size="small"
				variant="simple"
				class="absolute bottom-0 left-2 translate-y-[calc(100%_+_.0625rem)]"
			>
				{{ t($form?.password?.error?.message || serverErrorMessages.password) }}
			</message>
		</div>
		<message
			v-if="serverErrorMessages.general || serverErrorMessages.form"
			severity="error"
			size="small"
			class="mb-3 pl-2"
			variant="simple"
		>
			{{
				serverErrorMessages.general ||
				t(serverErrorMessages.form, {
					value: authAvailableMethods,
				})
			}}
		</message>
		<Button
			type="submit"
			severity="secondary"
			class="min-w-60 not-last:mb-4"
			contrast
			size="large"
			:label="t('buttons.signin')"
		/>
		<div
			class="text-creamy-cloud text-24-18 font-heading flex flex-wrap gap-x-1.5 align-bottom leading-tight"
		>
			<span>
				{{ t('pages.signin.subButtonText') }}
			</span>
			<router-link
				:to="{ name: 'signup' }"
				class="focus-visible:outline-t-inverse-hover hover:text-t-inverse-hover rounded-sm underline outline outline-transparent transition-colors duration-300"
			>
				{{ t('buttons.signup') }}
			</router-link>
		</div>
		<backdrop
			:visible="isSigninLoading"
			background-class="bg-creamy-cloud/30"
		/>
		<progress-bar
			mode="indeterminate"
			v-show="isSigninLoading"
			:style="{
				position: 'fixed',
				top: '0',
				left: '0',
				zIndex: '1010',
				width: '100%',
			}"
		/>
	</Form>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object } from 'yup'
import authSchema from '@/schemas/auth'
import { mapServerErrorKeys } from '@/utils/errorHelpers/mapServerErrorKeys'

import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

import { Form } from '@primevue/forms'
import InputText from '@/components/ui/InputText.vue'
import Button from '@/components/ui/buttons/Button.vue'
import Message from '@/components/ui/Message.vue'
import Password from '@/components/ui/Password.vue'
import ContinueWithGoogleButton from '@/components/formControls/ContinueWithGoogleButton.vue'
import Backdrop from '@/components/ui/Backdrop.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { onBeforeRouteLeave } from 'vue-router'

const { t, tm } = useI18n()

const authStore = useAuthStore()
const { signin, clearSigninErrors } = authStore

const { isSigninLoading, signinServerValidationErrors } = storeToRefs(authStore)

const resolver = yupResolver(object().shape(authSchema))

//========================================================================================================================================================

const passwordTips = computed(() => {
	const { length, lowercase, uppercase, numeric } = tm('errors.password')

	return {
		length,
		lowercase,
		uppercase,
		numeric,
	}
})

const i18nPathsForServerErrors = {
	email: 'errors.email',
	password: 'errors.password',
	form: 'errors',
	credentials: 'errors',
}

const serverErrorMessages = computed(() => {
	return mapServerErrorKeys(
		signinServerValidationErrors.value,
		i18nPathsForServerErrors,
	)
})

const authAvailableMethods = computed(() => {
	const methodsArr = signinServerValidationErrors.value?.form?.value
	if (!methodsArr || !Array.isArray(methodsArr) || !methodsArr.length) {
		return null
	}
	return methodsArr.join()
})

//========================================================================================================================================================

const onFormSubmit = async ({ valid, values }) => {
	if (valid) {
		await signin(values)
	}
}

onBeforeRouteLeave(() => {
	clearSigninErrors()
})
</script>
