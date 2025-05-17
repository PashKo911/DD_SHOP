<template>
	<div>
		<Select v-model="sortFilterSettings" />
	</div>
</template>

<script setup>
import { ref } from 'vue'
import sortFilterSettings from '@/data/sortFilterSettings'

import Select from '@/components/ui/select/Select.vue'
</script>
