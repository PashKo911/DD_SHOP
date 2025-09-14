<template>
	<router-link v-bind="routerProps" custom v-slot="{ navigate, href }">
		<Button as="a" v-bind="$attrs" :href="href" @click="navigate">
			<template v-for="(_, name) in $slots" v-slot:[name]="slotProps">
				<slot :name="name" v-bind="slotProps ?? {}" />
			</template>
		</Button>
	</router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Button from './Button.vue'

defineOptions({ inheritAttrs: false })

const routerProps = defineProps(RouterLink.props)
</script>
