<template>
	<Breadcrumb
		unstyled
		:pt="theme"
		:ptOptions="{
			mergeProps: ptViewMerge,
		}"
	>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Breadcrumb>
</template>

<script setup>
import Breadcrumb from 'primevue/breadcrumb'
import { ptViewMerge } from '@/utils/volt'

const theme = {
	root: `overflow-x-auto py-1 px-1`,
	list: `m-0 p-0 list-none flex items-center flex-nowrap gap-2`,
	item: ``,
	itemLink: `no-underline flex items-center gap-2 transition-colors duration-200 rounded-sm
		text-24-18 font-heading
        focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary`,
	itemIcon: ``,
	itemLabel: ``,
	separator: `flex items-center`,
	separatorIcon: ``,
}
</script>
