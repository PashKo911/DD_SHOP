<template>
	<div class="gx-30-10 gy-30-10 flex flex-wrap items-center">
		<social-link
			v-for="s in socialList"
			:key="s.id"
			:link="s.link"
			:aria-label="t(`accessibility.socialLabels.${s.id}`)"
		>
			<component :is="s.icon" />
		</social-link>
	</div>
</template>

<script setup>
import socialList from '@/data/socialList'
import SocialLink from './SocialLink.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
