<template>
  <div class="settings">
    <h1>设置</h1>

    <!-- 主题色设置 -->
    <div class="settings-section theme-settings">
      <h2>主题色设置</h2>
      <div class="theme-grid">
        <div 
          v-for="theme in themes" 
          :key="theme.name"
          class="theme-card"
          :class="{ active: currentTheme === theme.name }"
          @click="selectTheme(theme.name)"
        >
          <div class="theme-preview">
            <div class="preview-accent" :style="{ '--theme-color': theme.color }"></div>
          </div>
          <div class="theme-name">{{ theme.label }}</div>
        </div>
      </div>
    </div>
    
    <div class="settings-container">
      

      <!-- 个人信息设置 -->
      <div class="settings-section">
        <h2>个人信息</h2>
        <div class="profile-container">
          <div class="avatar-container">
            <div class="avatar-preview" :style="{ backgroundImage: `url(${avatarPreview || 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZeroHzzzz'})` }">
              <label class="avatar-upload-label" for="avatar-upload">
                <i class="fas fa-camera"></i>
                <span>更换头像</span>
              </label>
            </div>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              @change="handleAvatarChange"
              class="avatar-input"
            >
            <div class="avatar-tip">点击头像更换</div>
          </div>
          <div class="settings-form">
            <div class="form-group">
              <label for="username">用户名</label>
              <input 
                type="text" 
                id="username" 
                v-model="formData.username" 
                placeholder="请输入新的用户名"
              >
            </div>
            <div class="form-group">
              <label for="email">邮箱</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email" 
                @input="handleEmailInput"
                :class="{ 'error': emailError }"
                placeholder="请输入新的邮箱地址"
              >
              <span v-if="emailError" class="error-message">{{ emailError }}</span>
            </div>
            <button @click="saveProfile" class="save-btn">保存个人信息</button>
          </div>
        </div>
      </div>

      <!-- 密码修改 -->
      <div class="settings-section">
        <h2>修改密码</h2>
        <div class="settings-form">
          <div class="form-group">
            <label for="currentPassword">当前密码</label>
            <input 
              type="password" 
              id="currentPassword" 
              v-model="formData.currentPassword"
              placeholder="请输入当前密码"
            >
          </div>
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <input 
              type="password" 
              id="newPassword" 
              v-model="formData.newPassword"
              placeholder="请输入新密码"
            >
          </div>
          <div class="form-group">
            <label for="confirmPassword">确认新密码</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="formData.confirmPassword"
              placeholder="请再次输入新密码"
              :class="{ 'error': passwordError }"
            >
            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
          </div>
          <button @click="changePassword" class="save-btn">修改密码</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 表单数据
const formData = ref({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  avatar: ''
})

const avatarPreview = ref('')

// 处理头像上传
const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          avatarPreview.value = e.target.result as string
          formData.value.avatar = file
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert('请选择图片文件')
    }
  }
}

// 错误状态
const emailError = ref('')
const passwordError = ref('')

// 主题相关
const currentTheme = ref('default')
const themes = [
  {
    name: 'default',
    label: '默认绿色',
    color: '#42b983'
  },
  {
    name: 'coral',
    label: '珊瑚粉',
    color: '#ff7f7f'
  },
  {
    name: 'mint',
    label: '薄荷绿',
    color: '#98d8d6'
  },
  {
    name: 'ocean',
    label: '海蓝色',
    color: '#5c9ead'
  }
]

// 选择主题
const selectTheme = (themeName: string) => {
  currentTheme.value = themeName
  document.documentElement.style.setProperty('--accent-color', themes.find(t => t.name === themeName)?.color || '#42b983')
  localStorage.setItem('theme', themeName)
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme && themes.some(theme => theme.name === savedTheme)) {
    selectTheme(savedTheme)
  }
})



