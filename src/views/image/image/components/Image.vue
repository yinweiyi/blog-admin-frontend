<template>
  <div class="app-container">
    <el-dialog v-model="state.isShowDialog" width="70%" :before-close="onBeforeClose">
      <el-card shadow="never">
        <el-form :model="image" ref="formRef" label-position="right" label-width="120px" :rules="formRules">
          <el-form-item label="模型" prop="image_model_id">
            <el-select v-model="image.image_model_id" @change="onChangeModel">
              <el-option :value="0" label="请选择"></el-option>
              <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>

          <el-form-item label="图片：" prop="image_url">
            <ImageUpload v-model:imageUrl="image.image_url" :max-width="500" @getImageData="getImageData"/>
          </el-form-item>

          <el-form-item label="Prompt：" prop="prompt">
            <el-input type="textarea" class="form-input textarea" :rows="6" v-model="image.prompt"/>
          </el-form-item>
          <el-form-item label="NegativePrompt：" prop="negative_prompt">
            <el-input type="textarea" class="form-input textarea" :rows="6" v-model="image.negative_prompt"/>
          </el-form-item>

          <el-form-item label="CFG scale：" prop="cfg_scale">
            <el-input-number class="form-input" :precision="1" :step="0.5" :max="30" v-model="image.cfg_scale"/>
          </el-form-item>

          <el-form-item label="steps：" prop="steps">
            <el-input-number class="form-input" :min="0" :max="150" v-model="image.steps"/>
          </el-form-item>

          <el-form-item label="sampler：" prop="sampler">
            <el-select placeholder="Please select" v-model="image.sampler">
              <el-option
                v-for="item in samplers"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="seed：" prop="seed">
            <el-input-number class="form-input" v-model="image.seed"/>
          </el-form-item>

          <el-form-item label="clip skip：" prop="clip_skip">
            <el-input-number class="form-input" :min="0" :max="12" v-model="image.clip_skip"/>
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
import {reactive, ref, PropType} from "vue";
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

const image = ref<IImage>(props.image)

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}
//Euler a, Euler, LMS, Heun, DPM2, DPM2 a, DPM++ 2S a, DPM++ 2M, DPM++ SDE, DPM fast,
// DPM adaptive, LMS Karras, DPM2 Karras, DPM2 a Karras, DPM++ 2S a Karras, DPM++ 2M Karras, DPM++ SDE Karras, DDIM, PLMS
const samplers = [
  {label: "Euler a", value: "Euler a"},
  {label: "Euler", value: "Euler"},
  {label: "LMS", value: "LMS"},
  {label: "Heun", value: "Heun"},
  {label: "DPM2", value: "DPM2"},
  {label: "DPM2 a", value: "DPM2 a"},
  {label: "DPM++ 2S a", value: "DPM++ 2S a"},
  {label: "DPM++ 2M", value: "DPM++ 2M"},
  {label: "DPM++ SDE", value: "DPM++ SDE"},
  {label: "DPM fast", value: "DPM fast"},
  {label: "DPM adaptive", value: "DPM adaptive"},
  {label: "LMS Karras", value: "LMS Karras"},
  {label: "DPM2 Karras", value: "DPM2 Karras"},
  {label: "DPM2 a Karras", value: "DPM2 a Karras"},
  {label: "DPM++ 2S a Karras", value: "DPM++ 2S a Karras"},
  {label: "DPM++ 2M Karras", value: "DPM++ 2M Karras"},
  {label: "DPM++ SDE Karras", value: "DPM++ SDE Karras"},
  {label: "DDIM", value: "DDIM"},
  {label: "PLMS", value: "PLMS"},
  {label: "UniPC", value: "UniPC"},
]

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
  negative_prompt: [
    {required: true, message: "反向提示词不能为空", trigger: 'blur'},
  ],
})

const onChangeModel = (val: number) => {
  if (val) {
    const model = props.models.find(item => item.id === val)
    if (model) {
      image.value.prompt = model.default_prompt;
      image.value.negative_prompt = model.default_negative_prompt;
    }
  }
}

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
