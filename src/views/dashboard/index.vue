<template>
  <div class="app-container" v-loading="loading">
    <el-row>
      <el-col :span="12">
        <el-card class="card-container">
          <template #header>
            <div class="card-header">
              <span>系统信息</span>
            </div>
          </template>
          <el-table :data="dashboard.systems" :show-header="false">
            <el-table-column align="right" width="120">
              <template #default="{row}">
               {{ row[0] }}
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{row}">
                {{ row[1] }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="card-container">
          <template #header>
            <div class="card-header">
              <span>框架</span>
            </div>
          </template>
          <el-table :data="dashboard.frameworks" :show-header="false">
            <el-table-column align="right" width="150">
              <template #default="{row}">
                {{ row[0] }}
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="{row}">
                <span v-if="typeof row[1] === 'string'">{{ row[1] }}</span>
                <div v-else>
                  <el-tag class="tag-item" v-for="item in row[1]" :type="item['type']">{{ item['text'] }}</el-tag>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="card-container">
      <template #header>
        <div class="card-header">
          <span>扩展</span>
        </div>
      </template>
      <el-table :data="dashboard.extends" :show-header="false">
        <el-table-column align="right" width="120">
          <template #default="{row}">
            {{ row[0] }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="80">
          <template #default="{row}">
            <el-tag class="tag-item" :type="row[1]['type']">{{ row[1]['text'] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="100">
          <template #default="{row}">
            {{ row[2] }}
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="{row}">
            {{ row[3] }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from "vue";
import {getDashboard} from "@/api/dashboard";

const loading = ref(true)

const dashboard = reactive({
  systems: [],
  frameworks: [],
  extends: []
})

getDashboard().then((res: any) => {
  dashboard.systems = res.data.systems
  dashboard.frameworks = res.data.frameworks
  dashboard.extends = res.data.extends
}).finally(() => {
  loading.value = false
})
</script>

<style lang="scss" scoped>
.card-container {
  margin: 5px;
}
.tag-item {
  margin-right: 5px;
}
</style>
