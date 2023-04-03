<template>
  <div class="container">
    <el-form :model="formData" ref="formRef" label-position="right" label-width="150px" :rules="formRules"
             :disabled="props.type === 'detail'">
      <el-form-item label="活动标识：" prop="activityKey">
        <el-input class="form-input" v-model="formData.activityKey" placeholder="请输入活动标识"/>
      </el-form-item>
      <el-form-item label="活动名称：" prop="activityName">
        <el-input class="form-input" v-model="formData.activityName" placeholder="请输入活动名称"/>
      </el-form-item>
      <el-form-item label="兑换限制天数：" prop="exchangeLimitDay">
        <el-input-number class="form-input" :min="0" :precision="0" v-model="formData.exchangeLimitDay"
                         placeholder="请输入兑换限制天数" controls-position="right"/>
      </el-form-item>

      <el-form-item label="抽奖次数：" prop="limitValue">
        <el-select style="width: 150px" v-model="formData.limitType" placeholder="限制类型">
          <el-option
            v-for="item in limitTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        &nbsp;&nbsp;&nbsp;&nbsp;限制
        <el-input-number style="width: 150px; margin-left: 20px" :min="1" :precision="0"
                         v-model="formData.limitValue" placeholder="请输入限制次数" controls-position="right"/>
        次
      </el-form-item>
      <el-form-item label="活动时间:" prop="endTime">
        <el-col :span="11">
          <el-date-picker
            value-format="YYYY-MM-DD HH:mm:ss"
            v-model="timeRange"
            @change="onTimeChange"
            :default-time="defaultActivityTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-form-item>

      <el-form-item label="奖品:">
        <el-table :data="formData.prizes">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="奖品类型" align="center">
            <template #default="{row}">
              <el-select v-model="row.type">
                <el-option
                  v-for="item in prizeTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="补充" align="center">
            <template #default="{row}">
              <el-input v-if="row.type <= 2" v-model="row.prizeValue"/>
            </template>
          </el-table-column>

          <el-table-column label="基础奖品" align="center">
            <template #header>
              基础奖品
              <el-tooltip effect="light" content="奖品超限时的基础奖励,每期有且仅有一个基础奖品" placement="top">
                <el-icon>
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </template>
            <template #default="{row}">
              <el-select v-model="row.basePrize">
                <el-option :key="1" label="是" :value="true"></el-option>
                <el-option :key="0" label="否" :value="false"></el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="奖品名称" align="center">
            <template #default="{row}">
              <el-input v-model="row.prizeName"/>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template #header>
              图片地址
              <el-tooltip effect="light" content="填写H5静态地址相对路径或者oss路径" placement="top">
                <el-icon>
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </template>
            <template #default="{row}">
              <el-image :src="row.imageUrl" v-if="type === 'detail'" class="table-image"></el-image>

              <el-input v-else v-model="row.imageUrl"/>
            </template>
          </el-table-column>

          <el-table-column label="数量" align="center">
            <template #default="{row}">
              <span v-if="type === 'edit'">{{ row.stock }}</span>
              <el-input-number v-else class="table-input-number" :controls="false" v-model="row.stock"/>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template #header>
              中奖限制
              <el-tooltip effect="light" content="用户可中奖次数上限（0为无上限）" placement="top">
                <el-icon>
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </template>
            <template #default="{row}">
              <el-input-number class="table-input-number" :controls="false" v-model="row.limitWinningCount"/>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template #header>
              日发放量
              <el-tooltip effect="light" content="每日最大发放量（0为无上限）" placement="top">
                <el-icon>
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </template>
            <template #default="{row}">
              <el-input-number class="table-input-number" :controls="false" v-model="row.limitEveryday"/>
            </template>
          </el-table-column>

          <el-table-column align="center">
            <template #header>
              中奖率
              <el-tooltip effect="light" content="填写整数，如中奖率为0.98时，则填写98，奖品总中奖率和为10000"
                          placement="top">
                <el-icon>
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </template>
            <template #default="{row}">
              <el-input-number class="table-input-number" :controls="false" v-model="row.probabilities"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-link :underline="false" type="primary" v-if="type === 'detail'" :disabled="false" link
                       @click="handleShowUpdateStockDialog(scope.row)">库存调整
              </el-link>
              <el-button type="danger" v-else link @click="handleDeletePrize(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleAddPrize" v-if="type !== 'detail'">添加奖品</el-button>
      </el-form-item>
    </el-form>


    <el-form-item style="padding-left: 150px">
      <el-button type="primary" v-if="type === 'detail'" @click="handleEdit">编辑</el-button>
      <el-button type="primary" v-else @click="handleSubmit">保存</el-button>
      <el-button style="margin-left: 10px" @click="handleCancel">取消</el-button>
    </el-form-item>

    <el-dialog
      v-model="updateStockForm.showUpdateStockDialog"
      title="库存调整"
      width="30%"
      :before-close="handleCloseUpdateStockForm"
    >
      <el-form :label-width="100">
        <el-form-item label="调整数量：">
          <el-input-number v-model="updateStockForm.num" controls-position="right"/>
        </el-form-item>
        <el-alert type="info" show-icon :closable="false">
          正数添加库存，负数减少库存
        </el-alert>
      </el-form>
      <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateStockForm.showUpdateStockDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateStock">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType, reactive, ref} from "vue";
