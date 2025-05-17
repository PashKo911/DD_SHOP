<template>
	<Paginator unstyled :pt="theme" :ptOptions="ptOptions">
		<template
			#container="{
				page,
				pageCount,
				pageLinks,
				changePageCallback,
				firstPageCallback,
				lastPageCallback,
				prevPageCallback,
				nextPageCallback,
			}"
		>
			<div class="flex flex-wrap items-center justify-center gap-2">
				<SecondaryButton text @click="firstPageCallback" :disabled="page === 0">
					<template #icon>
						<AngleDoubleLeftIcon />
					</template>
				</SecondaryButton>
				<SecondaryButton text @click="prevPageCallback" :disabled="page === 0">
					<template #icon>
						<AngleLeftIcon />
					</template>
				</SecondaryButton>
				<div class="hidden items-center justify-center gap-2 sm:flex">
					<SecondaryButton
						v-for="pageLink of pageLinks"
						:key="pageLink"
						:text="page + 1 !== pageLink"
						@click="() => changePageCallback(pageLink - 1)"
						:class="[
							'h-10 min-w-10 shrink-0',
							{
								[activeButtonClass]: page + 1 === pageLink,
							},
						]"
						>{{ pageLink }}
					</SecondaryButton>
				</div>
				<SecondaryButton
					text
					@click="nextPageCallback"
					:disabled="page === pageCount - 1"
				>
					<template #icon>
						<AngleRightIcon />
					</template>
				</SecondaryButton>
				<SecondaryButton
					text
					@click="lastPageCallback"
					:disabled="page === pageCount - 1"
				>
					<template #icon>
						<AngleDoubleRightIcon />
					</template>
				</SecondaryButton>
			</div>
		</template>
		<template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
			<slot :name="slotName" v-bind="slotProps ?? {}" />
		</template>
	</Paginator>
</template>

<script setup>
import { computed } from 'vue'
import { ptViewMerge } from '@/utils/volt'

import AngleDoubleLeftIcon from '@primevue/icons/angledoubleleft'
import AngleDoubleRightIcon from '@primevue/icons/angledoubleright'
import AngleLeftIcon from '@primevue/icons/angleleft'
import AngleRightIcon from '@primevue/icons/angleright'
import Paginator from 'primevue/paginator'
import SecondaryButton from '../ui/secondaryButton/SecondaryButton.vue'

const ptOptions = computed(() => ({ mergeProps: ptViewMerge }))

const activeButtonClass = 'bg-primary hover:bg-primary! text-white!'

const theme = {
	root: `flex items-center justify-center flex-wrap py-2 gap-1`,
}
</script>
