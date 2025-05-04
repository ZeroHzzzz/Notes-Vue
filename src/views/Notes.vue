<template>
  <div class="notes">
    <div class="sidebar">
      <h3>分类</h3>
      <div class="categories-list">
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
          :class="{ active: currentCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
          <span class="note-count">{{ getNoteCountByCategory(category.id) }}</span>
        </button>
      </div>
      <button class="add-category-btn" @click="showAddCategory = true">添加分类</button>
      
      <!-- 添加分类的弹窗 -->
      <div v-if="showAddCategory" class="modal-overlay" @click="showAddCategory = false">
        <div class="modal" @click.stop>
          <h3>添加新分类</h3>
          <input 
            v-model="newCategoryName" 
            type="text" 
            placeholder="请输入分类名称"
            class="category-input"
          >
          <div class="modal-actions">
            <button @click="addCategory" class="confirm-btn">确认</button>
            <button @click="showAddCategory = false" class="cancel-btn">取消</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="notes-main">
      <h2>我的笔记</h2>
      <div class="notes-container">
        <div class="notes-grid">
          <draggable
            v-model="filteredNotes"
            class="notes-list"
            :list="filteredNotes"
            :animation="200"
            drag-class="ghost-note"
            @start="onDragStart"
            @end="onDragEnd"
            ghost-class="drag-note"
            item-key="id"
          >
            <template #item="{ element }">
              <div class="note-card">
                <div class="note-content">
                  <h3>{{ element.title }}</h3>
                  <p>{{ element.preview }}</p>
                  <img v-if="element.drawing" :src="element.drawing" class="drawing-preview" alt="涂鸦预览">
                  <div class="note-footer">
                    <span class="date">{{ element.date }}</span>
                    <div class="actions">
                      <router-link :to="`/note/${element.id}`" class="edit-btn">编辑</router-link>
                      <button @click="deleteNote(element.id)" class="delete-btn">删除</button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </draggable>
          <router-link to="/note/new" class="add-note-card">
            <div class="add-note-content">
              <div class="plus-icon">+</div>
              <span>新建笔记</span>
            </div>
          </router-link>
        </div>
      </div>
      <div 
        class="trash-zone" 
        :class="{ 'trash-active': isDragging }"
        @dragenter="onTrashEnter"
        @dragleave="onTrashLeave"
        @dragover.prevent
        @drop="onTrashDrop"
      >
        <div class="trash-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" fill="currentColor"/>
          </svg>
        </div>
        <span>拖放到此处删除</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'

interface Category {
  id: number
  name: string
}

interface Note {
  id: number
  title: string
  preview: string
  drawing?: string
  date: string
  categoryId?: number
}

const categories = ref<Category[]>([
  { id: 0, name: '全部' },
  { id: -1, name: '未分类' },
  { id: 1, name: '工作' },
  { id: 2, name: '学习' },
  { id: 3, name: '生活' }
])

const currentCategory = ref<number | null>(null)
const showAddCategory = ref(false)
const newCategoryName = ref('')

const notes = ref<Note[]>([
  {
    id: 1,
    title: '我的第一篇笔记',
    preview: '这是一个示例笔记内容...',
    date: '2025-01-20'
  },
  {
    id: 2,
    title: '学习计划',
    preview: '今天的学习目标是...',
    date: '2025-01-21'
  },
  {
    id: 3,
    title: '项目想法',
    preview: '关于新项目的一些构思...',
    date: '2025-01-22'
  }
])

const isDragging = ref(false)
const draggedNoteId = ref<number | null>(null)
const isOverTrash = ref(false)

const selectCategory = (categoryId: number) => {
  currentCategory.value = currentCategory.value === categoryId ? null : categoryId
}

const addCategory = () => {
  if (newCategoryName.value.trim()) {
    const newId = Math.max(...categories.value.map(c => c.id)) + 1
    categories.value.push({
      id: newId,
      name: newCategoryName.value.trim()
    })
    newCategoryName.value = ''
    showAddCategory.value = false
  }
}

const getNoteCountByCategory = (categoryId: number) => {
  return notes.value.filter(note => note.categoryId === categoryId).length
}

const filteredNotes = computed(() => {
  if (!currentCategory.value || currentCategory.value === 0) return notes.value
  if (currentCategory.value === -1) return notes.value.filter(note => !note.categoryId)
  return notes.value.filter(note => note.categoryId === currentCategory.value)
})

