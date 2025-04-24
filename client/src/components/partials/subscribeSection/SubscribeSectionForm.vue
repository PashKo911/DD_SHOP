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
				<template #icon>
					<mail-icon class="fill-surface-300" />
				</template>
				<template #input>
					<InputText
						name="email"
						type="iconField"
						:placeholder="$t('placeholders.emailField')"
						fluid
					/>
					<Message
						v-if="$form.email?.invalid"
						severity="error"
						size="small"
						variant="simple"
						class="absolute top-0 left-2 -translate-y-[calc(100%_+_.0625rem)]"
					>
						{{ $form.email?.error.message }}
					</Message>
				</template>
			</icon-field>
		</div>
		<ContrastButton
			type="submit"
			severity="secondary"
			:label="$t('buttons.subscribe')"
		>
			<template #icon>
				<subscribe-icon class="shrink-0" />
			</template>
		</ContrastButton>
	</Form>
</template>

<script setup>
import { ref } from 'vue'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import * as yup from 'yup'
import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

import InputText from '@/volt/InputText.vue'
import ContrastButton from '@/volt/ContrastButton.vue'
import { Form } from '@primevue/forms'
import Message from '@/volt/Message.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import IconField from '@/components/ui/IconField.vue'
import SubscribeIcon from '@/components/icons/SubscribeIcon.vue'

const toast = useToast()
const { t } = useI18n()

const schema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.email(t('errors.email.invalid'))
		.required(t('errors.email.required')),
})

const resolver = ref(yupResolver(schema))

const onFormSubmit = ({ valid }) => {
	if (valid) {
		toast.add({
			severity: 'success',
			summary: 'Form is submitted.',
			life: 3000,
		})
	}
}
</script>
