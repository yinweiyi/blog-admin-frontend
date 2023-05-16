<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <div class="toolbar-wrapper">
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增素材</el-button>
      </div>

      <div class="card" v-for="(item,index) in tableData" :key="item.media_id">
        <el-image class="card-image" :src="item.url" :preview-src-list="[item.url]"
                  fit="contain" lazy></el-image>

        <div class="card-footer">
          <div class="text-cut-name">{{ item.name }}</div>
          <div class="flex justify-between align-center">
            <div class="text-gray-50 flex-1">
              <el-button type="primary" :icon="CopyDocument" size="small" style="border-radius:12px; width: 90%"
                         @click="handleCopy(item.media_id)">复制
              </el-button>
            </div>

            <div class="text-gray-50 flex-1">
              <el-popconfirm
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="真的要删除此条数据吗？"
                @confirm="handleDelete(item, index)"
              >
                <template #reference>
                  <el-button type="danger" size="small" :icon="Delete" style="border-radius:12px; width: 90%">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </div>
      </div>

      <Material v-model:show-dialog="showMaterialDialog" v-if="showMaterialDialog" @refresh="getTableData"/>

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

import {onMounted, reactive, ref, watch} from "vue";
import {IMaterial, IGetMaterialParam} from "@/api/wechat/types/type";
import {getMaterial, deleteMaterial} from "@/api/wechat/ofaMaterial";
import {usePagination} from "@/hooks/usePagination";
import {CirclePlus, InfoFilled, CopyDocument, Delete} from "@element-plus/icons-vue"
import Material from "./components/Material.vue"
import {ElMessage} from "element-plus";
import 'vue-waterfall-plugin-next/dist/style.css'
import useClipboard from 'vue-clipboard3';

defineOptions({
  name: "MaterialList"
})

const showMaterialDialog = ref<boolean>(false)

const handleAdd = () => {
  showMaterialDialog.value = true
}

const handleDelete = (row: IMaterial, index: number) => {
  deleteMaterial({media_id: row.media_id}).then(() => {
    ElMessage.success("删除成功")
    tableData.value.splice(index, 1)
  })
}

const {toClipboard} = useClipboard();
const handleCopy = (mediaId: string) => {
  toClipboard(mediaId).then(() => {
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

const {paginationData, handleCurrentChange, handleSizeChange} = usePagination({pageSizes: [15, 30, 45], pageSize: 15})

const emit = defineEmits(['update:showDialog'])

//#region 查
const tableData = ref<IMaterial[]>([])

const formData = reactive<IGetMaterialParam>({
  type: 'image',
  page: paginationData.currentPage,
  pageSize: paginationData.pageSize
})

const loading = ref<boolean>(false)
const getTableData = () => {
  loading.value = true
  formData.page = paginationData.currentPage
  formData.pageSize = paginationData.pageSize
  getMaterial(formData).then(res => {
    paginationData.total = res.data.total
    tableData.value = res.data.list

  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'referrer');
  meta.setAttribute('content', 'no-referrer');
  document.head.appendChild(meta);

})

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})
</script>

<style scoped lang="scss">
.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card {
  width: 240px;
  display: inline-block;
  background: #FFFFFF;
  border: 1px solid #EBEEF5;
  box-shadow: 1px 1px 20px 0 rgba(0, 0, 0, 0.1);
  margin: 0 10px 10px 0;
  vertical-align: top;
  border-radius: 5px;
  box-sizing: border-box;
}

.card:hover {
  border: 2px solid #66b1ff;
  margin-bottom: 6px;
}

.card-image {
  line-height: 170px;
  max-height: 170px;
  width: 100%;
}

.card-preview {
  padding: 20px 0;
  color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-preview-icon {
  font-size: 30px;
  margin-right: 5px;
}

.card-preview-text {
  font-size: 12px;
}

.card-footer {
  color: #ccc;
  font-size: 12px;
  padding: 15px 10px;
}

</style>
