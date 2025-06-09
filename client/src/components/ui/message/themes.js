export const DEFAULT_MESSAGE_THEME = {
	root: `rounded-md outline outline-1
        p-outlined:bg-transparent p-outlined:outline p-outlined:outline-1
        p-simple:bg-transparent p-simple:outline-none
        p-info:bg-blue-50/95 p-info:outline-blue-200 p-info:text-blue-600
        p-info:p-outlined:text-blue-500 p-info:p-outlined:outline-blue-500
        p-info:p-simple:text-blue-500
        p-success:bg-green-50/95 p-success:outline-green-200 p-success:text-green-600
        p-success:p-outlined:text-green-500 p-success:p-outlined:outline-green-500
        p-success:p-simple:text-green-500
        p-warn:bg-yellow-50/95 p-warn:outline-yellow-200 p-warn:text-yellow-600
        p-warn:p-outlined:text-yellow-500 p-warn:p-outlined:outline-yellow-500
        p-warn:p-simple:text-yellow-500
        p-error:bg-red-50/95 p-error:outline-red-200 p-error:text-red-600
        p-error:p-outlined:text-red-500 p-error:p-outlined:outline-red-500
        p-error:p-simple:text-red-500
        p-secondary:bg-surface-100 p-secondary:outline-surface-200 p-secondary:text-surface-600
        p-secondary:p-outlined:text-surface-500 p-secondary:p-outlined:outline-surface-500
        p-secondary:p-simple:text-surface-500
        p-contrast:bg-surface-900 p-contrast:outline-surface-950 p-contrast:text-surface-50
        p-contrast:p-outlined:text-surface-950 p-contrast:p-outlined:outline-surface-950
        p-contrast:p-simple:text-surface-950`,
	content: `flex items-center
        p-simple:p-0
        px-3 py-2 gap-2 h-full
        p-small:px-2.5 p-small:py-[0.375rem]
        p-large:px-3.5 p-large:py-2.5`,
	icon: `flex-shrink-0 text-lg w-[1.125rem] h-[1.125rem]
        p-small:w-[0.875rem] p-small:h-[0.875rem] p-small:text-sm
        p-large:w-5 p-large:h-5 p-large:text-xl`,
	text: `text-base font-medium p-small:text-sm p-large:text-xl`,
	closeButton: `flex items-center justify-center flex-shrink-0 ms-auto overflow-hidden relative cursor-pointer select-none
        w-7 h-7 rounded-full bg-transparent transition-colors duration-200 text-inherit p-0 border-none
        focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2
        p-info:hover:bg-blue-100 p-info:focus-visible:outline-blue-600
        p-success:hover:bg-green-100 p-success:focus-visible:outline-green-600
        p:warn:hover:bg-yellow-100 p:warn:focus-visible:outline-yellow-600
        p-error:hover:bg-red-100 p-error:focus-visible:outline-red-600
        p-secondary:hover:bg-surface-200 p-secondary:focus-visible:outline-surface-600
        p-contrast:hover:bg-surface-800 p-contrast:focus-visible:outline-surface-50
        p-outlined:hover:bg-transparent p-simple:hover:bg-transparent`,
	closeIcon: `w-4 h-4 text-base
        p-small:w-3.5 p-small:h-3.5 p-small:text-sm 
        p-large:w-[1.125rem] p-large:h-[1.125rem] p-large:text-xl`,
	transition: {
		enterFromClass: 'opacity-0',
		enterActiveClass: 'transition-opacity duration-300',
		leaveFromClass: 'max-h-40',
		leaveActiveClass: 'overflow-hidden transition-all duration-300 ease-in',
		leaveToClass: 'max-h-0 opacity-0 !m-0',
	},
}
