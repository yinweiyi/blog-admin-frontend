<template>
  <div class="app-container">
    <el-card>
      <activity v-model:activity="activity" type="edit" @handleSubmit="onSubmit" @refresh="fetchDetail"/>
    </el-card>
  </div>

</template>


<script lang="ts" setup>
import Activity from '@/views/activity/activity/components/Activity.vue'
import {IActivity} from "@/views/activity/activity/components/data";
import {ref, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import { getActivity, updateActivity} from "@/api/activity";
import {ElMessage} from "element-plus";

defineOptions({
  name: "ActivityEdit"
})

let activity = ref<IActivity>({
  activityKey: '',
  activityName: '',
  exchangeLimitDay: 10,
  id: 0,
  limitType: 1,
  limitValue: 1,
  prizes: [],
  status: 1,
  statusText: '',
  winningCount: 0,
  startTime: '',
  endTime: '',
})

const route = useRoute();
const activityId = +route.params.id;

const fetchDetail = async () => {
  const {data} = await getActivity(activityId)
  activity.value = data
}

onMounted(() => {
  fetchDetail()
})

const router = useRouter();

const onSubmit = () => {
  updateActivity(activityId, activity.value).then(() => {
    ElMessage.success("修改成功")
    router.push("/activity/activities")
  })
}

</script>

<style scoped>

</style>
