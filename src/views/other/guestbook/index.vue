<template>
  <Comment :id="1" type="guestbook"/>
</template>

<script lang="ts" setup>
import Comment from "@/components/Comments/Comment.vue"

defineOptions({
  name: "ArticleComment"
})

</script>

<style scoped lang="scss">
</style>
