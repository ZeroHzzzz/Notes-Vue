<template>
  <div class="drawing-canvas-container" :class="{
    'toolbar-left': showToolbarPosition === 'left',
    'toolbar-top': showToolbarPosition === 'top'
  }">
    <div class="canvas-toolbar">
      <div class="toolbar-group">
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'pen' }" 
          @click="setTool('pen')"
          title="自由绘制"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'line' }" 
          @click="setTool('line')"
          title="直线"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'rect' }" 
          @click="setTool('rect')"
          title="矩形"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
          </svg>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'circle' }" 
          @click="setTool('circle')"
          title="圆形"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          </svg>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'text' }" 
          @click="setTool('text')"
          title="文本"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/>
          </svg>
        </button>
        <button 
          class="tool-btn" 
          :class="{ active: currentTool === 'eraser' }" 
          @click="setTool('eraser')"
          title="橡皮擦"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M15.14 3c-.51 0-1.02.2-1.41.59L2.59 14.73c-.78.77-.78 2.04 0 2.83L5.03 20h7.94l8.44-8.44c.79-.78.79-2.05 0-2.83l-4.84-4.84c-.39-.39-.9-.59-1.41-.59M17 18l-2 2h7v-2"/>
          </svg>
        </button>
      </div>
      
      <div class="toolbar-group">
        <div class="color-group">
          <input 
            type="color" 
            v-model="strokeColor" 
            class="color-picker"
            title="选择颜色"
          >
          <button 
            v-for="color in ['#000000', '#ff4757', '#2ed573', '#1e90ff', '#5352ed']" 
            :key="color"
            class="color-preset"
            :style="{ backgroundColor: color }"
            @click="strokeColor = color"
            :title="'选择' + color"
          ></button>
        </div>
        
        <select v-model="lineWidth" class="line-width" title="线条粗细">
          <option value="2">细</option>
          <option value="5">中</option>
          <option value="8">粗</option>
        </select>
      </div>
      
      <div class="toolbar-group">
        <button 
          class="action-btn undo-btn" 
          @click="undo"
          title="撤销"
          :disabled="!canUndo"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
          </svg>
        </button>
        <button 
          class="action-btn clear-btn" 
          @click="clearCanvas"
          title="清空画布"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </div>
    <canvas
      ref="canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      @touchend.passive="stopDrawing"
      @wheel.passive
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  width?: number
  height?: number
  showToolbarPosition?: 'top' | 'left'
}>()

const emit = defineEmits<{
  (e: 'update:drawing', value: string): void
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const currentTool = ref('pen')
const strokeColor = ref('#000000')
const lineWidth = ref('2')
const canUndo = ref(false)
let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0
let startX = 0
let startY = 0
let drawingStates: ImageData[] = []
let currentPath: { x: number; y: number }[] = []
let textInput: HTMLDivElement | null = null

const createTextInput = (x: number, y: number) => {
  if (!canvas.value || textInput) return

  textInput = document.createElement('div')
  textInput.contentEditable = 'true'
  textInput.className = 'canvas-text-input'
  textInput.style.position = 'absolute'
  textInput.style.left = `${x}px`
  textInput.style.top = `${y}px`
  textInput.style.minWidth = '100px'
  textInput.style.minHeight = '24px'
  textInput.style.padding = '4px'
  textInput.style.background = 'transparent'
  textInput.style.border = '1px solid #1890ff'
  textInput.style.outline = 'none'
  textInput.style.font = `${ctx?.lineWidth || 16}px sans-serif`
  textInput.style.color = strokeColor.value
  textInput.style.zIndex = '1000'

  textInput.addEventListener('blur', () => {
    if (!ctx || !textInput || !textInput.textContent) return
    
    const rect = textInput.getBoundingClientRect()
    const canvasRect = canvas.value!.getBoundingClientRect()
    
    ctx.font = `${ctx.lineWidth}px sans-serif`
    ctx.fillStyle = strokeColor.value
    ctx.fillText(
      textInput.textContent,
      rect.left - canvasRect.left,
      rect.top - canvasRect.top + ctx.lineWidth
    )
    
    saveState()
    textInput.remove()
    textInput = null
  })

  canvas.value.parentElement?.appendChild(textInput)
  textInput.focus()
}

const initCanvas = () => {
  if (!canvas.value) return

  const container = canvas.value.parentElement
  if (!container) return

  const containerWidth = container.clientWidth
  const containerHeight = container.clientHeight

  canvas.value.width = props.width || containerWidth
  canvas.value.height = props.height || Math.min(400, containerHeight)

  ctx = canvas.value.getContext('2d')
  if (ctx) {
    ctx.strokeStyle = strokeColor.value
    ctx.lineWidth = Number(lineWidth.value)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCanvas)
})

