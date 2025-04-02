<template>
	<button
		type="button"
		aria-label=" open / close menu"
		class="relative h-11 w-11 md:hidden"
	>
		<span
			class="bg-inverse menu-open:rotate-45 menu-open:translate-y-[.625rem] absolute top-2.5 right-[0.44rem] h-1 w-[1.875rem] rounded transition-transform duration-200"
		></span>
		<span
			class="bg-inverse menu-open:opacity-0 absolute right-[0.44rem] h-1 w-[1.875rem] translate-y-[-.125rem] rounded-[0.1875rem] transition-all duration-200"
		></span>
		<span
			class="bg-inverse menu-open:-rotate-45 menu-open:-translate-y-[.625rem] absolute right-[0.44rem] bottom-2.5 h-1 w-[1.875rem] rounded transition-transform duration-200"
		></span>
	</button>
</template>

<script setup></script>
