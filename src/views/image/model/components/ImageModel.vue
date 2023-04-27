<template>
  <div class="app-container">
    <el-dialog v-model="state.isShowDialog" width="70%" title="分类" :before-close="onBeforeClose">
      <el-card shadow="never">
        <el-form :model="imageModel" ref="formRef" label-position="right" label-width="120px" :rules="formRules">
          <el-form-item label="名称：" prop="name">
            <el-input class="form-input" v-model="imageModel.name" placeholder="请输入分类名"/>
          </el-form-item>
          <el-form-item label="模型大小：" prop="size">
            <el-input-number class="form-input" :precision="2" :step="0.1" v-model="imageModel.size"/>
          </el-form-item>
          <el-form-item label="下载地址：" prop="download_url">
            <el-input class="form-input" v-model="imageModel.download_url" placeholder="请输入模型下载地址"/>
          </el-form-item>
          <el-form-item label="排序：" prop="order">
            <el-input-number class="form-input" v-model="imageModel.order"/>
          </el-form-item>
          <el-form-item label="提示语：" prop="default_prompt">
            <el-input type="textarea" class="form-input textarea" :rows="6" v-model="imageModel.default_prompt"/>
          </el-form-item>
          <el-form-item label="反向提示语：" prop="default_negative_prompt">
            <el-input type="textarea" class="form-input textarea" :rows="6" v-model="imageModel.default_negative_prompt"/>
          </el-form-item>
          <el-form-item label="描述：" prop="description">
            <t-editor v-model:content="imageModel.description" placeholder="输入描述"/>
          </el-form-item>
        </el-form>

        <el-form-item style="padding-left: 150px">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button style="margin-left: 10px" @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-card>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, PropType} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {IImageModel} from "@/views/image/model/components/data";
import TEditor from "@/components/Tinymce/TEditor.vue";

defineOptions({
  name: "ImageModel"
})

const props = defineProps({
  imageModel: {
    type: Object as PropType<IImageModel>,
    required: true
  },
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  }
})
const emit = defineEmits(['update:showDialog', 'update:imageModel', 'handleSubmit'])

const state = reactive({
  isShowDialog: props.showDialog,
  loading: false
});

const imageModel = computed(() => props.imageModel)

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}

const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  name: [
    {required: true, message: "名称不能为空", trigger: 'blur'}
  ],
  size: [
    {required: true, message: "文件大小不能为空", trigger: 'blur'},
  ],
  download_url: [
    {required: true, message: "下载地址不能为空", trigger: 'blur'},
  ],
  default_prompt: [
    {required: true, message: "提示语不能为空", trigger: 'blur'},
  ],
  default_negative_prompt: [
    {required: true, message: "反向提示语不能为空", trigger: 'blur'},
  ],
})

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:imageModel", imageModel.value)
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
