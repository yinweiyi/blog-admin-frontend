<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
          <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增模型</el-button>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" row-key="id" border default-expand-all>
          <el-table-column prop="name" label="模型名" align="center"></el-table-column>
          <el-table-column prop="size" label="模型大小(M)" align="center" width="120"></el-table-column>
          <el-table-column prop="order" label="排序" align="center" sortable width="80"></el-table-column>
          <el-table-column label="下载地址" align="center">
            <template #default="{row}">
              <a :href="row.download_url" target="_blank">{{ row.download_url }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" align="center"/>
          <el-table-column fixed="right" label="操作" width="240" align="center">
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
        <ImageModel v-model:show-dialog="showDialog" v-model:imageModel="imageModel" @handleSubmit="handleSubmit"
                    v-if="showDialog"/>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue"
import {type IGetTableData} from "@/api/image-model/types/table"
import {deleteImageModel, getTableDataApi, storeImageModel, updateImageModel} from "@/api/image-model";
import {CirclePlus, InfoFilled} from "@element-plus/icons-vue"
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {IImageModel} from "@/views/image/model/components/data";
import ImageModel from './components/ImageModel.vue'

defineOptions({
  name: "ImageModels"
})

const loading = ref<boolean>(false)
const showDialog = ref<boolean>(false)

//#region 查
const tableData = ref<IGetTableData[]>([])
const router = useRouter()

const defaultImageModel = {
  id: 0,
  size: 0,
  order: 0,
  name: '',
  download_url: '',
  default_prompt: '',
  default_negative_prompt: '',
  description: ''
};

const imageModel = ref<IImageModel>(Object.assign({}, defaultImageModel))

const handleAdd = () => {
  imageModel.value = Object.assign({}, defaultImageModel)
  showDialog.value = true
}

const handleEdit = (row: IGetTableData) => {
  imageModel.value = row;
  showDialog.value = true
}

const handleSubmit = () => {
  if (imageModel.value.id > 0) {
    updateImageModel(imageModel.value.id, imageModel.value).then(() => {
      ElMessage.success("更新成功")
      showDialog.value = false
      getTableData()
    })
  } else {
    storeImageModel(imageModel.value).then(() => {
      ElMessage.success("添加成功")
      showDialog.value = false
      getTableData()
    })
  }
}

const handleDelete = (row: IGetTableData) => {
  deleteImageModel(row.id).then(() => {
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
