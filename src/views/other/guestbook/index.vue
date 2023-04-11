<template>
  <Comment :id="1" type="guestbook" />
</template>

<script lang="ts" setup>

defineOptions({
  name: "ArticleComment"
})
import Comment from "@/components/Comments/Comment.vue"

</script>

<style scoped lang="scss">
</style>