watch(strokeColor, (newColor) => {
  if (ctx) {
    ctx.strokeStyle = newColor
  }
})

watch(lineWidth, (newWidth) => {
  if (ctx) {
    ctx.lineWidth = Number(newWidth)
  }
})

const setTool = (tool: string) => {
  currentTool.value = tool
  if (ctx) {
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = Number(lineWidth.value) * 2
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = Number(lineWidth.value)
    }
  }
}

const saveState = () => {
  if (!canvas.value || !ctx) return
  const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height)
  drawingStates.push(imageData)
  canUndo.value = true
}

const undo = () => {
  if (!canvas.value || !ctx || drawingStates.length === 0) return
  const previousState = drawingStates.pop()
  if (previousState) {
    ctx.putImageData(previousState, 0, 0)
  }
  canUndo.value = drawingStates.length > 0
  emit('update:drawing', canvas.value.toDataURL())
}

const startDrawing = (e: MouseEvent) => {
  if (!canvas.value || !ctx) return

  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height
  const x = (e.clientX - rect.left) * scaleX
  const y = (e.clientY - rect.top) * scaleY

  if (currentTool.value === 'text') {
    createTextInput(e.clientX - rect.left, e.clientY - rect.top)
    return
  }

  isDrawing.value = true
  startX = lastX = x
  startY = lastY = y

  if (currentTool.value === 'pen') {
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    currentPath = [{ x: lastX, y: lastY }]
  }

  // 保存当前状态用于撤销
  saveState()
}

const draw = (e: MouseEvent) => {
  if (!isDrawing.value || !ctx || !canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height
  const x = (e.clientX - rect.left) * scaleX
  const y = (e.clientY - rect.top) * scaleY

  if (currentTool.value === 'pen' || currentTool.value === 'eraser') {
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastX = x
    lastY = y
  } else {
    // 清除上一次的预览
    if (drawingStates.length > 0) {
      ctx.putImageData(drawingStates[drawingStates.length - 1], 0, 0)
    }

    // 绘制新的预览
    ctx.beginPath()
    switch (currentTool.value) {
      case 'line':
        ctx.moveTo(startX, startY)
        ctx.lineTo(x, y)
        break
      case 'rect':
        const width = x - startX
        const height = y - startY
        ctx.rect(startX, startY, width, height)
        break
      case 'circle':
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2))
        ctx.arc(startX, startY, radius, 0, Math.PI * 2)
        break
    }
    ctx.stroke()
  }

  // 发送绘图数据
  emit('update:drawing', canvas.value.toDataURL())
}

