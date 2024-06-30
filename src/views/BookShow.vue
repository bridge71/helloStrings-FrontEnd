<template>
  <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
    :row-key="rowKey" />
  <n-modal v-model:show="showQQ">
    <n-space vertical>
      <n-qr-code :value="qq" :size="200" />
    </n-space>
  </n-modal>
</template>

<script>

import { useRouter } from 'vue-router';
import { h, defineComponent, ref, reactive, onMounted } from 'vue'
import { NIcon, NDropdown, NButton } from "naive-ui";
import axios from 'axios';


export default defineComponent({
  setup() {
    const isShowQQ = ref(false);
    const column1 = {
      title: '书名',
      key: 'BookName',
      render(row) {
        return h(
          'div',
          [
            h('span', null, row.bookName)
          ]
        );
      }
    }

    const column2 = {
      title: '作者',
      key: 'Author',
      render(row) {
        return h(
          'div',
          [
            h('span', null, row.author)
          ]
        );
      }
    }

    const column3 = {
      title: '课程',
      key: 'Course',
      render(row) {
        return h(
          'div',
          [
            h('span', null, row.course)
          ]
        );
      }
    }

    const column4 = {
      title: '专业',
      key: 'Profession',

      render(row) {
        return h(
          'div',
          [
            h('span', null, row.profession === '' ? '公共课' : row.profession)
          ]
        );
      }
    }

    const column5 = {
      title: '价格',
      key: 'Value',

      render(row) {
        return h(
          'div',
          [
            h('span', null, row.value)
          ]
        );
      }
    }

    const column6 = {
      title: '日期',
      key: 'Created_at',

      render(row) {
        return h(
          'div',
          [
            h('span', null, formatDate(new Date(row.CreatedAt)))
          ]
        );
      }
    }

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
      title: "联系",
      key: "action7",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => getInfo(row)
          },
          { default: () => "QQ" }
        );
      }
    }

    const columns = [
      column1,
      column2,
      column3,
      column4,
      column5,
      column6,
      column7
    ]

    const router = useRouter();
    const data = ref([]);
    const loading = ref(true);
    const qq = ref();
    const pagination = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      prefix({ itemCount }) {
        return `Total is ${itemCount}.`
      }
    });
    const fetchBooks = async () => {
      try {
        console.log("get book list");
        console.log("check Login Status, token:", sessionStorage.getItem('userToken'));
        const response = await axios.post('/sale/book/all', {});
        data.value = response.data.BookSale;
        console.log(response.data.BookSale);
      } catch (error) {
        console.error('获取书籍列表失败:', error);
      } finally {
        loading.value = false;
      }
    };

    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('userToken');
      console.log("check Login Status, token:", token);
      if (!token) {
        router.push({ name: 'login' });
      }
    }

    onMounted(() => {
      fetchBooks();
      checkLoginStatus();
    });

    const getInfo = async (row) => {
      console.log("userId of row:", row.UserId);
      try {
        const response = await axios.post('/user/info', {
          userId: row.userId,
        });
        qq.value = response.data.User.email;
        console.log(response.data.User)
        console.log("qq is ", qq.value)
        isShowQQ.value = true;

      } catch (error) {
        console.error('failed when fectch info from row:', error);
      }
    };
    return {
      data,
      columns,
      pagination,
      loading,
      qq,
      showQQ: isShowQQ,
      rowKey: (rowData) => rowData.BookName,
      formatDate
    }
  }
})
</script>
