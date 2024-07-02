<template>

  <n-card>
    <n-tabs class="card-tabs" default-value="signin" size="large" animated pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 154px; padding-right: 154px; box-sizing: border-box;">
      <n-tab-pane name="signin" tab="登录">
        <Editor v-model="value" editorStyle="height: 320px" />
        <n-form @submit="submitLoginForm">
          <n-form-item-row label="昵称">
            <n-input v-model:value="loginForm.nickname" placeholder="请输入昵称" />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input type="password" show-password-on="mousedown" v-model:value="loginForm.password"
              placeholder="请输入密码" />
          </n-form-item-row>
          <template #password-visible-icon>
            <n-icon :size="16" :component="GlassesOutline" />
          </template>
        </n-form>
        <n-button type="primary" block secondary strong @click="submitLoginForm">
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form>
          <n-form-item-row label="昵称">
            <n-input maxlength="10" show-count v-model:value="signForm.nickname" placeholder="请输入昵称" />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input maxlength="20" show-count type="password" show-password-on="mousedown"
              v-model:value="signForm.password" placeholder="请输入密码" />
          </n-form-item-row>
          <template #password-visible-icon>
            <n-icon :size="16" :component="GlassesOutline" />
          </template>
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


import Editor from 'primevue/editor';
import axios from 'axios';
import { GlassesOutline, Glasses } from "@vicons/ionicons5";
import { useMessage } from "naive-ui";
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const message = useMessage();
    const loginForm = ref({
      nickname: '',
      password: '',
      ip: '',
      lat: '',
      lng: '',
      province: '',
      city: '',
      district: '',
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
        password: loginForm.value.password,
        ip: loginForm.value.ip,
        lng: loginForm.value.lng,
        lat: loginForm.value.lat,
        province: loginForm.value.province,
        city: loginForm.value.city,
        district: loginForm.value.district
      })
        .then(response => {
          if (response.status == 200) {
            console.log("response", response.data);
            console.log("response token", response.data.User.userId);
            console.log("response level", response.data.User.level);
            sessionStorage.setItem('userToken', response.data.User.userId);
            sessionStorage.setItem('level', response.data.User.level);
            console.log("userToken:", sessionStorage.getItem('userToken'))
            router.push({ name: 'home' });
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
          // console.log("register data", response.data);
          if (response.status == 200) {
            message.success("注册成功");
            router.push({ name: 'login' });
          }
        })
        .catch(error => {
          message.error(error.response.data.RetMessage)
          console.error('注册失败:', error);
        });
    };

    const submitLoginForm = async () => {
      // console.log(loginForm.value);

      await getIP();
      console.log("ss")
      if (loginForm.value.nickname.trim() === '') {
        message.warning('请输入用户名');
        return;
      }
      if (loginForm.value.password.trim() === '') {
        message.warning('请输入密码');
        return;
      }

      login();
    };

    const submitSignForm = () => {
      // console.log(signForm.value);
      if (signForm.value.nickname.trim() === '') {
        message.warning('请输入用户名');
        return;
      }
      if (signForm.value.password.trim() === '') {
        message.warning('请输入密码');
        return;
      }

      console.log(valueRef.value)
      if (valueRef.value.trim() === '') {
        message.warning('请输入邮箱');
        return;
      }
      register();
    };

    const options = computed(() => {
      return ["@qq.com"].map((suffix) => {
        const prefix = valueRef.value.split("@")[0];
        return {
          label: prefix + suffix,
          value: prefix + suffix
        };
      });
    })



    const getIP = async () => {
      console.log("getting ip")
      axios.get('/ip?key=YHZBZ-7WPR4-AXQUK-FUHOR-5YQYH-NAFTH', {})
        .then(response => {

          console.log(response.data)
          loginForm.value.ip = response.data.result.ip;
          loginForm.value.lat = response.data.result.location.lat;
          loginForm.value.lng = response.data.result.location.lng;
          loginForm.value.province = response.data.result.ad_info.province;
          loginForm.value.city = response.data.result.ad_info.city;
          loginForm.value.district = response.data.result.ad_info.district;
          console.log(loginForm)
        })
        .catch(error => {
          console.error('failed to get ip', error);
        })

    };
    return {
      loginForm,
      signForm,
      // value,
      getIP,
      submitLoginForm,
      submitSignForm,
      value: valueRef,
      options
    };
  },
}
</script>
