<template>
	<Form
		v-slot="$form"
		:resolver="resolver"
		:validateOnSubmit="true"
		:validateOnValueUpdate="false"
		@submit="onFormSubmit"
		class="p-50-15 bg-primary w-full rounded-xl"
	>
		<h1
			class="text-creamy-cloud font-heading text-50-28 not-last:mb-50-20 leading-tight font-semibold capitalize"
		>
			{{ t('pages.signIn.title.page') }}
		</h1>
		<div class="not-last:mb-4 md:mb-6">
			<continue-with-google-button />
		</div>
		<div class="flex items-center justify-center gap-8 not-last:mb-4 md:mb-6">
			<span class="h-[.0625rem] w-[26.236882%] bg-[#A5A5A5]"> </span>
			<span
				class="font-heading text-24-18 leading-tight text-[#595757] uppercase"
			>
				{{ t('pages.signIn.separator') }}
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
			<InputText
				id="email"
				name="email"
				size="large"
				contrast
				placeholder="hello@email.com"
				fluid
			/>
			<Message
				v-if="$form.email?.invalid"
				severity="error"
				size="small"
				class="absolute bottom-0 left-2 translate-y-[calc(100%_+_.0625rem)]"
				variant="simple"
			>
				{{ $form.email.error.message }}
			</Message>
		</div>
		<div class="not-last:mb-50-30 relative flex flex-col gap-1">
			<label
				for="password"
				class="text-creamy-cloud text-24-18 font-heading mb-1.5 w-max leading-tight"
			>
				{{ t('inputLabels.passwordFieldLabel') }}
			</label>
			<Password
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
			</Password>
			<Message
				v-if="$form.password?.invalid"
				severity="error"
				size="small"
				variant="simple"
				class="absolute bottom-0 left-2 translate-y-[calc(100%_+_.0625rem)]"
			>
				{{ $form.password.error.message }}
			</Message>
		</div>

		<Button
			type="submit"
			severity="secondary"
			class="min-w-60 not-last:mb-4"
			contrast
			size="large"
			:label="t('buttons.signIn')"
		/>
		<div
			class="text-creamy-cloud text-24-18 font-heading flex flex-wrap gap-x-1.5 align-bottom leading-tight"
		>
			<span>
				{{ t('pages.signIn.subButtonText') }}
			</span>
			<router-link
				:to="{ name: 'signUp' }"
				class="focus-visible:outline-t-inverse-hover hover:text-t-inverse-hover rounded-sm underline outline outline-transparent transition-colors duration-300"
			>
				{{ t('buttons.signUp') }}
			</router-link>
		</div>
	</Form>
</template>

<script setup>
import { yupResolver } from '@primevue/forms/resolvers/yup'

import { object, string } from 'yup'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

import InputText from '@/components/ui/inputText/InputText.vue'
import Button from '@/components/ui/button/Button.vue'
import { Form } from '@primevue/forms'
import Message from '@/components/ui/message/Message.vue'
import Password from '@/components/ui/password/Password.vue'
import ContinueWithGoogleButton from '@/components/formControls/ContinueWithGoogleButton.vue'

const { t, tm } = useI18n()

const passwordTips = computed(() => {
	return tm('accessibility.passwordFieldTips.validateTips')
})

const schema = computed(() =>
	object().shape({
		email: string()
			.trim()
			.required(t('errors.email.required'))
			.email(t('errors.email.invalid')),
		password: string()
			.required(t('accessibility.passwordFieldTips.required'))
			.min(6, t('accessibility.passwordFieldTips.validateTips.minLength'))
			.matches(
				/[a-z]/,
				t('accessibility.passwordFieldTips.validateTips.lowercase'),
			)
			.matches(
				/[A-Z]/,
				t('accessibility.passwordFieldTips.validateTips.uppercase'),
			)
			.matches(
				/[0-9]/,
				t('accessibility.passwordFieldTips.validateTips.numeric'),
			),
	}),
)

const resolver = computed(() => yupResolver(schema.value))

const onFormSubmit = ({ valid, values }) => {
	if (valid) {
		console.log('submitted', values)
	}
}
</script>
