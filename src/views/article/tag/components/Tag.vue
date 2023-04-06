<template>
  <div class="app-container">
    <el-dialog v-model="state.isShowDialog" title="分类" :before-close="onBeforeClose">
      <el-card shadow="never">
        <el-form :model="tag" ref="formRef" label-position="right" label-width="100px" :rules="formRules">

          <el-form-item label="标签名：" prop="name">
            <el-input class="form-input" v-model="tag.name" placeholder="请输入标签名"/>
          </el-form-item>
          <el-form-item label="标识：" prop="slug">
            <el-input class="form-input" v-model="tag.slug" placeholder="请输入标识"/>
          </el-form-item>
          <el-form-item label="排序：" prop="order">
            <el-input-number class="form-input" v-model="tag.order"/>
          </el-form-item>
          <el-form-item label="描述：" prop="description">
            <el-input class="form-input" v-model="tag.description" placeholder="输入描述" type="textarea"/>
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
import {reactive, ref, computed, PropType} from "vue";
import {ITag} from "@/views/article/tag/components/data";
import {FormInstance, FormRules} from "element-plus";

defineOptions({
  name: "Tag"
})

const props = defineProps({
  tag: {
    type: Object as PropType<ITag>,
    required: true
  },
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['update:showDialog', 'update:tag', 'handleSubmit'])

const state = reactive({
  isShowDialog: props.showDialog,
  loading: false
});

const tag = computed(() => props.tag)

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}


const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  name: [
    {required: true, message: "标签名不能为空", trigger: 'blur'}
  ],
  slug: [
    {required: true, message: "标识不能为空", trigger: 'blur'},
    {min: 2, max: 20, message: '长度必须在 2 到 20 位之间', trigger: 'blur'},
  ],
})

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:tag", tag.value)
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
