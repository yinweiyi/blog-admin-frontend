<template>
  <el-card shadow="never" class="card">
    <el-form :model="guestbook" ref="formRef" label-position="right" label-width="120px" :rules="formRules">
      <el-form-item label="内容：" prop="title">
        <t-editor v-model:content="guestbook.content"  />
      </el-form-item>
      <el-form-item label="是否开启评论：" prop="can_comment">
        <el-switch v-model="guestbook.can_comment"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import TEditor from '@/components/Tinymce/TEditor.vue'
import {PropType, reactive, ref, watch} from "vue";
import {IGuestbook} from "@/views/system/setting/components/data";
import {FormInstance, FormRules} from "element-plus";

const props = defineProps({
  setting: {
    type: Object as PropType<IGuestbook>,
    required: true
  }
})

defineOptions({
  name: "Guestbook"
})

const emit = defineEmits(['update:setting', 'handleSubmit'])
const guestbook = ref<IGuestbook>({
  content: '',
  can_comment: true
})

watch(() => props.setting, (value) => {
  if (null != value) {
    guestbook.value = props.setting
  }
})

const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  content: [
    {required: true, message: "内容不能为空", trigger: 'blur'}
  ],
})


const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit('update:setting', guestbook.value)
      emit('handleSubmit')
    } else {
      return false
    }
  })
};
</script>

<style scoped>
.card {
  padding-top: 30px;
}
</style>
