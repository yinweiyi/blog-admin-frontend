<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form :model="formData" ref="formRef" label-position="right" label-width="150px" :rules="formRules"
               :disabled="props.type === 'detail'">
        <el-form-item label="用户名：" prop="name">
          <el-input class="form-input" v-model="formData.name" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="账号：" prop="account">
          <el-input class="form-input" v-model="formData.account" placeholder="请输入账号"/>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input class="form-input" v-model="formData.password" placeholder="请输入密码" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码：" prop="password_confirmation">
          <el-input class="form-input" v-model="formData.password_confirmation" placeholder="请再输入一次密码"
                    type="password"/>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <el-form-item style="padding-left: 150px">
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button style="margin-left: 10px" @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, PropType, ref, reactive} from "vue";
import {IAdministrator} from "@/views/system/administrator/components/data";
import {FormInstance, FormRules} from "element-plus";
import {useRouter} from "vue-router";

defineOptions({
  name: "Administrator"
})
const props = defineProps({
  type: {
    type: String as PropType<'edit' | 'add'>,
    required: true
  },
  administrator: {
    type: Object as PropType<IAdministrator>,
    required: true
  }
})

const formData = computed<IAdministrator>(() => {
  return props.administrator
})

const validatePass = (rule: any, value: any, callback: any) => {
  if (props.type == 'add') {
    if (value === '') {
      callback(new Error('密码不能为空'))
    } else {
      if (formData.value.password_confirmation !== '') {
        if (!formRef.value) return
        formRef.value.validateField('password_confirmation', () => null)
      }
    }
  } else {
    if (value || formData.value.password_confirmation) {
      if (!formRef.value) return
      formRef.value.validateField('password_confirmation', () => null)
    }
  }
  callback()
}
const validatePassConfirm = (rule: any, value: any, callback: any) => {
  if (props.type == 'add') {
    if (value === '') {
      callback(new Error('请再输入一次密码'))
    } else if (value !== formData.value.password) {
      callback(new Error("两次输入密码不一致!"))
    }
  } else {
    if (value !== formData.value.password_confirmation) {
      callback(new Error("两次输入密码不一致!"))
    }
  }
  callback()
}

const formRules = reactive<FormRules>({
  name: [
    {required: true, message: "用户名不能为空", trigger: 'blur'}
  ],
  account: [
    {required: true, message: "账号不能为空", trigger: 'blur'},
    {min: 3, max: 10, message: '长度必须在 3 到 10 位之间', trigger: 'blur'},
  ],
  password: [
    {validator: validatePass, trigger: 'blur'},
    {min: 5, max: 20, message: '长度必须在 5 到 20 位之间', trigger: 'blur'},
  ],
  password_confirmation: [{validator: validatePassConfirm, trigger: 'blur'}],
})


const formRef = ref<FormInstance | null>(null)

const emit = defineEmits(["handleSubmit", "update:administrator", "refresh"])

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit("update:administrator", formData.value)
      emit("handleSubmit")
    } else {
      return false
    }
  })
};

const router = useRouter()

const handleCancel = () => {
  router.back()
}
</script>

<style scoped>
.form-input {
  width: 400px;
}

.table-input-number {
  width: 100%;
}

.table-image {
  width: 120px;
  height: 120px;
}
</style>
