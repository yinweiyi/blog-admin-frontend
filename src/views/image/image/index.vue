<template>
  <div class="app-container">
    <div class="toolbar-wrapper">
      <div class="app-form">
        <el-form :model="formData" label-position="right" label-width="100px" :inline="true">
          <el-form-item label="请选择模型">
            <el-select v-model="formData.model_id">
              <el-option :value="0" label="请选择"></el-option>
              <el-option v-for="item in models" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getTableData" type="primary">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增图片</el-button>
    </div>
    <div gutter="10" v-masonry fit-width="false" transition-duration="0.1s" item-selector=".image" class="images">
      <div v-masonry-tile v-for="(item, index) in tableData" class="image" :key="index">
        <el-card>
          <el-icon class="edit-icon"><Edit  @click="handleEdit(item)" /></el-icon>
          <img :src="item.image_url"/>
        </el-card>
      </div>
    </div>

    <Image v-model:show-dialog="showImageDialog" :models="models" v-model:image="image" v-if="showImageDialog"
           @handleSubmit="handleSubmit"/>

  </div>
</template>

<script lang="ts" setup>

import {onMounted, reactive, ref, watch} from "vue";
import {IGetTableData, IGetTableParam} from "@/api/image/types/table";
import {IGetTableData as IModelData} from "@/api/image-model/types/table";
import {getTableDataApi, storeImage, updateImage} from "@/api/image";
import {getTableDataApi as getModelApi} from "@/api/image-model";
import {usePagination} from "@/hooks/usePagination";
import {CirclePlus, Edit} from "@element-plus/icons-vue"
import Image from "./components/Image.vue"
import {IImage} from "@/views/image/image/components/data";
import {ElMessage} from "element-plus";
// import Edit

defineOptions({
  name: "Image"
})


const showImageDialog = ref<boolean>(false)

const defaultImage = {
  id: 0,
  image_url: "",
  width: 0,
  height: 0,
  prompt: "",
  negative_prompt: "",
  cfg_scale: 7,
  steps: 20,
  sampler: "Euler a",
  seed: -1,
  clip_skip: 1,
  order: 0,
  image_model_id: 0
}

const image = ref<IImage>(Object.assign({}, defaultImage))

const handleAdd = () => {
  image.value = Object.assign({}, defaultImage)
  showImageDialog.value = true
}

const handleEdit = (row: IGetTableData) => {
  image.value = row;
  showImageDialog.value = true
}

const handleSubmit = () => {
  if (image.value.id > 0) {
    updateImage(image.value.id, image.value).then(() => {
      ElMessage.success("更新成功")
      showImageDialog.value = false
      getTableData()
    })
  } else {
    storeImage(image.value).then(() => {
      ElMessage.success("添加成功")
      showImageDialog.value = false
      getTableData()
    })
  }
}


const {paginationData, handleCurrentChange, handleSizeChange} = usePagination({pageSize: 15})

const emit = defineEmits(['update:showDialog'])

//#region 查
const tableData = ref<IGetTableData[]>([])

const formData = reactive<IGetTableParam>({
  model_id: undefined,
  page: paginationData.currentPage,
  pageSize: paginationData.pageSize
})

const models = ref<IModelData[]>([])

const getModels = () => {
  getModelApi().then(res => {
    models.value = res.data
  }).catch(() => {
    tableData.value = []
  })
}

const loading = ref<boolean>(false)
const getTableData = () => {
  loading.value = true
  formData.page = paginationData.currentPage
  formData.pageSize = paginationData.pageSize
  getTableDataApi(formData).then(res => {
    paginationData.total = res.data.total
    tableData.value.push(...res.data.list)
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
        getTableData();
      }
    }
  }


}


onMounted(() => {
  getModels()
  document.querySelector('.app-main')?.addEventListener('scroll', onScroll);
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

.images {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  padding: 5px;

  .image {
    width: 24%;
    border-radius: 5px;
    box-shadow: 0 5px 5px 1px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    &:hover{
      .edit-icon {
        display: block;
      }
    }

    .edit-icon {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #1b1c1f;
      display: none;
      cursor: pointer;
    }

    img {
      width: 100%;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
  }
}

</style>
