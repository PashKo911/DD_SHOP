export const DEFAULT_SELECT_THEME = {
	root: `inline-flex cursor-pointer relative select-none rounded-md p-fluid:flex
        bg-creamy-cloud
        border border-border-color hover:border-surface-400
        p-focus:border-primary
        p-filled:bg-surface-50
        p-invalid:border-red-400
        p-disabled:bg-surface-200 p-disabled:text-surface-500 p-disabled:pointer-events-none
        shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]
        transition-colors duration-200`,
	label: `block whitespace-nowrap overflow-hidden flex-auto w-[1%]
        py-2 px-3 overflow-ellipsis 
        p-clearable:pe-7 p-empty:overflow-hidden p-empty:opacity-0 p-editable:cursor-default
		font-heading font-semibold bg-transparent border-none outline-none
        p-placeholder:text-surface-500
        p-disabled:text-surface-500
        p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
        p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]`,
	dropdown: `flex items-center justify-center shrink-0 bg-transparent
        text-surface-400 w-10 rounded-e-md`,
	overlay: `absolute top-0 left-0 rounded-md p-portal-self:min-w-full
        bg-surface-0
        border border-surface-200
        text-surface-700
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]`,
	header: `pt-2 pb-1 px-4`,
	pcFilterContainer: {
		root: `relative`,
	},
	pcFilter: {
		root: `w-full appearance-none rounded-md outline-hidden
            bg-surface-0
            text-surface-700
            placeholder:text-surface-500
            border border-surface-300
            enabled:hover:border-surface-400
            enabled:focus:border-primary
            disabled:bg-surface-200 disabled:text-surface-500
            ps-3 pe-10 py-2 p-fluid:w-full
            transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
	},
	pcFilterIconContainer: {
		root: `absolute top-1/2 -mt-2 leading-none end-3 z-1`,
	},
	listContainer: `overflow-auto`,
	list: `m-0 p-1 list-none gap-[2px] flex flex-col`,
	optionGroup: `m-0 px-3 py-2 bg-transparent text-surface-500`,
	optionGroupLabel: ``,
	option: `cursor-pointer font-heading whitespace-nowrap relative overflow-hidden flex items-center
        px-3 py-2 border-none text-surface-700 bg-transparent rounded-sm
        p-focus:bg-surface-100 p-focus:text-surface-800
        p-selected:bg-highlight p-focus:p-selected:bg-highlight-emphasis
        transition-colors duration-200`,
	optionLabel: ``,
	optionCheckIcon: `relative -ms-[0.375rem] me-[0.375rem] text-surface-700`,
	optionBlankIcon: ``,
	emptyMessage: `px-3 py-2`,
	virtualScroller: ``,
	transition: {
		enterFromClass: 'opacity-0 scale-y-75',
		enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
		leaveActiveClass: 'transition-opacity duration-100 ease-linear',
		leaveToClass: 'opacity-0',
	},
}

export const TRANSPARENT_SELECT_THEME = {
	root: `inline-flex cursor-pointer relative select-none rounded-md p-fluid:flex
 		border border-transparent hover:border-t-inverse-hover
        p-focus:border-t-inverse-hover
        transition-colors`,

	label: `block whitespace-nowrap overflow-hidden flex-auto w-[1%]
        py-2 px-3 overflow-ellipsis 
        text-inverse font-heading  border-none outline-none
        p-placeholder:text-inverse 
        p-small:text-[1.125rem]  p-small:px-[0.625rem] p-small:py-[0.375rem]`,

	dropdown: `hidden`,
	overlay: `absolute top-0 left-0 rounded-md p-portal-self:min-w-full
        bg-inverse
        border border-surface-200
        text-surface-700 font-heading p-small:px-[0.625rem]
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]`,
	header: `pt-2 pb-1 px-4`,
	listContainer: `overflow-auto`,
	list: `m-0 p-1 list-none gap-[.125rem] flex flex-col`,
	optionGroup: `m-0 px-3 py-2 bg-transparent text-surface-500 font-bold`,
	option: `cursor-pointer font-normal whitespace-nowrap relative overflow-hidden flex items-center
        px-3 py-2 border-none text-primary bg-transparent rounded-sm
        p-focus:bg-surface-100 p-focus:text-surface-800
        transition-colors duration-200`,
	emptyMessage: `px-3 py-2`,
	transition: {
		enterFromClass: 'opacity-0 scale-y-75',
		enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
		leaveActiveClass: 'transition-opacity duration-100 ease-linear',
		leaveToClass: 'opacity-0',
	},
}
