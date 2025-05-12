<template>
	<main-layout>
		<HomeHeroSection class="pb-80-30 pt-10 lg:pt-14" />
		<div class="not-last:mb-80-50">
			<SliderSingle :items="specialOfferItems" />
			<div class="py-50-15 bg-primary relative z-20 -mt-[.0625rem]">
				<ul
					class="container flex flex-wrap items-center justify-around gap-2 md:justify-between md:gap-4"
				>
					<li
						v-for="p in fashionPartners"
						:key="p"
						class="font-heading text-creamy-cloud text-80-20 leading-tight font-semibold uppercase"
					>
						{{ p }}
					</li>
				</ul>
			</div>
		</div>
		<div class="not-last:mb-80-50 container">
			<slider-base
				:items="sliderData"
				:title="t('pages.home.sectionTitles.newArrivals')"
			/>
		</div>
		<div class="not-last:mb-80-50">
			<img
				src="@/assets/img/hero/black-friday-section.webp"
				:alt="t('pages.home.sectionTitles.blackFriday')"
			/>
		</div>
		<div class="not-last:mb-100-60 container">
			<slider-base
				:items="sliderData"
				:title="t('pages.home.sectionTitles.topSelling')"
			/>
		</div>
		<div class="not-last:mb-100-60 container">
			<home-dress-style-section class="not-last:mb-80-50" />
		</div>
		<div class="not-last:mb-80-50">
			<img src="@/assets/img/hero/new-collection.webp" alt="Image" />
		</div>
		<div class="not-last:mb-80-50 container">
			<slider-base
				:items="reviews"
				:title="t('pages.home.sectionTitles.reviews')"
			>
				<template #default="{ item }">
					<card-review :review-data="item" />
				</template>
			</slider-base>
		</div>
	</main-layout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

import { reviews } from '@/data/reviews'
import specialOfferItems from '@/data/specialOfferItems'
import fashionPartners from '@/data/fashionPartners'
import sliderData from '@/data/sliderData'

import MainLayout from '@/components/layouts/MainLayout.vue'
import CardReview from '@/components/cards/CardReview.vue'
import SliderBase from '@/components/sliders/SliderBase.vue'
import HomeHeroSection from './HomeHeroSection.vue'
import SliderSingle from '@/components/sliders/SliderSingle.vue'
import HomeDressStyleSection from './HomeDressStyleSection.vue'

const { t } = useI18n()
</script>
