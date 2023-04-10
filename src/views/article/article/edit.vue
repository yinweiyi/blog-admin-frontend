<template>
  <div class="app-container">
    <Article v-model:article="article" type="edit" @handleSubmit="onSubmit"/>
  </div>
</template>

<script lang="ts" setup>
import Article from './components/Article.vue'
import {onMounted, ref} from "vue";
import {IArticle} from "@/views/article/article/components/data";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import {getArticle, updateArticle} from "@/api/article";
defineOptions({
  name: "ArticleEdit"
})
const article = ref<IArticle>({
  title: '',
  slug: '',
  author: '',
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

const route = useRoute();
const id = +route.params.id;

const fetchDetail = async () => {
  const {data} = await getArticle(id)
  article.value = data
}

onMounted(() => {
  fetchDetail()
})

const router = useRouter()
const onSubmit = () => {
  updateArticle(id, article.value).then(() => {
    ElMessage.success("更新成功")
    router.push("/article/articles")
  })
}
</script>

<style scoped>

</style>
