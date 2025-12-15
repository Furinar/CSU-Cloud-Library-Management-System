<template>
  <div class="book-form-container">
    <el-card class="common-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑图书' : '新增图书' }}</span>
        </div>
      </template>
      
      <el-form :model="form" ref="formRef" label-width="100px" :rules="rules">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" />
        </el-form-item>
        
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="form.isbn" :disabled="isEdit" />
        </el-form-item>
        
        <el-form-item label="出版社" prop="publisher">
           <el-input v-model="form.publisher" />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-cascader
            v-model="cascaderValue"
            :options="categoryOptions"
            placeholder="请选择分类"
            :props="{ checkStrictly: true }"
            clearable
            filterable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="出版日期" prop="publishDate">
          <el-date-picker v-model="form.publishDate" type="date" placeholder="选择出版日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        
        <el-form-item label="库存" prop="totalStock">
          <el-input-number v-model="form.totalStock" :min="1" />
        </el-form-item>
        
        <el-form-item label="封面设置" prop="coverUrl">
          <el-radio-group v-model="coverType" style="margin-bottom: 10px;">
            <el-radio label="url">图片链接</el-radio>
            <el-radio label="upload">本地上传</el-radio>
          </el-radio-group>
          
          <div v-if="coverType === 'url'" style="width: 100%">
            <el-input v-model="form.coverUrl" placeholder="请输入图片URL" />
          </div>
          
          <div v-else style="width: 100%">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleFileChange"
            >
              <img v-if="form.coverUrl && form.coverUrl.startsWith('data:')" :src="form.coverUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="el-upload__tip">支持 jpg/png 文件，大小不超过 2MB</div>
          </div>
        </el-form-item>
        
        <el-form-item label="简介" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="4" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadFile } from 'element-plus';
import { getBookById, createBook, updateBook } from '@/api/book';
import type { BookCreateDTO, BookUpdateDTO, Book } from '@/types/book';

const route = useRoute();
const router = useRouter();
const formRef = ref();
const isEdit = computed(() => !!route.params.id);
const coverType = ref('url');

const cascaderValue = computed({
  get: () => {
    if (!form.category) return [];
    return form.category.split('/');
  },
  set: (val) => {
    if (Array.isArray(val) && val.length > 0) {
      form.category = val.join('/');
    } else {
      form.category = '';
    }
  }
});

