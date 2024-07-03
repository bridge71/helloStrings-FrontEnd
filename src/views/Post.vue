<template>
  <n-card>
    <n-tabs class="card-tabs" default-value="signin" size="large" animated pane-wrapper-style="margin: 0 -4px"
      pane-style="padding-left: 154px; padding-right: 154px; box-sizing: border-box;">

      <div class="html-content-wrapper" v-html="htmlContent"></div>
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
    const ipForm = ref({
      // userId: '',
      ip: '',
      lat: '',
      lng: '',
      province: '',
      city: '',
      district: '',
    })
    const htmlContent = ref("")

    const getThePost = async () => {
      // checkLoginStatus();
      try {
        router.push({ name: 'post', query: { postId: row.postId } })
        console.log("get The posts");
        // console.log("check Login Status, token:", sessionStorage.getItem('userToken'));
        const response = await axios.get('/post/get', {});
        htmlContent.value = response.data.postContent;
        console.log(response.data.Post);
        // router.push({ name: '' });
      } catch (error) {
        console.error('获取帖子失败:', error);
      }
    };
    const getIP = async () => {
      console.log("getting ip")
      try {
        const response = await axios.get('/ip?key=YHZBZ-7WPR4-AXQUK-FUHOR-5YQYH-NAFTH', {});
        console.log("get info from qq", response.data)
        ipForm.value.ip = response.data.result.ip;
        ipForm.value.lat = response.data.result.location.lat;
        ipForm.value.lng = response.data.result.location.lng;
        ipForm.value.province = response.data.result.ad_info.province;
        ipForm.value.city = response.data.result.ad_info.city;
        ipForm.value.district = response.data.result.ad_info.district;
        // ipForm.value.userId = parseInt(sessionStorage.getItem("userToken"))
        console.log(loginForm.value);
        storeIP();
      } catch (error) {
        console.error('failed to get ip', error);
      }
    };

    return {
      loginForm,
      signForm,
      ipForm,
      // value,
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
