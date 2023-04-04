<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd(0)">新增分类</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" row-key="id" border default-expand-all>
          <el-table-column prop="name" label="分类名" align="center"></el-table-column>
          <el-table-column prop="slug" label="标识" align="center"></el-table-column>
          <el-table-column prop="order" label="排序" align="center" sortable></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"/>
          <el-table-column fixed="right" label="操作" width="240">
            <template #default="{row}">
              <el-button type="primary" text bg size="small" @click="handleEdit(row)">编辑</el-button>
              <el-popconfirm
                v-if="row.children.length === 0"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="真的要删除此条数据吗？"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button type="danger" text bg size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button type="default" v-if="row.parent_id === 0" text bg size="small" @click="handleAdd(row.id)">
                添加子类
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Category v-model:show-dialog="showDialog" v-model:category="category" @handleSubmit="handleSubmit"
                  v-if="showDialog"/>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue"
import {type IGetTableData} from "@/api/category/types/table"
import {deleteCategory, getTableDataApi, storeCategory, updateCategory} from "@/api/category";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {ICategory} from "@/views/article/category/components/data";
import Category from './components/Category.vue'

defineOptions({
  name: "Categories"
})

const loading = ref<boolean>(false)
const showDialog = ref<boolean>(false)

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()

const defaultCategory = {
  id: 0,
  parent_id: 0,
  order: 0,
  name: '',
  slug: '',
  description: '',
};

const category = ref<ICategory>(Object.assign({}, defaultCategory))

const handleAdd = (parentId: number) => {
  category.value = Object.assign({}, defaultCategory)
  category.value.parent_id = parentId
  showDialog.value = true
}

const handleEdit = (row: IGetTableData) => {
  const {id, parent_id, order, name, slug, description} = row
  category.value = {id, parent_id, order, name, slug, description};
  showDialog.value = true
}

const handleSubmit = () => {
  if (category.value.id > 0) {
    updateCategory(category.value.id, category.value).then(() => {
      ElMessage.success("更新成功")
      showDialog.value = false
      getTableData()
    })
  } else {
    storeCategory(category.value).then(() => {
      ElMessage.success("添加成功")
      showDialog.value = false
      getTableData()
    })
  }
}

const handleDelete = (row: IGetTableData) => {
  deleteCategory(row.id).then(() => {
    ElMessage.success("删除成功")
    getTableData();
  })
}

const getTableData = () => {
  loading.value = true
  getTableDataApi().then(res => {
    tableData.value = res.data
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  getTableData()
})
</script>

<style lang="scss" scoped>

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
