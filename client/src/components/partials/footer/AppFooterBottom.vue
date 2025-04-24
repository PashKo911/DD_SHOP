<template>
	<div class="bg-primary py-44-30">
		<div
			class="relative container flex flex-col flex-wrap items-center justify-between gap-8 pt-8 md:flex-row"
		>
			<SeparatorInverse class="absolute top-0 left-0 w-full" />
			<div class="flex items-center gap-1.5 text-white capitalize">
				<span>
					{{ t('partials.footer.footerCopy') }}
				</span>
				<a
					href="https://suncavefreelancer.github.io/Site_code_lg/index.html"
					target="_blank"
					class="hover:text-t-inverse-hover focus-visible:outline-t-inverse-hover rounded-sm font-bold underline outline outline-transparent transition-colors duration-300"
				>
					CODE_LG
				</a>
			</div>
			<ul class="gx-md-50-25 flex flex-wrap justify-center gap-y-[1.5625rem]">
				<li
					v-for="m in paymentMethods"
					:key="m.id"
					:aria-label="t(`accessibility.paymentMethodsLabels.${m.id}`)"
					class="grid h-[2.625rem] w-[5.875rem] place-items-center rounded-l-full rounded-r-full bg-white"
				>
					<component :is="m.icon" />
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import paymentMethods from '@/data/paymentMethods'
import SeparatorInverse from '@/components/separators/SeparatorInverse.vue'

const { t } = useI18n()
</script>
