<template>
	<section
		class="bg-primary px-md-84-15 py-md-57-15 gy-lg-50-30 container flex flex-col items-start justify-between gap-x-4 md:w-[95%] md:flex-row md:rounded-2xl xl:w-full"
	>
		<h2
			class="text-max-md-40-20 md:text-md-52-28 text-center font-sans leading-tight font-bold text-white uppercase md:max-w-[45.9375rem] md:basis-[55%] md:text-left"
		>
			{{ $t('subscribeSection.title') }}
		</h2>
		<SubscribeSectionForm
			class="md:max-w-[39.5rem] md:basis-[45%] md:self-center"
		/>
	</section>
</template>

<script setup>
import SubscribeSectionForm from './SubscribeSectionForm.vue'
</script>
