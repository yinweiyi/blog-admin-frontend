<template>
  <div class="rich" :style="{ width: width }">
    <mavon-editor
      ref="mavon"
      v-model="value"
      :toolbars="markdownOption"
      :toolbars-flag="toolbarsFlag"
      :subfield="editPreview === 'edit'"
      preview-background="#fff"
      :box-shadow="true"
      :autofocus="autofocus"
      :placeholder="placeholder"
      :style="{ 'height': height, 'width': '100%', 'z-index': 0 }"
      :ishljs="true"
      :default-open="defaultOpen"
      @change="change"
      @img-add="imgAdd"
    />
  </div>
</template>
<script setup lang="ts">
import {ref, watch} from 'vue';
import {upload} from "@/api/common/file";
import 'mavon-editor/dist/css/index.css';

// import Api from '@/apis';
const props = withDefaults(
  defineProps<{
    content?: string;
    html?: string;
    richHeight?: string;
    editPreview?: string;
    placeholder?: string;
    autofocus?: boolean;
    width?: string;
  }>(),
  {
    content: '',
    html: '',
    richHeight: '300px',
    editPreview: 'preview',
    placeholder: '',
    autofocus: false,
    width: '100%',
  },
);

const emit = defineEmits(['update:content']);
const mavon = ref();
const value = ref('');
const height = ref('200px');
const toolbarsFlag = ref(false);
const defaultOpen = ref('preview');
const markdownOption = ref({
  bold: true, // 粗体
  italic: true, // 斜体
  header: true, // 标题
  underline: true, // 下划线
  strikethrough: true, // 中划线
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
  preview: true, // 预览
});
watch(
  () => props.editPreview,
  (val) => {
    defaultOpen.value = val;
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
const change = (val: string) => {
  emit('update:content', val);
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

  img {
    width: 100px;
  }
}
</style>

