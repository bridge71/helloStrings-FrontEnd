<template>
  <n-form class="myform" ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
    require-mark-placement="right-hanging" :size="size" :style="{

      // padding-left: '454px' 
      // padding-right: '454px'
      // box-sizing: 'border-box'
      // maxWidth: '640px'
    }">
    <n-form-item label="书名" path="bookName">
      <n-input v-model:value="model.bookName" placeholder="书名" />
    </n-form-item>
    <n-form-item label="作者" path="author">
      <n-input v-model:value="model.author" placeholder="作者" />
    </n-form-item>
    <n-form-item label="公共课">
      <n-switch v-model:value="model.common" />
    </n-form-item>
    <n-form-item v-if="!model.common" label="专业" path="profession">
      <n-input v-model:value="model.profession" placeholder="专业" />
    </n-form-item>
    <n-form-item label="课程" path="course">
      <n-input v-model:value="model.course" placeholder="课程" />
    </n-form-item>
    <n-form-item label="售价(￥)" path="value">
      <n-input-number v-model:value="model.value" />
    </n-form-item>
    <div style="display: flex; justify-content: flex-end">
      <n-button round type="primary" @click="handleValidateButtonClick">
        录入
      </n-button>
    </div>
  </n-form>

</template>

<style>
.myform {

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
<script>
import { defineComponent, ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import axios from 'axios';
import { useRouter } from 'vue-router';
export default {

  setup() {
    const router = useRouter();
    const formRef = ref(null);
    const message = useMessage();

    const model = ref({
      bookName: null,
      author: null,
      common: false,
      profession: null,
      course: null,
      value: null
    });

    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('userToken');
      console.log("check Login Status, token:", sessionStorage.getItem('userToken'))
      if (token == null) {
        router.push({ name: 'login' });
      }
    }
    onMounted(checkLoginStatus);

    const submitBookForm = () => {
      console.log("usrToken:", sessionStorage.getItem('userToken'))
      console.log("bookName:", model.value.bookName)
      console.log("author:", model.value.author)
      console.log("common:", model.value.common)
      console.log("profession:", model.value.profession)
      console.log("course:", model.value.course)
      console.log("value:", model.value.value)
      axios.post('/sale/book/submit', {
        userId: parseInt(sessionStorage.getItem("userToken")),
        bookName: model.value.bookName,
        author: model.value.author,
        common: model.value.common,
        profession: model.value.profession,
        course: model.value.course,
        value: parseInt(model.value.value),
      })
        .then(response => {
          if (response.status == 200) {
            console.log("response", response.data);
            console.log("userToken:", sessionStorage.getItem('userToken'));
            message.success("上传成功");
            // router.push({ name: 'salebooksubmit' });
          }
        })
        .catch(error => {
          console.error('上传失败:', error);
          message.error(error.response.data.RetMessage)
        });
    };
    return {
      formRef,
      size: ref("medium"),
      model,
      rules: {
        bookName: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入书名"
        },
        author: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入作者"
        },
        common: {
          required: true,
          trigger: ["blur", "change"],
          message: "请选择是否公共课"
        },

        profession: {
          required: true,
          trigger: ["blur", "input"],
          message: "请输入专业"
        },
        course: {
          required: true,
          trigger: ["blur", "change"],
          message: "请输入课程"
        },
        value: {
          type: "number",
          required: true,
          trigger: ["blur", "change"],
          message: "请输入预期售价"
        }
      },
      handleValidateButtonClick(e) {
        e.preventDefault();
        formRef.value?.validate((errors) => {
          if (!errors) {
            submitBookForm();
            // message.success("验证成功");
          } else {
          }
        });
      }
    };
  }
}
</script>
