<template>
  <div class="app-container">
    <el-card shadow="false">
      <e-rice
        :content="desc"
        placeholder="请输入"
        rich-height="400px"
        edit-preview="edit"
        :toolbars-flag="true"
        @rich-val="getDescription"
      />
    </el-card>
    <el-button @click="getContent">点击获取文章</el-button>
  </div>
</template>

<script setup lang="ts">
import ERice from '@/components/MavonEditor/ERice.vue'
import {ref} from "vue";

const desc = ref('')

const getDescription = (val: string) => {
  desc.value = val;
}
const getContent = () => {
  console.log(desc.value)
}

</script>

<style scoped>

</style>
