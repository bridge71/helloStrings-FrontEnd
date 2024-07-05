<template>
  <n-page-header subtitle="「琴弦」" @back="handleBack">
    <template #title>
      <a href="https://github.com/bridge71/helloStrings" style="text-decoration: none; color: inherit">helloStrings</a>
    </template>
    <template #extra>
      <n-space>
        <n-button size="small" @click="goHome()">
          <template #icon>
            <n-icon>
              <homeIcon />
            </n-icon>
          </template>
          主页
        </n-button>
      </n-space>
    </template>
  </n-page-header>
  <n-card>
    <n-tabs type="line" class="card-tabs" default-value="signin" size="large" animated
      pane-wrapper-style="margin: 0 -4px;" pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
      <n-tab-pane name="signin" tab="我发的帖子">
        <n-back-top :right="100" />
        <n-row :gutter="[20, 28]">
          <n-col v-for="(item, index) in postAuthorData" :key="index" :span="8">
            <n-thing content-indented>
              <template #avatar>
                <n-avatar>
                  <n-icon>
                    <userAvatar />
                  </n-icon>
                </n-avatar>
              </template>
              <template #header>
                标题 : {{ item.title }}
              </template>
              <template #description>
                作者： {{ item.nickname }}
              </template>
              <template #footer>
                发布时间 : {{ formatDate(new Date(item.createdAt)) }}
              </template>
              <template #action>
                <n-space>
                  <router-link :to="{ name: 'article', params: { postId: item.postId } }">
                    <n-button size="small">
                      <template #icon>
                        <n-icon>
                          <read />
                        </n-icon>
                      </template>
                      阅读
                    </n-button>
                  </router-link>
                  <n-button size="small" @click="changeLikes(item.postId, item.likes)">
                    <template #icon>
                      <n-icon>
                        <heart />
                      </n-icon>
                    </template>
                    {{ item.likes }}
                  </n-button>
                </n-space>
              </template>
            </n-thing>
          </n-col>
        </n-row>
      </n-tab-pane>
      <n-tab-pane name="comment" tab="我评论的帖子">
        <n-back-top :right="100" />
        <n-row :gutter="[20, 28]">
          <n-col v-for="(item, index) in postCommentData" :key="index" :span="8">
            <n-thing content-indented>
              <template #avatar>
                <n-avatar>
                  <n-icon>
                    <userAvatar />
                  </n-icon>
                </n-avatar>
              </template>
              <template #header>
                标题 : {{ item.title }}
              </template>
              <template #description>
                作者： {{ item.nickname }}
              </template>
              <template #footer>
                发布时间 : {{ formatDate(new Date(item.createdAt)) }}
              </template>
              <template #action>
                <n-space>
                  <router-link :to="{ name: 'article', params: { postId: item.postId } }">
                    <n-button size="small">
                      <template #icon>
                        <n-icon>
                          <read />
                        </n-icon>
                      </template>
                      阅读
                    </n-button>
                  </router-link>
                  <n-button size="small" @click="changeLikes(item.postId, item.likes)">
                    <template #icon>
                      <n-icon>
                        <heart />
                      </n-icon>
                    </template>
                    {{ item.likes }}
                  </n-button>
                </n-space>
              </template>
            </n-thing>
          </n-col>
        </n-row>
      </n-tab-pane>
      <n-tab-pane name="like" tab="我点赞的帖子">
        <n-back-top :right="100" />
        <n-row :gutter="[20, 28]">
          <n-col v-for="(item, index) in postLikeData" :key="index" :span="8">
            <n-thing content-indented>
              <template #avatar>
                <n-avatar>
                  <n-icon>
                    <userAvatar />
                  </n-icon>
                </n-avatar>
              </template>
              <template #header>
                标题 : {{ item.title }}
              </template>
              <template #description>
                作者： {{ item.nickname }}
              </template>
              <template #footer>
                发布时间 : {{ formatDate(new Date(item.createdAt)) }}
              </template>
              <template #action>
                <n-space>
                  <router-link :to="{ name: 'article', params: { postId: item.postId } }">
                    <n-button size="small">
                      <template #icon>
                        <n-icon>
                          <read />
                        </n-icon>
                      </template>
                      阅读
                    </n-button>
                  </router-link>
                  <n-button size="small" @click="changeLikes(item.postId, item.likes)">
                    <template #icon>
                      <n-icon>
                        <heart />
                      </n-icon>
                    </template>
                    {{ item.likes }}
                  </n-button>
                </n-space>
              </template>
            </n-thing>
          </n-col>
        </n-row>
      </n-tab-pane>
      <n-tab-pane name="books" tab="我上传的书">
        <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
          @update:page="handlePageChange" :row-key="rowKey" />
        <n-modal v-model:show="showQQ">
          <div class="h-6rem w-6rem bg-primary border-round">
            <n-qr-code class="origin-top-right  rotate-45 h-6rem w-6rem" alt="primeflex" :value="qq" :size="200" />
          </div>
        </n-modal>
      </n-tab-pane>
      <n-tab-pane name="login" tab="登录信息">
        <n-data-table remote ref="table" :columns="IPcolumns" :data="IPData" :row-key="rowKey" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script>
