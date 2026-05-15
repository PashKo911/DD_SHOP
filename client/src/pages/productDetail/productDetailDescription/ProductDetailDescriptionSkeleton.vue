<template>
	<div class="grid gap-4 lg:pt-5">
		<skeleton width="50%" height="60px" class="rounded-md" />
		<skeleton width="7.75rem" height="1.5rem" class="rounded-md" />
		<skeleton width="12.5rem" height="h-[2.375rem]" class="rounded-md" />
		<div class="grid gap-9">
			<skeleton width="100%" height="1.5rem" class="rounded-md" />
			<skeleton width="100%" height="100px" class="rounded-md" />
			<skeleton width="100%" height="100px" class="rounded-md" />
			<skeleton width="100%" height="100px" class="rounded-md" />
		</div>
	</div>
</template>

<script setup>
import Skeleton from '@/components/skeleton/Skeleton.vue'
</script>
