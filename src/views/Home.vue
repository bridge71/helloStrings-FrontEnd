<template>
  <n-card>
    <n-tabs type="line" class="card-tabs" default-value="signin" size="large" animated
      pane-wrapper-style="margin: 0 -4px" pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">

      <n-tab-pane name="signin" tab="书籍">
        <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
          @update:page="handlePageChange" :row-key="rowKey" />
        <n-modal v-model:show="showQQ">
          <n-space vertical>
            <n-qr-code :value="qq" :size="200" />
          </n-space>
        </n-modal>
      </n-tab-pane>

      <n-tab-pane name="searchbooks" tab="书籍搜索">
        <n-space>
          <n-input v-model:value="searchForm.key" type="text" size="large" round placeholder="中文搜索的话只能12个字（笑"
            maxlength="36" show-count clearable :style="{ width: 660 + 'px' }" />
          <n-button attr-type="button" @click="submitSearchForm">
            搜索
          </n-button>
        </n-space>
        <n-radio-group v-model:value="searchForm.by" name="radiogroup">
          <n-space>
            <n-radio v-for="search in searches" :key="search.value" :value="search.value">
              {{ search.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
        <n-data-table v-if="isSearch" remote ref="table" :columns="columns" :data="searchData" :loading="loading2"
          :pagination="pagination2" @update:page="handlePageChange2" :row-key="rowKey" />
        <n-modal v-model:show="showQQ">
          <n-space vertical>
            <n-qr-code :value="qq" :size="200" />
          </n-space>
        </n-modal>
      </n-tab-pane>

      <n-tab-pane name="bookinput" tab="书籍录入">
        <n-form class="myform" ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging" :size="size" :style="{
          }">
          <n-form-item label="书名" path="title">
            <n-input clearable v-model:value="model.title" placeholder="书名" />
          </n-form-item>
          <n-form-item label="作者" path="author">
            <n-input clearable v-model:value="model.author" placeholder="作者" />
          </n-form-item>
          <n-form-item label="公共课">
            <n-switch v-model:value="model.common" />
          </n-form-item>
          <n-form-item v-if="!model.common" label="专业" path="profession">
            <n-input clearable v-model:value="model.profession" placeholder="专业" />
          </n-form-item>
          <n-form-item label="课程" path="course">
            <n-input clearable v-model:value="model.course" placeholder="课程" />
          </n-form-item>
          <n-form-item clearable label="售价(￥)" path="value">
            <n-input-number v-model:value="model.value" />
          </n-form-item>
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="handleValidateButtonClick">
              录入
            </n-button>
          </div>
        </n-form>
      </n-tab-pane>

    </n-tabs>
  </n-card>
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
import { useRouter } from 'vue-router';
import { h, defineComponent, ref, reactive, onMounted } from 'vue';
import { NIcon, NDropdown, NButton } from "naive-ui";
import axios from 'axios';
import { useMessage } from "naive-ui";
import {
  ShoppingCart as sellOnIcon,
  ShoppingCartOff as sellOffIcon,
} from "@vicons/tabler";

export default {
  setup() {
    const loadingRef = ref(false);
    const loadingRef2 = ref(false);
    const isSearch = ref(false);
    const searches = [
      { value: "title", label: "by title" },
      { value: "author", label: "by author" },
      { value: "profession", label: "by profession" },
      { value: "course", label: "by course" },
    ];
    const defaultSearch = ref(searches[0].value);
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
        return h('div', [h('span', null, formatDate(new Date(row.CreatedAt)))]);
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
    };
    const column8 = {
      title: '状态',
      key: 'mark',
      render(row) {
        return h(
          NIcon,
          { size: '20' },
          { default: () => row.isSold ? h(sellOffIcon) : h(sellOnIcon) }
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
    const data = ref([]);
    const searchData = ref([]);
    const loading = ref(true);
    const loading2 = ref(true);
    const qq = ref();
    const pagination = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      prefix({ itemCount }) {
        return `Total is ${itemCount}.`;
      }
    });

    const pagination2 = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      prefix({ itemCount }) {
        return `Total is ${itemCount}.`;
      }
    });
    const dataRef = ref([]);
    const dataRef2 = ref([]);
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
    function query2(page, pageSize = 10) {
      return new Promise((resolve) => {
        const copiedData = searchData.value;
        const pagedData = customSlice(copiedData, (page - 1) * pageSize, page * pageSize);
        const total = copiedData.length;
        const pageCount = Math.ceil(copiedData.length / pageSize);
        resolve({ pageCount, data: pagedData, total })
      });
    }
    const fetchBooks = async () => {
      try {
        console.log("get book list");
        console.log("check Login Status, token:", sessionStorage.getItem('userToken'));
        const response = await axios.post('/sale/book/all', {});
        data.value = response.data.BookSale;
        console.log(response.data.BookSale);
        query(pagination.page, pagination.pageSize).then((data) => {
          dataRef.value = data.data;
          pagination.pageCount = data.pageCount;
          pagination.itemCount = data.total;
          loadingRef.value = false;
        });
      } catch (error) {
        console.error('获取书籍列表失败:', error);
      } finally {
        loading.value = false;
      }
    };
    onMounted(() => {
      fetchBooks();
      checkLoginStatus();
    });
    const searchForm = ref({ by: "", key: "" });
    const submitSearchForm = () => {
      console.log(searchForm.value);
      if (searchForm.value.key.trim() === '') {
        alert('请输入关键字');
        return;
      }
      if (searchForm.value.by.trim() === '') {
        alert('请选择搜索策略');
        return;
      }
      searchBook();
    };
    const searchBook = async () => {
      try {
        console.log("search books by", searchForm.value);
        const response = await axios.post('/sale/book/by', {
          key: searchForm.value.key,
          by: searchForm.value.by
        });
        searchData.value = response.data.BookSale;
        isSearch.value = true;
        query2(pagination2.page, pagination2.pageSize).then((data) => {
          dataRef2.value = data.data;
          pagination2.pageCount = data.pageCount;
          pagination2.itemCount = data.total;
          loadingRef2.value = false;
        });
        fetchBooks();
      } catch (error) {
        console.error('failed when get books by:', error);
      } finally {
        loading2.value = false;
      }

    };
    const getInfo = async (row) => {
      console.log("userId of row:", row.UserId);
      try {
        const response = await axios.post('/user/info', { userId: row.userId });
        qq.value = response.data.User.email;
        console.log(response.data.User);
        console.log("qq is ", qq.value);
        isShowQQ.value = true;
      } catch (error) {
        console.error('failed when fetch info from row:', error);
      }
    };
    const router = useRouter();
    const formRef = ref(null);
    const message = useMessage();
    const model = ref({
      title: null,
      author: null,
      common: false,
      profession: null,
      course: null,
      value: null
    });

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

    const handlePageChange2 = (currentPage) => {
      if (!loadingRef2.value) {
        loadingRef2.value = true;
        query2(currentPage, pagination2.pageSize).then((data) => {
          dataRef2.value = searchData.data;
          pagination2.page = currentPage;
          pagination2.pageCount = data.pageCount;
          pagination2.itemCount = data.total;
          loadingRef2.value = false;
        });
      }
    }
    const checkLoginStatus = () => {
      const token = sessionStorage.getItem('userToken');
      console.log("check Login Status, token:", sessionStorage.getItem('userToken'));
      if (token == null) {
        router.push({ name: 'login' });
      }
    };
    const submitBookForm = () => {
      console.log("usrToken:", sessionStorage.getItem('userToken'));
      console.log("title:", model.value.title);
      console.log("author:", model.value.author);
      console.log("common:", model.value.common);
      console.log("profession:", model.value.profession);
      console.log("course:", model.value.course);
      console.log("value:", model.value.value);
      axios.post('/sale/book/submit', {
        userId: parseInt(sessionStorage.getItem("userToken")),
        title: model.value.title,
        author: model.value.author,
        common: model.value.common,
        profession: model.value.profession,
        course: model.value.course,
        value: parseInt(model.value.value),
      }).then(response => {
        if (response.status == 200) {
          console.log("response", response.data);
          console.log("userToken:", sessionStorage.getItem('userToken'));
          message.success("上传成功");
        }
        fetchBooks();
      }).catch(error => {
        console.error('上传失败:', error);
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
    const handleValidateButtonClick = (e) => {
      e.preventDefault();
      formRef.value?.validate((errors) => {
        if (!errors) {
          submitBookForm();
        } else {
        }
      });
    };
    return {
      formRef,
      data: dataRef,
      searchData: dataRef2,
      searchData,
      columns,
      pagination,
      pagination2,
      loading,
      loading2,
      qq,
      searches,
      searchForm,
      defaultSearch,
      showQQ: isShowQQ,
      size: ref("medium"),
      model,
      rules,
      isSearch,
      searchBook,
      customSlice,
      submitSearchForm,
      rowKey: (rowData) => rowData.Title,
      formatDate,
      handleValidateButtonClick,
      handlePageChange,
      handlePageChange2,
    };
  }
};
</script>
