<template>
  <div class="app-container">
    <div class="comments" v-for="comment in props.comments" :id="`comment-${comment.id}`">
      <div class="comment">
        <div class="comment-author vcard">
          <img :src="comment.avatar" alt="用户评论头像" class="img-circle">
          <strong>{{ comment.nickname }} </strong>：
          <span class="datetime">发表于 {{ comment.created_at }}
            <span class="reply">
              <el-button link @click="handleReply(comment)" :aria-label="`回复给${comment.nickname}`">[回复]</el-button>
            </span>
          </span>
        </div>
        <p>{{ comment.content }}</p>
      </div>
      <div class="children" v-if="comment.children">
        <CommentList :comments="comment.children" @handleReply="handleReply"></CommentList>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {PropType} from "vue";
import {IComment} from "@/api/comment/types/table";

defineOptions({
  name: "CommentsList"
})

const props = defineProps({
  comments: {
    type: Object as PropType<IComment[]>,
    required: true
  }
})

const emit = defineEmits(['handleReply'])

const handleReply = (comment: IComment) => {
  emit('handleReply', comment)
}
</script>

<style scoped lang="scss">
.comments {
  border: 1px dashed #7ca4c1;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #d9edf7;
  color: #31708f;
  border-radius: 3px;

  .comment .comment-author .img-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    vertical-align: middle;
  }

  .children {
    padding-left: 40px;
  }

}
</style>
