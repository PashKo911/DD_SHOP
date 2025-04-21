<template>
	<main-layout>
		<div class="font-heading font-bold">League Spartan</div>
		<div class="font-pridi">Pridi</div>
		<div class="font-semibold">Montserrat</div>
		<div class="font-aBeeZee font-semibold">ABeeZee</div>
		<Search class="text-primary" />
		<div class="font-title text-[80px] uppercase">
			знайти одяг, який відповідає вашому стилю
		</div>
		<Select
			v-model="selectedCity"
			:options="cities"
			optionLabel="name"
			placeholder="Select a City"
			class="w-full md:w-56"
		/>
		<InputText />
	</main-layout>
</template>

<script setup>
import InputText from '@/volt/InputText.vue'
import MainLayout from '@/components/layouts/MainLayout.vue'
import Select from '@/volt/Select.vue'
import { ref } from 'vue'
import Search from '@primevue/icons/search'

const selectedCity = ref(null)
const cities = ref([
	{ name: 'New York', code: 'NY' },
	{ name: 'Rome', code: 'RM' },
	{ name: 'London', code: 'LDN' },
	{ name: 'Istanbul', code: 'IST' },
	{ name: 'Paris', code: 'PRS' },
])
</script>