// 验证邮箱格式
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!email) {
    emailError.value = '请输入邮箱地址'
    return false
  }
  if (!emailRegex.test(email)) {
    emailError.value = '请输入有效的邮箱地址'
    return false
  }
  emailError.value = ''
  return true
}

// 监听邮箱输入
const handleEmailInput = () => {
  validateEmail(formData.value.email)
}

// 验证密码
const validatePassword = () => {
  if (formData.value.newPassword !== formData.value.confirmPassword) {
    passwordError.value = '两次输入的密码不一致'
    return false
  }
  if (formData.value.newPassword.length < 6) {
    passwordError.value = '密码长度不能少于6位'
    return false
  }
  passwordError.value = ''
  return true
}

// 保存个人信息
const saveProfile = () => {
  if (!validateEmail(formData.value.email)) {
    return
  }
  // 这里添加保存个人信息的逻辑
  const profileData = new FormData()
  profileData.append('username', formData.value.username)
  profileData.append('email', formData.value.email)
  if (formData.value.avatar) {
    profileData.append('avatar', formData.value.avatar)
  }
  console.log('保存个人信息:', {
    username: formData.value.username,
    email: formData.value.email,
    hasAvatar: !!formData.value.avatar
  })
}

// 修改密码
const changePassword = () => {
  if (!validatePassword()) {
    return
  }
  // 这里添加修改密码的逻辑
  console.log('修改密码:', {
    currentPassword: formData.value.currentPassword,
    newPassword: formData.value.newPassword
  })
}
</script>

<style scoped>
.theme-settings {
  grid-column: 1 / -1;
  margin-bottom: 0;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.theme-card {
  background: var(--card-bg);
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.theme-card:hover {
  border-color: var(--accent-color);
  box-shadow: 0 2px 8px var(--card-shadow);
}

.theme-card.active {
  border-color: var(--accent-color);
  background: color-mix(in srgb, var(--accent-color) 10%, var(--card-bg));
}

.theme-preview {
  height: 80px;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
  position: relative;
  background: var(--card-bg);
}

.preview-accent {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: linear-gradient(45deg, var(--theme-color), color-mix(in srgb, var(--theme-color) 70%, white));
  transform: rotate(-15deg);
  transition: all 0.3s ease;
  opacity: 0.9;
}

.theme-card:hover .preview-accent {
  transform: rotate(-5deg) scale(1.1);
  opacity: 1;
}

.theme-name {
  text-align: center;
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 6rem;
  min-height: calc(100vh - 60px);
}

.settings h1 {
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .settings-container {
    grid-template-columns: 1fr;
  }
}

.settings-section {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px var(--card-shadow);
  transition: all 0.3s ease;
}

.settings-section:hover {
  box-shadow: 0 6px 16px var(--card-shadow);
}

.profile-container {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;
}

.avatar-container {
  text-align: center;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  margin: 0 auto;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid var(--border-color);
  box-shadow: 0 2px 8px var(--card-shadow);
  margin-bottom: 0.5rem;
}

.avatar-tip {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  opacity: 0.8;
}

.avatar-preview:hover {
  border-color: var(--accent-color);
  box-shadow: 0 4px 12px var(--accent-shadow);
}

.avatar-preview:hover .avatar-upload-label {
  opacity: 1;
}

.avatar-upload-label {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-upload-label i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.avatar-input {
  display: none;
}

.settings-section h2 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  font-size: 1.25rem;
}

.settings-form {
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
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:hover {
  border-color: var(--accent-color);
  box-shadow: 0 2px 8px var(--accent-shadow);
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 4px 16px var(--accent-shadow);
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
}

.save-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent-color);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--accent-shadow);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .settings {
    padding: 1rem;
  }

  .settings-section {
    padding: 1.25rem;
  }

  .profile-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .avatar-container {
    margin: 0 auto;
    max-width: 200px;
  }

  .avatar-preview {
    width: 100px;
    height: 100px;
  }

  .theme-grid {
    gap: 1rem;
  }
}
</style>