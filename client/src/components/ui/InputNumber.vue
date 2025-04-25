<template>
	<InputNumber
		unstyled
		:pt="theme"
		:ptOptions="{
			mergeProps: ptViewMerge,
		}"
	>
		<template #incrementicon>
			<PlusIcon />
		</template>
		<template #decrementicon>
			<MinusIcon />
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</InputNumber>
</template>

<script setup lang="ts">
import MinusIcon from '@primevue/icons/minus'
import PlusIcon from '@primevue/icons/plus'
import InputNumber, {
	type InputNumberPassThroughOptions,
	type InputNumberProps,
} from 'primevue/inputnumber'
import { ref } from 'vue'
import { ptViewMerge } from '@/utils/volt'

interface Props extends /* @vue-ignore */ InputNumberProps {}
defineProps<Props>()

const theme = ref<InputNumberPassThroughOptions>({
	root: `inline-flex relative
        p-vertical:flex-col p-fluid:w-full`,
	pcInputText: {
		root: `appearance-none rounded-md outline-hidden flex-auto
        bg-white
		text-center leading-tight
        p-filled:bg-surface-50
        text-primary font-heading
        placeholder:text-primary
        border border-border-color
        enabled:hover:border-surface-200
        enabled:focus:border-primary
        disabled:bg-surface-200 disabled:text-surface-500 
        p-invalid:border-red-400
        p-invalid:placeholder:text-red-600
        px-3 py-2 p-fluid:w-full
        p-small:text-xl p-small:w-16 p-small:px-1.5
        p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
        transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
        p-horizontal:order-2 p-horizontal:rounded-none
        p-vertical:order-2 p-vertical:rounded-none p-vertical:text-center
        p-fluid:w-[1%] p-fluid:p-vertical:w-full`,
	},
	buttonGroup: `p-stacked:flex p-stacked:flex-col p-stacked:absolute p-stacked:top-px p-stacked:end-px p-stacked:h-[calc(100%-2px)] p-stacked:z-10`,
	incrementButton: `flex items-center justify-center grow-0 shrink-0 basis-auto cursor-pointer w-10
        bg-white 
        border border-border-color enabled:hover:border-primary
        text-surface-400 enabled:hover:text-surface-500 enabled:active:text-surface-600
        transition-colors duration-200 disabled:pointer-events-none
        p-stacked:relative p-stacked:flex-auto p-stacked:border-none
        p-stacked:p-0 p-stacked:rounded-tr-[5px]
        p-horizontal:order-3 p-horizontal:rounded-e-md p-horizontal:border-s-0
        p-vertical:py-2 p-vertical:order-1 p-vertical:rounded-ss-md p-vertical:rounded-se-md p-vertical:w-full p-vertical:border-b-0`,
	incrementIcon: ``,
	decrementButton: `flex items-center justify-center grow-0 shrink-0 basis-auto cursor-pointer w-10
        bg-white 
        border border-border-color enabled:hover:border-primary
        text-surface-400 enabled:hover:text-surface-500 enabled:active:text-surface-600
        transition-colors duration-200 disabled:pointer-events-none
        p-stacked:relative p-stacked:flex-auto p-stacked:border-none
        p-stacked:p-0 p-stacked:rounded-br-[5px]
        p-horizontal:order-1 p-horizontal:rounded-s-md p-horizontal:border-e-0
        p-vertical:py-2 p-vertical:order-3 p-vertical:rounded-ee-md p-vertical:rounded-es-md p-vertical:w-full p-vertical:border-t-0`,
	decrementIcon: ``,
})
</script>
