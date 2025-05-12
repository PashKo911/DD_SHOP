<template>
	<header-menu />
	<main class="pb-80-30 mb-80-30 relative grow">
		<separator-base class="absolute bottom-0 left-0" />
		<toast />
		<slot />
	</main>
	<subscribe-section />
	<app-footer />
</template>

<script setup>
import HeaderMenu from '@/components/partials/header/HeaderMenu.vue'
import AppFooter from '@/components/partials/footer/AppFooter.vue'
import Toast from '@/components/ui/toast/Toast.vue'
import SubscribeSection from '@/components/partials/subscribeSection/SubscribeSection.vue'
import SeparatorBase from '../separators/SeparatorBase.vue'
</script>
