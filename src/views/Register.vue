<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 实时验证邮箱格式
const validateEmailInput = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!formData.value.email) {
    errors.value.email = '请输入邮箱'
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
  } else {
    errors.value.email = ''
  }
}

const validateForm = () => {
  let isValid = true
  errors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  if (!formData.value.username) {
    errors.value.username = '请输入用户名'
    isValid = false
  } else if (formData.value.username.length < 3) {
    errors.value.username = '用户名至少需要3个字符'
    isValid = false
  }

  if (!formData.value.email) {
    errors.value.email = '请输入邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }

  if (!formData.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = '密码至少需要6个字符'
    isValid = false
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = '请确认密码'
    isValid = false
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validateForm()) {
    // 这里添加注册逻辑
    console.log('注册信息:', formData.value)
    router.push('/login')
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>注册账号</h1>
        <p>创建你的 Notes 账号</p>
      </div>
      <form class="register-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">
            <i class="fas fa-user"></i>
            用户名
          </label>
          <input
            type="text"
            id="username"
            v-model="formData.username"
            :class="{ error: errors.username }"
            placeholder="请输入用户名"
          >
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="email">
            <i class="fas fa-envelope"></i>
            邮箱
          </label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            @input="validateEmailInput"
            :class="{ error: errors.email }"
            placeholder="请输入邮箱"
          >
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">
            <i class="fas fa-lock"></i>
            密码
          </label>
          <input
            type="password"
            id="password"
            v-model="formData.password"
            :class="{ error: errors.password }"
            placeholder="请输入密码"
          >
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">
            <i class="fas fa-lock"></i>
            确认密码
          </label>
          <input
            type="password"
            id="confirmPassword"
            v-model="formData.confirmPassword"
            :class="{ error: errors.confirmPassword }"
            placeholder="请再次输入密码"
          >
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" class="register-btn">注册</button>

        <div class="register-footer">
          已有账号？
          <router-link to="/login">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  padding: 2rem;
}

.register-card {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px var(--card-shadow);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: 2rem;
}

.register-header p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-primary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group i {
  color: var(--accent-color);
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
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
}

.register-btn {
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent-color);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--accent-shadow);
}

.register-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
}

.register-footer {
  margin-top: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.register-footer a {
  color: var(--accent-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.register-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }

  .register-card {
    padding: 1.5rem;
  }

  .register-header h1 {
    font-size: 1.75rem;
  }
}
</style>