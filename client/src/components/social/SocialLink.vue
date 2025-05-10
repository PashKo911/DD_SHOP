<template>
	<a
		:href="link"
		target="_blank"
		:aria-label="ariaLabel"
		class="bg-primary group focus-visible:outline-primary grid aspect-square w-[3.125rem] shrink-0 place-items-center rounded-full border border-white fill-white outline outline-transparent drop-shadow-lg transition"
	>
		<span class="duration-300 will-change-transform group-hover:scale-125">
			<slot>
				<facebook-icon />
			</slot>
		</span>
	</a>
</template>

<script setup>
import FacebookIcon from '../icons/FacebookIcon.vue'

defineProps({
	link: {
		type: String,
		required: true,
	},
	ariaLabel: {
		type: String,
		default: 'Social Link',
	},
})
</script>
