<template>
	<data-table :value="usersValue" :loading="isUsersLoading">
		<template v-if="!isUsersLoading && usersValue.length !== 0" #empty>
			<empty-list />
		</template>
		<Column
			field="avatar"
			:header="t('pages.dashboard.users.tableTitles.image')"
		>
			<template #body="slotProps">
				<img :src="slotProps.data.avatar" alt="avatar" width="64" />
			</template>
		</Column>
		<Column
			field="name"
			:header="t('pages.dashboard.users.tableTitles.name')"
		></Column>
		<Column
			field="email"
			:header="t('pages.dashboard.users.tableTitles.email')"
		></Column>
		<Column :header="t('pages.dashboard.users.tableTitles.type')">
			<template #body="slotProps">
				<Select
					size="small"
					:loading="
						isUserTypesLoading ||
						isSetUserTypeLoading(slotProps?.data?._id).value
					"
					option-label="name"
					option-value="_id"
					checkmark
					fluid
					:options="userTypesValue"
					:default-value="slotProps?.data?.type?._id"
					@change="onUserTypeChange(slotProps.data, $event)"
				/>
			</template>
		</Column>
		<Column :header="t('pages.dashboard.users.tableTitles.actions')">
			<template #body="slotProps">
				<Button
					severity="info"
					:aria-label="t('accessibility.buttons.deleteUser')"
					variant="text"
					rounded
					:loading="isDeleteUserLoading(slotProps?.data?._id).value"
					@click="onDeleteUser(slotProps?.data?._id)"
					class="min-w-8 py-1.5!"
				>
					<template #icon>
						<delete-icon
							class="size-[1em] transition-transform duration-300 group-hover:scale-110"
						/>
					</template>
				</Button>
			</template>
		</Column>
	</data-table>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useUsersStore } from '@/stores/users'
import { useI18n } from 'vue-i18n'

import Column from 'primevue/column'
import DataTable from '@/components/dataTable/DataTable.vue'
import EmptyList from '@/components/dataTable/EmptyList.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/buttons/Button.vue'
import DeleteIcon from '@/components/icons/DeleteIcon.vue'

const usersStore = useUsersStore()
const { t } = useI18n()
const { usersValue, isUsersLoading, isUserTypesLoading, userTypesValue } =
	storeToRefs(usersStore)

const {
	fetchUsers,
	setUserType,
	updateUserInState,
	isSetUserTypeLoading,
	isDeleteUserLoading,
	getUserTypes,
	deleteUser,
} = usersStore

//========================================================================================================================================================
const onUserTypeChange = async (user, { value }) => {
	const updatedUser = await setUserType({ _id: user._id, typeId: value })
	updateUserInState(updatedUser)
}

const onDeleteUser = async (id) => {
	await deleteUser(id)
	fetchUsers()
}

//========================================================================================================================================================

onMounted(() => {
	if (!userTypesValue.value.length) {
		getUserTypes()
	}
	if (!usersValue.value.length) {
		fetchUsers()
	}
})
</script>
