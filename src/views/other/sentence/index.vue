<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd()">新增句子</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" row-key="id" border default-expand-all>
          <el-table-column prop="author" label="作者" align="center" width="150"></el-table-column>
          <el-table-column prop="content" label="内容" ></el-table-column>
          <el-table-column prop="translation" label="翻译"></el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
          <el-table-column fixed="right" label="操作" width="130">
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
        <Sentence v-model:show-dialog="showDialog" v-model:sentence="sentence" @handleSubmit="handleSubmit"
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
import {type IGetTableData} from "@/api/sentence/types/table"
import {deleteSentence, getTableDataApi, storeSentence, updateSentence} from "@/api/sentence";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {ISentence} from "@/views/other/sentence/components/data";
import Sentence from './components/Sentence.vue'
import {usePagination} from "@/hooks/usePagination";

defineOptions({
  name: "Sentences"
})

const loading = ref<boolean>(false)
const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
const showDialog = ref<boolean>(false)

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()


const defaultSentence = {
  id: 0,
  author: '',
  content: '',
  translation: '',
};

const sentence = ref<ISentence>(Object.assign({}, defaultSentence))

const handleAdd = () => {
  sentence.value = Object.assign({}, defaultSentence)
  showDialog.value = true
}

const handleEdit = (row: IGetTableData) => {
  const {id, author, content, translation} = row
  sentence.value = {id, author, content, translation};
  showDialog.value = true
}

const handleSubmit = () => {
  if (sentence.value.id > 0) {
    updateSentence(sentence.value.id, sentence.value).then(() => {
      ElMessage.success("更新成功")
      showDialog.value = false
      getTableData()
    })
  } else {
    storeSentence(sentence.value).then(() => {
      ElMessage.success("添加成功")
      showDialog.value = false
      getTableData()
    })
  }
}

const handleDelete = (row: IGetTableData) => {
  deleteSentence(row.id).then(() => {
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
