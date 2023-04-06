<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd()">新增分类</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" row-key="id" border default-expand-all>
          <el-table-column prop="name" label="标签名" align="center"></el-table-column>
          <el-table-column prop="slug" label="标识" align="center"></el-table-column>
          <el-table-column prop="order" label="排序" align="center" sortable></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"/>
          <el-table-column fixed="right" label="操作" width="240">
            <template #default="{row}">
              <el-button type="primary" text bg size="small" @click="handleEdit(row)">编辑</el-button>
              <el-popconfirm
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="真的要删除此条数据吗？"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button type="danger" text bg size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <Tag v-model:show-dialog="showDialog" v-model:tag="tag" @handleSubmit="handleSubmit"
                  v-if="showDialog"/>
      </div>

      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from "vue"
import {type IGetTableData} from "@/api/tag/types/table"
import {deleteTag, getTableDataApi, storeTag, updateTag} from "@/api/tag";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {ITag} from "@/views/article/tag/components/data";
import Tag from './components/Tag.vue'
import {usePagination} from "@/hooks/usePagination";

defineOptions({
  name: "Tags"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const showDialog = ref<boolean>(false)

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()

const defaultTag = {
  id: 0,
  order: 0,
  name: '',
  slug: '',
  description: '',
};

const tag = ref<ITag>(Object.assign({}, defaultTag))

const handleAdd = () => {
  tag.value = Object.assign({}, defaultTag)
  showDialog.value = true
}

const handleEdit = (row: IGetTableData) => {
  const {id, order, name, slug, description} = row
  tag.value = {id, order, name, slug, description};
  showDialog.value = true
}

const handleSubmit = () => {
  if (tag.value.id > 0) {
    updateTag(tag.value.id, tag.value).then(() => {
      ElMessage.success("更新成功")
      showDialog.value = false
      getTableData()
    })
  } else {
    storeTag(tag.value).then(() => {
      ElMessage.success("添加成功")
      showDialog.value = false
      getTableData()
    })
  }
}

const handleDelete = (row: IGetTableData) => {
  deleteTag(row.id).then(() => {
    ElMessage.success("删除成功")
    getTableData();
  })
}

const getTableData = () => {
  loading.value = true
  getTableDataApi({
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize,
  }).then(res => {
    paginationData.total = res.data.total
    tableData.value = res.data.list
  }).catch(() => {
    tableData.value = []
  }).finally(() => {
    loading.value = false
  })
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})
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
