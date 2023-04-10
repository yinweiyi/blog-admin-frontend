<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form :model="formData" ref="formRef" label-position="right" label-width="150px" :rules="formRules">
        <el-form-item label="分类：" prop="category_id">
          <el-tree-select v-model="formData.category_id" :data="categoriesData" :render-after-expand="true"/>
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input class="form-input" v-model="formData.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="标识：" prop="slug">
          <el-input class="form-input" v-model="formData.slug" placeholder="请输入标识"/>
        </el-form-item>
        <el-form-item label="作者：" prop="author">
          <el-input class="form-input" v-model="formData.author" placeholder="请输入作者"/>
        </el-form-item>
        <el-form-item label="标签：" prop="tags">
          <el-select v-model="formData.tags" multiple placeholder="请选择标签" style="width: 380px">
            <el-option
              v-for="item in tags"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：" prop="keywords">
          <el-input class="form-input" v-model="formData.keywords" placeholder="请输入关键词"/>
        </el-form-item>
        <el-form-item label="文本类型：" prop="content_type">
          <el-radio-group v-model="formData.content_type">
            <el-radio :label="1">markdown编辑器</el-radio>
            <el-radio :label="2">富文本编辑器</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容：" prop="markdown" v-if="formData.content_type === 1">
          <ElMdRich v-model:content="formData.markdown" v-model:html="formData.html" placeholder="请输入" edit-preview="edit" rich-height="400px"/>
        </el-form-item>

        <el-form-item label="内容：" prop="html" v-if="formData.content_type === 2">
          <WangEditor v-model:content="formData.html"></WangEditor>
        </el-form-item>
        <el-form-item label="排序：" prop="order">
          <el-input-number class="form-input" v-model="formData.order"/>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input type="textarea" rows="6" class="form-input" v-model="formData.description"
                    placeholder="请输入描述"/>
        </el-form-item>
        <el-form-item label="是否置顶：" prop="is_top">
          <el-switch v-model="formData.is_top"/>
        </el-form-item>
        <el-form-item label="是否显示：" prop="is_show">
          <el-switch v-model="formData.is_show"/>
        </el-form-item>
        <el-form-item label="浏览量：" prop="views">
          <el-input-number class="form-input" v-model="formData.views"/>
        </el-form-item>

      </el-form>

      <el-form-item style="padding-left: 150px">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button style="margin-left: 10px" @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType, ref, reactive, onMounted} from "vue";
import {IArticle} from "@/views/article/article/components/data";
import {FormInstance, FormRules} from "element-plus";
import {useRouter} from "vue-router";
import {IGetTableData as ICategories} from "@/api/category/types/table";
import {IGetTableData as ITags} from "@/api/tag/types/table";
import {getTableDataApi} from "@/api/category";
import {getAllData} from "@/api/tag";
import WangEditor from "@/components/WangEditor/WangEditor.vue";
import ElMdRich from "@/components/MavonEditor/ElMdRich.vue"

defineOptions({
  name: "Article"
})
const props = defineProps({
  type: {
    type: String as PropType<'edit' | 'add'>,
    required: true
  },
  article: {
    type: Object as PropType<IArticle>,
    required: true
  }
})


const categories = ref<ICategories[]>([])

const categoriesData = computed(() => {
  let items = categories.value.map(item => {
    return {
      label: item.name,
      value: item.id,
      disabled: item.children.length > 0,
      children: item.children.map(child => {
        return {
          label: child.name,
          value: child.id,
        }
      })
    }
  })
  items.unshift({
    label: '请选择分类',
    value: 0,
    disabled: false,
    children: []
  })
  return items

})

const formData = computed<IArticle>(() => {
  return props.article
})


const formRules = reactive<FormRules>({
  title: [
    {required: true, message: "标题不能为空", trigger: 'blur'}
  ],
  slug: [
    {required: true, message: "标识不能为空", trigger: 'blur'},
    {min: 2, max: 20, message: '长度必须在 2 到 20 位之间', trigger: 'blur'},
  ],
  keywords: [
    {required: true, message: "关键词不能为空", trigger: 'blur'}
  ]
})


const formRef = ref<FormInstance | null>(null)

const emit = defineEmits(["handleSubmit", "update:article", "refresh"])

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:article", formData.value)
      emit("handleSubmit")
    } else {
      return false
    }
  })
};

const handleFetchCategories = () => {
  getTableDataApi().then(res => {
    categories.value = res.data
  })
}

const tags = ref<ITags[]>([])

const handleFetchTags = () => {
  getAllData().then(res => {
    tags.value = res.data
  })
}

onMounted(() => {
  handleFetchCategories()
  handleFetchTags()
})

const router = useRouter()

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.form-input {
  width: 400px;
}

.table-input-number {
  width: 100%;
}

.table-image {
  width: 120px;
  height: 120px;
}
</style>
