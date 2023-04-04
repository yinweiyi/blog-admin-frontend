<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增管理员</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="id" label="id" align="center"/>
          <el-table-column prop="name" label="用户名" align="center"></el-table-column>
          <el-table-column prop="account" label="账号" align="center"></el-table-column>
          <el-table-column prop="last_login_ip" label="最后登录ip" align="center"></el-table-column>
          <el-table-column prop="last_login_at" label="最后登录时间" align="center"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"/>
          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template #default="scope">
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
import {type IGetTableData} from "@/api/administrator/types/table"
import {usePagination} from "@/hooks/usePagination"
import {deleteAdministrator, getTableDataApi} from "@/api/administrator";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

defineOptions({
  name: "Administrators"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()

const handleAdd = () => {
  router.push({name: "AdministratorAdd"})
}

const handleToEdit = (row: IGetTableData) => {
  router.push({name: "AdministratorEdit", params: {id: row.id}})
}

const handleDelete = (row: IGetTableData) => {
  deleteAdministrator(row.id).then(() => {
    ElMessage.success("删除成功")
    getTableData();
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
