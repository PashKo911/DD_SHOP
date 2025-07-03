<template>
	<RouterLink v-bind="routerProps" custom v-slot="{ navigate, href }">
		<Button as="a" v-bind="$attrs" :href="href" @click="navigate">
			<slot />
		</Button>
	</RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Button from './Button.vue'

defineOptions({ inheritAttrs: false })

const routerProps = defineProps(RouterLink.props)
</script>
