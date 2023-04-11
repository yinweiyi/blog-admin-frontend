<template>
  <div class="app-container" ref="appContainer">
    <el-card shadow="never">
      <h3> {{ tableData.title }} : 目前有 {{ tableData.total }} 条评论</h3>

      <CommentList :comments="tableData.list" @handleReply="handleReply"/>

      <el-pagination
        background
        :layout="paginationData.layout"
        :page-sizes="paginationData.pageSizes"
        :total="paginationData.total"
        :page-size="paginationData.pageSize"
        :currentPage="paginationData.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <div class="comment-reply-container" ref="replyContainer">
        <div class="comment-reply-user" v-if="replyComment.id > 0">
          回复：{{ replyComment.nickname }}
        </div>
        <div class="form-comment">
          <el-form :model="replyForm" ref="formRef" label-position="right">
            <el-form-item>
              <el-input type="textarea" rows="5" v-model="replyForm.comment"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button :disabled="replyForm.parent_id === 0 || replyForm.comment === ''" @click="onReplyForm">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {getTableDataApi, reply} from "@/api/comment";
import {ref, watch} from "vue";
import {IGetTableResponseData, IGetTableRequestData, IReply, IComment} from "@/api/comment/types/table";
import {usePagination} from "@/hooks/usePagination";
import CommentList from "@/components/Comments/CommentList.vue"
import {ElMessage} from "element-plus";

defineOptions({
  name: "Comment"
})

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

const params = ref<IGetTableRequestData>({
  id: props.id,
  type: props.type,
  page: 1
})

const tableData = ref<IGetTableResponseData>({
  title: '',
  list: [],
  total: 0
})

const replyForm = ref<IReply>({
  parent_id: 0,
  comment: ''
})

const replyContainer = ref()

const replyComment = ref<IComment>({
  id: 0,
  content: '',
  avatar: '',
  nickname: '',
  email: '',
  created_at: '',
  children: []
})

const handleReply = (comment: IComment) => {
  replyComment.value = comment
  replyForm.value.parent_id = comment.id
  document.querySelector('.app-main')?.scrollTo(0, replyContainer.value.offsetTop)
}

const onReplyForm = () => {
  if (replyForm.value.parent_id === 0 || replyForm.value.comment === '') {
    ElMessage.error('回复内容不能为空')
    return
  }
  reply(replyForm.value).then(() => {
    ElMessage.success('回复成功')
    getTableData();
  })
}

const getTableData = () => {
  params.value.page = paginationData.currentPage
  getTableDataApi(params.value).then((res) => {
    tableData.value = res.data
    paginationData.total = res.data.total
  })
}

const {paginationData, handleCurrentChange, handleSizeChange} = usePagination()
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, {immediate: true})

</script>

<style scoped lang="scss">
.comment-reply-container {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(97, 97, 97, .48);

  .comment-reply-user {
    color: #337ab7;
    margin-bottom: 5px;
  }
}
</style>
