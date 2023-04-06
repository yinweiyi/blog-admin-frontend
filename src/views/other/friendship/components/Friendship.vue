<template>
  <div class="app-container">
    <el-dialog v-model="state.isShowDialog" title="分类" :before-close="onBeforeClose">
      <el-card shadow="never">
        <el-form :model="friendship" ref="formRef" label-position="right" label-width="100px" :rules="formRules">

          <el-form-item label="标题：" prop="title">
            <el-input class="form-input" v-model="friendship.title" placeholder="请输入题"/>
          </el-form-item>
          <el-form-item label="链接：" prop="link">
            <el-input class="form-input" v-model="friendship.link" placeholder="请输入链接"/>
          </el-form-item>
          <el-form-item label="排序：" prop="order">
            <el-input-number class="form-input" v-model="friendship.order"/>
          </el-form-item>
          <el-form-item label="是否开启：" prop="status">
            <el-switch v-model="friendship.status" class="ml-2"/>
          </el-form-item>
          <el-form-item label="描述：" prop="description">
            <el-input class="form-input" v-model="friendship.description" placeholder="输入描述" type="textarea"/>
          </el-form-item>
        </el-form>

        <el-form-item style="padding-left: 100px">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button style="margin-left: 10px" @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-card>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, computed, PropType} from "vue";
import {IFriendship} from "@/views/other/friendship/components/data";
import {FormInstance, FormRules} from "element-plus";

defineOptions({
  name: "Friendship"
})

const props = defineProps({
  friendship: {
    type: Object as PropType<IFriendship>,
    required: true
  },
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['update:showDialog', 'update:friendship', 'handleSubmit'])

const state = reactive({
  isShowDialog: props.showDialog,
  loading: false
});

const friendship = computed(() => props.friendship)

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}


const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  title: [
    {required: true, message: "标题不能为空", trigger: 'blur'}
  ],
  link: [
    {required: true, message: "链接不能为空", trigger: 'blur'},
  ],
})

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:friendship", friendship.value)
      emit("handleSubmit")
    } else {
      return false
    }
  })
};

const handleCancel = () => {
  emit('update:showDialog', false)
}

</script>

<style scoped>

</style>
