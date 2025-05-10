<template>
	<article class="border-border-color flex flex-col rounded-lg border p-4">
		<div class="flex items-center gap-4 not-last:mb-5">
			<h3 class="text-xl leading-tight font-semibold capitalize">
				{{ reviewData.author }}
			</h3>
			<verified-icon v-if="reviewData.verified" />
		</div>
		<rating-comp v-model="reviewData.rating" readonly class="not-last:mb-5" />
		<div class="grow not-last:mb-6">
			<show-more :collapsedHeight="50">
				<p class="text-xl leading-tight">
					{{ reviewData.text }}
				</p>
			</show-more>
		</div>
		<span class="block lg:text-xl">
			{{ t('partials.reviews.postedOn') }}
			<time :datetime="reviewData.date">
				{{ d(reviewData.date, 'long') }}
			</time>
		</span>
	</article>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import VerifiedIcon from '../icons/VerifiedIcon.vue'
import RatingComp from '../ui/rating/RatingComp.vue'
import ShowMore from '../showMore/ShowMore.vue'

defineProps({
	reviewData: {
		type: Object,
		required: true,
	},
})

const { t, d } = useI18n()
</script>
