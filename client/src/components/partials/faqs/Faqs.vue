<template>
	<Accordion :value="value">
		<AccordionPanel v-for="f in faqsArr" :key="f.id" :value="f.id">
			<AccordionHeader>{{ f.question }}</AccordionHeader>
			<AccordionContent>
				<p>
					{{ f.answer }}
				</p>
			</AccordionContent>
		</AccordionPanel>
	</Accordion>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import Accordion from '@/components/accordion/Accordion.vue'
import AccordionPanel from '@/components/accordion/AccordionPanel.vue'
import AccordionHeader from '@/components/accordion/AccordionHeader.vue'
import AccordionContent from '@/components/accordion/AccordionContent.vue'

const { tm } = useI18n()

const faqsArr = computed(() => {
	return tm('partials.faqs')
})
const value = computed(() => {
	return faqsArr.value.map((f) => f.id)
})
</script>
