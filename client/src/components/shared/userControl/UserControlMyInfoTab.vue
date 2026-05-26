<template>
	<section class="grid gap-6 md:gap-8">
		<div
			class="from-primary via-primary to-[#3a3939] overflow-hidden rounded-[1.75rem] bg-linear-to-br p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)] md:p-8"
		>
			<div
				class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
			>
				<div class="flex items-center gap-4 md:gap-5">
					<div
						class="grid aspect-square h-20 w-20 shrink-0 place-items-center rounded-3xl border border-white/15 bg-white/10 text-3xl font-semibold backdrop-blur-sm md:h-24 md:w-24 md:text-4xl"
					>
						ES
					</div>
					<div class="grid gap-2">
						<span
							class="w-max rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.18em] uppercase"
						>
							Premium member
						</span>
						<div>
							<h2 class="font-heading text-32-26 leading-tight font-semibold">
								Emma Stone
							</h2>
							<p class="text-sm text-white/75 md:text-base">
								emma.stone@example.com
							</p>
						</div>
					</div>
				</div>

				<div
					class="grid gap-3 rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur-sm sm:grid-cols-2 md:min-w-[18rem]"
				>
					<div>
						<p class="text-xs tracking-[0.18em] uppercase text-white/60">
							Loyalty tier
						</p>
						<p class="mt-1 text-lg font-semibold">Gold</p>
					</div>
					<div>
						<p class="text-xs tracking-[0.18em] uppercase text-white/60">
							Reward points
						</p>
						<p class="mt-1 text-lg font-semibold">2,450 pts</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-3">
			<article
				v-for="item in infoCards"
				:key="item.label"
				class="border-border-color rounded-[1.5rem] border bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
			>
				<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
					{{ item.label }}
				</p>
				<p class="text-primary mt-3 font-heading text-xl leading-tight font-semibold">
					{{ item.value }}
				</p>
				<p class="text-dark-grey mt-2 text-sm leading-relaxed">
					{{ item.note }}
				</p>
			</article>
		</div>

		<div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
			<div
				class="border-border-color rounded-[1.75rem] border bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
			>
				<div
					class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
				>
					<div>
						<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
							Account overview
						</p>
						<h3 class="font-heading text-32-26 mt-2 leading-tight font-semibold">
							Shopping activity
						</h3>
					</div>
					<span
						class="bg-select-hover text-primary w-max rounded-full px-3 py-1 text-sm font-medium"
					>
						Static preview
					</span>
				</div>

				<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div
						v-for="stat in accountStats"
						:key="stat.label"
						class="bg-creamy-cloud rounded-[1.25rem] p-4"
					>
						<p class="text-dark-grey text-xs tracking-[0.14em] uppercase">
							{{ stat.label }}
						</p>
						<p class="text-primary mt-3 font-heading text-3xl font-semibold">
							{{ stat.value }}
						</p>
						<p class="text-dark-grey mt-2 text-sm">
							{{ stat.caption }}
						</p>
					</div>
				</div>
			</div>

			<div
				class="border-border-color rounded-[1.75rem] border bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
			>
				<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
					Recent activity
				</p>
				<h3 class="font-heading text-32-26 mt-2 leading-tight font-semibold">
					Account timeline
				</h3>

				<div class="mt-6 grid gap-4">
					<div
						v-for="event in timeline"
						:key="event.title"
						class="flex gap-4"
					>
						<div class="flex flex-col items-center">
							<span
								class="bg-primary mt-1 h-3 w-3 rounded-full"
							></span>
							<span
								v-if="event !== timeline[timeline.length - 1]"
								class="bg-border-color mt-2 h-full w-px"
							></span>
						</div>
						<div class="pb-4">
							<p class="text-primary font-heading text-lg font-semibold">
								{{ event.title }}
							</p>
							<p class="text-dark-grey mt-1 text-sm leading-relaxed">
								{{ event.description }}
							</p>
							<p class="text-dark-grey mt-2 text-xs tracking-[0.14em] uppercase">
								{{ event.date }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
const infoCards = [
	{
		label: 'Phone',
		value: '+1 (202) 555-0148',
		note: 'Primary contact number for order updates and delivery notices.',
	},
	{
		label: 'Shipping address',
		value: '241 Mercer St, New York',
		note: 'Default destination used for fast checkout and saved deliveries.',
	},
	{
		label: 'Member since',
		value: 'March 2023',
		note: 'Active customer with personalized picks and member-only offers.',
	},
]

const accountStats = [
	{
		label: 'Orders',
		value: '18',
		caption: 'Completed purchases',
	},
	{
		label: 'Wishlist',
		value: '12',
		caption: 'Saved favorite items',
	},
	{
		label: 'Reviews',
		value: '6',
		caption: 'Shared product ratings',
	},
	{
		label: 'Returns',
		value: '2',
		caption: 'Processed requests',
	},
]

const timeline = [
	{
		title: 'Latest order delivered',
		description:
			'Your spring essentials order arrived successfully and was marked as completed.',
		date: '12 Apr 2026',
	},
	{
		title: 'Wishlist updated',
		description:
			'Three new items were saved for later, including a matching linen set.',
		date: '08 Apr 2026',
	},
	{
		title: 'Profile verified',
		description:
			'Contact information was confirmed to make future checkout steps faster.',
		date: '21 Mar 2026',
	},
]
</script>
