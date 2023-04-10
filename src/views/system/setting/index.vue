<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-tabs v-model="activeName" class="setting-tabs" @tab-click="handleClick">
        <el-tab-pane label="站点配置" name="site">
          <Site v-model:setting="setting" v-if="activeName === 'site'" @handleSubmit="handleSubmit"/>
        </el-tab-pane>
        <el-tab-pane label="留言文本" name="guestbook">
          <Guestbook v-model:setting="setting" v-if="activeName === 'guestbook'" @handleSubmit="handleSubmit"/>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>

</template>
<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {getSetting, updateSetting} from "@/api/setting";
import {ElMessage, TabsPaneContext} from "element-plus";
import Site from './components/Site.vue'
import Guestbook from './components/Guestbook.vue'

const activeName = ref('site')
const setting = ref({})

const handleFetch = () => {
  getSetting(activeName.value).then(res => {
    if (res.data) {
      setting.value = res.data
    }
  })
}

onMounted(() => {
  handleFetch()
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.paneName === undefined ? '' : tab.paneName.toString();
  handleFetch()
}

const handleSubmit = () => {
  updateSetting(activeName.value, setting.value).then(() => {
    ElMessage.success('更新成功');
  })
};

</script>
<style>
.setting-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
