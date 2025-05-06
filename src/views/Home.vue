<template>
  <div class="home">

    <!-- 顶部区域 -->
    <div class="top-section">
      <!-- 轮播图区域 -->
      <div class="carousel">
        <div class="carousel-container" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
          <div v-for="(slide, index) in carouselSlides" 
               :key="index"
               class="carousel-slide"
               :class="{ active: currentSlide === index }">
            <template v-if="slide.type === 'video'">
              <div class="video-container" 
                @click="toggleVideoFullscreen(index)"
                @mouseenter="playVideo(index)"
                @mouseleave="pauseVideo(index)">
                <video
                  :ref="el => { if (el) videoRefs[index] = el }"
                  :src="slide.source"
                  class="slide-video"
                  :class="{ 'fullscreen': isVideoFullscreen }"
                  :poster="slide.image"
                  loop
                  muted
                  playsinline
                ></video>
              </div>
            </template>
            <template v-else>
              <img :src="slide.image" :alt="slide.title">
            </template>
            <div class="slide-info">
              <h3>{{ slide.title }}</h3>
              <p>{{ slide.description }}</p>
            </div>
          </div>
          <button class="carousel-btn prev" @click="prevSlide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-btn next" @click="nextSlide">
            <i class="fas fa-chevron-right"></i>
          </button>
          <div class="carousel-indicators">
            <span v-for="(_, index) in carouselSlides" 
                  :key="index"
                  :class="{ active: currentSlide === index }"
                  @click="currentSlide = index"></span>
          </div>
        </div>
      </div>

      <!-- 用户信息区域 -->
      <div class="user-panel">
        <div class="user-info">
          <div class="user-avatar">
            <img :src="userAvatar" :alt="username">
          </div>
          <div class="user-welcome">
            <h2>欢迎回来，{{ username }}</h2>
            <p class="last-visit">上次访问：{{ lastVisit }}</p>
          </div>
        </div>
        <div class="daily-quote" @click="updateDailyQuote" title="点击更新名言">
          <i class="fas fa-quote-left quote-icon"></i>
          <p class="quote-text">{{ dailyQuote.text }}</p>
          <p class="quote-author">—— {{ dailyQuote.author }}</p>
          <i class="fas fa-sync refresh-icon"></i>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-label">连续打卡</span>
            <span class="stat-value">{{ streak }} 天</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">今日状态</span>
            <button class="checkin-btn" @click="handleCheckin" :disabled="hasCheckedIn">
              {{ hasCheckedIn ? '已打卡' : '打卡' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能卡片区 -->
    <div class="feature-cards">
      <div class="feature-card" @click="$router.push('/notes')">
        <i class="fas fa-book-open"></i>
        <div class="card-content">
          <h3>我的笔记</h3>
          <p>{{ notesCount }} 个笔记</p>
        </div>
      </div>
      <div class="feature-card primary" @click="$router.push('/note/new')">
        <i class="fas fa-plus"></i>
        <div class="card-content">
          <h3>新建笔记</h3>
          <p>开始记录新想法</p>
        </div>
      </div>
      <div class="feature-card" @click="$router.push('/profile')">
        <i class="fas fa-chart-line"></i>
        <div class="card-content">
          <h3>数据统计</h3>
          <p>查看笔记分析</p>
        </div>
      </div>
    </div>

    <!-- 最近笔记区 -->
    <div class="recent-notes">
      <h2>最近笔记</h2>
      <div class="notes-grid">
        <div v-for="note in recentNotes" :key="note.id" 
             class="note-card" 
             @click="$router.push(`/note/${note.id}`)">
          <div class="note-content">
            <span class="note-category">{{ note.category }}</span>
            <h4>{{ note.title }}</h4>
            <p>{{ note.preview }}</p>
          </div>
          <div class="note-meta">
            <span><i class="fas fa-calendar"></i> {{ note.date }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const videoRefs = ref<{ [key: number]: HTMLVideoElement }>({});
const isVideoFullscreen = ref(false);

const playVideo = (index: number) => {
  const video = videoRefs.value[index];
  if (video) {
    video.play();
  }
};

const pauseVideo = (index: number) => {
  const video = videoRefs.value[index];
  if (video) {
    video.pause();
    video.currentTime = 0;
    video.load(); // 重新加载视频，这会显示封面图片
  }
};

const toggleVideoFullscreen = (index: number) => {
  const video = videoRefs.value[index];
  if (!video) return;
  
  if (!isVideoFullscreen.value) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
    isVideoFullscreen.value = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    isVideoFullscreen.value = false;
  }
};

// 用户信息
const username = ref('ZeroHzzzz');
const lastVisit = ref('2025-01-24 15:30');
const notesCount = ref(12);
const userAvatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=ZeroHzzzz');
const streak = ref(7);
const hasCheckedIn = ref(false);

// 名言列表
const quotes = [
  { text: '学而不思则罔，思而不学则殆。', author: '孔子' },
  { text: '纸上得来终觉浅，绝知此事要躬行。', author: '陆游' },
  { text: '业精于勤，荒于嬉；行成于思，毁于随。', author: '韩愈' },
  { text: '读书破万卷，下笔如有神。', author: '杜甫' },
  { text: '不积跬步，无以至千里；不积小流，无以成江海。', author: '荀子' },
  { text: '天行健，君子以自强不息。', author: '周易' }
];

// 每日名言
const dailyQuote = ref(quotes[Math.floor(Math.random() * quotes.length)]);

// 更新每日名言
const updateDailyQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  dailyQuote.value = quotes[randomIndex];
};

// 轮播图数据
const carouselSlides = ref([
  {
    title: '算法训练营',
    description: '系统提升算法能力，从入门到精通',
    type: 'video',
    source: '/src/assets/1616862789-1-192.mp4',
    image: '/src/assets/slide1.jpg'
  },
  {
    title: '竞赛备战营',
    description: '针对性训练，助你在比赛中脱颖而出',
    type: 'image',
    image: '/src/assets/slide2.jpg'
  },
  {
    title: '大厂面试题',
    description: '精选大厂算法面试题，助你一臂之力',
    type: 'image',
    image: '/src/assets/slide3.jpg'
  }
]);

const currentSlide = ref(0);
const autoPlayInterval = ref<number | null>(null);

// 轮播图控制方法
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + carouselSlides.value.length) % carouselSlides.value.length;
};

