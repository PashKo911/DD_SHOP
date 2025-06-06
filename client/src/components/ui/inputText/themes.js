export const DEFAULT_THEME = {
	root: `appearance-none rounded-md outline-hidden
	  bg-black
	  p-filled:bg-surface-50
	  text-creamy-cloud
	  font-heading leading-tight
	  placeholder:text-creamy-cloud focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300
	  border-2 border-primary
	  enabled:hover:border-t-inverse-hover 
	  enabled:focus:border-t-inverse-hover
	  disabled:bg-surface-200 disabled:text-surface-500
	  p-invalid:border-red-400
	  p-invalid:placeholder:text-red-600
	  px-3 py-2 p-fluid:w-full
	  p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
	  p-large:px-[0.875rem] p-large:py-5 p-large:rounded-lg p-large:text-24-18
	  transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
}

export const CONTRAST_THEME = {
	root: `appearance-none rounded-md outline-hidden
	  bg-inverse
	  p-filled:bg-surface-50
	  text-primary
	  font-heading leading-tight
	  placeholder:text-surface-300 focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300
	  border-2 border-primary
	  enabled:hover:border-t-inverse-hover
	  enabled:focus:border-t-inverse-hover
	  disabled:bg-surface-200 disabled:text-surface-500
	  p-invalid:border-red-400
	  p-invalid:placeholder:text-red-600
	  px-3 py-2 p-fluid:w-full
	  p-small:text-sm p-small:px-[0.625rem] p-small:py-[0.375rem]
	  p-large:text-lg p-large:px-[0.875rem] py-5 p-large:rounded-lg p-large:text-24-18
	  transition-colors duration-200 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
}

export const ICON_FIELD_THEME = {
	root: `appearance-none rounded-[1.0625rem] outline-hidden
	  bg-inverse
	  text-primary text-xl font-bold
	  font-heading
	  border-2 border-primary rounded-2xl
	  placeholder:text-surface-300 text-xl  focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300
	  enabled:hover:border-t-inverse-hover
	  enabled:focus:border-t-inverse-hover
	  p-invalid:border-red-400 
	  p-invalid:placeholder:text-red-600 
	  px-3 ps-12 py-3 md:py-[1.0625rem] p-fluid:w-full
	  p-small:py-[.4375rem]
	  p-large:text-lg p-large:px-[0.875rem] p-large:py-[0.625rem]
	  p-filled:bg-surface-50 
	  disabled:bg-surface-200 disabled:text-surface-500
	  transition-colors duration-300 shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]`,
}
