<template>
	<header-menu />
	<main class="grow">
		<Toast />
		<HeaderDarkThemeToggler class="fixed top-24 left-4" />
		<div class="container pt-[7.5rem] pb-8">
			<slot />
		</div>
	</main>
	<SubscribeSection />
	<app-footer />
</template>

<script setup>
import HeaderMenu from '@/components/partials/header/HeaderMenu.vue'
import AppFooter from '@/components/partials/AppFooter.vue'
import Toast from '@/volt/Toast.vue'
import HeaderDarkThemeToggler from '../partials/header/HeaderDarkThemeToggler.vue'
import SubscribeSection from '../SubscribeSection/SubscribeSection.vue'
</script>
