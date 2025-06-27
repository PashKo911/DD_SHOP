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
						icon-field
						:placeholder="t('placeholders.emailField')"
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
		<Button type="submit" size="small" contrast :label="t('buttons.subscribe')">
			<template #icon>
				<subscribe-icon
					class="relative shrink-0 transition-colors group-hover:fill-white"
				/>
			</template>
		</Button>
	</Form>
</template>

<script setup>
import { ref } from 'vue'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { object, string } from 'yup'

import { useI18n } from 'vue-i18n'
import { useToast } from 'primevue/usetoast'

import InputText from '@/components/ui/inputText/InputText.vue'
import Button from '@/components/ui/button/Button.vue'
import { Form } from '@primevue/forms'
import Message from '@/components/ui/message/Message.vue'
import MailIcon from '@/components/icons/MailIcon.vue'
import IconField from '@/components/formControls/IconField.vue'
import SubscribeIcon from '@/components/icons/SubscribeIcon.vue'

const toast = useToast()
const { t } = useI18n()

const schema = object().shape({
	email: string()
		.trim()
		.email(t('errors.email.invalid'))
		.required(t('errors.email.required')),
})

const resolver = ref(yupResolver(schema))
//========================================================================================================================================================

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
