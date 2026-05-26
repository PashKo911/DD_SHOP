<template>
	<section class="my-100-30 container grid gap-6 md:gap-8">
		<div
			class="border-border-color overflow-hidden rounded-[1.5rem] border bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:p-6"
		>
			<div
				class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
			>
				<div class="flex items-center gap-4">
					<img
						v-if="user?.avatar"
						:src="user.avatar"
						:alt="user.name"
						class="h-16 w-16 rounded-2xl object-cover"
					/>

					<div
						v-else
						class="bg-primary text-creamy-cloud grid h-16 w-16 place-items-center rounded-2xl text-2xl font-semibold"
					>
						{{ initials }}
					</div>

					<div class="grid gap-2">
						<div>
							<h1 class="font-heading text-32-26 leading-tight font-semibold">
								{{ user?.name }}
							</h1>

							<p class="text-dark-grey text-sm md:text-base">
								{{ user?.email }}
							</p>
						</div>
					</div>
				</div>

				<div
					class="bg-creamy-cloud grid gap-4 rounded-2xl p-4 sm:grid-cols-2 md:min-w-[18rem]"
				>
					<div>
						<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
							Cart items
						</p>

						<p class="text-primary mt-1 text-lg font-semibold">
							{{ cartItemsCount }}
						</p>
					</div>

					<div>
						<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
							Account type
						</p>

						<p class="text-primary mt-1 text-lg font-semibold">
							{{ user?.googleId ? 'Google' : 'Standard' }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid gap-4 md:grid-cols-3">
			<article
				v-for="item in infoCards"
				:key="item.key"
				class="border-border-color rounded-2xl border bg-white p-5 shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
			>
				<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
					{{ item.label }}
				</p>

				<p
					class="text-primary font-heading mt-3 text-xl leading-tight font-semibold break-words"
					:class="{
						capitalize: item.key !== 'email',
					}"
				>
					{{ item.value }}
				</p>

				<p class="text-dark-grey mt-2 text-sm leading-relaxed">
					{{ item.note }}
				</p>
			</article>
		</div>

		<div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
			<div
				class="border-border-color rounded-[1.5rem] border bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
			>
				<div
					class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
				>
					<div>
						<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
							{{ t('pages.account.overview.title') }}
						</p>

						<h2
							class="font-heading text-32-26 mt-2 leading-tight font-semibold"
						>
							{{ t('pages.account.overview.subtitle') }}
						</h2>
					</div>

					<span
						class="bg-creamy-cloud text-primary w-max rounded-full px-3 py-1 text-sm font-medium"
					>
						{{ t('pages.account.overview.badge') }}
					</span>
				</div>

				<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div
						v-for="stat in accountStats"
						:key="stat.label"
						class="bg-creamy-cloud rounded-2xl p-4"
					>
						<p class="text-dark-grey text-xs tracking-[0.14em] uppercase">
							{{ stat.label }}
						</p>

						<p class="text-primary font-heading mt-3 text-3xl font-semibold">
							{{ stat.value }}
						</p>

						<p class="text-dark-grey mt-2 text-sm">
							{{ stat.caption }}
						</p>
					</div>
				</div>
			</div>

			<div
				class="border-border-color rounded-[1.5rem] border bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
			>
				<p class="text-dark-grey text-xs tracking-[0.18em] uppercase">
					{{ t('pages.account.timeline.title') }}
				</p>

				<h2 class="font-heading text-32-26 mt-2 leading-tight font-semibold">
					{{ t('pages.account.timeline.subtitle') }}
				</h2>

				<div class="mt-6 grid gap-4">
					<div v-for="event in timeline" :key="event.title" class="flex gap-4">
						<div class="flex flex-col items-center">
							<span
								class="bg-primary mt-1 h-3 w-3 shrink-0 rounded-full"
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

							<p
								class="text-dark-grey mt-2 text-xs tracking-[0.14em] uppercase"
							>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const { t, locale, d } = useI18n()

const authStore = useAuthStore()
const cartStore = useCartStore()

const { user } = storeToRefs(authStore)
const { cartItemsCount } = storeToRefs(cartStore)

const initials = computed(() => {
	if (!user.value?.name) return '?'

	return user.value.name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.slice(0, 2)
		.toUpperCase()
})

const infoCards = computed(() => [
	{
		label: t('pages.account.infoCards.email.label'),
		value: user.value?.email || '—',
		note: t('pages.account.infoCards.email.note'),
		key: 'email',
	},
	{
		label: t('pages.account.infoCards.authentication.label'),
		value: user.value?.googleId
			? t('pages.account.infoCards.authentication.google')
			: t('pages.account.infoCards.authentication.credentials'),
		note: t('pages.account.infoCards.authentication.note'),
		key: 'label',
	},
	{
		label: t('pages.account.infoCards.role.label'),
		value: user.value?.type?.name || t('pages.account.customer'),
		note: t('pages.account.infoCards.role.note'),
		key: 'role',
	},
])

const accountStats = computed(() => [
	{
		label: t('pages.account.stats.cartItems.label'),
		value: cartItemsCount.value,
		caption: t('pages.account.stats.cartItems.caption'),
	},
	{
		label: t('pages.account.stats.favorites.label'),
		value: '0',
		caption: t('pages.account.stats.favorites.caption'),
	},
	{
		label: t('pages.account.stats.reviews.label'),
		value: '0',
		caption: t('pages.account.stats.reviews.caption'),
	},
	{
		label: t('pages.account.stats.orders.label'),
		value: '0',
		caption: t('pages.account.stats.orders.caption'),
	},
])

const timeline = computed(() => [
	{
		title: t('pages.account.timeline.created.title'),
		description: t('pages.account.timeline.created.description'),
		date:
			user.value?.updatedAt || user.value?.createdAt
				? d(new Date(user.value.updatedAt || user.value.createdAt), 'short')
				: t('pages.account.timeline.recently'),
	},
	{
		title: t('pages.account.timeline.authentication.title'),
		description: user.value?.googleId
			? t('pages.account.timeline.authentication.google')
			: t('pages.account.timeline.authentication.credentials'),
		date:
			user.value?.updatedAt || user.value?.createdAt
				? d(new Date(user.value.updatedAt || user.value.createdAt), 'short')
				: t('pages.account.timeline.recently'),
	},
	{
		title: t('pages.account.timeline.session.title'),
		description: t('pages.account.timeline.session.description'),
		date: t('pages.account.timeline.session.date'),
	},
])
</script>
