<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dashboard">
    <div class="container">
      <!-- 欢迎横幅 -->
      <div class="welcome-banner bg-primary text-white p-4 rounded mb-4">
        <h2>欢迎回来</h2>
        <p>以下是为您推荐的个性化健康资源</p>
      </div>


      <!-- 快速操作区域 -->
      <div class="quick-actions">
        <h3 class="mb-3">快速操作</h3>
        <div class="row">
          <div class="col-md-3 mb-3">
            <button class="btn btn-outline-primary w-100 py-3">
              <i class="fas fa-calendar-check fa-2x mb-2"></i>
              <br>预约服务
            </button>
          </div>
          <div class="col-md-3 mb-3">
            <button class="btn btn-outline-primary w-100 py-3">
              <i class="fas fa-file-medical fa-2x mb-2"></i>
              <br>健康记录
            </button>
          </div>
          <div class="col-md-3 mb-3">
            <button class="btn btn-outline-primary w-100 py-3">
              <i class="fas fa-users fa-2x mb-2"></i>
              <br>社区活动
            </button>
          </div>
          <div class="col-md-3 mb-3">
            <button class="btn btn-outline-primary w-100 py-3">
              <i class="fas fa-cog fa-2x mb-2"></i>
              <br>设置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
