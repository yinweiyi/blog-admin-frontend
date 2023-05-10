<template>
  <div class="app-container">
    <el-card shadow="never">
      <div id="app-menu">
        <!-- v-loading="loading" -->
        <!-- 预览窗 -->
        <div class="weixin-preview">
          <div class="weixin-bd">
            <div class="weixin-header">公众号菜单</div>
            <ul class="weixin-menu" id="weixin-menu">
              <li v-for="(btn, i) in menus.button" :key="i" class="menu-item"
                  :class="{ 'current': formRef.selectedMenuIndex === i && formRef.selectedMenuLevel === 1 }"
                  @click="selectMenu(i)">
                <div class="menu-item-title">
                  <span>{{ btn.name }}</span>
                </div>
                <ul class="weixin-sub-menu">
                  <li v-for="(sub, i2) in btn.sub_button" :key="i2" class="menu-sub-item"
                      :class="{ 'current': formRef.selectedMenuIndex === i && formRef.selectedSubMenuIndex === i2 && formRef.selectedMenuLevel === 2, 'on-drag-over': formRef.onDragOverMenu === (i + '_' + i2) }"
                      @click.stop="selectSubMenu(i, i2)" draggable="true" @dragstart="selectSubMenu(i, i2)"
                      @dragover.prevent="formRef.onDragOverMenu = (i + '_' + i2)" @drop="onDrop(i, i2)">
                    <div class="menu-item-title">
                      <span>{{ sub.name }}</span>
                    </div>
                  </li>
                  <li v-if="btn.sub_button && btn.sub_button.length < 5" class="menu-sub-item"
                      :class="{ 'on-drag-over': formRef.onDragOverMenu === (i + '_' + btn.sub_button.length) }"
                      @click.stop="addMenu(2, i)"
                      @dragover.prevent="formRef.onDragOverMenu = (i + '_' + btn.sub_button.length)"
                      @drop="onDrop(i, btn.sub_button.length)">
                    <div class="menu-item-title">
                      <el-icon>
                        <Plus/>
                      </el-icon>
                    </div>
                  </li>
                  <i class="menu-arrow arrow_out"></i>
                  <i class="menu-arrow arrow_in"></i>
                </ul>
              </li>
              <li class="menu-item" v-if="menus.button.length < 3" @click="addMenu(1, 0)">
                <el-icon>
                  <Plus/>
                </el-icon>
              </li>
            </ul>
          </div>
        </div>
        <!-- 菜单编辑器 -->
        <div class="weixin-menu-detail" v-if="formRef.selectedMenuLevel > 0">
          <!--          <wx-menu-button-editor :button="selectedButton" :selectedMenuLevel="selectedMenuLevel"-->
          <!--                                 @delMenu="delMenu"></wx-menu-button-editor>-->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from "vue";
import * as MenuType from "@/api/wechat/types/type";
import {getMenu} from "@/api/wechat/ofaMenu";
import {ElMessage} from "element-plus";
import {Plus} from "@element-plus/icons-vue";

defineOptions({
  name: "OfficialAccountMenu"
})

const menus = ref<MenuType.Menu>({button: []})

const formRef = reactive({
  selectedMenuIndex: 0,//当前选中菜单索引
  selectedSubMenuIndex: 0,//当前选中子菜单索引
  selectedMenuLevel: 0,//选中菜单级别
  selectedButton: '',//选中的菜单按钮
  onDragOverMenu: '' //当前鼠标拖动到的位置
})

const selectMenu = (i: number) => {
  formRef.selectedMenuLevel = 1
  formRef.selectedSubMenuIndex = 0
  formRef.selectedMenuIndex = i
  formRef.selectedButton = menus.value.button[i]
}

const unSelectMenu = () => {//不选中任何菜单
  formRef.selectedMenuLevel = 0
  formRef.selectedMenuIndex = 0
  formRef.selectedSubMenuIndex = 0
  formRef.selectedButton = ''
}

//选中子菜单
const selectSubMenu = (i: number, i2: number) => {
  formRef.selectedMenuLevel = 2
  formRef.selectedMenuIndex = i
  formRef.selectedSubMenuIndex = i2
  formRef.selectedButton = menus.value.button[i].sub_button[i2]
}

