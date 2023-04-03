<template>
  <div class="app-container">
    <el-card>
      <activity v-model:activity="activity" type="detail" @refresh="fetchDetail"/>
    </el-card>
  </div>

</template>


<script lang="ts" setup>
import Activity from '@/views/activity/activity/components/Activity.vue'
import {IActivity} from "@/views/activity/activity/components/data";
import {ref, onMounted} from "vue";
import {useRoute} from "vue-router";
import {getActivity} from "@/api/activity";

defineOptions({
  name: "ActivityDetail"
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

</script>

<style scoped>

</style>