const startAutoPlay = () => {
  if (!autoPlayInterval.value) {
    autoPlayInterval.value = setInterval(nextSlide, 5000);
  }
};

const stopAutoPlay = () => {
  if (autoPlayInterval.value) {
    clearInterval(autoPlayInterval.value);
    autoPlayInterval.value = null;
  }
};

// 打卡方法
const handleCheckin = () => {
  if (!hasCheckedIn.value) {
    hasCheckedIn.value = true;
    streak.value++;
    // 这里可以添加打卡请求
  }
};

// 最近笔记
const recentNotes = ref([
  {
    id: 1,
    title: '动态规划专题笔记',
    preview: '总结了常见的动态规划题型和解题思路...',
    date: '2025-01-24',
    category: '算法'
  },
  {
    id: 2,
    title: '图论基础知识',
    preview: '整理了图的基本概念和常用算法...',
    date: '2025-01-23',
    category: '基础'
  },
  {
    id: 3,
    title: '比赛经验总结',
    preview: '记录了最近参加比赛的心得体会...',
    date: '2025-01-22',
    category: '竞赛'
  }
]);

onMounted(() => {
  startAutoPlay();
  // 这里可以添加获取用户信息和笔记数据的逻辑
});
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: var(--bg-color);
  display: flex;
  flex-direction: column;
}



/* 顶部区域样式 */
.top-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: stretch;
}

/* 轮播图样式 */
.carousel {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: var(--card-bg);
  box-shadow: 0 4px 12px var(--card-shadow);
  min-height: 400px;
}

.carousel-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--card-bg);
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.carousel-slide.active {
  opacity: 1;
}

.carousel-slide img,
.carousel-slide video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.slide-video {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  transition: all 0.3s ease;
}

.slide-video.fullscreen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  background: black;
}

.slide-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
}

.slide-info h3 {
  margin: 0;
  font-size: 1.5rem;
}

.slide-info p {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  opacity: 0.9;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 1rem;
}

.carousel-btn.next {
  right: 1rem;
}

.carousel-indicators {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.carousel-indicators span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: white;
  transform: scale(1.2);
}

/* 用户信息面板样式 */
.user-panel {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 4px 12px var(--card-shadow);
  min-height: 400px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent-color);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-welcome h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.last-visit {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.daily-quote {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  background: var(--bg-color);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.daily-quote:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--card-shadow);
}

.daily-quote .refresh-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.daily-quote:hover .refresh-icon {
  opacity: 0.5;
}

.daily-quote:hover .refresh-icon:hover {
  opacity: 1;
  transform: rotate(180deg);
}

.quote-icon {
  color: var(--accent-color);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.quote-text {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: var(--text-primary);
  font-style: italic;
  line-height: 1.5;
}

.quote-author {
  margin: 0.5rem 0 0;
  text-align: right;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.stat-value {
  color: var(--accent-color);
  font-size: 1.25rem;
  font-weight: bold;
}

.checkin-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent-color);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkin-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--accent-shadow);
}

.checkin-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .top-section {
    grid-template-columns: 1fr;
  }

  .carousel-container {
    height: 200px;
  }

  .slide-info h3 {
    font-size: 1.25rem;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
  }

  .user-welcome h2 {
    font-size: 1.25rem;
  }
}

/* 功能卡片区样式 */
.feature-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--card-shadow);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px var(--card-shadow);
}

.feature-card i {
  font-size: 2rem;
  color: var(--accent-color);
}

.feature-card.primary {
  background: var(--accent-color);
}

.feature-card.primary i,
.feature-card.primary h3,
.feature-card.primary p {
  color: white;
}

.card-content h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.card-content p {
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
}

/* 最近笔记区样式 */
.recent-notes {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 12px var(--card-shadow);
}

.recent-notes h2 {
  margin: 0 0 2rem;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.note-card {
  background: var(--bg-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px var(--card-shadow);
}

.note-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--accent-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.note-content h4 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.note-content p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.note-meta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.note-meta i {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  .welcome-content h1 {
    font-size: 2rem;
  }

  .feature-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .notes-grid {
    grid-template-columns: 1fr;
  }
}
</style>