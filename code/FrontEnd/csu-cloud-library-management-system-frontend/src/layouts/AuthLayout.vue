<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="welcome-side">
        <div class="brand-area">
          <img src="@/assets/csu.png" alt="CSU Logo" class="logo" />
          <h1 class="system-title">中南云图书管理系统</h1>
          <p class="system-subtitle">智慧 · 便捷 · 高效的图书管理服务平台</p>
        </div>
        <div class="decoration-circle"></div>
        <div class="decoration-circle-small"></div>
      </div>
      <div class="form-side">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.auth-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.auth-container {
  display: flex;
  width: 1000px;
  height: 600px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;

  @media (max-width: 1024px) {
    width: 90%;
    height: auto;
    min-height: 500px;
  }
}

.welcome-side {
  flex: 1;
  background: linear-gradient(135deg, #165C91 0%, #0f3a5f 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 40px;
  overflow: hidden;

  .brand-area {
    z-index: 2;
    text-align: center;
    
    .logo {
      width: 100px;
      height: 100px;
      object-fit: contain;
      margin-bottom: 24px;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      transition: transform 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
      }
    }

    .system-title {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
      letter-spacing: 1px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .system-subtitle {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 300;
      letter-spacing: 0.5px;
    }
  }

  .decoration-circle {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    top: -50px;
    left: -50px;
    z-index: 1;
  }
  
  .decoration-circle-small {
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    bottom: 50px;
    right: -30px;
    z-index: 1;
  }
}

.form-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #fff;
  position: relative;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
