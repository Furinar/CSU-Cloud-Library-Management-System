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
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="计算机/编程" value="计算机/编程" />
            <el-option label="文学/小说" value="文学/小说" />
            <el-option label="历史/传记" value="历史/传记" />
          </el-select>
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
        router.push('/admin/books/list');
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

