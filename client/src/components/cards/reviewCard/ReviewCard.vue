<template>
	<article class="border-border-color flex flex-col rounded-lg border p-4">
		<div v-if="reviewData.author" class="flex items-center gap-4 not-last:mb-5">
			<h3 class="text-xl leading-tight font-semibold capitalize">
				{{ reviewData.author?.name }}
			</h3>
			<verified-icon v-if="reviewData.verified" />
		</div>
		<rating-comp v-model="reviewData.rating" readonly class="not-last:mb-5" />
		<div class="grow not-last:mb-4">
			<show-more :collapsedHeight="50">
				<p class="text-xl leading-tight">
					{{ reviewData.comment }}
				</p>
			</show-more>
		</div>
		<span class="block text-lg leading-tight">
			{{ t('partials.reviews.postedOn') }}
			<time :datetime="reviewData.createdAt">
				{{ d(reviewData.createdAt, 'long') }}
			</time>
		</span>
	</article>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import VerifiedIcon from '@/components/icons/VerifiedIcon.vue'
import RatingComp from '@/components/ui/rating/RatingComp.vue'
import ShowMore from '@/components/showMore/ShowMore.vue'

defineProps({
	reviewData: {
		type: Object,
		required: true,
	},
})

const { t, d } = useI18n()
</script>
