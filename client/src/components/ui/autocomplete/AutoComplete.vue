<template>
	<AutoComplete unstyled :pt="theme" :ptOptions="ptOptions" appendTo="self">
		<template #dropdownicon>
			<slot name="dropdownicon">
				<ChevronDownIcon />
			</slot>
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</AutoComplete>
</template>

<script setup>
import ChevronDownIcon from '@primevue/icons/chevrondown'
import AutoComplete from 'primevue/autocomplete'
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const theme = {
	root: `inline-flex p-fluid:flex flex-row-reverse relative`,
	pcInputText: {
		root: `appearance-none rounded-md outline-hidden
            bg-creamy-cloud
            p-filled:bg-surface-50
			font-heading leading-tight
            text-primary text-xl font-bold
            placeholder:text-surface-500
            border border-transparent border-2
            enabled:hover:border-t-inverse-hover
            enabled:focus:border-t-inverse-hover
            disabled:bg-surface-100 disabled:text-surface-500
            p-invalid:border-red-400
            p-invalid:placeholder:text-red-600
            pl-[3.125rem] pr-10 py-1.5 md:py-2 p-fluid:w-full
            p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
            p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
            p-has-dropdown:flex-auto p-has-dropdown:w-[1%] 
            transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
	},
	inputMultiple: `m-0 list-none cursor-text overflow-hidden flex items-center flex-wrap
        px-3 py-1 not-p-empty:px-1 gap-1 text-surface-700
        border border-surface-300 rounded-md p-has-dropdown:rounded-e-none w-full
        hover:border-surface-400 p-focus:border-t-inverse-hover border-2
        p-invalid:border-red-400
        p-filled:bg-surface-50
        p-disabled:pointer-events-none p-disabled:bg-surface-200 p-disabled:text-surface-500
        shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
        transition-colors duration-200 outline-none`,
	chipItem: ``,
	pcChip: {
		root: `inline-flex items-center rounded-sm gap-2 px-3 py-1
            bg-surface-100
            text-surface-800
            has-[img]:pt-1 has-[img]:pb-1
            p-focus:bg-surface-200 p-focus:text-surface-800
            p-removable:pe-2`,
		image: `rounded-full w-8 h-8 -ms-2`,
		icon: `text-surface-800 text-base w-4 h-4`,
		label: ``,
		removeIcon: `cursor-pointer text-base w-4 h-4 rounded-full
            text-surface-800
            focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary`,
	},
	chipIcon: ``,
	inputChip: `flex-auto inline-flex py-1 max-w-30`,
	input: `border-none outline-none bg-transparent m-0 p-0 shadow-none rounded-none w-full text-inherit
        placeholder:text-surface-500`,
	loader: `absolute top-1/2 -translate-y-1/2 end-3 p-has-dropdown:end-4 animate-spin`,
	dropdown: `absolute top-0 left-0 cursor-pointer inline-flex items-center justify-center select-none overflow-hidden w-10 h-full shrink-0 rounded-s-md
		group
		border border-2 border-transparent outline-none
		focus-visible:border-t-inverse-hover
        transition-colors duration-200`,
	dropdownIcon: ``,
	overlay: `search-overlay w-full absolute top-0 overflow-hidden
        bg-creamy-cloud
		rounded-md
        border border-surface-200
        text-surface-700
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]`,
	virtualScroller: ``,
	listContainer: `w-full overflow-auto`,
	list: `m-0 p-1 list-none flex flex-col`,
	optionGroup: `m-0 px-3 py-1 text-primary font-semibold bg-transparent capitalize`,
	option: `cursor-pointer whitespace-nowrap relative flex items-center px-3 py-[3px] rounded-sm
        text-primary bg-transparent border-none
        p-focus:bg-surface-100 p-focus:text-surface-800
        p-selected:bg-highlight p-focus:p-selected:bg-highlight-emphasis
        transition-colors duration-200`,
	emptyMessage: `px-3 py-2`,
	searchResultMessage: ``,
	selectedMessage: ``,
	transition: {
		enterFromClass: 'opacity-0 scale-y-75',
		enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
		leaveActiveClass: 'transition-opacity duration-100 ease-linear',
		leaveToClass: 'opacity-0',
	},
}
</script>
