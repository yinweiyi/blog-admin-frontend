<template>
  <div class="app-container">
    <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
      <div class="menu-name">{{ button.name }}</div>
      <div class="menu-del" @click="$emit('delMenu')">删除菜单</div>
    </div>
    <div class="menu-input-group">
      <div class="menu-label">菜单名称</div>
      <div class="menu-input">
        <input type="text" name="name" placeholder="请输入菜单名称" class="menu-input-text" v-model="button.name"
               @input="checkMenuName(button.name)">
        <p class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</p>
        <p class="menu-tips">字数不超过{{ props.selectedMenuLevel === 1 ? '5' : '8' }}个汉字</p>
      </div>
    </div>
    <div v-show="!button.subButtons || button.subButtons.length === 0">
      <div class="menu-input-group">
        <div class="menu-label">菜单内容</div>
        <div class="menu-input">
          <select v-model="button.type" name="type" class="menu-input-text">
            <option value="view">跳转网页(view)</option>
            <option value="media_id">发送消息(media_id)</option>
            <option value="miniprogram">打开指定小程序(miniprogram)</option>
            <option value="click">自定义点击事件(click)</option>
          </select>
        </div>
      </div>
      <div class="menu-content" v-if="button.type === 'view'">
        <div class="menu-input-group">
          <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>
          <div class="menu-label">页面地址</div>
          <div class="menu-input">
            <input type="text" placeholder="" class="menu-input-text" v-model="button.url">
          </div>
        </div>
      </div>
      <div class="menu-content" v-else-if="button.type === 'media_id'">
        <div class="menu-input-group">
          <p class="menu-tips">订阅者点击该菜单会收到以下图文消息</p>
          <div class="menu-label">media_id</div>
          <div class="menu-input">
            <input type="text" placeholder="图文消息media_id" class="menu-input-text" v-model="button.mediaId">
          </div>
        </div>
      </div>
      <div class="menu-content" v-else-if="button.type === 'miniprogram'">
        <div class="menu-input-group">
          <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
          <div class="menu-label">小程序appId</div>
          <div class="menu-input">
            <input type="text" placeholder="小程序的appId（仅认证公众号可配置）" class="menu-input-text"
                   v-model="button.appid">
          </div>
        </div>
        <div class="menu-input-group">
          <div class="menu-label">小程序路径</div>
          <div class="menu-input">
            <input type="text" placeholder="小程序的页面路径 pages/index/index" class="menu-input-text"
                   v-model="button.pagepath">
          </div>
        </div>
        <div class="menu-input-group">
          <div class="menu-label">备用网页</div>
          <div class="menu-input">
            <input type="text" placeholder="" class="menu-input-text" v-model="button.url">
            <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>
          </div>
        </div>
      </div>
      <div class="menu-content" v-else>
        <div class="menu-input-group">
          <p class="menu-tips">用于消息接口推送，不超过128字节</p>
          <div class="menu-label">菜单KEY值</div>
          <div class="menu-input">
            <input type="text" placeholder="" class="menu-input-text" v-model="button.key">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";

defineOptions({
  name: "MenuButtonEditor"
})

const props = defineProps({
  selectedMenuLevel: {
    type: Number,
    default: 1
  },
  button: {
    type: Object,
    required: true
  }
})

const menuNameBounds = ref(false)

//检查菜单名称长度
const checkMenuName = (val: string) => {
  if (props.selectedMenuLevel == 1 && getMenuNameLen(val) <= 10) {
    menuNameBounds.value = false
  } else if (props.selectedMenuLevel == 2 && getMenuNameLen(val) <= 16) {
    menuNameBounds.value = false
  } else {
    menuNameBounds.value = true
  }
}

const getMenuNameLen = (val: string) => {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    let a = val.charAt(i);
    a.match(/[^\x00-\xff]/ig) != null ? len += 2 : len += 1;
  }
  return len;
}


</script>

<style scoped lang="scss">
.menu-name {
  float: left;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}
.menu-del {
  float: right;
  height: 40px;
  line-height: 40px;
  color: #459ae9;
  cursor: pointer;
}

.menu-input-group {
  width: 540px;
  margin: 10px 0 30px 0;
  overflow: hidden;
}

.menu-label {
  float: left;
  height: 30px;
  line-height: 30px;
  width: 80px;
  text-align: right;
}

.menu-input {
  float: left;
  width: 380px;
}

.menu-input-text {
  border: 0;
  outline: 0;
  background: #fff;
  width: 300px;
  padding: 5px 0 5px 0;
  margin-left: 10px;
  text-indent: 10px;
  height: 35px;
}

.menu-tips {
  color: #8d8d8d;
  padding-top: 4px;
  margin: 0;

  &.cursor {
    color: #459ae9;
    cursor: pointer;
  }
}

.menu-input .menu-tips {
  margin: 0 0 0 10px;
}

.menu-content {
  padding: 16px 20px;
  border: 1px solid #e7e7eb;
  background-color: #fff;

  .menu-input-group {
    margin: 0 0 10px 0;
  }

  .menu-label {
    text-align: left;
    width: 100px;
  }

  .menu-input-text {
    border: 1px solid #e7e7eb;
  }

  .menu-tips {
    padding-bottom: 10px;
  }
}


.menu-msg-content {
  padding: 0;
  border: 1px solid #e7e7eb;
  background-color: #fff;

  .menu-msg-head {
    overflow: hidden;
    border-bottom: 1px solid #e7e7eb;
    line-height: 38px;
    height: 38px;
    padding: 0 20px;
  }

  .menu-msg-panel {
    padding: 30px 50px;
  }

  .menu-msg-select {
    padding: 40px 20px;
    border: 2px dotted #d9dadc;
    text-align: center;
  }

  .menu-msg-select:hover {
    border-color: #b3b3b3;
  }

  strong {
    display: block;
    padding-top: 3px;
    font-weight: 400;
    font-style: normal;
  }

  .menu-msg-title {
    float: left;
    width: 310px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
