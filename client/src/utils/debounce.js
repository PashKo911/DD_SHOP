export default function debounce(fn, delay = 500) {
	let timeout

	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => fn.apply(this, args), delay)
	}
}
