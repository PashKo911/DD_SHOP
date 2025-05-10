export const DEFAULT_BUTTON_THEME = {
	root: `inline-flex cursor-pointer select-none items-center justify-center capitalize
    overflow-hidden relative px-3 py-3 gap-2 rounded-md
    disabled:pointer-events-none disabled:opacity-60
    transition-colors duration-200 bg-primary
    enabled:hover:bg-primary-emphasis enabled:active:bg-primary-emphasis-alt
    text-primary text-24-18 font-bold font-heading border border-primary
    enabled:hover:border-primary-emphasis enabled:active:border-primary-emphasis-alt
    focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-primary
    p-vertical:flex-col p-fluid:w-full p-icon-only:w-10
    p-icon-only:px-0 p-icon-only:gap-0 p-icon-only:rounded-full
    p-small:text-sm p-small:px-3 p-small:py-2
    p-large:px-[0.875rem] sm:p-large:py-4.5 p-large:rounded-lg p-large:uppercase
    p-raised:shadow-sm p-rounded:rounded-[2rem]
    p-outlined:bg-transparent enabled:hover:p-outlined:bg-primary-50
    enabled:active:p-outlined:bg-primary-100
    p-outlined:border-primary-200 enabled:hover:p-outlined:border-primary-200
    p-outlined:text-primary enabled:hover:p-outlined:text-primary
    p-text:bg-transparent enabled:hover:p-text:text-red-400 p-text:before:hidden p-text:border-none 
    before:rounded-[.4375rem] group before:bg-creamy-cloud
    before:absolute before:inset-[.1875rem] before:scale-0
    p-large:before:rounded-[.75rem] before:opacity-0 before:transition-transform
    before:duration-300 hover:before:scale-100 hover:before:opacity-100`,
	loadingIcon: ``,
	icon: `p-right:order-1 p-bottom:order-2`,
	label: `font-bold p-icon-only:invisible p-icon-only:w-0
			text-24-18
    group-hover:text-primary text-creamy-cloud relative transition-colors`,
	pcBadge: {
		root: `min-w-4 h-4 leading-4 bg-primary-contrast rounded-full text-primary text-xs font-bold`,
	},
}

export const CONTRAST_BUTTON_THEME = {
	root: `inline-flex cursor-pointer select-none items-center justify-center group capitalize
    overflow-hidden relative px-3 py-5 md:py-[1.125rem] gap-2.5 rounded-2xl
    disabled:pointer-events-none disabled:opacity-60
    transition-colors duration-200 bg-inverse enabled:active:bg-b-active
    border border-transparent font-bold font-heading text-xl
    focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2
    focus-visible:outline-t-inverse-hover
	enabled:hover:text-creamy-cloud
    p-vertical:flex-col p-fluid:w-full p-icon-only:w-10
    p-icon-only:px-0 p-icon-only:gap-0 p-icon-only:rounded-full
    p-small:text-md p-small:px-3 py-[.9063rem] md:p-small:py-[1.2188rem]
    p-large:px-[0.875rem] sm:p-large:py-[1.1563rem] p-large:rounded-lg p-large:uppercase
    p-raised:shadow-sm p-rounded:rounded-[2rem]
    p-outlined:bg-transparent enabled:hover:p-outlined:bg-surface-50
    enabled:active:p-outlined:bg-surface-100
    p-outlined:border-surface-700 enabled:hover:p-outlined:border-surface-700
    p-text:bg-transparent p-text:px-0 p-text:py-0 enabled:active:p-text:bg-transparent enabled:hover:p-text:text-t-hover enabled:hover:p-text:decoration-t-hover underline decoration-transparent p-text:before:hidden p-text:border-none p-text:p-small:font-medium p-text:focus-visible:outline-primary p-text:overflow-visible
    before:rounded-[1.375rem] before:bg-black
    before:absolute before:inset-[.1875rem] before:scale-0
    p-large:before:rounded-[.75rem] before:opacity-0 before:transition-transform
    before:duration-300 enabled:hover:before:scale-100 enabled:hover:before:opacity-100`,
	loadingIcon: ``,
	icon: `p-right:order-1 p-bottom:order-2`,
	label: `p-icon-only:invisible p-icon-only:w-0  relative leading-tight`,
	pcBadge: { root: `min-w-4 h-4 leading-4` },
}
