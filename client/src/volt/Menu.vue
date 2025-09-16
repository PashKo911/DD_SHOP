<template>
	<Menu ref="el" unstyled :pt="theme" :ptOptions="ptOptions">
		<template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Menu>
</template>

<script setup>
import Menu from 'primevue/menu'
import { computed, ref } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `bg-creamy-cloud
        text-primary mt-1
        border border-surface-200
        rounded-md p-2
        p-popup:shadow-[0_.25rem_.375rem_-0.0625rem_rgba(0,0,0,0.1),0_.125rem_.25rem_-0.125rem_rgba(0,0,0,0.1)]`,
	list: `m-0 p-1 list-none outline-none flex flex-col gap-[.125rem]`,
	item: `p-disabled:opacity-60 p-disabled:pointer-events-none flex`,
	itemContent: `group transition-colors duration-200 rounded-sm text-primary w-full flex items-center
		p-focus:bg-select-hover`,
	itemLink: `cursor-pointer flex items-center no-underline overflow-hidden relative text-inherit font-heading font-semibold
        px-2 py-2 gap-2 select-none outline-none`,
	itemIcon: `text-surface-400`,
	itemLabel: ``,
	submenuLabel: `bg-transparent px-3 py-2 text-surface-500 font-semibold`,
	separator: `border-b border-border-color pt-2 mb-2`,
	transition: {
		enterFromClass: 'opacity-0 scale-y-75',
		enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
		leaveActiveClass: 'transition-opacity duration-100 ease-linear',
		leaveToClass: 'opacity-0',
	},
}

const el = ref()
defineExpose({
	toggle: (event) => el.value.toggle(event),
})
</script>
