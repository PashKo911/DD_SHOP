<template>
	<Transition name="overlay">
		<div
			v-if="loading"
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
		>
			<div
				class="mx-4 w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900/90 p-8 shadow-2xl"
			>
				<div class="flex flex-col items-center text-center">
					<!-- Loader -->
					<div class="relative mb-6 flex h-20 w-20 items-center justify-center">
						<div
							class="absolute h-20 w-20 animate-spin rounded-full border-4 border-zinc-700 border-t-white"
						/>

						<div
							class="absolute h-14 w-14 rounded-full border border-zinc-600"
						/>

						<span class="text-sm font-semibold text-white">
							{{ secondsLeft }}s
						</span>
					</div>

					<!-- Title -->
					<h2 class="mb-3 text-2xl font-semibold tracking-tight text-white">
						Waking up the server...
					</h2>

					<!-- Description -->
					<p class="mb-6 leading-relaxed text-zinc-300">
						This project is hosted on a free Render instance. After inactivity,
						the server goes into sleep mode and may take up to 50 seconds to
						start again.
					</p>

					<!-- Progress -->
					<div class="mb-4 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
						<div
							class="h-full rounded-full bg-white transition-all duration-1000"
							:style="{ width: `${progress}%` }"
						/>
					</div>

					<!-- Footer text -->
					<p class="text-sm text-zinc-500">
						Thanks for waiting — the app should be available shortly.
					</p>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
	loading: {
		type: Boolean,
		default: false,
	},

	duration: {
		type: Number,
		default: 50,
	},
})

const secondsLeft = ref(props.duration)

let interval = null

const progress = computed(() => {
	const passed = props.duration - secondsLeft.value

	return (passed / props.duration) * 100
})

const startTimer = () => {
	stopTimer()

	secondsLeft.value = props.duration

	interval = setInterval(() => {
		if (secondsLeft.value > 0) {
			secondsLeft.value--
		}
	}, 1000)
}

const stopTimer = () => {
	if (interval) {
		clearInterval(interval)
		interval = null
	}
}

watch(
	() => props.loading,
	(isLoading) => {
		if (isLoading) {
			startTimer()
		} else {
			stopTimer()
		}
	},
	{ immediate: true },
)

onBeforeUnmount(() => {
	stopTimer()
})
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
	transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
	opacity: 0;
}
</style>
