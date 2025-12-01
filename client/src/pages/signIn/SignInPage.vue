<template>
	<div
		class="relative bg-[url(@/assets/img/auth/sign-in.jpg)] bg-cover bg-[20%] xl:bg-left-top"
	>
		<div class="absolute inset-0 bg-black/30 backdrop-blur-md md:hidden"></div>
		<div
			class="container flex min-h-[calc(100svh_-_7.375rem)] items-center justify-end pt-7 pb-8 md:min-h-[calc(100svh_-_8.75rem)] lg:min-h-[calc(100svh_-_6.125rem)]"
		>
			<signin-form class="md:w-md-670-450 relative" />
		</div>
	</div>
</template>

<script setup>
import SigninForm from '@/pages/signin/SigninPage.vue'
</script>
