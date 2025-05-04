<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value.toString())
}

// 初始化深浅色模式
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode) {
    isDarkMode.value = savedDarkMode === 'true'
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }
})
</script>

<template>
  <nav class="navbar">
    <div class="nav-content">
      <router-link to="/" class="nav-brand">
        <img src="../assets/logo.svg" alt="Logo" class="nav-logo" />
        <span class="nav-title">Notes</span>
      </router-link>
      <div class="nav-links">
        <router-link to="/home" class="nav-link">
          <i class="fas fa-home"></i>
          <span>首页</span>
        </router-link>
        <router-link to="/notes" class="nav-link">
          <i class="fas fa-book"></i>
          <span>笔记</span>
        </router-link>
        <router-link to="/profile" class="nav-link">
          <i class="fas fa-chart-line"></i>
          <span>统计</span>
        </router-link>
        <router-link to="/settings" class="nav-link">
          <i class="fas fa-cog"></i>
          <span>设置</span>
        </router-link>
        <router-link to="/contact" class="nav-link">
          <i class="fas fa-envelope"></i>
          <span>联系</span>
        </router-link>
        <button class="theme-toggle nav-link" @click="toggleDarkMode" :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'">
          <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          <!-- <span class="mode-text">{{ isDarkMode ? '浅色' : '深色' }}</span> -->
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--nav-bg);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px var(--nav-shadow);
  z-index: 100;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.nav-content {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.nav-brand:hover {
  color: var(--accent-color);
}

.nav-logo {
  height: 32px;
  width: 32px;
  transition: transform 0.3s ease;
}

.nav-brand:hover .nav-logo {
  transform: scale(1.1);
}

.nav-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--accent-color);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--hover-bg);
}

.nav-link.router-link-active {
  color: var(--text-primary);
}

.nav-link.router-link-active::before {
  opacity: 0.1;
}

.nav-link:hover::before {
  opacity: 0.05;
}

.nav-link i {
  font-size: 1.1rem;
}

.theme-toggle {
  border: none;
  background: none;
  cursor: pointer;
}

.theme-toggle i {
  transition: transform 0.3s ease;
}

.theme-toggle:hover i {
  transform: rotate(30deg);
}

@media (max-width: 768px) {
  .nav-title {
    display: none;
  }

  .nav-link span {
    display: none;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .nav-link i {
    font-size: 1.2rem;
  }
}
</style>