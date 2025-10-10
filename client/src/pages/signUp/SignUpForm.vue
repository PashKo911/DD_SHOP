<template>
	<Form
		v-slot="$form"
		:resolver="resolver"
		:validateOnValueUpdate="false"
		:validateOnBlur="true"
		@submit="onFormSubmit"
		class="p-50-15 bg-creamy-cloud w-full rounded-xl"
	>
		<h1
			class="text-primary font-heading text-50-28 not-last:mb-50-20 leading-tight font-semibold capitalize"
		>
			{{ t('pages.signup.title.page') }}
		</h1>
		<div class="not-last:mb-4 md:mb-6">
			<continue-with-google-button type="button" :is-contrast="false" />
		</div>

		<div class="relative flex flex-col gap-1 not-last:mb-6">
			<label
				for="email"
				class="text-primary text-24-18 font-heading mb-1.5 w-max leading-tight"
			>
				{{ t('inputLabels.emailFieldLabel') }}
			</label>
			<input-text
				id="email"
				name="email"
				type="text"
				size="large"
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
				{{
					t($form?.email?.error?.message || serverErrorMessages.email, {
						value: duplicateKeyVal,
					})
				}}
			</message>
		</div>
		<div class="not-last:mb-50-30 relative flex flex-col gap-1">
			<label
				for="password"
				class="text-primary text-24-18 font-heading mb-1.5 w-max leading-tight"
			>
				{{ t('inputLabels.passwordFieldLabel') }}
			</label>

			<password
				input-id="password"
				type="text"
				:placeholder="t('placeholders.passwordField')"
				toggleMask
				fluid
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
			v-if="serverErrorMessages.general"
			severity="error"
			size="small"
			class="mb-3 pl-2"
			variant="simple"
		>
			{{ serverErrorMessages.general }}
		</message>
		<Button
			type="submit"
			severity="secondary"
			class="min-w-60 not-last:mb-4"
			size="large"
			:label="t('buttons.signup')"
		/>
		<div
			class="text-primary text-24-18 font-heading flex flex-wrap gap-x-1.5 align-bottom leading-tight"
		>
			<span>
				{{ t('pages.signup.subButtonText') }}
			</span>
			<router-link
				:to="{ name: routeNames.SIGNIN }"
				class="focus-visible:outline-primary hover:text-t-hover rounded-sm underline outline outline-transparent transition-colors duration-300"
			>
				{{ t('buttons.signin') }}
			</router-link>
		</div>
		<backdrop :visible="isSignupLoading" background-class="bg-black/30" />
		<progress-bar
			mode="indeterminate"
			v-show="isSignupLoading"
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
import { onBeforeRouteLeave } from 'vue-router'

import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object } from 'yup'
import { mapServerErrorKeys } from '@/utils/errorHelpers/mapServerErrorKeys'

import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

import authSchema from '../../schemas/auth'

import Backdrop from '@/components/ui/Backdrop.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { Form } from '@primevue/forms'
import Button from '@/components/ui/buttons/Button.vue'
import Message from '@/components/ui/Message.vue'
import Password from '@/components/ui/Password.vue'
import ContinueWithGoogleButton from '@/components/formControls/ContinueWithGoogleButton.vue'
import InputText from '@/components/ui/InputText.vue'
import routeNames from '@/router/routeNames'

const { t, tm } = useI18n()
const router = useRouter()

const authStore = useAuthStore()

const { signup, clearSignupErrors } = authStore

const { signupServerValidationErrors, isSignupLoading, isAuthenticated } =
	storeToRefs(authStore)
const { initCart } = useCartStore()

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
}

const serverErrorMessages = computed(() => {
	return mapServerErrorKeys(
		signupServerValidationErrors.value,
		i18nPathsForServerErrors,
	)
})

const duplicateKeyVal = computed(() => {
	return signupServerValidationErrors.value?.email?.value ?? null
})
//========================================================================================================================================================

const onFormSubmit = async ({ valid, values }) => {
	if (valid) {
		await signup(values, () => {
			router.push({ name: routeNames.HOME })
		})
	}
}

onBeforeRouteLeave(() => {
	clearSignupErrors()
})
</script>