const onDragStart = (e: any) => {
  isDragging.value = true
  const element = e.item
  draggedNoteId.value = element.__draggable_context.element.id
  
  // 添加拖拽时的样式
  element.classList.add('dragging')
  document.body.style.cursor = 'grabbing'

  // 为其他卡片添加过渡动画类
  const cards = document.querySelectorAll('.note-card:not(.dragging)')
  cards.forEach(card => card.classList.add('card-transition'))

  // 创建拖拽轨迹效果
  const createTrail = () => {
    const trail = document.createElement('div')
    trail.className = 'drag-trail'
    trail.style.left = `${e.clientX}px`
    trail.style.top = `${e.clientY}px`
    document.body.appendChild(trail)
    setTimeout(() => trail.remove(), 800)
  }

  // 监听鼠标移动创建轨迹
  const handleMouseMove = (e: MouseEvent) => {
    requestAnimationFrame(() => createTrail())
  }

  document.addEventListener('mousemove', handleMouseMove)
  
  // 清理事件监听
  element.addEventListener('dragend', () => {
    document.removeEventListener('mousemove', handleMouseMove)
    // 移除过渡动画类
    cards.forEach(card => card.classList.remove('card-transition'))
  }, { once: true })
}

const onChange = (e: any) => {
  console.log('List changed:', e)
}

const onDragEnd = (e: any) => {
  isDragging.value = false
  draggedNoteId.value = null
  isOverTrash.value = false
  document.body.style.cursor = 'default'
  
  // 移除拖拽样式
  if (e.item) {
    e.item.classList.remove('dragging')
  }
}

const onTrashEnter = () => {
  isOverTrash.value = true
}

const onTrashLeave = () => {
  isOverTrash.value = false
}

const onTrashDrop = () => {
  if (draggedNoteId.value !== null) {
    deleteNote(draggedNoteId.value)
  }
  isOverTrash.value = false
}

const deleteNote = (id: number) => {
  notes.value = notes.value.filter(note => note.id !== id)
}
</script>

