<template>
	<main-layout>
		<div
			class="relative bg-[url(@/assets/img/auth/sign-up.jpg)] bg-cover bg-[40%] sm:bg-[75%] md:bg-[60%] xl:bg-left-top"
		>
			<div
				class="absolute inset-0 bg-black/30 backdrop-blur-md md:hidden"
			></div>
			<div
				class="container flex min-h-[calc(100svh_-_7.375rem)] items-center justify-end pt-7 pb-8 md:min-h-[calc(100svh_-_8.75rem)] lg:min-h-[calc(100svh_-_6.1875rem)]"
			>
				<sign-up-form class="md:w-md-670-450 relative" />
			</div>
		</div>
	</main-layout>
</template>

<script setup>
import MainLayout from '@/components/layouts/MainLayout.vue'
import SignUpForm from './SignUpForm.vue'
</script>