import Editor from 'primevue/editor';
import { useRouter } from 'vue-router';
import { h, ref, reactive, onMounted } from 'vue';
import { NIcon, NButton } from "naive-ui";
import axios from 'axios';
import { useMessage } from "naive-ui";
import {
  ShoppingCart as sellOnIcon,
  ShoppingCartOff as sellOffIcon,
  Book as read,
  Heart as heart,
} from "@vicons/tabler";
import {
  UserAvatar as userAvatar,
  Home as homeIcon
} from "@vicons/carbon"

import {
  PersonCircleOutline as UserIcon,
} from "@vicons/ionicons5";

export default {

  components: {
    Editor,
    homeIcon,
    read,
    heart,
    userAvatar,
    UserIcon,
  },
  setup() {

    const loadingRef = ref(false);
    const searchesPost = [
      { value: "title", label: "by title" },
      { value: "author", label: "by author" },
    ];
    const isShowQQ = ref(false);
    const column1 = {
      title: '书名',
      key: 'title',
      render(row) {
        return h('div', [h('span', null, row.title)]);
      }
    };
    const column2 = {
      title: '作者',
      key: 'Author',
      render(row) {
        return h('div', [h('span', null, row.author)]);
      }
    };
    const column3 = {
      title: '课程',
      key: 'Course',
      render(row) {
        return h('div', [h('span', null, row.course)]);
      }
    };
    const column4 = {
      title: '专业',
      key: 'Profession',
      render(row) {
        return h('div', [h('span', null, row.profession === '' ? '公共课' : row.profession)]);
      }
    };
    const column5 = {
      title: '价格',
      key: 'Value',
      render(row) {
        return h('div', [h('span', null, row.value)]);
      }
    };
    const column6 = {
      title: '日期',
      key: 'Created_at',
      render(row) {
        return h('div', [h('span', null, formatDate(new Date(row.createdAt)))]);
      }
    };
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const column7 = {
      title: "更改状态",
      key: "action7",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => bookUpdateStatus(row)
          },
          { default: () => row.IsSold ? "on sale" : "off sale" }
        );
      }
    };
    const column8 = {
      title: '状态',
      key: 'mark',
      render(row) {
        return h(
          NIcon,
          { size: '20' },
          { default: () => row.IsSold ? h(sellOffIcon) : h(sellOnIcon) }
        );
      }
    };
    const columns = [
      column1,
      column2,
      column3,
      column4,
      column5,
      column6,
      column8,
      column7
    ];

    const IPColumn1 = {
      title: 'ip',
      key: 'ip',
      render(row) {
        return h('div', [h('span', null, row.ip)]);
      }
    };
    const IPColumn2 = {
      title: '经度',
      key: '经度',
      render(row) {
        return h('div', [h('span', null, row.lng)]);
      }
    };
    const IPColumn3 = {
      title: '纬度',
      key: '纬度',
      render(row) {
        return h('div', [h('span', null, row.lat)]);
      }
    };
    const IPColumn4 = {
      title: '省份',
      key: '省份',
      render(row) {
        return h('div', [h('span', null, row.province)]);
      }
    };
    const IPColumn5 = {
      title: '城市',
      key: '城市',
      render(row) {
        return h('div', [h('span', null, row.city)]);
      }
    };

    const IPColumn7 = {
      title: '行政区',
      key: '行政区',
      render(row) {
        return h('div', [h('span', null, row.district)]);
      }
    };
    const IPColumn6 = {
      title: '日期',
      key: 'Created_at',
      render(row) {
        return h('div', [h('span', null, formatDate(new Date(row.createdAt)))]);
      }
    };
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const IPcolumns = [
      IPColumn1,
      IPColumn2,
      IPColumn3,
      IPColumn4,
      IPColumn5,
      IPColumn7,
      IPColumn6,
    ];
    const data = ref([]);
    const loading = ref(true);
    const qq = ref();
    const pagination = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 8,
      prefix({ itemCount }) {
        return `Total is ${itemCount}.`;
      }
    });

    const dataRef = ref([]);
    function customSlice(data, start, end) {
      const result = [];
      for (let i = start; i < end && i < data.length; i++) {
        result.push(data[i]);
      }
      return result;
    }
    function query(page, pageSize = 10) {
      return new Promise((resolve) => {
        const copiedData = data.value;
        const pagedData = customSlice(copiedData, (page - 1) * pageSize, page * pageSize);
        const total = copiedData.length;
        const pageCount = Math.ceil(copiedData.length / pageSize);
        resolve({ pageCount, data: pagedData, total })
      });
    }

    const postAuthor = ref("")
    const postAuthorData = ref([])
    const postReadAuthor = async () => {
      try {
        const response = await axios.post('/post/read/nickname', {});
        postAuthorData.value = response.data.Post;
      } catch (error) {
        console.error('error in postReadAuthor:', error);
      }
    };

    const postCommentData = ref([])
    const postReadComment = async () => {
      try {
        const response = await axios.post('/post/mark/read', {});
        postCommentData.value = response.data.Post;
      } catch (error) {
        console.error('error in postReadComment:', error);
      }
    };

    const postLikeData = ref([])
    const postReadLike = async () => {
      try {
        const response = await axios.post('/post/likes/read', {});
        postLikeData.value = response.data.Post;
      } catch (error) {
        console.error('error in postReadLike:', error);
      }
    };

    const bookUpdateStatus = async (row) => {
      console.log("userId of row:", row.UserId);
      try {
        const response = await axios.post('/sale/book/update',
          {
            userId: row.UserId,
            createdAt: row.createdAt,
            isSold: row.IsSold
          });

        if (response.status == 200) {
          message.success("更新成功");
        }
        fetchBooks();
      } catch (error) {
        console.error('error in bookUpdateStatus:', error);
      }
    };

    const IPData = ref([])
    const IPRead = async () => {
      try {
        const response = await axios.post('/user/ip/read', {});
        if (response.status == 200) {
          IPData.value = response.data.IP
        }
      } catch (error) {
        console.error('error in IPRead:', error);
      }
    };

    onMounted(() => {
      checkLoginStatus();
      postReadAuthor();
      postReadComment();
      postReadLike();
      IPRead();
      fetchBooks();
    });

    const router = useRouter();
    const formRef = ref(null);
    const message = useMessage();
    const handlePageChange = (currentPage) => {
      if (!loadingRef.value) {
        loadingRef.value = true;
        query(currentPage, pagination.pageSize).then((data) => {
          dataRef.value = data.data;
          pagination.page = currentPage;
          pagination.pageCount = data.pageCount;
          pagination.itemCount = data.total;
          loadingRef.value = false;
        });
      }
    }

    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('userToken');
      if (token == null) {
        router.push({ name: 'login' });
      }
    };

    const goHome = () => {
      router.push({ name: 'home' });
    };

    const ip = ref("")
    const getIP = () => {
      axios.get('https://api.ipify.org?format=json', {})
        .then(response => {
          ip.value = response.data.ip;
          console.log("ip  ", ip.value)
        }).catch(error => {
          console.log("failed get ip", error)
        })
    }

    const fetchBooks = async () => {
      try {
        const response = await axios.post('/sale/book/by', {});
        data.value = response.data.BookSale;
        query(pagination.page, pagination.pageSize).then((data) => {
          dataRef.value = data.data;
          pagination.pageCount = data.pageCount;
          pagination.itemCount = data.total;
          loadingRef.value = false;
        });
      } catch (error) {
        console.error('error in fetchBooks:', error);
      } finally {
        loading.value = false;
      }
    };

    const changeLikes = (postId, likes) => {
      axios.post('/post/likes/change', {
        postId: postId,
        likes: likes
      }).then(response => {
        if (response.status == 200) {
          message.success(response.data.RetMessage);
        }
        postReadAuthor();
        postReadComment();
        postReadLike();
      }).catch(error => {
        console.error('error in changeLikes:', error);
        message.error(error.response.data.RetMessage);
      });
    };

    const rules = {
      title: { required: true, trigger: ["blur", "input"], message: "请输入书名" },
      author: { required: true, trigger: ["blur", "input"], message: "请输入作者" },
      common: { required: true, trigger: ["blur", "change"], message: "请选择是否公共课" },
      profession: { required: true, trigger: ["blur", "input"], message: "请输入专业" },
      course: { required: true, trigger: ["blur", "change"], message: "请输入课程" },
      value: { type: "number", required: true, trigger: ["blur", "change"], message: "请输入预期售价" }
    };

    return {
      formRef,
      data: dataRef,
      columns,
      pagination,
      loading,
      qq,
      showQQ: isShowQQ,
      ip,
      rules,
      customSlice,
      rowKey: (rowData) => rowData.Title,
      formatDate,
      handlePageChange,
      getIP,
      changeLikes,
      goHome,
      searchesPost,
      postAuthor,
      postAuthorData,
      postReadAuthor,
      postReadComment,
      postCommentData,
      postLikeData,
      postReadLike,
      bookUpdateStatus,
      IPcolumns,
      IPData,
      IPRead,
    };
  }
};
</script>
