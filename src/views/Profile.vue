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

    <!-- 成就系统表格 -->
    <div class="achievements-card">
      <h3>我的成就</h3>
      <div class="table-container">
        <table class="achievements-table">
          <thead>
            <tr>
              <th>成就</th>
              <th>描述</th>
              <th>进度</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="achievement in achievements" :key="achievement.id">
              <td class="achievement-name">
                <span class="achievement-icon" :class="{ 'unlocked': achievement.unlocked }">
                  {{ achievement.icon }}
                </span>
                {{ achievement.name }}
              </td>
              <td>{{ achievement.description }}</td>
              <td class="progress-cell">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: achievement.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ achievement.progress }}%</span>
              </td>
              <td>
                <span class="status-badge" :class="{ 'unlocked': achievement.unlocked }">
                  {{ achievement.unlocked ? '已解锁' : '未解锁' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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

// 成就系统数据
const achievements = ref([
  {
    id: 1,
    name: '初来乍到',
    description: '创建第一篇笔记',
    progress: 100,
    unlocked: true,
    icon: '📝'
  },
  {
    id: 2,
    name: '勤奋学者',
    description: '连续记录7天',
    progress: Math.min(Math.round((streak.value / 7) * 100), 100),
    unlocked: streak.value >= 7,
    icon: '🔥'
  },
  {
    id: 3,
    name: '分类达人',
    description: '使用所有笔记分类',
    progress: 60,
    unlocked: false,
    icon: '📁'
  },
  {
    id: 4,
    name: '笔记专家',
    description: '创建10篇笔记',
    progress: Math.min(Math.round((notes.value.length / 10) * 100), 100),
    unlocked: notes.value.length >= 10,
    icon: '🌟'
  }
])

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
.achievements-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 4px 20px var(--card-shadow);
}

.achievements-card h3 {
  color: var(--text-color);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.table-container {
  overflow-x: auto;
}

.achievements-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.achievements-table th,
.achievements-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.achievements-table th {
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-color);
}

.achievements-table tr:hover {
  background: var(--bg-color);
}

.achievement-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.achievement-icon {
  font-size: 1.25rem;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.achievement-icon.unlocked {
  opacity: 1;
}

.progress-cell {
  width: 200px;
}

.progress-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-right: 0.5rem;
  flex-grow: 1;
}

.progress-fill {
  height: 100%;
  background: var(--accent-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--border-color);
  color: var(--text-secondary);
}

.status-badge.unlocked {
  background: var(--accent-color);
  color: white;
}

@media (max-width: 768px) {
  .achievements-card {
    padding: 1rem;
    margin-top: 1.5rem;
  }

  .achievements-table th,
  .achievements-table td {
    padding: 0.75rem;
  }

  .progress-cell {
    width: 150px;
  }
}
</style>