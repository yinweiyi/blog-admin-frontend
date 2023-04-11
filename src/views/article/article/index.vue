<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增文章</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="id" label="id" align="center" width="60"/>
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column label="标识" width="160">
            <template #default="{row}">
              <el-tag>{{ row.slug }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者" align="center" width="80"></el-table-column>
          <el-table-column prop="order" label="排序" align="center" sortable width="80"></el-table-column>
          <el-table-column prop="views" label="浏览量" align="center" sortable width="100"></el-table-column>
          <el-table-column label="分类名" align="center" width="100">
            <template #default="{row}">
              <el-tag>{{ row.category.name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否置顶" align="center" width="80">
            <template #default="{row}">
              <el-switch
                v-model="row.is_top"
                class="ml-2"
                :loading="changeStatusLoading"
                @change="handleChangeStatus(row, 'is_top')"
              />
            </template>
          </el-table-column>
          <el-table-column label="是否显示" align="center" width="80">
            <template #default="{row}">
              <el-switch
                v-model="row.is_show"
                class="ml-2"
                :loading="changeStatusLoading"
                @change="handleChangeStatus(row, 'is_show')"
              />
            </template>
          </el-table-column>
          <el-table-column prop="updated_at" label="更新时间" align="center" width="160"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template #default="scope">

              <el-button type="default" text bg size="small" @click="handleToComment(scope.row)">评论</el-button>
              <el-button type="primary" text bg size="small" @click="handleToEdit(scope.row)">编辑</el-button>

              <el-popconfirm
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="真的要删除此条数据吗？"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <el-button type="danger" text bg size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
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
import {ref, watch} from "vue"
import {type IGetTableData} from "@/api/article/types/table"
import {usePagination} from "@/hooks/usePagination"
import {deleteArticle, getTableDataApi} from "@/api/article";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {updateStatus} from "@/api/article";

defineOptions({
  name: "Articles"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const changeStatusLoading = ref<boolean>(false)

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()

const handleAdd = () => {
  router.push({name: "ArticleAdd"})
}

const handleToEdit = (row: IGetTableData) => {
  router.push({name: "ArticleEdit", params: {id: row.id}})
}

const handleToComment = (row: IGetTableData) => {
  router.push({name: "ArticleComment", params: {id: row.id}})
}

const handleDelete = (row: IGetTableData) => {
  deleteArticle(row.id).then(() => {
    ElMessage.success("删除成功")
    getTableData();
  })
}

const handleChangeStatus = (row: IGetTableData, field: 'is_show' | 'is_top') => {
  changeStatusLoading.value = true;
  updateStatus(row.id, {[field]: row[field]}).then(() => {
    ElMessage.success('更新成功');
  }).finally(() => {
    changeStatusLoading.value = false
  })
}

const getTableData = () => {
  loading.value = true
  getTableDataApi({
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize,
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

//#endregion

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
