<template>
	<section
		class="lg:gx-lg-80-12 not-last:mb-100-60 flex flex-col items-start justify-between gap-x-4 gap-y-10 lg:flex-row"
	>
		<slider-thumb :images-list="imagesList" class="lg:shrink-0 lg:basis-1/2" />
		<product-description :product-data="productData" class="lg:grow" />
	</section>

	<product-detail-tabs :reviews="reviews" class="not-last:mb-100-60" />

	<section>
		<div>
			<h2
				class="font-heading not-last:mb-50-30 text-50-28 leading-tight font-semibold uppercase"
			></h2>
		</div>
		<!-- <slider-base
			:items="sliderData"
			:title="t('pages.productDetail.title.sameProductsSection')"
		/> -->
	</section>
</template>
<script setup>
import { useI18n } from 'vue-i18n'

import img1 from '@/assets/img/products/1.webp'
import img2 from '@/assets/img/products/2.webp'
import img3 from '@/assets/img/products/3.webp'
import { reviews } from '@/data/reviews'
import sliderData from '@/data/sliderData'

import SliderThumb from '@/components/sliders/SliderThumb.vue'
import SliderBase from '@/components/sliders/SliderBase.vue'
import ProductDescription from './ProductDescription.vue'
import ProductDetailTabs from './ProductDetailTabs.vue'

const imagesList = [
	{
		_id: '1',
		imgSrc: img1,
	},
	{
		_id: '2',
		imgSrc: img2,
	},
	{
		_id: '3',
		imgSrc: img3,
	},
	{
		_id: '4',
		imgSrc: img1,
	},
	{
		_id: '5',
		imgSrc: img2,
	},
	{
		_id: '6',
		imgSrc: img3,
	},
]

const productData = {
	_id: '1',
	title: 'one life graphic T-Shorts',
	rating: 4.5,
	price: 260,
	oldPrice: 300,
	description:
		"Men's T-shirt, two-piece, 200 g/m², multi-colored with graphics, M (8060)",
	colors: [
		{
			_id: '1',
			label: 'blue',
			value: '#007ED3',
		},
		{
			_id: '2',
			label: 'red',
			value: '#DA3300',
		},
		{
			_id: '3',
			label: 'dark gray',
			value: '#434D58',
		},
	],
	sizes: [
		{
			_id: '1',
			label: 's',
			value: 's',
		},
		{
			_id: '2',
			label: 'm',
			value: 'm',
		},
		{
			_id: '3',
			label: 'l',
			value: 'l',
		},
		{
			_id: '4',
			label: 'xl',
			value: 'xlsa',
		},
		{
			_id: '5',
			label: 'sm',
			value: 'sm',
		},
	],
}

const props = defineProps({
	category: {
		type: String,
		required: true,
	},
	productId: {
		type: [String, Number],
		required: true,
	},
})

const { t } = useI18n()
</script>