const onDrop = (i: number, i2: number) => {//拖拽移动位置
  formRef.onDragOverMenu = '';
  if (i == formRef.selectedMenuIndex && i2 == formRef.selectedSubMenuIndex) //拖拽到了原位置
    return
  if (i != formRef.selectedMenuIndex && menus.value.button[i].sub_button.length >= 5) {
    ElMessage.error('目标组已满');
    return
  }
  menus.value.button[i].sub_button.splice(i2, 0, formRef.selectedButton)
  let delSubIndex = formRef.selectedSubMenuIndex
  if (i == formRef.selectedMenuIndex && i2 < formRef.selectedSubMenuIndex)
    delSubIndex++
  menus.value.button[formRef.selectedMenuIndex].sub_button.splice(delSubIndex, 1);
  unSelectMenu()
}

//添加菜单
const addMenu = (level: number, i: number) => {
  if (level == 1 && menus.value.button.length < 3) {
    menus.value.button.push({
      "type": "view",
      "name": "菜单名称",
      "sub_button": [],
      "url": ""
    })
    selectMenu(menus.value.button.length - 1)
  }
  if (level == 2 && menus.value.button[i].sub_button.length < 5) {
    menus.value.button[i].sub_button.push({
      "type": "view",
      "name": "子菜单名称",
      "url": ""
    })

    selectSubMenu(i, menus.value.button[i].sub_button.length - 1)
  }
}

const getWxMenu = () => {
  getMenu().then(res => {
    menus.value = res.data
    menus.value.button = menus.value.button.map(i => {
      if (i.sub_button == null) {
        i.sub_button = []
      }
      return i;
    })
  })
}


onMounted(() => {
  getWxMenu()
})
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

#app-menu {
  overflow: hidden;
  width: 100%;

  ul {
    padding: 0;

    li {
      list-style: none;
    }
  }
}


.weixin-preview {
  position: relative;
  width: 320px;
  height: 540px;
  float: left;
  margin-right: 10px;
  border: 1px solid #e7e7eb;

  a {
    text-decoration: none;
    color: #616161;
  }

  //.weixin-hd .weixin-title {
  //  color: #fff;
  //  font-size: 15px;
  //  width: 100%;
  //  text-align: center;
  //  position: absolute;
  //  top: 33px;
  //  left: 0;
  //}

  .weixin-header {
    text-align: center;
    padding: 10px 0;
    background-color: #616161;
    color: #ffffff;
  }

  .weixin-menu {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #e7e7e7;
    background-position: 0 0;
    background-repeat: no-repeat;
    margin-bottom: 0;

    .menu-item {
      position: relative;
      float: left;
      line-height: 50px;
      height: 50px;
      text-align: center;
      width: 33.33%;
      border-left: 1px solid #e7e7e7;
      cursor: pointer;
      color: #616161;
    }
  }

  .weixin-sub-menu {
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    border-top: 1px solid #d0d0d0;
    margin-bottom: 0;
    background: #fafafa;
    display: block;
    padding: 0;

    .menu-sub-item {
      line-height: 50px;
      height: 50px;
      text-align: center;
      width: 100%;
      border: 1px solid #d0d0d0;
      border-top-width: 0;
      cursor: pointer;
      position: relative;
      color: #616161;

      &.on-drag-over {
        border-top: 2px solid #44b549;
      }
    }
  }

  .menu-arrow {
    position: absolute;
    left: 50%;
    margin-left: -6px;
  }

  .arrow_in {
    bottom: -4px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px 6px 0;
    border-style: solid dashed dashed;
    border-color: #fafafa transparent transparent;
  }

  .arrow_out {
    bottom: -5px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px 6px 0;
    border-style: solid dashed dashed;
    border-color: #d0d0d0 transparent transparent;
  }

  .menu-item .menu-item-title, .menu-sub-item .menu-item-title {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }

  .menu-item.current, .menu-sub-item.current {
    border: 1px solid #44b549;
    background: #fff;
    color: #44b549;
  }

  .menu-item:hover {
    color: #000;
  }

  .menu-sub-item:hover {
    background: #eee;
  }

  li.current:hover {
    background: #fff;
    color: #44b549;
  }

}
</style>
