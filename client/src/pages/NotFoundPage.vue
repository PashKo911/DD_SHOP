<template>
	<main-layout>
		<div class="container -mt-4 pb-8 sm:pt-2">
			<div class="mx-auto max-w-[52.6875rem]">
				<div class="flex justify-center">
					<img
						src="@/assets/img/not-found/404.svg"
						:alt="t('accessibility.notFoundAlt')"
					/>
				</div>
				<div class="-mt-[7vw]">
					<div class="flex justify-center">
						<img
							class="w-full max-w-[25.8125rem]"
							src="@/assets/img/not-found/main.png"
							alt="Image"
						/>
					</div>
					<div
						class="p-35-15 bg-creamy-cloud border-border-color relative -mt-0.5 grid justify-center rounded-md border"
					>
						<h1
							class="font-heading text-58-22 not-last:mb-45-15 text-center leading-tight font-semibold"
						>
							{{ t('pages.pageNotFound.title.page') }}
						</h1>
						<p
							class="font-heading text-24-18 text-center leading-tight not-last:mb-6"
						>
							{{ t('pages.pageNotFound.text') }}
						</p>
						<Button
							class="mx-auto w-max"
							@click="onBack"
							:label="t('buttons.backHome')"
						/>
					</div>
				</div>
			</div>
		</div>
	</main-layout>
</template>

<script setup>
import MainLayout from '@/components/layouts/MainLayout.vue'
import Button from '@/components/ui/button/Button.vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const onBack = () => {
	router.push({ name: 'home' })
}
</script>
