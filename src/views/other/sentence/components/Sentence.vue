<template>
  <div class="app-container">
    <el-dialog v-model="state.isShowDialog" title="分类" :before-close="onBeforeClose">
      <el-card shadow="never">
        <el-form :model="sentence" ref="formRef" label-position="right" label-width="100px" :rules="formRules">

          <el-form-item label="作者：" prop="author">
            <el-input class="form-input" v-model="sentence.author" placeholder="请输入作者"/>
          </el-form-item>
          <el-form-item label="内容：" prop="content">
            <el-input type="textarea" class="form-input" v-model="sentence.content" placeholder="请输入内容"/>
          </el-form-item>
          <el-form-item label="翻译：" prop="translation">
            <el-input type="textarea" class="form-input" v-model="sentence.translation" placeholder="请输入翻译"/>
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
import {ISentence} from "@/views/other/sentence/components/data";
import {FormInstance, FormRules} from "element-plus";

defineOptions({
  name: "Sentence"
})

const props = defineProps({
  sentence: {
    type: Object as PropType<ISentence>,
    required: true
  },
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['update:showDialog', 'update:sentence', 'handleSubmit'])

const state = reactive({
  isShowDialog: props.showDialog,
  loading: false
});

const sentence = computed(() => props.sentence)

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}

const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  author: [
    {required: true, message: "作者不能为空", trigger: 'blur'}
  ],
  content: [
    {required: true, message: "内容不能为空", trigger: 'blur'},
  ],
  translation: [
    {required: true, message: "翻译不能为空", trigger: 'blur'},
  ],
})

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:sentence", sentence.value)
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
