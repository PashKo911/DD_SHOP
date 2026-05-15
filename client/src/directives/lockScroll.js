function getScrollbarWidth() {
	return window.innerWidth - document.documentElement.clientWidth
}

function lockScroll() {
	const w = getScrollbarWidth()
	document.body.classList.add('p-overflow-hidden')
	document.body.style.setProperty('--p-scrollbar-width', `${w}px`)
}

function unlockScroll() {
	document.body.classList.remove('p-overflow-hidden')
	document.body.style.removeProperty('--p-scrollbar-width')
}

export default {
	mounted(el, binding) {
		if (binding.value) {
			lockScroll()
		}
	},
	updated(el, binding) {
		if (binding.value && !binding.oldValue) {
			lockScroll()
		} else if (!binding.value && binding.oldValue) {
			unlockScroll()
		}
	},
	unmounted() {
		unlockScroll()
	},
}
