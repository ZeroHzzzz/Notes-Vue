<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import NavBar from './components/NavBar.vue'
import './styles/themes.css'

const route = useRoute()
const showNavBar = computed(() => !['/', '/login', '/register'].includes(route.path))
const showToast = ref(false)
const toastMessage = ref('')

const copyUrl = () => {
  navigator.clipboard.writeText(window.location.origin + '/home').then(() => {
    toastMessage.value = '链接已复制到剪贴板'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  }).catch(err => {
    console.error('复制失败:', err)
    toastMessage.value = '复制失败，请重试'
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2000)
  })
}
</script>

<template>
  <div class="app">
    <NavBar v-if="showNavBar" />
    <main :class="{ 'main-content': showNavBar }">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <div class="footer-content">
      <div class="footer-info">
        <p>&copy; 2025 Notes. All rights reserved.</p>
        <p class="support">技术支持：<a href="#" class="footer-link">浙江工业大学</a></p>
      </div>
      <div class="footer-links">
        <a href="javascript:void(0)" class="footer-link" @click="copyUrl">分享</a>
        <router-link to="/contact" class="footer-link">反馈</router-link>
        <a href="#" class="footer-link">帮助</a>
      </div>
      </div>
    </footer>
    <div class="toast" v-if="showToast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<style>
.main-content {
  padding-top: 60px;
  flex: 1;
  background: var(--bg-color);
}
</style>

<style>
.app {
  min-height: 100vh;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
}

.nav {
  background: var(--nav-bg);
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px var(--nav-shadow);
  display: flex;
  gap: 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: var(--hover-bg);
}

.nav-link.router-link-active {
  color: var(--active-color);
  font-weight: bold;
}

.theme-toggle {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--hover-bg);
}

.main {
  min-height: calc(100vh - 8rem);
}

.footer {
  background: var(--nav-bg);
  padding: 1.5rem 0;
  box-shadow: 0 -2px 8px var(--nav-shadow);
  margin-top: 2rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-primary);
}

.footer-info p {
  margin: 0;
  font-size: 0.9rem;
}

.support {
  margin-top: 0.5rem !important;
  color: var(--text-secondary);
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  }

  .footer-links {
    gap: 1rem;
  }
}

.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--nav-bg);
  color: var(--text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px var(--nav-shadow);
  z-index: 1000;
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
