<template>
  <n-card>
    <n-tabs class="card-tabs" default-value="signin" size="large" animated pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 454px; padding-right: 454px; box-sizing: border-box;">
      <n-tab-pane name="signin" tab="登录">
        <n-form @submit="submitLoginForm">
          <n-form-item-row label="昵称">
            <n-input v-model:value="loginForm.nickname" placeholder="请输入昵称" />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input type="password" v-model:value="loginForm.password" placeholder="请输入密码" />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong @click="submitLoginForm">
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form>
          <n-form-item-row label="昵称">
            <n-input v-model:value="signForm.nickname" placeholder="请输入昵称" />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input type="password" v-model:value="signForm.password" placeholder="请输入密码" />
          </n-form-item-row>
          <label>邮箱</label>
          <n-auto-complete v-model:value="value" :input-props="{
            autocomplete: 'disabled'
          }" :options="options" placeholder="邮箱" clearable />

        </n-form>
        <n-button type="primary" block secondary strong @click="submitSignForm">
          注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<style>
.card-tabs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
<script>
import axios from 'axios';

import { useMessage } from "naive-ui";
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const message = useMessage();
    const loginForm = ref({
      nickname: '',
      password: ''
    });
    const signForm = ref({
      nickname: '',
      password: '',
    });
    const valueRef = ref("");
    const value = ref("");
    const login = () => {
      axios.post('/user/login', {
        nickname: loginForm.value.nickname,
        password: loginForm.value.password
      })
        .then(response => {
          if (response.status == 200) {
            console.log("response", response.data);
            console.log("response token", response.data.User.UserId);
            sessionStorage.setItem('userToken', response.data.User.UserId);
            sessionStorage.setItem('level', response.data.User.Level);
            console.log("userToken:", sessionStorage.getItem('userToken'))
            router.push({ name: 'book' });
          }
        })
        .catch(error => {
          console.error('登录失败:', error);
          message.error(error.response.data.RetMessage)
        });
    };

    const register = () => {
      axios.post('user/register', {
        nickname: signForm.value.nickname,
        password: signForm.value.password,
        email: valueRef.value
      })
        .then(response => {
          console.log(response.data);

          if (response.status == 200) {
            message.success("注册成功");
            router.push({ name: 'Login' });
          }
        })
        .catch(error => {
          message.error(error.response.data.RetMessage)
          console.error('注册失败:', error);
        });
    };
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('userToken');
      console.log("check Login Status, token:", sessionStorage.getItem('userToken'))
      if (token) {
        router.push({ name: 'login' });
      }
    }

    const submitLoginForm = () => {
      console.log(loginForm.value);

      if (loginForm.value.nickname.trim() === '') {
        alert('请输入用户名');
        return;
      }
      if (loginForm.value.password.trim() === '') {
        alert('请输入密码');
        return;
      }

      login();
    };

    const submitSignForm = () => {
      console.log(signForm.value);

      if (signForm.value.nickname.trim() === '') {
        alert('请输入用户名');
        return;
      }
      if (signForm.value.password.trim() === '') {
        alert('请输入密码');
        return;
      }

      console.log(valueRef.value)
      if (valueRef.value.trim() === '') {
        alert('请输入邮箱');
        return;
      }
      register();
    };

    onMounted(() => {
      checkLoginStatus();
    });
    const options = computed(() => {
      return ["@qq.com"].map((suffix) => {
        const prefix = valueRef.value.split("@")[0];
        return {
          label: prefix + suffix,
          value: prefix + suffix
        };
      });
    })
    return {
      loginForm,
      signForm,
      // value,
      submitLoginForm,
      submitSignForm,
      value: valueRef,
      options
    };
  },
}
</script>
