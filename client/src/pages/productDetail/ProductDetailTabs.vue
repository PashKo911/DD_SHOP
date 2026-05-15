<template>
	<tabs value="1" scrollable :lazy="true">
		<tab-list>
			<tab value="0">
				{{ t('pages.productDetail.tabs.head.details') }}
			</tab>
			<tab value="1">
				{{ t('pages.productDetail.tabs.head.reviews') }}
			</tab>
			<tab value="2">
				{{ t('pages.productDetail.tabs.head.faq') }}
			</tab>
		</tab-list>
		<tab-panels>
			<tab-panel value="0">
				<p>
					{{ description }}
				</p>
			</tab-panel>
			<tab-panel value="1">
				<div class="grid gap-x-6 gap-y-8 md:grid-cols-2">
					<component
						:is="activeReviewComponent"
						v-for="r in reviewCards"
						:key="r._id"
						:review-data="!r.isSkeleton ? r : null"
					/>
				</div>
			</tab-panel>
			<tab-panel value="2">
				<faqs />
			</tab-panel>
		</tab-panels>
	</tabs>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import Tabs from '@/components/tab/Tabs.vue'
import TabList from '@/components/tab/TabList.vue'
import Tab from '@/components/tab/Tab.vue'
import TabPanels from '@/components/tab/TabPanels.vue'
import TabPanel from '@/components/tab/TabPanel.vue'
import ReviewCard from '@/components/cards/reviewCard/ReviewCard.vue'
import ReviewCardSkeleton from '@/components/cards/reviewCard/ReviewCardSkeleton.vue'
import Faqs from '@/components/partials/faqs/Faqs.vue'

const { t } = useI18n()
const props = defineProps({
	reviews: {
		type: Array,
		default: () => [],
	},
	isReviewsLoading: {
		type: Boolean,
		default: false,
	},
	skeletonCount: {
		type: Number,
		default: 6,
	},
	description: {
		type: String,
	},
})

const activeReviewComponent = computed(() => {
	return props.isReviewsLoading || !props.reviews.length
		? ReviewCardSkeleton
		: ReviewCard
})

const reviewCards = computed(() => {
	if (props.isReviewsLoading || !props.reviews.length) {
		return Array.from({ length: props.skeletonCount }, (_, i) => ({
			_id: `skeleton-${i}`,
			isSkeleton: true,
		}))
	}
	return props.reviews
})
</script>
