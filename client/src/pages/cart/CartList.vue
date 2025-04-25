<template>
	<div class="p-35-15 border-border-color rounded-xl border">
		<cart-product-card v-for="p in cartList" :key="p._id" :product-data="p" />
	</div>
</template>

<script setup>
import CartProductCard from './CartProductCard.vue'

import img1 from '@/assets/img/products/1.jpg'
import img2 from '@/assets/img/products/2.jpg'
import img3 from '@/assets/img/products/3.jpg'

const cartList = [
	{
		_id: '1',
		imgSrc: img1,
		title: "Stylish men's sweater (Color)",
		color: 'Turquoise',
		size: '2XL',
		price: '239',
	},
	{
		_id: '2',
		imgSrc: img2,
		title: "Stylish men's sweater (Color)",
		color: 'Turquoise',
		size: '2XL',
		price: '239',
	},
	{
		_id: '3',
		imgSrc: img3,
		title: "Stylish men's sweater (Color)",
		color: 'Turquoise',
		size: '2XL',
		price: '239',
	},
]
</script>