import {IActivity, IActivityPrize} from "@/views/activity/activity/components/data";
import {Warning} from "@element-plus/icons-vue";
import {FormInstance} from "element-plus";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus"
import {updatePrizeStock} from "@/api/activity";

defineOptions({
  name: "Activity"
})
const props = defineProps({
  type: {
    type: String as PropType<'edit' | 'add' | 'detail'>,
    required: true
  },
  activity: {
    type: Object as PropType<IActivity>,
    required: true
  }
})

const timeRange = ref(['', ''])
const formData = computed(() => {
  timeRange.value = [
    props.activity.startTime,
    props.activity.endTime
  ]
  return props.activity
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

const limitTypes = [
  {label: "每期", value: 1},
  {label: "每天", value: 2},
];


const onTimeChange = () => {
  formData.value.startTime = timeRange.value[0]
  formData.value.endTime = timeRange.value[1]
}

const defaultActivityTime: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]

const prizeTypes = [
  {label: "工分", value: 1},
  {label: "优惠券", value: 2},
  {label: "实物", value: 3},
];

const handleAddPrize = () => {
  formData.value.prizes.push(Object.assign({}, defaultPrize))
}

const handleDeletePrize = (index: number) => {
  formData.value.prizes.splice(index, 1)
}

const formRules = {
  activityKey: [
    {required: true, message: "活动标识不能为空", trigger: 'blur'}
  ],
  activityName: [
    {required: true, message: "活动名称不能为空", trigger: 'blur'}
  ],
  link: [
    {required: true, message: "活动链接不能为空", trigger: 'blur'}
  ],
  endTime: [
    {required: true, message: "活动时间不能为空", trigger: 'blur'}
  ],
  limitValue: [
    {required: true}
  ]
}
const formRef = ref<FormInstance | null>(null)

const emit = defineEmits(["handleSubmit", "update:activity", "refresh"])

const levelName = [
  "一等奖",
  "二等奖",
  "三等奖",
  "四等奖",
  "五等奖",
  "六等奖",
  "七等奖",
  "八等奖",
  "九等奖",
  "十等奖"
]

const validatePrize = (prizes: IActivityPrize[]) => {
  for (let i in prizes) {
    let prize = prizes[i]
    prize.level = parseInt(i) + 1;
    prize.levelName = levelName[i]
    if (prize.prizeName == '' || prize.imageUrl == '' || prize.stock == 0) {
      return false;
    }
    if (prize.type < 3 && prize.prizeValue == '') {
      return false;
    }
  }
  return true;
}
const validateProbabilities = (prizes: IActivityPrize[]) => {
  let sum = 0;
  let sumProbabilities = prizes.map(item => item.probabilities)
  if (sumProbabilities.length === 1) {
    return sumProbabilities[0];
  }
  sumProbabilities.reduce(function (pre, curr) {
    sum = pre + curr;
    return sum;
  });
  return sum === 10000
}

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (!validatePrize(formData.value.prizes)) {
        ElMessage.error("请填写完整奖品信息")
        return false;
      }
      if (!validateProbabilities(formData.value.prizes)) {
        ElMessage.error("所有奖品的概率和必须为10000")
        return false;
      }
      emit("update:activity", formData.value)
      emit("handleSubmit")
    } else {
      return false
    }
  })
};

const updateStockForm = reactive({
  showUpdateStockDialog: false,
  activePrizeId: 0,
  num: 0
})

const handleShowUpdateStockDialog = (record: IActivityPrize) => {
  updateStockForm.activePrizeId = record.id
  updateStockForm.showUpdateStockDialog = true
}

const handleCloseUpdateStockForm = () => {
  updateStockForm.showUpdateStockDialog = false
  updateStockForm.activePrizeId = 0
  updateStockForm.num = 0
}

const handleUpdateStock = async () => {
  if (updateStockForm.num === 0) {
    ElMessage.error("调整数量不能为0")
    return;
  }
  await updatePrizeStock(updateStockForm.activePrizeId, {num: updateStockForm.num}).then(() => {
    ElMessage.success("更新成功")
    updateStockForm.activePrizeId = 0;
    updateStockForm.num = 0
    emit("refresh")
    updateStockForm.showUpdateStockDialog = false
  })
}

const router = useRouter()

const handleEdit = () => {
  router.push({name: "ActivityEdit", params: {id: props.activity?.id}})
}

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.form-input {
  width: 400px;
}

.table-input-number {
  width: 100%;
}

.table-image {
  width: 120px;
  height: 120px;
}
</style>
