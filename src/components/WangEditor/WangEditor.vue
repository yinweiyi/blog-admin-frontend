<template>
  <div class="wang-edit-container">
    <div ref="editorEle" style="text-align: left"></div>
  </div>
</template>

<script lang="ts">
import E from 'wangeditor'
import {defineComponent, onMounted, ref, watch} from "vue";
import {upload} from "@/api/common/file";
import {ElMessage} from "element-plus";

const createEditorEffect = (props: any, context: any, editorEle: any) => {

  const editor = new E(editorEle.value)

  // 配置 onchange 回调函数
  editor.config.onblur = function (newHtml: string) {
    context.emit('update:content', newHtml)
  };
  // 配置触发 onchange 的时间频率，默认为 200ms
  editor.config.onchangeTimeout = 500; // 修改为 500ms

  editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
  // 配置 server 接口地址
  editor.config.customUploadImg = function (resultFiles: any, insertImgFn: any) {
    // resultFiles 是 input 中选中的文件列表
    // insertImgFn 是获取图片 url 后，插入到编辑器的方法
    const formData = new FormData()
    resultFiles.forEach((file: any) => {
      formData.append('file', file)
    })

    upload(formData).then(res => {
      insertImgFn(res.data.link)
    }).catch(() => {
      ElMessage.error('上传失败.')
    })
  }
  editor.create()
  editor.txt.html(props.content)
  return editor
}

export default defineComponent({
  name: "WangEditor",
  props: ['content'],
  setup(props, context) {
    const editorEle = ref(null)
    const editor = ref()
    onMounted(() => {
      editor.value = createEditorEffect(props, context, editorEle)
    })

    watch(() => props.content, (newValue) => {
      editor.value.txt.html(newValue)
    })
    return {editorEle}
  }
})
</script>

<style scoped>

</style>
