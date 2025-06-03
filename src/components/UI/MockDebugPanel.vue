<template>
  <div class="mock-debug-panel" v-if="isVisible">
    <button @click="togglePanel" class="debug-toggle-btn">
      <i class="pi pi-bug"></i>
    </button>
    
    <transition name="slide">
      <div v-if="isExpanded" class="debug-content">
        <div class="debug-header">
          <h3>Mock System Debug</h3>
          <button @click="isExpanded = false" class="close-btn">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="debug-body">
          <!-- Mock Status -->
          <div class="debug-section">
            <h4>Mock Status</h4>
            <div class="status-grid">
              <div class="status-item">
                <span>Global Mocks:</span>
                <Tag :severity="mockConfig.USE_MOCKS ? 'success' : 'danger'">
                  {{ mockConfig.USE_MOCKS ? 'ON' : 'OFF' }}
                </Tag>
              </div>
              <div class="status-item">
                <span>Auth Module:</span>
                <Tag :severity="mockConfig.modules.auth ? 'success' : 'danger'">
                  {{ mockConfig.modules.auth ? 'ON' : 'OFF' }}
                </Tag>
              </div>
            </div>
          </div>
          
          <!-- Test Login -->
          <div class="debug-section">
            <h4>Test Mock Login</h4>
            <Button 
              label="Test Mock Login" 
              @click="testMockLogin"
              :loading="testing"
              size="small"
              severity="info"
            />
            
            <div v-if="testResult" class="test-result">
              <pre>{{ JSON.stringify(testResult, null, 2) }}</pre>
            </div>
          </div>
          
          <!-- Console Logs -->
          <div class="debug-section">
            <h4>Console Logs</h4>
            <div class="logs-container">
              <div v-for="(log, index) in consoleLogs" :key="index" class="log-entry">
                <span class="log-time">{{ log.time }}</span>
                <span class="log-type" :class="log.type">{{ log.type }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </div>
          
          <!-- Mock Handlers -->
          <div class="debug-section">
            <h4>Available Mock Handlers</h4>
            <div class="handlers-list">
              <div v-for="handler in authHandlers" :key="handler" class="handler-item">
                {{ handler }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import axiosClient from '@/axiosClient';
import MOCK_CONFIG from '@/config/mockConfig';

// Estado
const isVisible = ref(true);
const isExpanded = ref(false);
const testing = ref(false);
const testResult = ref(null);
const consoleLogs = ref([]);
const mockConfig = reactive({ ...MOCK_CONFIG });

// Handlers de auth disponibles
const authHandlers = [
  'POST /login',
  'POST /Usuarios/Login',
  'POST /logout',
  'GET /auth/me'
];

// Capturar console.log
const originalLog = console.log;
const captureLog = (...args) => {
  originalLog(...args);
  
  // Solo capturar logs relacionados con mocks
  const message = args.join(' ');
  if (message.includes('MOCK') || message.includes('mock') || message.includes('Login')) {
    consoleLogs.value.push({
      time: new Date().toLocaleTimeString(),
      type: 'log',
      message: message.substring(0, 200)
    });
    
    // Mantener solo los últimos 20 logs
    if (consoleLogs.value.length > 20) {
      consoleLogs.value.shift();
    }
  }
};

// Toggle panel
const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};

// Test mock login
const testMockLogin = async () => {
  testing.value = true;
  testResult.value = null;
  
  try {
    const response = await axiosClient.post('/Usuarios/Login', {
      usuarioName: 'carlos@inroom.com',
      password: 'test123'
    });
    
    testResult.value = {
      success: true,
      data: response.data
    };
  } catch (error) {
    testResult.value = {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  } finally {
    testing.value = false;
  }
};

// Lifecycle
onMounted(() => {
  console.log = captureLog;
  
  // Actualizar config cuando cambie
  window.addEventListener('mock-config-changed', (event) => {
    Object.assign(mockConfig, event.detail);
  });
});

onUnmounted(() => {
  console.log = originalLog;
});
</script>

<style scoped>
.mock-debug-panel {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 9998;
}

.debug-toggle-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: #ff6b6b;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.debug-toggle-btn:hover {
  transform: scale(1.1);
  background: #ff5252;
}

.debug-content {
  position: absolute;
  bottom: 60px;
  right: 0;
  width: 500px;
  max-height: 600px;
  background: #1e1e1e;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.debug-header {
  padding: 16px;
  background: #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
}

.debug-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #ff6b6b;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
}

.close-btn:hover {
  color: #fff;
}

.debug-body {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.debug-section {
  margin-bottom: 24px;
}

.debug-section h4 {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #2d2d2d;
  border-radius: 4px;
  font-size: 0.85rem;
}

.test-result {
  margin-top: 12px;
  padding: 12px;
  background: #2d2d2d;
  border-radius: 4px;
  overflow-x: auto;
}

.test-result pre {
  margin: 0;
  font-size: 0.75rem;
  color: #00ff00;
}

.logs-container {
  max-height: 200px;
  overflow-y: auto;
  background: #2d2d2d;
  border-radius: 4px;
  padding: 8px;
}

.log-entry {
  font-size: 0.75rem;
  margin-bottom: 4px;
  font-family: monospace;
}

.log-time {
  color: #666;
  margin-right: 8px;
}

.log-type {
  margin-right: 8px;
  font-weight: bold;
}

.log-type.log {
  color: #4caf50;
}

.log-type.error {
  color: #f44336;
}

.log-message {
  color: #ccc;
}

.handlers-list {
  background: #2d2d2d;
  border-radius: 4px;
  padding: 8px;
}

.handler-item {
  font-size: 0.8rem;
  font-family: monospace;
  color: #4caf50;
  margin-bottom: 4px;
}

/* Animación */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>