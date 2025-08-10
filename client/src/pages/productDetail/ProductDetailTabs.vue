<template>
	<Tabs value="1" scrollable>
		<TabList>
			<Tab value="0">
				{{ t('pages.productDetail.tabs.head.details') }}
			</Tab>
			<Tab value="1">
				{{ t('pages.productDetail.tabs.head.reviews') }}
			</Tab>
			<Tab value="2">
				{{ t('pages.productDetail.tabs.head.faq') }}
			</Tab>
		</TabList>
		<TabPanels>
			<TabPanel value="0">
				<p>
					At vero eos et accusamus et iusto odio dignissimos ducimus qui
					blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
					et quas molestias excepturi sint occaecati cupiditate non provident,
					similique sunt in culpa qui officia deserunt mollitia animi, id est
					laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
					distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
					cumque nihil impedit quo minus.
				</p>
			</TabPanel>
			<TabPanel value="1">
				<div class="grid gap-x-6 gap-y-8 md:grid-cols-2">
					<review-card v-for="r in reviews" :key="r._id" :review-data="r">
						{{ item }}
					</review-card>
				</div>
			</TabPanel>
			<TabPanel value="2">
				<p>
					At vero eos et accusamus et iusto odio dignissimos ducimus qui
					blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
					et quas molestias excepturi sint occaecati cupiditate non provident,
					similique sunt in culpa qui officia deserunt mollitia animi, id est
					laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita
					distinctio. Nam libero tempore, cum soluta nobis est eligendi optio
					cumque nihil impedit quo minus.
				</p>
			</TabPanel>
		</TabPanels>
	</Tabs>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import Tabs from '@/components/tab/Tabs.vue'
import TabList from '@/components/tab/TabList.vue'
import Tab from '@/components/tab/Tab.vue'
import TabPanels from '@/components/tab/TabPanels.vue'
import TabPanel from '@/components/tab/TabPanel.vue'
import ReviewCard from '@/components/cards/reviewCard/ReviewCard.vue'

const { t } = useI18n()
const props = defineProps({
	reviews: {
		type: Array,
		default: () => [],
	},
})
</script>
