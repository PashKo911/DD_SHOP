<template>
	<nav
		id="appNav"
		class="menu-open:max-md:translate-x-0 bg-primary-800 grid min-w-[230px] grid-cols-2 items-center justify-items-center gap-y-10 duration-200 ease-in max-md:fixed max-md:-top-0 max-md:left-0 max-md:h-screen max-md:w-full max-md:-translate-x-full max-md:overflow-auto max-md:px-4 max-md:pt-[9.375rem] max-md:pb-8 max-md:transition-all max-md:duration-300"
	>
		<ul
			class="col-span-full flex flex-wrap items-center gap-x-8 gap-y-5 max-md:flex-col md:gap-y-1"
		>
			<li v-for="r in visibleMenuItems" :key="r.path">
				<router-link
					class="hover:text-t-hover text-inverse font-league text-3xl capitalize transition-colors duration-300 md:text-2xl"
					active-class="text-t-hover! "
					:to="{ name: r.name }"
				>
					{{ $t(r.meta?.localeName) }}
				</router-link>
			</li>
		</ul>
	</nav>
</template>

<script setup>
defineProps({
	visibleMenuItems: {
		type: Array,
		default: () => [],
	},
})
</script>
