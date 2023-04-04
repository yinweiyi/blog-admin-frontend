<template>
  <div class="app-container">
    <Administrator v-model:administrator="administrator" type="add" @handleSubmit="onSubmit"/>
  </div>
</template>

<script lang="ts" setup>
import Administrator from './components/Administrator.vue'
import {ref} from "vue";
import {IAdministrator} from "@/views/system/administrator/components/data";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {storeAdministrator} from "@/api/administrator";
defineOptions({
  name: "AdministratorAdd"
})
const administrator = ref<IAdministrator>({
  id: 0,
  name: '',
  account: '',
  password: '',
  password_confirmation: '',
  status: true
})

const router = useRouter()
const onSubmit = () => {
  storeAdministrator(administrator.value).then(() => {
    ElMessage.success("添加成功")
    router.push("/system/administrators")
  })
}
</script>

<style scoped>

</style>
