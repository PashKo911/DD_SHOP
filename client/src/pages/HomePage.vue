<template>
	<main-layout>
		<div class="font-heading font-bold">League Spartan</div>
		<div class="font-pridi">Pridi</div>
		<div class="font-semibold">Montserrat</div>
		<div
			data-a
			data-b
			class="a b c d e f g h i j k l m n o p q aspect-square w-40"
		></div>
		<Search class="text-primary" />
		<div class="font-title text-[80px] uppercase">
			знайти одяг, який відповідає вашому стилю
		</div>
		<slider-base :items="reviews">
			<template #default="{ item }">
				<card-review :review-data="item" />
			</template>
		</slider-base>
	</main-layout>
</template>

<script setup>
import MainLayout from '@/components/layouts/MainLayout.vue'
import Search from '@primevue/icons/search'

import CardReview from '@/components/cards/CardReview.vue'
import SliderBase from '@/components/sliders/SliderBase.vue'
import { reviews } from '@/data/reviews'
</script>
