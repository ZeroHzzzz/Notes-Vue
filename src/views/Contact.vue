<template>
  <div class="contact">
    <!-- 联系页面标题 -->
    <h1>联系我们</h1>

    <div class="contact-container">
      <!-- 联系表单 -->
      <div class="contact-form">
        <h2>发送消息</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="formData.name" required>
          </div>
          <div class="form-group">
            <label for="email">邮箱</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              @input="handleEmailInput"
              :class="{ 'error': emailError }"
              required
            >
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>
          <div class="form-group">
            <label for="subject">主题</label>
            <input type="text" id="subject" v-model="formData.subject" required>
          </div>
          <div class="form-group">
            <label for="message">消息</label>
            <textarea id="message" v-model="formData.message" rows="5" required></textarea>
          </div>
          <button type="submit" class="submit-btn">发送消息</button>
        </form>
      </div>

      <!-- 联系信息 -->
      <div class="contact-info">
        <h2>联系方式</h2>
        <div class="info-item">
          <i class="fas fa-map-marker-alt"></i>
          <div>
            <h3>地址</h3>
            <p>浙江省杭州市浙工大路288号</p>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-phone"></i>
          <div>
            <h3>电话</h3>
            <p>+86 123 4567 8900</p>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-envelope"></i>
          <div>
            <h3>邮箱</h3>
            <p>contact@aipaper.com</p>
          </div>
        </div>
        <div class="info-item">
          <i class="fas fa-clock"></i>
          <div>
            <h3>工作时间</h3>
            <p>周一至周五: 9:00 - 18:00</p>
            <p>周六至周日: 10:00 - 16:00</p>
          </div>
        </div>

        <!-- 社交媒体链接 -->
        <div class="social-links">
          <a href="#" title="微信"><i class="fab fa-weixin"></i></a>
          <a href="#" title="微博"><i class="fab fa-weibo"></i></a>
          <a href="#" title="GitHub"><i class="fab fa-github"></i></a>
        </div>
      </div>
    </div>

    <!-- 地图区域 -->
    <div class="map-container">
      <h2>我们的位置</h2>
      <div class="map-placeholder">
        <!-- 这里可以集成实际的地图组件 -->
        <div class="map-placeholder-text">
          <i class="fas fa-map-marked-alt"></i>
          <p>地图加载中...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 表单数据
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// 邮箱验证状态
const emailError = ref('');

// 验证邮箱格式
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email) {
    emailError.value = '请输入邮箱地址';
    return false;
  }
  if (!emailRegex.test(email)) {
    emailError.value = '请输入有效的邮箱地址';
    return false;
  }
  emailError.value = '';
  return true;
};

// 监听邮箱输入
const handleEmailInput = () => {
  validateEmail(formData.value.email);
};

// 提交表单
const handleSubmit = () => {
  // 验证邮箱
  if (!validateEmail(formData.value.email)) {
    return;
  }

  // 这里添加表单提交逻辑
  console.log('表单提交:', formData.value);
  
  // 重置表单
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  emailError.value = '';
};
</script>

<style scoped>
.contact {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.contact h1 {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-primary);
  font-size: 2.5rem;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

/* 联系表单样式 */
.contact-form {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px var(--card-shadow);
}

.contact-form h2 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-shadow);
}

.form-group input.error {
  border-color: #ff4d4f;
}

.form-group input.error:focus {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.error-message {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--accent-shadow);
}

/* 联系信息样式 */
.contact-info {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px var(--card-shadow);
}

.contact-info h2 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-item i {
  font-size: 1.5rem;
  color: var(--accent-color);
  margin-top: 0.25rem;
}

.info-item h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.info-item p {
  margin: 0.25rem 0 0;
  color: var(--text-secondary);
}

.social-links {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.social-links a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.social-links a:hover {
  background: var(--accent-color);
  color: white;
  transform: translateY(-2px);
}

/* 地图区域样式 */
.map-container {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px var(--card-shadow);
}

.map-container h2 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.map-placeholder {
  width: 100%;
  height: 400px;
  background: var(--bg-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.map-placeholder-text {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.map-placeholder-text i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.map-placeholder-text p {
  font-size: 1.1rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }

  .contact h1 {
    font-size: 2rem;
  }

  .map-placeholder {
    height: 300px;
  }
}
</style>