const categoryOptions = [
  {
    value: '计算机',
    label: '计算机',
    children: [
      { value: '编程', label: '编程' },
      { value: '软件工程', label: '软件工程' },
      { value: '网络', label: '网络' },
      { value: 'AI', label: 'AI' },
      { value: '算法', label: '算法' },
      { value: '随笔', label: '随笔' },
      { value: '数据库', label: '数据库' },
      { value: '面试', label: '面试' },
      { value: '系统', label: '系统' },
      { value: '框架', label: '框架' },
      { value: '容器', label: '容器' },
      { value: '工具', label: '工具' },
      { value: '脚本', label: '脚本' },
      { value: '服务器', label: '服务器' },
      { value: '搜索引擎', label: '搜索引擎' },
      { value: '移动开发', label: '移动开发' },
      { value: '架构', label: '架构' },
      { value: '中间件', label: '中间件' },
      { value: '大数据', label: '大数据' },
      { value: '安全', label: '安全' }
    ]
  },
  {
    value: '文学',
    label: '文学',
    children: [
      { value: '科幻', label: '科幻' },
      { value: '小说', label: '小说' },
      { value: '经典', label: '经典' },
      { value: '童话', label: '童话' },
      { value: '悬疑', label: '悬疑' },
      { value: '散文', label: '散文' },
      { value: '戏剧', label: '戏剧' }
    ]
  },
  {
    value: '历史',
    label: '历史',
    children: [
      { value: '科普', label: '科普' },
      { value: '通俗', label: '通俗' },
      { value: '通史', label: '通史' },
      { value: '经典', label: '经典' },
      { value: '明清', label: '明清' },
      { value: '小说', label: '小说' },
      { value: '三国', label: '三国' },
      { value: '宗教', label: '宗教' },
      { value: '人物', label: '人物' },
      { value: '传记', label: '传记' }
    ]
  },
  {
    value: '心理学',
    label: '心理学',
    children: [
      { value: '经济', label: '经济' },
      { value: '营销', label: '营销' },
      { value: '成长', label: '成长' },
      { value: '情感', label: '情感' },
      { value: '社会', label: '社会' },
      { value: '通俗', label: '通俗' },
      { value: '幸福', label: '幸福' }
    ]
  },
  {
    value: '经管',
    label: '经管',
    children: [
      { value: '个人成长', label: '个人成长' },
      { value: '智慧', label: '智慧' },
      { value: '理财', label: '理财' },
      { value: '营销', label: '营销' },
      { value: '创业', label: '创业' },
      { value: '管理', label: '管理' },
      { value: '投资', label: '投资' }
    ]
  },
  {
    value: '经济',
    label: '经济',
    children: [
      { value: '管理', label: '管理' },
      { value: '理财', label: '理财' }
    ]
  },
  { value: '管理', label: '管理' },
  {
    value: '科普',
    label: '科普',
    children: [
      { value: '物理', label: '物理' },
      { value: '生物', label: '生物' },
      { value: '数学', label: '数学' },
      { value: '综合', label: '综合' }
    ]
  },
  {
    value: '哲学',
    label: '哲学',
    children: [
      { value: '经典', label: '经典' },
      { value: '通俗', label: '通俗' },
      { value: '宗教', label: '宗教' }
    ]
  },
  {
    value: '美学',
    label: '美学',
    children: [
      { value: '经典', label: '经典' }
    ]
  },
  {
    value: '社会学',
    label: '社会学',
    children: [
      { value: '经典', label: '经典' }
    ]
  },
  {
    value: '政治',
    label: '政治',
    children: [
      { value: '军事', label: '军事' }
    ]
  },
  { value: '法律', label: '法律' },
  {
    value: '人文',
    label: '人文',
    children: [
      { value: '社科', label: '社科' }
    ]
  },
  {
    value: '艺术',
    label: '艺术',
    children: [
      { value: '摄影', label: '摄影' }
    ]
  },
  { value: '自然科学', label: '自然科学' },
  { value: '医药卫生', label: '医药卫生' },
  { value: '工业技术', label: '工业技术' },
  {
    value: '建筑',
    label: '建筑',
    children: [
      { value: '工程', label: '工程' }
    ]
  },
  {
    value: '农业',
    label: '农业',
    children: [
      { value: '林业', label: '林业' }
    ]
  },
  {
    value: '教育',
    label: '教育',
    children: [
      { value: '考试', label: '考试' }
    ]
  },
  {
    value: '生活',
    label: '生活',
    children: [
      { value: '时尚', label: '时尚' }
    ]
  },
  {
    value: '动漫',
    label: '动漫',
    children: [
      { value: '绘本', label: '绘本' }
    ]
  },
  {
    value: '少儿',
    label: '少儿',
    children: [
      { value: '育儿', label: '育儿' }
    ]
  }
];

const form = reactive<BookCreateDTO>({
  title: '',
  author: '',
  isbn: '',
  publisher: '',
  category: '',
  publishDate: '',
  description: '',
  totalStock: 10,
  coverUrl: ''
});

const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  publishDate: [{ required: true, message: '请选择出版日期', trigger: 'change' }],
  coverUrl: [{ required: true, message: '请输入或上传封面', trigger: 'blur' }],
  description: [{ required: true, message: '请输入简介', trigger: 'blur' }]
};

onMounted(async () => {
  if (isEdit.value) {
    // Load book data
    const book = await getBookById(route.params.id as string);
    if (book) {
      form.title = book.title;
      form.author = book.author;
      form.isbn = book.isbn;
      form.publisher = book.publisher;
      form.category = book.category;
      form.publishDate = book.publishDate;
      form.description = book.description;
      form.totalStock = book.totalStock;
      form.coverUrl = book.coverUrl;
      if (form.coverUrl && form.coverUrl.startsWith('data:')) {
        coverType.value = 'upload';
      }
    }
  }
});

const handleFileChange = (uploadFile: UploadFile) => {
  if (!uploadFile.raw) return;
  
  const isImage = uploadFile.raw.type.startsWith('image/');
  const isLt2M = uploadFile.raw.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!');
    return;
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!');
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(uploadFile.raw);
  reader.onload = () => {
    form.coverUrl = reader.result as string;
  };
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const payload: BookCreateDTO | BookUpdateDTO = { ...form };
        if (isEdit.value) {
          await updateBook(route.params.id as string, payload);
          ElMessage.success('更新成功');
        } else {
          await createBook(payload);
          ElMessage.success('创建成功');
        }
        router.push('/books/search');
      } catch (error) {
        console.error(error);
      }
    }
  });
};
</script>

<style scoped lang="scss">
.book-form-container {
  max-width: 800px;
  margin: 0 auto;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: var(--el-transition-duration-fast);
  
  &:hover {
    border-color: #409EFF;
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>

