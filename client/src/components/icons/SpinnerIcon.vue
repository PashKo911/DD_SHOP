<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 64 64"
		aria-hidden="true"
	>
		<g>
			<circle
				cx="32"
				cy="32"
				r="28"
				fill="none"
				stroke="inherit"
				stroke-width="6"
				stroke-linecap="round"
				stroke-dasharray="20 156"
			>
				<animate
					attributeName="stroke-dasharray"
					dur="1.4s"
					values="20 156;120 56;20 156"
					keyTimes="0;0.5;1"
					repeatCount="indefinite"
				/>
				<animate
					attributeName="stroke-dashoffset"
					dur="1.4s"
					values="0;-176"
					repeatCount="indefinite"
				/>
			</circle>

			<animateTransform
				attributeName="transform"
				attributeType="XML"
				type="rotate"
				from="0 32 32"
				to="360 32 32"
				dur="1.5s"
				repeatCount="indefinite"
			/>
		</g>
	</svg>
</template>
