<template>
  <div class="app-container">
    <Administrator v-model:administrator="administrator" type="edit" @handleSubmit="onSubmit"/>
  </div>
</template>

<script lang="ts" setup>
import Administrator from './components/Administrator.vue'
import {onMounted, ref} from "vue";
import {IAdministrator} from "@/views/system/administrator/components/data";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {getAdministrator, updateAdministrator} from "@/api/administrator";
defineOptions({
  name: "AdministratorEdit"
})
const administrator = ref<IAdministrator>({
  id: 0,
  name: '',
  account: '',
  password: '',
  password_confirmation: '',
  status: true
})

const route = useRoute();
const id = +route.params.id;

const fetchDetail = async () => {
  const {data} = await getAdministrator(id)
  administrator.value = data
}

onMounted(() => {
  fetchDetail()
})

const router = useRouter()
const onSubmit = () => {
  updateAdministrator(id, administrator.value).then(() => {
    ElMessage.success("更新成功")
    router.push("/system/administrators")
  })
}
</script>

<style scoped>

</style>
