<template>
	<header-menu />
	<main class="grow">
		<Toast />
		<slot />
	</main>
	<SubscribeSection class="not-last:my-100-30" />
	<app-footer />
</template>

<script setup>
import HeaderMenu from '@/components/partials/header/HeaderMenu.vue'
import AppFooter from '@/components/partials/footer/AppFooter.vue'
import Toast from '@/components/ui/toast/Toast.vue'
import SubscribeSection from '@/components/partials/subscribeSection/SubscribeSection.vue'
</script>
