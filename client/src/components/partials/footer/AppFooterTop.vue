<template>
	<div class="my-100-30 container items-start justify-between gap-8 lg:flex">
		<div class="gy-40-25 grid grow max-lg:mb-10">
			<h2 class="text-[2.5rem] leading-tight font-bold uppercase">dd_shop</h2>
			<div class="grid gap-2.5">
				<p class="lg:w-lg-440-235 max-w-110 font-medium capitalize">
					{{ t('partials.footer.footerText.topText') }}
				</p>
			</div>
			<social-list class="lg:w-lg-440-235 max-w-110" />
		</div>
		<AppFooterMenu />
	</div>
</template>

<script setup>
import SocialList from '@/components/social/SocialList.vue'
import AppFooterMenu from './AppFooterMenu.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
