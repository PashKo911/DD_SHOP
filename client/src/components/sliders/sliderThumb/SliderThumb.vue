<template>
	<div
		class="flex w-full flex-col-reverse gap-6 overflow-hidden p-2.5 sm:flex-row sm:p-5 lg:max-w-[51.875rem]"
	>
		<Swiper
			:modules="modules"
			:spaceBetween="20"
			:slidesPerView="3"
			:autoHeight="true"
			:direction="thumbSwiperDirection"
			@swiper="setThumbsSwiper"
			data-thumb-swiper
			class="max-w-full cursor-pointer sm:basis-[23.631841%] [&_.swiper-button-prev]:hidden"
		>
			<SwiperSlide v-for="i in imagesList" :key="i">
				<div
					class="[.swiper-slide-thumb-active_&]:outline-primary flex aspect-[143.4/208] items-center justify-center overflow-hidden rounded-lg bg-white outline outline-offset-5 outline-transparent transition-colors sm:outline-offset-10 [.swiper-slide-visible_&]:shadow-lg"
				>
					<img
						:src="`${apiConfig.apiBase}${i}`"
						:alt="altImageAttr"
						width="143"
						height="215"
						class="h-full w-full"
					/>
				</div>
			</SwiperSlide>
		</Swiper>
		<Swiper
			:modules="modules"
			:effect="'fade'"
			:fadeEffect="{ crossFade: true }"
			:thumbs="{ swiper: thumbsSwiper }"
			:navigation="{ prevEl: '.btn-prev', nextEl: '.btn-next' }"
			@swiper="setMainSwiper"
			@slide-change="onSlideChange"
			class="group max-w-full min-w-0 overflow-hidden rounded-lg shadow-lg sm:basis-[75.243781%]"
		>
			<SwiperSlide
				v-for="i in imagesList"
				:key="i"
				class="bg-white"
				v-slot="{ isNext, isPrev }"
			>
				<div class="aspect-[457/686]">
					<img
						:src="`${apiConfig.apiBase}${i}`"
						:alt="altImageAttr"
						width="457"
						height="686"
						class="h-full w-full"
					/>
				</div>
			</SwiperSlide>
			<div class="absolute inset-0 overflow-hidden">
				<slider-nav-button
					:disabled="isFirstSlide"
					@click="mainSwiper.slidePrev()"
					:aria-label="t('buttons.prevSlide')"
					class="any-hover:-translate-x-full any-hover:opacity-0 absolute top-1/2 left-2 -translate-y-1/2 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100"
				>
					<arrow-left-icon class="aspect-square w-8" />
				</slider-nav-button>
				<slider-nav-button
					:disabled="isLastSlide"
					@click="mainSwiper.slideNext()"
					:aria-label="t('buttons.prevSlide')"
					class="any-hover:translate-x-full any-hover:opacity-0 absolute top-1/2 right-2 -translate-y-1/2 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100"
				>
					<arrow-right-icon class="aspect-square w-8" />
				</slider-nav-button>
			</div>
		</Swiper>
	</div>
</template>

<script setup>
import 'swiper/css'

import { ref, computed, watch } from 'vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useI18n } from 'vue-i18n'
import apiConfig from '@/config/api'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Thumbs, EffectFade } from 'swiper/modules'
import SliderNavButton from '@/components/sliders/SliderNavButton.vue'
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon.vue'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'

const props = defineProps({
	imagesList: {
		type: Array,
		required: [],
	},
	altImageAttr: {
		type: String,
		default: 'Image',
	},
})

const thumbsSwiper = ref(null)
const mainSwiper = ref(null)
const { t } = useI18n()

const setThumbsSwiper = (swiperInstance) => {
	thumbsSwiper.value = swiperInstance
}

const setMainSwiper = (swiperInstance) => {
	mainSwiper.value = swiperInstance
}

const activeIndex = ref(0)

const modules = [Thumbs, EffectFade]

const isMobileSmall = useMediaQuery('(max-width: 479.98px)')

const thumbSwiperDirection = computed(() => {
	return isMobileSmall.value ? 'horizontal' : 'vertical'
})
const isLastSlide = computed(() => {
	if (!props.imagesList?.length) return null
	return activeIndex.value === props.imagesList?.length - 1
})
const isFirstSlide = computed(() => {
	if (!props.imagesList?.length) return null
	return activeIndex.value === 0
})

const onSlideChange = (e) => {
	activeIndex.value = e.activeIndex
}
</script>

<style scoped>
[data-thumb-swiper].swiper {
	overflow: visible;
	margin-left: 0;
	margin-right: 0;
}
</style>
