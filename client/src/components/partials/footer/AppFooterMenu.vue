<template>
	<div class="flex grow flex-wrap justify-between gap-x-4 gap-y-8 md:gap-y-12">
		<div v-for="i in footerMenuList" :key="i.id">
			<h3 class="font-heading text-32-26 mb-4 leading-tight uppercase lg:mb-8">
				{{ t(`footer.footerMenu.${i.id}.title`) }}
			</h3>
			<ul class="grid gap-2.5 lg:gap-5">
				<li v-for="l in i.items" :key="l.id">
					<router-link
						:to="{
							name: l.routeName,
						}"
						class="font-heading text-24-18 hover:decoration-primary focus-visible:outline-primary rounded-sm capitalize underline decoration-transparent decoration-2 outline outline-transparent transition-colors duration-300"
					>
						{{ t(`footer.footerMenu.${i.id}.items.${l.id}`) }}
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import footerMenuList from '@/data/footerMenuList'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
