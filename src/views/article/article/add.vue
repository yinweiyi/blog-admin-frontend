<template>
  <div class="app-container">
    <Article v-model:article="article" type="add" @handleSubmit="onSubmit"/>
  </div>
</template>

<script lang="ts" setup>
import Article from './components/Article.vue'
import {ref} from "vue";
import {IArticle} from "@/views/article/article/components/data";
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {storeArticle} from "@/api/article";
defineOptions({
  name: "ArticleAdd"
})
const article = ref<IArticle>({
  title: '',
  slug: '',
  author: 'wayee',
  content_type: 1,
  markdown: '',
  html: '',
  description:  null,
  keywords: '',
  order: 0,
  views: 0,
  category_id: 0,
  tags: [],
  is_top: false,
  is_show: true
})

const router = useRouter()
const onSubmit = () => {
  storeArticle(article.value).then(() => {
    ElMessage.success("添加成功")
    router.push("/article/articles")
  })
}
</script>

<style scoped>

</style>
