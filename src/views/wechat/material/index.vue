<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <div class="toolbar-wrapper">
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增素材</el-button>
      </div>

      <div class="card" v-for="item in tableData" :key="item.media_id">
        <el-image class="card-image" :src="item.url" :preview-src-list="[item.url]"
                  fit="contain" lazy></el-image>

        <div class="card-footer">
          <div class="text-cut-name">{{ item.name }}</div>
          <div class="flex justify-between align-center">
            <div class="text-gray-50 flex-1">
              <el-button type="primary" :icon="Edit" size="small" style="border-radius:12px; width: 90%"
                         @click.stop="handleCopy(item)">
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
                  </el-button>
                </template>
              </el-popconfirm>
            </div>


          </div>
        </div>
      </div>

      <Material v-model:show-dialog="showMaterialDialog" v-if="showMaterialDialog" @refresh="getTableData(true)"/>
    </el-card>
  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref} from "vue";
import {IMaterial, IGetMaterialParam} from "@/api/wechat/types/type";
import {getMaterial, deleteMaterial} from "@/api/wechat/ofaMaterial";
import {usePagination} from "@/hooks/usePagination";
import {CirclePlus, InfoFilled, Edit, Delete} from "@element-plus/icons-vue"
import Material from "./components/Material.vue"
import {ElMessage} from "element-plus";
import 'vue-waterfall-plugin-next/dist/style.css'

defineOptions({
  name: "MaterialList"
})


const showMaterialDialog = ref<boolean>(false)


const handleAdd = () => {
  showMaterialDialog.value = true
}

const handleDelete = (row: IMaterial, index: number) => {
  deleteMaterial(row.media_id).then(() => {
    ElMessage.success("删除成功")
    tableData.value.splice(index, 1)
  })
}


const handleCopy = (row: IMaterial) => {
  // storeMaterial(image.value).then(() => {
  //   ElMessage.success("添加成功")
  //   if (goOn) {
  //     image.value.image_url = ''
  //   } else {
  //     showMaterialDialog.value = false
  //   }
  //   tableData.value.unshift(image.value)
  // })
}


const {paginationData, handleCurrentChange, handleSizeChange} = usePagination({pageSize: 15})

const emit = defineEmits(['update:showDialog'])

//#region 查
const tableData = ref<IMaterial[]>([])

const formData = reactive<IGetMaterialParam>({
  type: 'image',
  page: paginationData.currentPage,
  pageSize: paginationData.pageSize
})

const loading = ref<boolean>(false)
const getTableData = (refresh: boolean) => {
  loading.value = true
  if (refresh) {
    paginationData.currentPage = 1
  }
  formData.page = paginationData.currentPage
  formData.pageSize = paginationData.pageSize
  getMaterial(formData).then(res => {
    paginationData.total = res.data.total
    if (refresh) {
      tableData.value = res.data.list
    } else {
      tableData.value.push(...res.data.list)
    }

  }).finally(() => {
    loading.value = false
  })
}

const onScroll = () => {
  let appMain = document.querySelector('.app-main')

  if (appMain !== null) {
    const scrollTop = appMain.scrollTop; // 滚动距离
    const scrollHeight = appMain.scrollHeight; // 元素总高度（含滚动部分）
    const clientHeight = appMain.clientHeight; // 元素可视高度
    if (scrollTop + clientHeight + 5 >= scrollHeight) {
      // 已滚动到最底部
      if (loading.value === false && Math.ceil(paginationData.total / paginationData.pageSize) > paginationData.currentPage) {
        paginationData.currentPage++
        getTableData(false)
      }
    }
  }
}

onMounted(() => {
  document.querySelector('.app-main')?.addEventListener('scroll', onScroll);
  getTableData(true)
})
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
