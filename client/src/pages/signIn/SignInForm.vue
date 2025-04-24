<template>
	<Form
		v-slot="$form"
		:resolver="resolver"
		@submit="onFormSubmit"
		class="p-50-15 bg-primary w-full rounded-xl"
	>
		<h1
			class="text-creamy-cloud font-heading text-50-28 not-last:mb-50-20 leading-tight font-semibold capitalize"
		>
			{{ t('pages.signIn.title') }}
		</h1>
		<div class="not-last:mb-4 md:mb-6">
			<ContinueWithGoogleButton />
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
				class="text-creamy-cloud text-24-18 font-heading mb-1.5 leading-tight"
			>
				{{ t('pages.signIn.emailFieldLabel') }}
			</label>
			<InputText
				id="email"
				name="email"
				type="text"
				size="large"
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
				class="text-creamy-cloud text-24-18 font-heading mb-1.5 leading-tight"
			>
				{{ t('pages.signIn.passwordFieldLabel') }}
			</label>
			<Password
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

		<ContrastButton
			type="submit"
			severity="secondary"
			class="min-w-60 not-last:mb-4"
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
				class="hover:text-t-hover underline transition-colors duration-300"
			>
				{{ t('pages.signIn.signUpLinkLabel') }}
			</router-link>
		</div>
	</Form>
</template>

<script setup>
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

import InputText from '@/volt/InputText.vue'
import ContrastButton from '@/volt/ContrastButton.vue'
import { Form } from '@primevue/forms'
import Message from '@/volt/Message.vue'
import Password from '@/volt/Password.vue'
import ContinueWithGoogleButton from '@/components/ui/ContinueWithGoogleButton.vue'

const { t, tm } = useI18n()

const passwordTips = computed(() => {
	return tm('accessibility.passwordFieldTips.validateTips')
})

const schema = computed(() =>
	yup.object().shape({
		email: yup
			.string()
			.trim()
			.required(t('errors.email.required'))
			.email(t('errors.email.invalid')),
		password: yup
			.string()
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
