<template>
  <div class="profile">
    <div class="stats-grid">
      <div class="stat-card total-notes">
        <div class="stat-icon">📝</div>
        <div class="stat-content">
          <h3>总笔记数</h3>
          <div class="stat-value">{{ totalNotes }}</div>
        </div>
      </div>
      <div class="stat-card categories">
        <div class="stat-icon">📁</div>
        <div class="stat-content">
          <h3>分类数量</h3>
          <div class="stat-value">{{ totalCategories }}</div>
        </div>
      </div>
      <div class="stat-card this-month">
        <div class="stat-icon">📅</div>
        <div class="stat-content">
          <h3>本月新增</h3>
          <div class="stat-value">{{ notesThisMonth }}</div>
        </div>
      </div>
      <div class="stat-card streak">
        <div class="stat-icon">🔥</div>
        <div class="stat-content">
          <h3>连续记录</h3>
          <div class="stat-value">{{ streak }} 天</div>
        </div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h3>笔记分类统计</h3>
        <div class="pie-chart" ref="categoryChart"></div>
      </div>
      <div class="chart-card">
        <h3>近期活跃度</h3>
        <div class="line-chart" ref="activityChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import * as echarts from 'echarts'

// 模拟数据
const notes = ref([
  { id: 1, title: '笔记1', categoryId: 1, date: '2025-01-20' },
  { id: 2, title: '笔记2', categoryId: 2, date: '2025-01-21' },
  { id: 3, title: '笔记3', categoryId: 1, date: '2025-01-22' }
])

const categories = ref([
  { id: 0, name: '全部' },
  { id: -1, name: '未分类' },
  { id: 1, name: '工作' },
  { id: 2, name: '学习' },
  { id: 3, name: '生活' }
])

// 统计数据
const totalNotes = computed(() => notes.value.length)
const totalCategories = computed(() => categories.value.length - 2) // 减去"全部"和"未分类"
const notesThisMonth = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  return notes.value.filter(note => {
    const noteDate = new Date(note.date)
    return noteDate.getMonth() === thisMonth && noteDate.getFullYear() === thisYear
  }).length
})
const streak = ref(5) // 模拟数据

// 图表相关
const categoryChart = ref<HTMLElement | null>(null)
const activityChart = ref<HTMLElement | null>(null)

onMounted(() => {
  // 初始化分类统计图表
  if (categoryChart.value) {
    const chart = echarts.init(categoryChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'outside'
        },
        labelLine: {
          show: true
        },
        data: [
          { value: 4, name: '工作' },
          { value: 3, name: '学习' },
          { value: 2, name: '生活' },
          { value: 1, name: '未分类' }
        ]
      }]
    })

    // 监听窗口大小变化
    window.addEventListener('resize', () => chart.resize())
  }

  // 初始化活跃度图表
  if (activityChart.value) {
    const chart = echarts.init(activityChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ['1/18', '1/19', '1/20', '1/21', '1/22', '1/23', '1/24']
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [{
        data: [2, 1, 3, 2, 4, 1, 2],
        type: 'line',
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          width: 3
        },
        areaStyle: {
          opacity: 0.3
        }
      }]
    })

    // 监听窗口大小变化
    window.addEventListener('resize', () => chart.resize())
  }
})
</script>

<style scoped>
.profile {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px var(--card-shadow);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px var(--card-shadow);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-color);
  border-radius: 12px;
  color: white;
}

.stat-content h3 {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px var(--card-shadow);
}

.chart-card h3 {
  color: var(--text-color);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.pie-chart,
.line-chart {
  height: 300px;
  width: 100%;
}

@media (max-width: 768px) {
  .profile {
    padding: 1rem;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }

  .chart-card {
    padding: 1rem;
  }
}
</style>