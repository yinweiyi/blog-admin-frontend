<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增活动</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column prop="id" label="id" align="center"/>
          <el-table-column prop="activityName" label="活动名称" align="center"></el-table-column>
          <el-table-column label="活动时间" align="center" width="350">
            <template #default="scope">
              {{ scope.row.startTime }} ~ {{ scope.row.endTime }}
            </template>
          </el-table-column>
          <el-table-column prop="statusText" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 1" type="info" effect="plain">{{ scope.row.statusText }}</el-tag>
              <el-tag v-else-if="scope.row.status === 2" type="success">{{ scope.row.statusText }}</el-tag>
              <el-tag v-else type="danger">{{ scope.row.statusText }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="winningCount" label="参加次数" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleToDetail(scope.row)">查看</el-button>

              <el-popconfirm
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="真的要清理此条缓存吗？"
                @confirm="handleRefreshCache(scope.row)"
              >
                <template #reference>
                  <el-button type="danger" text bg size="small">清理缓存</el-button>
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
import {type IGetTableData} from "@/api/activity/types/table"
import {usePagination} from "@/hooks/usePagination"
import {getTableDataApi, refreshCache} from "@/api/activity";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

defineOptions({
  name: "Activities"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()

const handleAdd = () => {
  router.push({name: "ActivityAdd"})
}

const handleToDetail = (row: IGetTableData) => {
  router.push({name: "ActivityDetail", params: {id: row.id}})
}

const handleRefreshCache = async (row: IGetTableData) => {
    await refreshCache(row.id).then(() => {
      ElMessage.success("清理成功")
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
