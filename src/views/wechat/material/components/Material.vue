<template>
  <div class="app-container">
    <div class="app-container">
      <el-dialog title="新增素材" v-model="state.isShowDialog" width="70%" :before-close="onBeforeClose">
        <el-form :model="material" ref="formRef" label-position="right" label-width="120px" :rules="formRules">
          <el-form-item label="媒体文件" prop="file">
            <el-upload
              ref="uploadFile"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="onUploadChange"
              :auto-upload="false"
            >
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>
              <template #tip>
                <div class="el-upload__tip text-red">
                  limit 1 file, new file will cover the old file
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item label="媒体类型" prop="mediaType">
            <el-select v-model="material.mediaType" placeholder="媒体类型" style="width:100%">
              <el-option label="图片（2M以内，支持PNG\JPEG\JPG\GIF）" value="image"></el-option>
              <el-option label="视频（10M以内，只支持MP4）" value="video"></el-option>
              <el-option label="语音（2M、60s以内，支持AMR\MP3）" value="voice"></el-option>
              <el-option label="缩略图（64K以内JPG）" value="thumb"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="素材名称" prop="fileName">
            <el-input v-model="material.fileName" placeholder="为便于管理建议按用途分类+素材内容命名"></el-input>
          </el-form-item>

          <el-form-item style="padding-left: 150px">
            <el-button type="primary" @click="handleSubmit" :disabled="state.updating">
              {{ state.updating ? '提交中...' : '提交' }}
            </el-button>
            <el-button style="margin-left: 10px" @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {computed, reactive, ref} from "vue";
import {IMaterialForm} from "@/views/wechat/material/components/data";
import {
  ElMessage,
  FormInstance,
  FormRules,
  genFileId,
  UploadFile,
  UploadInstance,
  UploadProps,
  UploadRawFile
} from "element-plus";
import {addMaterial} from "@/api/wechat/ofaMaterial";

defineOptions({
  name: "Material"
})

const props = defineProps({
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  }
})

const material = ref<IMaterialForm>({
  file: computed(() => {
    return fileRef.value
  }),
  fileName: '',
  mediaType: 'image'
})
const formRules = reactive<FormRules>({
  file: [
    {required: true, message: "文件不能为空", trigger: 'change'}
  ],
  fileName: [
    {required: true, message: "文件名不能为空", trigger: 'blur'}
  ],
  mediaType: [
    {required: true, message: "请选择媒体类型", trigger: 'change'},
  ],
})


const emit = defineEmits(['update:showDialog', 'refresh'])

const state = reactive({
  isShowDialog: props.showDialog,
  updating: false
});

const handleCancel = () => {
  emit('update:showDialog', false)
}

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}

const fileRef = ref()

const onUploadChange = (uploadFile: UploadFile) => {
  fileRef.value = uploadFile.raw
  return true
}

const uploadFile = ref<UploadInstance>()
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadFile.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadFile.value!.handleStart(file)
}

const formRef = ref<FormInstance | null>(null)

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      addMaterial(material.value).then(() => {
        ElMessage.success('添加成功')
        emit('refresh', true)
      })

      //handleCancel()
    } else {
      return false
    }
  })
};


</script>

<style scoped>

</style>
