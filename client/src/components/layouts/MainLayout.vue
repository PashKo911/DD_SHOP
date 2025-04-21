<template>
	<header-menu />
	<main class="grow">
		<Toast />
		<div class="container pt-[7.5rem] pb-8">
			<slot />
		</div>
	</main>
	<SubscribeSection class="not-last:my-100-30" />
	<app-footer />
</template>

<script setup>
import HeaderMenu from '@/components/partials/header/HeaderMenu.vue'
import AppFooter from '@/components/partials/footer/AppFooter.vue'
import Toast from '@/volt/Toast.vue'
import SubscribeSection from '@/components/SubscribeSection/SubscribeSection.vue'
</script>
