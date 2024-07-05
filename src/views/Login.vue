<template>
  <n-watermark content="helloStrings" cross fullscreen :font-size="16" :line-height="16" :width="384" :height="384"
    :x-offset="12" :y-offset="60" :rotate="-15" />
  <n-card>
    <n-tabs class="card-tabs" default-value="signin" size="large" animated pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 154px; padding-right: 154px; box-sizing: border-box;">
      <n-tab-pane name="signin" tab="登录">
        <Editor v-model="value" editorStyle="height: 320px" />
        <n-form @submit="post">
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
import { GlassesOutline } from "@vicons/ionicons5";
import { useMessage } from "naive-ui";
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const message = useMessage();
    const loginForm = ref({
      nickname: '',
      password: '',
    });
    const ipForm = ref({
      ip: '',
      lat: '',
      lng: '',
      province: '',
      city: '',
      district: '',
    })
    const signForm = ref({
      nickname: '',
      password: '',
    });
    const valueRef = ref("");

    const login = () => {
      axios.post('/_login', {
        nickname: loginForm.value.nickname,
        password: loginForm.value.password,
      })
        .then(response => {
          if (response.status == 200) {
            sessionStorage.setItem('userToken', response.data.User.userId);
            router.push({ name: 'home' });
            getIP()
          }
        })
        .catch(error => {
          // console.error('登录失败:', error);
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
          if (response.status == 200) {
            message.success("注册成功");
            router.push({ name: 'login' });
          }
        })
        .catch(error => {
          message.error(error.response.data.RetMessage)
        });
    };

    const submitLoginForm = async () => {
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
      if (signForm.value.nickname.trim() === '') {
        message.warning('请输入用户名');
        return;
      }
      if (signForm.value.password.trim() === '') {
        message.warning('请输入密码');
        return;
      }

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
      try {
        const response = await axios.get('/ip?key=YHZBZ-7WPR4-AXQUK-FUHOR-5YQYH-NAFTH', {});
        ipForm.value.ip = response.data.result.ip;
        ipForm.value.lat = response.data.result.location.lat;
        ipForm.value.lng = response.data.result.location.lng;
        ipForm.value.province = response.data.result.ad_info.province;
        ipForm.value.city = response.data.result.ad_info.city;
        ipForm.value.district = response.data.result.ad_info.district;
        storeIP();
      } catch (error) {
        console.error("error in getIP:", error)
      }
    };

    const storeIP = async () => {
      try {
        axios.post('/user/ip/create', {
          ip: ipForm.value.ip,
          lng: ipForm.value.lng,
          lat: ipForm.value.lat,
          province: ipForm.value.province,
          city: ipForm.value.city,
          district: ipForm.value.district
        })
      } catch (error) {
        console.log("error in storeIP", error)
      }
    }

    return {
      loginForm,
      signForm,
      ipForm,
      getIP,
      storeIP,
      submitLoginForm,
      submitSignForm,
      value: valueRef,
      options
    };
  },
}
</script>