const handleTouchStart = (e: TouchEvent) => {
  if (!canvas.value || !ctx) return

  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height
  const touch = e.touches[0]

  startX = lastX = (touch.clientX - rect.left) * scaleX
  startY = lastY = (touch.clientY - rect.top) * scaleY
  isDrawing.value = true

  if (currentTool.value === 'pen') {
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
  }

  saveState()
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDrawing.value || !ctx || !canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height
  const touch = e.touches[0]

  const x = (touch.clientX - rect.left) * scaleX
  const y = (touch.clientY - rect.top) * scaleY

  if (currentTool.value === 'pen' || currentTool.value === 'eraser') {
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()
    lastX = x
    lastY = y
  } else {
    // 清除上一次的预览
    if (drawingStates.length > 0) {
      ctx.putImageData(drawingStates[drawingStates.length - 1], 0, 0)
    }

    // 绘制新的预览
    ctx.beginPath()
    switch (currentTool.value) {
      case 'line':
        ctx.moveTo(startX, startY)
        ctx.lineTo(x, y)
        break
      case 'rect':
        const width = x - startX
        const height = y - startY
        ctx.rect(startX, startY, width, height)
        break
      case 'circle':
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2))
        ctx.arc(startX, startY, radius, 0, Math.PI * 2)
        break
    }
    ctx.stroke()
  }

  emit('update:drawing', canvas.value.toDataURL())
}

const stopDrawing = () => {
  if (!isDrawing.value) return
  isDrawing.value = false

  // 如果不是自由绘制工具，在停止时保存状态
  if (currentTool.value !== 'pen' && currentTool.value !== 'eraser') {
    saveState()
  }

  // 发送最终的绘图数据
  if (canvas.value) {
    emit('update:drawing', canvas.value.toDataURL())
  }
}

const clearCanvas = () => {
  if (!canvas.value || !ctx) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  drawingStates = []
  canUndo.value = false
  emit('update:drawing', '')
}
</script>

<style scoped>
.drawing-canvas-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border-radius: 8px;
  overflow: visible;
  position: relative;
}

.canvas-text-input {
  position: absolute;
  font-family: sans-serif;
  line-height: 1.2;
  white-space: pre-wrap;
  word-break: break-word;
  cursor: text;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.drawing-canvas-container.toolbar-left {
  flex-direction: row;
}

.drawing-canvas-container.toolbar-top {
  flex-direction: column;
}

.canvas-toolbar {
  padding: 8px;
  display: flex;
  gap: 12px;
  background: var(--toolbar-bg);
  border: 1px solid var(--toolbar-border);
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.toolbar-left .canvas-toolbar {
  flex-direction: column;
  margin-bottom: 0;
  margin-right: 8px;
  padding: 12px 8px;
}

.toolbar-left .toolbar-group {
  flex-direction: column;
}

.toolbar-group {
  display: flex;
  gap: 8px;
  align-items: center;
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
  color: var(--btn-color);
}

.tool-btn:hover {
  background: var(--btn-hover);
  transform: translateY(-1px);
}

.tool-btn.active {
  background: var(--btn-active-bg);
  border-color: var(--btn-active-border);
  color: var(--btn-active-color);
}

.color-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-picker {
  width: 36px;
  height: 36px;
  padding: 3px;
  border: 2px solid var(--toolbar-border);
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-preset {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.color-preset:hover {
  transform: scale(1.1);
}

.line-width {
  padding: 6px 12px;
  border: 2px solid var(--toolbar-border);
  border-radius: 8px;
  background: var(--btn-bg);
  cursor: pointer;
  color: var(--btn-color);
  font-size: 14px;
}

.action-btn {
  width: 36px;
  height: 36px;
  padding: 6px;
  border: 2px solid var(--toolbar-border);
  background: var(--btn-bg);
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btn-color);
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--btn-hover);
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.undo-btn {
  background: var(--btn-bg);
}

.clear-btn {
  background: var(--clear-btn-bg);
  border-color: var(--clear-btn-border);
  color: var(--clear-btn-color);
}

.clear-btn:hover {
  background: var(--clear-btn-hover);
}

canvas {
  background: var(--canvas-bg);
  border-radius: 0 0 8px 8px;
  touch-action: none;
  width: 100%;
  height: 100%;
  display: block;
}
</style>