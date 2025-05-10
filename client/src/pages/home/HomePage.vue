<template>
	<main-layout>
		<HomeHeroSection class="pb-80-30 pt-10 lg:pt-14" />
		<slider-base :items="reviews">
			<template #default="{ item }">
				<card-review :review-data="item" />
			</template>
		</slider-base>
	</main-layout>
</template>

<script setup>
import { reviews } from '@/data/reviews'

import MainLayout from '@/components/layouts/MainLayout.vue'
import CardReview from '@/components/cards/CardReview.vue'
import SliderBase from '@/components/sliders/SliderBase.vue'
import HomeHeroSection from './HomeHeroSection.vue'
</script>
