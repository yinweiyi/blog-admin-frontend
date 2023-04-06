<template>
  <div class="rich" :style="{ width: width }">
    <mavon-editor
      ref="mavon"
      v-model="value"
      :toolbars="markdownOption"
      :toolbars-flag="toolbarsFlag"
      :subfield="editPreview === 'edit'"
      preview-background="#fff"
      :box-shadow="false"
      :autofocus="autofocus"
      :placeholder="placeholder"
      :style="{ 'min-height': height }"
      :ishljs="true"
      :default-open="defaultopen"
      style="height: 100%; width: 100%"
      :image-click="imageClick"
      @change="change"
      @img-add="imgAdd"
    />
  </div>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue';
import {upload} from "@/api/common/file";

// import Api from '@/apis';
const props = withDefaults(
  defineProps<{
    content?: string;
    richHeight?: string;
    editPreview?: string;
    placeholder?: string;
    autofocus?: boolean;
    width?: string;
  }>(),
  {
    content: '',
    richHeight: '300px',
    editPreview: 'preview',
    placeholder: '',
    autofocus: false,
    width: '100%',
  },
);

const emit = defineEmits<{ (e: 'richVal', value: any): void }>();
const mavon = ref();
const value = ref('');
const height = ref('200px');
const toolbarsFlag = ref(false);
const defaultopen = ref('preview');
const showViewer = ref(false);
const previewImg = ref<any>([]);
const markdownOption = ref({
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
  mark: true, // 标记
  superscript: true, // 上角标
  subscript: true, // 下角标
  quote: true, // 引用
  ol: true, // 有序列表
  ul: true, // 无序列表
  link: true, // 链接
  imagelink: true, // 图片链接
  code: true, // code
  table: true, // 表格
  fullscreen: true, // 全屏编辑
  readmodel: true, // 沉浸式阅读
  htmlcode: true, // 展示html源码
  // help: true, // 帮助
  undo: true, // 上一步
  redo: true, // 下一步
  trash: true, // 清空
  save: false, // 保存（触发events中的save事件）
  navigation: true, // 导航目录
  alignleft: true, // 左对齐
  aligncenter: true, // 居中
  alignright: true, // 右对齐
  subfield: true, // 单双栏模式
  preview: true, // 预览
});
watch(
  () => props.editPreview,
  (val) => {
    defaultopen.value = val;
    toolbarsFlag.value = val === 'edit';
  },
  {immediate: true, deep: true},
);
watch(
  () => props.content,
  (val) => {
    value.value = val;
  },
  {immediate: true, deep: true},
);
watch(
  () => props.richHeight,
  (val) => {
    height.value = val;
  },
  {immediate: true, deep: true},
);
// 后端接口设计为base64存储
const imgAdd = (pos: number, $file: any) => {
  let formData = new FormData();
  formData.append('file', $file);

  upload(formData).then(res => {
    mavon.value.$img2Url(pos, res.data.link);
  })
};
const change = (val: string, val1: string) => {
  emit('richVal', val);
};
const imageClick = (data: any) => {
  previewImg.value = [];
  previewImg.value.push(data.src);
  showViewer.value = true;
  document.documentElement.style.overflowY = 'hidden ';
};
</script>
<style scoped lang="scss">
.rich {
  width: 100%;
  height: 100%;
  line-height: 30px;

  :deep(.v-note-wrapper) {
    .v-note-op .v-left-item,
    .v-right-item {
      flex: none !important;
      -webkit-flex: none !important;
      -ms-flex: none !important;
      flex-wrap: wrap;
    }
  }

  img{
    width: 100px;
  }
}
</style>

