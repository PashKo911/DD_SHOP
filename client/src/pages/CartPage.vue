<template>
	<main-layout>
		<breadcrumb-wrapper :items="items" />
		<div>CartPage</div>
	</main-layout>
</template>

<script setup>
import MainLayout from '@/components/layouts/MainLayout.vue'
import BreadcrumbWrapper from '@/components/breadcrumb/BreadcrumbWrapper.vue'

const items = [{ label: 'Cart' }]
</script>
