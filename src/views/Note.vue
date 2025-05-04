<template>
  <div class="note-editor">
    <div class="editor-header">
      <div class="header-main">
        <h2>{{ isNewNote ? '新建笔记' : '编辑笔记' }}</h2>
        <select v-model="selectedCategory" class="category-select">
          <option value="">选择分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="header-actions">
        <button @click="saveNote" class="save-btn">保存</button>
        <router-link to="/notes" class="cancel-btn">取消</router-link>
      </div>
    </div>
    <div class="editor-content">
      <input
        v-model="noteTitle"
        type="text"
        placeholder="笔记标题"
        class="title-input"
      >
      <div class="tool-switcher">
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'text' }" 
          @click="setTool('text')"
          title="文本工具"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/>
          </svg>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'draw' }" 
          @click="setTool('draw')"
          title="绘图工具"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
      </div>
      <div class="paper-container" :class="currentTool">
        <div class="canvas-area" :class="currentTool">
          <textarea
            v-if="currentTool === 'text'"
            v-model="noteContent"
            placeholder="开始写作..."
            class="content-input"
          ></textarea>
          <DrawingCanvas
            v-else
            v-model:drawing="drawingData"
            class="drawing-canvas"
            :show-toolbar-position="'top'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DrawingCanvas from '../components/DrawingCanvas.vue'

const route = useRoute()
const router = useRouter()

const isNewNote = computed(() => route.params.id === 'new')
const noteTitle = ref('')
const noteContent = ref('')
const drawingData = ref('')
const currentTool = ref('text')
const selectedCategory = ref('')

interface Category {
  id: number
  name: string
}

const categories = ref<Category[]>([
  { id: 1, name: '工作' },
  { id: 2, name: '学习' },
  { id: 3, name: '生活' }
])

const setTool = (tool: 'text' | 'draw') => {
  currentTool.value = tool
}

const saveNote = () => {
  if (!selectedCategory.value) {
    alert('请选择笔记分类')
    return
  }

  const note = {
    title: noteTitle.value,
    content: noteContent.value,
    drawing: drawingData.value,
    date: new Date().toISOString().split('T')[0],
    categoryId: selectedCategory.value
  }
  console.log('Saving note:', note)
  router.push('/notes')
}
</script>

<style scoped>
.note-editor {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .note-editor {
    padding: 1rem;
  }

  .editor-header {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .header-actions {
    width: 100%;
    display: flex;
    gap: 0.5rem;
  }

  .save-btn,
  .cancel-btn {
    flex: 1;
    text-align: center;
  }

  .title-input {
    font-size: 1.2rem;
    padding: 0.5rem;
  }

  .content-input {
    min-height: 300px;
    padding: 0.5rem;
  }
}

.editor-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.header-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--input-color);
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.category-select:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-color, #42b983)25;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.save-btn {
  background-color: var(--save-btn-bg);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px var(--card-shadow);
}

.save-btn:hover {
  background-color: var(--save-btn-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px var(--card-shadow);
}

.cancel-btn {
  color: var(--cancel-btn-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin-left: 1rem;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.cancel-btn:hover {
  color: var(--cancel-btn-hover);
}

.editor-content {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px var(--card-shadow);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.title-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background-color: var(--input-bg);
  color: var(--input-color);
}

.title-input::placeholder {
  color: var(--input-placeholder);
  transition: color 0.3s ease;
}

.title-input:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-color, #42b983)25;
}

.tool-switcher {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--card-shadow);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.tool-btn {
  width: 36px;
  height: 36px;
  padding: 6px;
  border: 2px solid transparent;
  background: var(--btn-bg);
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--title-color);
}

.tool-btn:hover {
  background: var(--btn-hover);
  transform: translateY(-1px);
}

.tool-btn.active {
  background: var(--btn-active-bg);
  border-color: var(--btn-active);
  color: var(--btn-active);
}

.paper-container {
  min-height: 600px;
  border-radius: 8px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.paper-container.text,
.paper-container.draw {
  background: var(--card-bg);
  transition: background-color 0.3s ease;
}

.paper-container::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 100%;
  background: #ff6b6b;
  border-radius: 1px;
}

.canvas-area {
  width: 100%;
  height: 100%;
  min-height: 500px;
  position: relative;
}

.content-input {
  width: 100%;
  height: 100%;
  min-height: 500px;
  padding: 2rem;
  border: none;
  outline: none;
  font-size: 1rem;
  line-height: 1.6;
  background: transparent;
  resize: none;
  color: var(--input-color);
  transition: color 0.3s ease;
}

.content-input::placeholder {
  color: var(--input-placeholder);
  transition: color 0.3s ease;
}

.drawing-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 4px;
}
</style>