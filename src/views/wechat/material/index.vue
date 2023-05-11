<template>
  <div class="app-container">
    <el-card shadow="never" v-loading="loading">
      <div class="toolbar-wrapper">
        <el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增素材</el-button>
      </div>

      <Waterfall
        :list="tableData"
        :row-key="options.rowKey"
        :gutter="options.gutter"
        :has-around-gutter="options.hasAroundGutter"
        :width="options.width"
        :breakpoints="options.breakpoints"
        :img-selector="options.imgSelector"
        :background-color="options.backgroundColor"
        :animation-effect="options.animationEffect"
        :animation-duration="options.animationDuration"
        :animation-delay="options.animationDelay"
        :lazyload="options.lazyload"
        :load-props="options.loadProps"
      >
        <template #item="{ item, url, index }">
          <div
            class="bg-gray-900 rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-linear hover:shadow-lg hover:shadow-gray-600 group">
            <div class="overflow-hidden">
              <LazyImg :url="item.url"
                       class="cursor-pointer transition-all duration-300 ease-linear group-hover:scale-105"/>
            </div>
            <div class="px-4 pt-2 pb-4 border-t border-t-gray-800">
              <div class="pt-3 flex  items-center border-t border-t-gray-600 border-opacity-50">
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
        </template>
      </Waterfall>

      <Material v-model:show-dialog="showMaterialDialog" v-if="showMaterialDialog" @refresh="getTableData(true)" @handleSubmit="handleSubmit"/>
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
import loadingPng from "@/assets/waterfall/loading.png"
import errorPng from "@/assets/waterfall/error.png"
import {LazyImg, Waterfall} from 'vue-waterfall-plugin-next'
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

const handleSubmit = (goOn: Boolean) => {
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

const options = reactive({
  // 唯一key值
  rowKey: 'id',
  // 卡片之间的间隙
  gutter: 10,
  // 是否有周围的gutter
  hasAroundGutter: true,
  // 卡片在PC上的宽度
  width: 320,
  // 自定义行显示个数，主要用于对移动端的适配
  breakpoints: {
    1200: {
      // 当屏幕宽度小于等于1200
      rowPerView: 4,
    },
    800: {
      // 当屏幕宽度小于等于800
      rowPerView: 3,
    },
    500: {
      // 当屏幕宽度小于等于500
      rowPerView: 2,
    },
  },
  // 动画效果
  animationEffect: 'animate__fadeInUp',
  // 动画时间
  animationDuration: 1000,
  // 动画延迟
  animationDelay: 300,
  // 背景色
  backgroundColor: '#fff',
  // imgSelector
  imgSelector: 'src.original',
  // 加载配置
  loadProps: {
    loadingPng,
    errorPng,
  },
  // 是否懒加载
  lazyload: true,

})

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

</style>
