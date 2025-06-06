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
      <div class="notes-header">
        <h2>我的笔记</h2>
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索笔记..."
            class="search-input"
          >
          <i class="fas fa-search search-icon"></i>
        </div>
      </div>
      <div class="notes-container">
        <div class="notes-grid">
          <draggable
            v-model="paginatedNotes"
            class="notes-list"
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
              <div class="plus-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="96" height="96">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor"/>
                </svg>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <!-- 分页导航 -->
      <div class="pagination">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          v-for="page in totalPages" 
          :key="page"
          class="page-btn"
          :class="{ active: currentPage === page }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
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
  // 第一页
  {
    id: 1,
    title: '我的第一篇笔记',
    preview: '这是一个示例笔记内容...',
    date: '2025-01-20',
    categoryId: 1
  },
  {
    id: 2,
    title: '学习计划',
    preview: '今天的学习目标是...',
    date: '2025-01-21',
    categoryId: 2
  },
  {
    id: 3,
    title: '项目想法',
    preview: '关于新项目的一些构思...',
    date: '2025-01-22',
    categoryId: 3
  },
  // 第二页
  {
    id: 4,
    title: '每日总结',
    preview: '今天完成了以下任务...',
    date: '2025-01-23',
    categoryId: 1
  },
  {
    id: 5,
    title: '读书笔记',
    preview: '《设计模式》读书笔记...',
    date: '2025-01-24',
    categoryId: 2
  },
  {
    id: 6,
    title: '周末计划',
    preview: '这个周末准备...',
    date: '2025-01-25',
    categoryId: 3
  },
  // 第三页
  {
    id: 7,
    title: '会议记录',
    preview: '今天的会议讨论了...',
    date: '2025-01-26',
    categoryId: 1
  },
  {
    id: 8,
    title: '技术研究',
    preview: '研究了新的前端框架...',
    date: '2025-01-27',
    categoryId: 2
  },
  {
    id: 9,
    title: '生活感悟',
    preview: '最近的一些思考...',
    date: '2025-01-28',
    categoryId: 3
  },
  // 第四页
  {
    id: 10,
    title: '工作安排',
    preview: '下周的工作计划...',
    date: '2025-01-29',
    categoryId: 1
  },
  {
    id: 11,
    title: '算法笔记',
    preview: '动态规划的学习笔记...',
    date: '2025-01-30',
    categoryId: 2
  },
  {
    id: 12,
    title: '旅行计划',
    preview: '计划去的地方有...',
    date: '2025-01-31',
    categoryId: 3
  }
])

const isDragging = ref(false)
const draggedNoteId = ref<number | null>(null)
const isOverTrash = ref(false)

const selectCategory = (categoryId: number) => {
  currentCategory.value = categoryId
  currentPage.value = 1
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
  if (categoryId === 0) return notes.value.length
  if (categoryId === -1) return notes.value.filter(note => !note.categoryId).length
  return notes.value.filter(note => note.categoryId === categoryId).length
}

const searchQuery = ref('')

const currentPage = ref(1)
const pageSize = 5

const filteredNotes = computed(() => {
  let filtered = notes.value
  
  // 按分类筛选
  if (currentCategory.value && currentCategory.value !== 0) {
    if (currentCategory.value === -1) {
      filtered = filtered.filter(note => !note.categoryId)
    } else {
      filtered = filtered.filter(note => note.categoryId === currentCategory.value)
    }
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.preview.toLowerCase().includes(query)
    )
  }
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredNotes.value.length / pageSize))

const paginatedNotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredNotes.value.slice(start, start + pageSize)
})

const changePage = (page: number) => {
  currentPage.value = page
}



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

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--input-bg);
  color: var(--input-color);
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px var(--accent-shadow);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 1rem;
}

@media (max-width: 768px) {
  .notes-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-2px);
}

.page-btn.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .pagination {
    flex-wrap: wrap;
  }
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
  grid-template-rows: auto;
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
  user-select: text;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.note-card::selection,
.note-card *::selection {
  background: rgba(var(--accent-color-rgb), 0.2);
  color: var(--text-color);
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
  transform: translateY(-8px);
  box-shadow: 0 8px 30px var(--card-shadow);
  border-color: var(--accent-color);
}

.note-card:hover::before {
  transform: scaleX(1);
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
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--card-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  color: var(--text-color);
  user-select: none;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  height: 100%;
  min-height: 280px;
}

.add-note-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100%;
  gap: 1rem;
}

.plus-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--btn-bg);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.plus-icon svg {
  width: 24px;
  height: 24px;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.add-note-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.add-note-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px var(--card-shadow);
  border-color: var(--accent-color);
}

.add-note-card:hover .plus-icon {
  background: var(--accent-color);
  transform: scale(1.1);
}

.add-note-card:hover .plus-icon svg {
  color: white;
}

.add-note-card:hover .add-note-text {
  color: var(--accent-color);
}

.plus-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: var(--accent-color);
  transition: transform 0.3s ease;
}

.add-note-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.add-note-card:hover .add-note-text {
  color: var(--accent-color);
}

.add-note-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px var(--card-shadow);
  border-color: var(--accent-color);
}

.add-note-card:hover .plus-icon {
  transform: scale(1.2);
  transition: transform 0.3s ease;
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