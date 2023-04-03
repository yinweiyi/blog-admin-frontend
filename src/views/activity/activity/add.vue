<template>
  <div class="app-container">
    <el-card>
      <activity v-model:activity="activity" type="add" @handleSubmit="onSubmit"/>
    </el-card>
  </div>

</template>


<script lang="ts" setup>
import Activity from '@/views/activity/activity/components/Activity.vue'
import {IActivity, IActivityPrize} from "@/views/activity/activity/components/data";
import {ref, onMounted} from "vue";
import {addActivity} from "@/api/activity";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

defineOptions({
  name: "ActivityAdd"
})

const defaultPrize: IActivityPrize = {
  basePrize: false,
  prizeName: '',
  type: 3,
  prizeValue: '',
  imageUrl: '',
  probabilities: 1000,
  stock: 0,
  limitWinningCount: 0,
  limitEveryday: 0,
  id: 0,
  surplus: 0,
  level: 0,
  levelName: ''
}

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

onMounted(() => {
  for (let i = 0; i < 7; i++) {
    activity.value.prizes.push(Object.assign({}, defaultPrize))
  }
})

const router = useRouter()
const onSubmit = () => {
  addActivity(activity.value).then(() => {
    ElMessage.success("添加成功")
    router.push("/activity/activities")
  })
}

</script>

<style scoped>

</style>
