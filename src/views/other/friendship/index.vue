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
          <el-table-column prop="title" label="标题" align="center"></el-table-column>
          <el-table-column prop="link" label="链接" align="center"></el-table-column>
          <el-table-column label="是否开启" align="center">
            <template #default="{row}">
              <el-switch
                v-model="row.status"
                class="ml-2"
                :loading="changeStatusLoading"
                @change="handleChangeStatus(row)"
              />
            </template>
          </el-table-column>
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
        <Friendship v-model:show-dialog="showDialog" v-model:friendship="friendship" @handleSubmit="handleSubmit"
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
import {ref, watch} from "vue"
import {type IGetTableData} from "@/api/friendship/types/table"
import {deleteFriendship, getTableDataApi, storeFriendship, updateFriendship, updateStatus} from "@/api/friendship";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {IFriendship} from "@/views/other/friendship/components/data";
import Friendship from './components/Friendship.vue'
import {usePagination} from "@/hooks/usePagination";

defineOptions({
  name: "Friendships"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const showDialog = ref<boolean>(false)
const changeStatusLoading = ref<boolean>(false)

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()


const defaultFriendship = {
  id: 0,
  title: '',
  link: '',
  status: true,
  order: 0,
  description: '',
};

const friendship = ref<IFriendship>(Object.assign({}, defaultFriendship))

const handleAdd = () => {
  friendship.value = Object.assign({}, defaultFriendship)
  showDialog.value = true
}

const handleEdit = (row: IGetTableData) => {
  const {id, title, link, status, order, description} = row
  friendship.value = {id, title, link, status, order, description};
  showDialog.value = true
}

const handleSubmit = () => {
  if (friendship.value.id > 0) {
    updateFriendship(friendship.value.id, friendship.value).then(() => {
      ElMessage.success("更新成功")
      showDialog.value = false
      getTableData()
    })
  } else {
    storeFriendship(friendship.value).then(() => {
      ElMessage.success("添加成功")
      showDialog.value = false
      getTableData()
    })
  }
}

const handleDelete = (row: IGetTableData) => {
  deleteFriendship(row.id).then(() => {
    ElMessage.success("删除成功")
    getTableData();
  })
}

const handleChangeStatus = (row: IGetTableData) => {
  changeStatusLoading.value = true;
  updateStatus(row.id, {status: row.status}).then(() => {
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
