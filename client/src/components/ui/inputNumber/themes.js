export const DEFAULT_INPUT_NUMBER_THEME = {
	root: `inline-flex relative group
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
        px-3 py-[.9063rem] p-fluid:w-full w-16
        p-small:text-xl p-small:w-16 p-small:px-1.5 p-small:py-2
        p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
        transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
        p-horizontal:order-2 p-horizontal:rounded-none
        p-vertical:order-2 p-vertical:rounded-none p-vertical:text-center
        p-fluid:w-[1%] p-fluid:p-vertical:w-full`,
	},
	buttonGroup: `p-stacked:flex p-stacked:flex-col p-stacked:absolute p-stacked:top-px p-stacked:end-px p-stacked:h-[calc(100%-2px)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300`,
	incrementButton: `flex items-center justify-center grow-0 shrink-0 basis-auto cursor-pointer w-10
        bg-white 
        border border-border-color enabled:hover:border-primary
        text-surface-400 enabled:hover:text-surface-500 enabled:active:text-surface-600
        transition-colors duration-200 disabled:pointer-events-none
        p-stacked:relative p-stacked:flex-auto p-stacked:border-none
        p-stacked:p-0 p-stacked:rounded-tr-md
        p-horizontal:order-3 p-horizontal:rounded-e-md p-horizontal:border-s-0
        p-vertical:py-2 p-vertical:order-1 p-vertical:rounded-ss-md p-vertical:rounded-se-md p-vertical:w-full p-vertical:border-b-0`,
	incrementIcon: ``,
	decrementButton: `flex items-center justify-center grow-0 shrink-0 basis-auto cursor-pointer w-10
        bg-white 
        border border-border-color enabled:hover:border-primary
        text-surface-400 enabled:hover:text-surface-500 enabled:active:text-surface-600
        transition-colors duration-200 disabled:pointer-events-none
        p-stacked:relative p-stacked:flex-auto p-stacked:border-none
        p-stacked:p-0 p-stacked:rounded-br-md
        p-horizontal:order-1 p-horizontal:rounded-s-md p-horizontal:border-e-0
        p-vertical:py-2 p-vertical:order-3 p-vertical:rounded-ee-md p-vertical:rounded-es-md p-vertical:w-full p-vertical:border-t-0`,
	decrementIcon: ``,
}
