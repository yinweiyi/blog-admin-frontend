<template>
    <el-card shadow="never">
      <el-form :model="site" ref="formRef" label-position="right" label-width="100px" :rules="formRules">
        <el-form-item label="网站标题：" prop="title">
          <el-input class="form-input" v-model="site.title" placeholder="请输入网站标题"/>
        </el-form-item>
        <el-form-item label="副标题：" prop="sub_title">
          <el-input class="form-input" v-model="site.sub_title" placeholder="请输入副标题"/>
        </el-form-item>

        <el-form-item label="关键字：" prop="keywords">
          <el-input class="form-input" v-model="site.keywords"/>
        </el-form-item>

        <el-form-item label="icp备案：" prop="icp">
          <el-input class="form-input" v-model="site.icp"/>
        </el-form-item>

        <el-form-item label="公安备案：" prop="beian">
          <el-input class="form-input" v-model="site.beian"/>
        </el-form-item>

        <el-form-item label="网站作者：" prop="author">
          <el-input class="form-input" v-model="site.author"/>
        </el-form-item>

        <el-form-item label="描述：" prop="description">
          <el-input class="form-input" v-model="site.description" placeholder="输入描述" type="textarea"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>

</template>

<script lang="ts" setup>
import {PropType, reactive, ref, watch} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {ISite} from "@/views/system/setting/components/data";

const props = defineProps({
  setting: {
    type: Object as PropType<ISite>,
    required: true
  }
})

defineOptions({
  name: "Site"
})

const emit = defineEmits(['update:setting', 'handleSubmit'])

const site = ref<ISite>({
  title: '',
  sub_title: '',
  keywords: '',
  icp: '',
  beian: '',
  author: '',
  description: ''
})

watch(() => props.setting, (value) => {
  if (null != value) {
    site.value = props.setting
  }
})


const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  title: [
    {required: true, message: "网站标题不能为空", trigger: 'blur'}
  ],
  sub_title: [
    {required: true, message: "副标题不能为空", trigger: 'blur'},
  ]
})


const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit('update:setting', site.value)
      emit('handleSubmit')
    } else {
      return false
    }
  })
};

</script>

<style scoped>

</style>
