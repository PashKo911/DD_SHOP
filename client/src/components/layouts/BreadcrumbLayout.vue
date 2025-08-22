<template>
	<div class="container pt-6 pb-8">
		<breadcrumb-wrapper class="mb-8" />
		<router-view />
	</div>
</template>

<script setup>
import BreadcrumbWrapper from '@/components/breadcrumb/BreadcrumbWrapper.vue'
</script>
