<template>
	<main-layout>
		<div class="relative">
			<div
				class="2xl:bg-top-left pointer-events-none absolute inset-0 bg-[url(@/assets/img/auth/sign-in.jpg)] bg-cover bg-[20%] blur-sm md:blur-none xl:bg-left-top"
			></div>
			<div
				class="container flex min-h-[calc(100svh_-_7.375rem)] items-center justify-end pt-7 pb-8 md:min-h-[calc(100svh_-_8.75rem)] lg:min-h-[calc(100svh_-_6.125rem)]"
			>
				<sign-in-form class="md:w-md-670-450 relative" />
			</div>
		</div>
	</main-layout>
</template>

<script setup>
import MainLayout from '@/components/layouts/MainLayout.vue'
import SignInForm from './SignInForm.vue'
</script>
