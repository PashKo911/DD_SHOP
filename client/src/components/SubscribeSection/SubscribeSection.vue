<template>
	<div class="bg-primary px-md-84-15 py-md-57-15 container xl:rounded-2xl">
		<h2
			class="text-55-20 text-center font-sans leading-tight font-bold text-white uppercase md:text-left"
		>
			{{ $t('subscribeSection.title') }}
		</h2>
		<SubscribeSectionForm />
	</div>
</template>

<script setup>
import SubscribeSectionForm from './SubscribeSectionForm.vue'
</script>