<style scoped>
.notes {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px var(--card-shadow);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.sidebar h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: var(--btn-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: var(--btn-hover);
  transform: translateY(-1px);
}

.category-item.active {
  background: var(--btn-active-bg);
  color: var(--btn-active-color);
  border: 1px solid var(--btn-active-border);
}

.note-count {
  background: var(--btn-hover);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.add-category-btn {
  width: 100%;
  padding: 0.75rem;
  border: 1px dashed var(--border-color);
  border-radius: 4px;
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-category-btn:hover {
  background: var(--btn-hover);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px var(--card-shadow);
  width: 90%;
  max-width: 400px;
}

.modal h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.category-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 1rem;
  background: var(--input-bg);
  color: var(--input-color);
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.confirm-btn,
.cancel-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn {
  background: var(--save-btn-bg);
  color: white;
}

.confirm-btn:hover {
  background: var(--save-btn-hover);
}

.cancel-btn {
  background: var(--btn-bg);
  color: var(--text-color);
}

.cancel-btn:hover {
  background: var(--btn-hover);
}

.notes-main {
  flex: 1;
}

@media (max-width: 768px) {
  .notes {
    flex-direction: column;
    padding: 1rem;
  }

  .sidebar {
    width: 100%;
  }
}

.notes {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--text-color);
}

.notes-container {
  margin: 2rem 0;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
}

.notes-list {
  display: contents;
}

@media (max-width: 768px) {
  .notes {
    padding: 1rem;
  }

  .notes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .note-card {
    margin-bottom: 1rem;
  }

  .note-content {
    padding: 1rem;
  }

  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .edit-btn, .delete-btn {
    width: 100%;
    text-align: center;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.note-card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--card-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: grab;
  color: var(--text-color);
  user-select: none;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-color);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.note-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px var(--card-shadow);
  border-color: var(--accent-color);
}

.note-card:hover::before {
  transform: scaleX(1);
}

.hidden {
  opacity: 0.3;
}

.drag-note {
  transform: scale(1.05) rotate(1deg) !important;
  box-shadow: 0 30px 80px var(--drag-shadow),
              inset 0 0 30px var(--drag-shadow);
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  border: 2px solid var(--drag-border);
  cursor: grabbing !important;
  z-index: 100;
  animation: dragPulse 1.5s infinite;
  position: relative;
  opacity: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ghost-note {
  background: var(--ghost-bg);
  border: 2px dashed var(--ghost-border);
  backdrop-filter: blur(4px);
  animation: ghostPulse 1s ease-in-out infinite;
  transform-origin: center;
}

@keyframes ghostPulse {
  0% {
    opacity: 0.7;
    transform: scale(1) translateY(0);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02) translateY(-4px);
  }
  100% {
    opacity: 0.7;
    transform: scale(1) translateY(0);
  }
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.note-card {
  animation: cardEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.note-card:nth-child(3n + 1) { animation-delay: 0.1s; }
.note-card:nth-child(3n + 2) { animation-delay: 0.2s; }
.note-card:nth-child(3n + 3) { animation-delay: 0.3s; }

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.note-card:active {
  cursor: grabbing;
  transform: scale(1.02);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1024px) {
  .dragging {
    width: calc(50% - 1rem);
  }
}

@media (max-width: 768px) {
  .dragging {
    width: calc(100% - 1rem);
  }
}

.notes-grid > * {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

.card-transition {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-transition:nth-child(3n + 1) { transition-delay: 0.1s; }
.card-transition:nth-child(3n + 2) { transition-delay: 0.2s; }
.card-transition:nth-child(3n + 3) { transition-delay: 0.3s; }

.trash-zone {
  position: fixed;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1.5rem;
  border-radius: 8px;
  background: var(--delete-bg);
  border: 2px dashed var(--delete-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  opacity: 0;
  color: var(--delete-color);
}

.trash-zone.trash-active {
  bottom: 2rem;
  opacity: 1;
}

.trash-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trash-icon svg {
  width: 100%;
  height: 100%;
}

.note-content {
  padding: 1.75rem;
  position: relative;
  z-index: 1;
}

.note-content h3 {
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.note-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.drawing-preview {
  width: 100%;
  height: 180px;
  object-fit: cover;
  margin: 1rem 0;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease;
}

.drawing-preview:hover {
  transform: scale(1.02);
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  background: var(--card-bg);
  position: relative;
  z-index: 1;
  min-width: 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.date {
  color: var(--date-color);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.4rem 1rem;
  background: var(--date-bg);
  border-radius: 20px;
  letter-spacing: 0.5px;
  border: 1px solid var(--border-color);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.date::before {
  content: '📅';
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  white-space: nowrap;
}

.edit-btn {
  background: var(--accent-color);
  color: white;
  text-decoration: none;
  box-shadow: 0 2px 8px var(--accent-shadow);
  position: relative;
  overflow: hidden;
}

.edit-btn::before {
  content: '✏️';
  margin-right: 0.3rem;
  font-size: 1rem;
}

.edit-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--accent-shadow);
}

.edit-btn:hover::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  transform: scale(0);
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    transform: scale(1);
    opacity: 0;
  }
}

.delete-btn {
  background: transparent;
  color: var(--delete-color);
  border: 2px solid var(--delete-color);
  position: relative;
  overflow: hidden;
}

.delete-btn::before {
  content: '🗑️';
  margin-right: 0.3rem;
  font-size: 1rem;
}

.delete-btn:hover {
  background: var(--delete-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--delete-shadow);
}

.delete-btn:hover::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  transform: scale(0);
  animation: ripple 0.6s ease-out;
}

.add-note-card {
  display: block;
  background: var(--card-bg);
  border-radius: 12px;
  border: 2px dashed var(--accent-color);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 200px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: cardEnter 0.6s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.add-note-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--accent-color);
  gap: 1rem;
}

.plus-icon {
  font-size: 3.5rem;
  font-weight: 200;
  line-height: 1;
  transition: transform 0.3s ease;
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--accent-color);
  border-radius: 50%;
}

.add-note-card:hover .plus-icon {
  border-style: solid;
  transform: rotate(90deg) scale(1.1);
}

.add-note-card:hover {
  background: var(--accent-color);
  border-style: solid;
  transform: translateY(-8px);
  box-shadow: 0 8px 30px var(--card-shadow);
}

.add-note-card:hover .add-note-content {
  color: white;
}

.add-note-card:hover .plus-icon {
  transform: rotate(90deg);
}
</style>