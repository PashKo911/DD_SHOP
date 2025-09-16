<template>
	<div class="flex items-center">
		<router-link
			v-if="!isAuthenticated"
			to="/auth"
			:aria-label="t('accessibility.signin')"
			:class="{ 'fill-t-inverse-hover': isAuthSection }"
			class="focus-visible:outline-t-inverse-hover rounded-sm outline outline-transparent transition-colors duration-300"
		>
			<sign-in-icon
				width="2.25rem"
				:class="{ 'fill-t-inverse-hover': isAuthSection }"
				class="fill-inverse hover:fill-t-inverse-hover duration-300"
			/>
		</router-link>
		<user-control-user-menu v-else :user-data="user" @signout="signout" />
	</div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import UserControlUserMenu from './UserControlUserMenu.vue'
import SignInIcon from '@/components/icons/SignInIcon.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()

const { isAuthenticated, user } = storeToRefs(authStore)
const { signout } = authStore

const isAuthSection = computed(() => route.path.startsWith('/auth'))
</script>
