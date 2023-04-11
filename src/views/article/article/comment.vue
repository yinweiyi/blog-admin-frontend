<template>
  <Comment :id="id" type="article"/>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import Comment from "@/components/Comments/Comment.vue"

defineOptions({
  name: "ArticleComment"
})

const route = useRoute();
const id = +route.params.id;
</script>

<style scoped lang="scss">
</style>
