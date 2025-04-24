<template>
	<nav
		id="appNav"
		class="menu-open:max-md:translate-x-0 bg-primary grid min-w-[14.375rem] grid-cols-2 items-center justify-items-center gap-y-10 duration-200 ease-in max-md:fixed max-md:-top-0 max-md:left-0 max-md:h-screen max-md:w-full max-md:-translate-x-full max-md:overflow-auto max-md:px-4 max-md:pt-[9.375rem] max-md:pb-8 max-md:transition-all max-md:duration-300"
	>
		<ul
			class="gx-lg-32-16 col-span-full flex flex-wrap items-center gap-y-5 max-md:flex-col md:gap-y-1"
		>
			<li v-for="r in visibleMenuItems" :key="r.path">
				<router-link
					class="hover:text-t-inverse-hover text-inverse font-heading focus-visible:outline-t-inverse-hover rounded-sm text-3xl capitalize outline outline-transparent transition-colors duration-300 md:text-2xl"
					active-class="text-t-inverse-hover!"
					:to="{ name: r.name }"
					v-if="r.meta.useInMenu"
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
