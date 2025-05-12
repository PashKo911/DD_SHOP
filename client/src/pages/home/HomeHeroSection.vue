<template>
	<section
		id="1"
		data-wrp
		class="container flex flex-col items-center max-lg:gap-3 lg:flex-row"
	>
		<div data-cnt class="shrink-0 basis-[56%]">
			<h1
				class="font-title lg:text-lg-80-48 text-max-lg-70-32 text-center leading-tight font-bold uppercase not-last:mb-5 lg:text-left"
			>
				{{ t('pages.home.heroSection.title') }}
			</h1>
			<div class="text-center not-last:mb-9 lg:max-w-[44.375rem] lg:text-left">
				<p
					class="font-heading text-35-20 leading-tight capitalize not-last:mb-2.5"
				>
					{{ t('pages.home.heroSection.text') }}
				</p>
			</div>
			<Button
				:label="t('buttons.shopNow')"
				size="large"
				class="min-w-full lg:min-w-[18.125rem] not-last:lg:mb-10 not-last:xl:mb-[3.125rem]"
			/>
			<Teleport defer :to="achievementsPosition">
				<ul
					class="flex w-full items-start justify-evenly gap-x-4 lg:justify-between"
				>
					<li v-for="a in achievements" :key="a.id" class="grid gap-2.5">
						<span
							class="font-heading text-max-lg-60-26 lg:text-lg-70-42 leading-tight font-semibold"
						>
							{{ a.value }}
						</span>
						<span
							class="font-heading lg:text-lg-29-20 leading-tight capitalize"
						>
							{{ t(a.label) }}
						</span>
					</li>
				</ul>
			</Teleport>
		</div>
		<div class="lg:basis-{44%} not-last:mb-2">
			<img
				src="@/assets/img/hero/main.webp"
				:alt="t('pages.home.heroSection.mainImgAlt')"
			/>
		</div>
	</section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMediaQuery } from '@/composables/useMediaQuery'
import achievements from '@/data/achievements'

import Button from '@/components/ui/button/Button.vue'

const isTablet = useMediaQuery('(max-width: 991.98px)')
const achievementsPosition = computed(() => {
	return isTablet.value ? '[data-wrp]' : '[data-cnt]'
})

const { t } = useI18n()
</script>
