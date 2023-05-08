<template>
  <div class="app-container">
    <el-dialog v-model="state.isShowDialog" width="70%" :before-close="onBeforeClose">
      <el-card shadow="never">
        <el-form :model="image" ref="formRef" label-position="right" label-width="120px" :rules="formRules">
          <el-form-item label="模型" prop="image_model_id">
            <el-select v-model="image.image_model_id">
              <el-option :value="0" label="请选择"></el-option>
              <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item label="图片：" prop="image_url">
            <ImageUpload v-model:imageUrl="image.image_url" image-prefix="ai-image" @getImageData="getImageData"/>
          </el-form-item>

          <el-form-item label="提示词：" prop="prompt">
            <el-input type="textarea" class="form-input textarea" :rows="6" v-model="image.prompt"/>
          </el-form-item>
          <el-form-item label="反向提示语：" prop="negative_prompt">
            <el-input type="textarea" class="form-input textarea" :rows="6" v-model="image.negative_prompt"/>
          </el-form-item>
          <el-form-item label="排序：" prop="order">
            <el-input-number class="form-input" v-model="image.order"/>
          </el-form-item>
        </el-form>

        <el-form-item style="padding-left: 150px">
          <el-button type="primary" @click="handleSubmit(false)">保存</el-button>
          <el-button type="success" v-if="image.id === 0" @click="handleSubmit(true)">保存并继续</el-button>
          <el-button style="margin-left: 10px" @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-card>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, PropType, watch} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {IImage} from "@/views/image/image/components/data";
import ImageUpload from "@/components/Upload/ImageUpload.vue"
import {IFile} from "@/api/common/types/type";
import {IGetTableData as IModelData} from "@/api/image-model/types/table";

defineOptions({
  name: "Image"
})

const props = defineProps({
  image: {
    type: Object as PropType<IImage>,
    required: true
  },
  models: {
    type: Object as PropType<IModelData[]>,
    required: true
  },
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  }
})
const emit = defineEmits(['update:showDialog', 'update:image', 'handleSubmit'])

const state = reactive({
  isShowDialog: props.showDialog,
  loading: false
});

const image = ref<IImage>({
  id: 0,
  image_url: "",
  width: 0,
  height: 0,
  prompt: "",
  negative_prompt: "",
  order: 0,
  image_model_id: 0
})

watch(props.image, (newValue) => {
  image.value = newValue
})

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}

const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  image_model_id: [
    {required: true, message: "请选择模型", trigger: 'blur'}
  ],
  image_url: [
    {required: true, message: "图片不能为空", trigger: 'blur'}
  ],
  prompt: [
    {required: true, message: "提示词不能为空", trigger: 'blur'},
  ],
})

const handleSubmit = (goOn: Boolean) => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:image", image.value)
      emit("handleSubmit", goOn)
    } else {
      return false
    }
  })
};

const getImageData = (file: IFile) => {
  image.value.height = file.height
  image.value.width = file.width
}

const handleCancel = () => {
  emit('update:showDialog', false)
}

</script>

<style scoped>
.textarea {
  width: 500px;
}
</style>
