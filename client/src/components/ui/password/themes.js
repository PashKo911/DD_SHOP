export const DEFAULT_PASSWORD_THEME = {
	root: `inline-flex relative p-fluid:flex`,
	pcInputText: {
		root: `appearance-none rounded-md outline-hidden
      bg-black p-filled:bg-surface-50 text-creamy-cloud font-heading leading-tight
      placeholder:text-creamy-cloud focus:placeholder:opacity-0 placeholder:transition-opacity
      placeholder:duration-300 border-2 border-primary
      enabled:hover:border-t-inverse-hover enabled:focus:border-t-inverse-hover
      disabled:bg-surface-200 disabled:text-surface-500
      p-invalid:border-red-400 p-invalid:placeholder:text-red-600
      px-3 py-2 p-fluid:w-full p-has-e-icon:pe-10
      p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
      p-large:text-24-18 p-large:px-[0.875rem] p-large:py-[.6875rem]
      sm:p-large:py-5 p-large:rounded-lg
      transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
	},
	overlay: `p-3 rounded-md p-portal-self:min-w-full
    bg-black border border-surface-200 text-creamy-cloud
    shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]`,
	content: `flex flex-col gap-2`,
	meter: `h-3 bg-surface-200 rounded-md`,
	meterLabel: `h-full w-0 transition-[width] duration-1000 ease-in-out rounded-md
    p-weak:bg-red-500 p-medium:bg-amber-500 p-strong:bg-green-500`,
	meterText: `font-bold`,
	transition: {
		enterFromClass: 'opacity-0 scale-y-75',
		enterActiveClass: 'transition duration-120 ease-[cubic-bezier(0,0,0.2,1)]',
		leaveActiveClass: 'transition-opacity duration-100 ease-linear',
		leaveToClass: 'opacity-0',
	},
}

export const CONTRAST_PASSWORD_THEME = {
	root: DEFAULT_PASSWORD_THEME.root,
	pcInputText: {
		...DEFAULT_PASSWORD_THEME.pcInputText,
		root: DEFAULT_PASSWORD_THEME.pcInputText.root
			.replace('bg-black', 'bg-inverse')
			.replace('text-creamy-cloud', 'text-primary')
			.replace('placeholder:text-creamy-cloud', 'placeholder:text-surface-300'),
	},
	overlay: DEFAULT_PASSWORD_THEME.overlay
		.replace('bg-black', 'bg-creamy-cloud')
		.replace('text-creamy-cloud', 'text-surface-700'),
	content: DEFAULT_PASSWORD_THEME.content,
	meter: DEFAULT_PASSWORD_THEME.meter,
	meterLabel: DEFAULT_PASSWORD_THEME.meterLabel,
	meterText: DEFAULT_PASSWORD_THEME.meterText,
	transition: DEFAULT_PASSWORD_THEME.transition,
}
