<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    :http-request="customRequest"
    :before-upload="beforeUpload"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
    <el-icon v-else class="avatar-uploader-icon">
      <Plus/>
    </el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import {defineEmits, ref, watch} from 'vue'
import {ElMessage} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'

import type {UploadProps} from 'element-plus'
import {upload} from "@/api/common/file";

const props = defineProps({
  imageUrl: {
    type: String,
    default: () => {
      return ""
    },
  },
  imagePrefix: {
    type: String,
    default: () => {
      return "baigei"
    },
  }
})

const emits = defineEmits(["update:imageUrl", "getImageData"])

const imageUrl = ref(props.imageUrl)

const file = ref()

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  file.value = rawFile
  return true
}

const customRequest = () => {
  const formData = new FormData()
  formData.append('file', file.value)
  formData.append('prefix', props.imagePrefix)

  upload(formData).then(res => {
    imageUrl.value = res.data.link  //上传成功，在成功函数里填入图片路径
    emits('update:imageUrl', res.data.link + '?imageMogr2/format/webp')
    emits('getImageData', res.data)
  }).catch(() => {
    ElMessage.error('上传失败.')
  })
}

</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
