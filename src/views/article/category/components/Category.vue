<template>
  <div class="app-container">
    <el-dialog v-model="state.isShowDialog" title="分类" :before-close="onBeforeClose">
      <el-card shadow="never">
        <el-form :model="category" ref="formRef" label-position="right" label-width="100px" :rules="formRules">
          <el-form-item label="父分类：" prop="parent_id">
            <el-select placeholder="请选择分类" v-model="category.parent_id">
              <el-option
                v-for="item in parents"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="分类名：" prop="name">
            <el-input class="form-input" v-model="category.name" placeholder="请输入分类名"/>
          </el-form-item>
          <el-form-item label="标识：" prop="slug">
            <el-input class="form-input" v-model="category.slug" placeholder="请输入标识"/>
          </el-form-item>
          <el-form-item label="排序：" prop="order">
            <el-input-number class="form-input" v-model="category.order"/>
          </el-form-item>
          <el-form-item label="描述：" prop="description">
            <el-input class="form-input" v-model="category.description" placeholder="输入描述" type="textarea"/>
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
import {onMounted, reactive, ref, computed, PropType} from "vue";
import {ICategory, ICategorySelect} from "@/views/article/category/components/data";
import {getParents} from "@/api/category";
import {FormInstance, FormRules} from "element-plus";

defineOptions({
  name: "Category"
})

const props = defineProps({
  category: {
    type: Object as PropType<ICategory>,
    required: true
  },
  showDialog: {
    type: Boolean,
    required: true,
    default: false
  }
})
const parents = ref<ICategorySelect[]>([{
  label: '----顶级分类----',
  value: 0
}])
const emit = defineEmits(['update:showDialog', 'update:category', 'handleSubmit'])

const state = reactive({
  isShowDialog: props.showDialog,
  loading: false
});

const handleFetchParents = async () => {
  const {data} = await getParents();
  parents.value = parents.value.concat(data.map(item => {
    return {
      label: item.name,
      value: item.id,
    }
  }))
}
const category = computed(() => props.category)

// 关闭弹窗
const onBeforeClose = (down: Function) => {
  emit('update:showDialog', false)
  down()
}

onMounted(() => {
  handleFetchParents()
})

const formRef = ref<FormInstance | null>(null)

const formRules = reactive<FormRules>({
  name: [
    {required: true, message: "分类名不能为空", trigger: 'blur'}
  ],
  slug: [
    {required: true, message: "标识不能为空", trigger: 'blur'},
    {min: 3, max: 10, message: '长度必须在 3 到 10 位之间', trigger: 'blur'},
  ],
})

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:category", category.value)
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
