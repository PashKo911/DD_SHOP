/**
 * Debounce a function: delays calling `fn` until `delay` ms have passed
 * since the last invocation.
 *
 * @param {Function} fn      - Function to debounce.
 * @param {number}   delay   - Milliseconds to wait (default 500).
 * @returns {Function} Debounced function.
 *
 * Usage (short & general):
 * // create debounced wrapper
 * const debounced = debounce((payload) => doWork(payload), 250)
 *
 * // only the last call within 250ms will execute `doWork`
 * debounced('first')
 * debounced('second')
 * // after 250ms => doWork('second')
 */
export default function debounce(fn, delay = 500) {
	let timeout
	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => fn.apply(this, args), delay)
	}
}
