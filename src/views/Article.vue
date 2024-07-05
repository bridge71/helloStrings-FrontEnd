<template>
  <div class="content-container">
    <n-back-top :right="100" />
    <n-space vertical>
      <div v-html="htmlContent" />
      <n-progress type="line" :percentage="100" :height="14" :border-radius="4" :fill-border-radius="0" />
      <n-row :gutter="[20, 28]">
        <n-col v-for="(item, index) in commentData" :key="index" :span="18">
          <n-thing content-indented>
            <template #avatar>
              <n-avatar>
                <n-icon>
                  <userAvatar />
                </n-icon>
              </n-avatar>
            </template>
            <template #header>
              昵称： {{ item.nickname }}
            </template>
            <template #description>
              <div v-html="item.content" />
            </template>
            <template #footer>
              发布时间 : {{ formatDate(new Date(item.createdAt)) }}
            </template>
          </n-thing>
        </n-col>
      </n-row>
      <n-progress type="line" :percentage="99" :height="14" :border-radius="4" :fill-border-radius="0" />
      <n-input maxlength="600" show-count v-model:value="comment" type="textarea" clearable placeholder="评论"
        :style="{ width: 700 + 'px' }" />
      <n-space justify="center">
        <n-button color="#8a2be2" @click="submitComment">
          评论
        </n-button>
      </n-space>
    </n-space>
  </div>
</template>
<style>
.loading-container,
.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 720px;
  margin: 0 auto;
}
</style>
<script>
import axios from 'axios';
import { useMessage } from "naive-ui";
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { NImage } from 'naive-ui';
import {
  UserAvatar as userAvatar,
} from "@vicons/carbon"
export default defineComponent({
  components: {
    NImage,
    userAvatar,
  },
  setup() {
    const route = useRoute();
    const postId = ref(route.params.postId);
    const htmlContent = ref("");
    const loading = ref(true);
    const loading2 = ref(true);
    const commentData = ref([]);
    const comment = ref("");
    const message = useMessage();

    const getThePost = async () => {
      try {
        const response = await axios.post('/post/read/id', { postId: parseInt(postId.value) });
        htmlContent.value = response.data.PostContent.content;
      } catch (error) {
        console.error('error in getThePost:', error);
      } finally {
        loading.value = false;
      }
    };

    const createPostComments = async () => {
      try {
        await axios.post('/post/mark/create', { postId: parseInt(postId.value) });
        message.success("评论成功")
      } catch (error) {
        console.error('error in createPostComments:', error);
      }
    };
    const submitComment = async () => {
      if (comment.value.trim() === '') {
        message.warning('请输入内容');
        return;
      }
      await axios.post('/post/comment/create', {
        postId: parseInt(postId.value),
        content: comment.value,
      }).then(response => {
        createPostComments()
        fetchComment();
      }).catch(error => {
        console.error("error in submitComment", error);
        message.error(error.response.data.RetMessage);
      });
    }
    const fetchComment = async () => {
      try {
        const response = await axios.post('/post/comment/read/id', { postId: parseInt(postId.value) });
        commentData.value = response.data.Comment;
      } catch (error) {
        console.error('error in fetchComment:', error);
      } finally {
        loading2.value = false;
      }
    };
    onMounted(() => {
      getThePost();
      fetchComment();
    });

    const images = computed(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent.value, 'text/html');
      const imageElements = doc.querySelectorAll('n-image');
      return Array.from(imageElements).map(el => ({
        width: el.getAttribute('width'),
        src: el.getAttribute('src'),
      }));
    });

    const otherContent = computed(() => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent.value, 'text/html');
      const imageElements = doc.querySelectorAll('n-image');
      imageElements.forEach(el => el.parentNode.removeChild(el));
      return doc.body.innerHTML;
    });

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return {
      postId,
      loading,
      getThePost,
      fetchComment,
      formatDate,
      submitComment,
      htmlContent,
      images,
      otherContent,
      commentData,
      comment,
      loading2,
      message,
    };
  },
});
</script>
