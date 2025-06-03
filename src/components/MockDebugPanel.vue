<template>
  <div v-if="isVisible" class="fixed bottom-4 right-4 w-96 bg-gray-900 border border-purple-500/30 rounded-lg shadow-2xl p-4 z-50">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-purple-300 font-semibold flex items-center gap-2">
        <i class="pi pi-bug text-yellow-500"></i>
        Mock Debug Panel
      </h3>
      <Button 
        icon="pi pi-times" 
        severity="secondary" 
        text 
        size="small"
        @click="isVisible = false"
      />
    </div>
    
    <div class="space-y-3">
      <!-- Mock Status -->
      <div class="p-3 bg-gray-800 rounded">
        <p class="text-sm text-gray-400">Mock Status:</p>
        <p class="text-green-400 font-mono">{{ mockConfig.USE_MOCKS ? 'ENABLED' : 'DISABLED' }}</p>
      </div>
      
      <!-- Auth Module Status -->
      <div class="p-3 bg-gray-800 rounded">
        <p class="text-sm text-gray-400">Auth Module:</p>
        <p class="text-green-400 font-mono">{{ mockConfig.modules.auth ? 'ENABLED' : 'DISABLED' }}</p>
      </div>
      
      <!-- Test Login Button -->
      <Button 
        label="Test Mock Login" 
        icon="pi pi-user"
        class="w-full"
        severity="warning"
        @click="testMockLogin"
        :loading="testing"
      />
      
      <!-- Results -->
      <div v-if="testResult" class="p-3 bg-gray-800 rounded max-h-64 overflow-auto">
        <p class="text-sm text-gray-400 mb-2">Test Result:</p>
        <pre class="text-xs text-gray-300">{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>
      
      <!-- Console Logs -->
      <div v-if="consoleLogs.length > 0" class="p-3 bg-gray-800 rounded max-h-64 overflow-auto">
        <p class="text-sm text-gray-400 mb-2">Console Logs:</p>
        <div v-for="(log, index) in consoleLogs" :key="index" class="text-xs mb-1">
          <span class="text-purple-400">[{{ log.type }}]</span>
          <span class="text-gray-300 ml-2">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Toggle Button -->
  <Button 
    v-if="!isVisible"
    icon="pi pi-bug"
    severity="warning"
    class="fixed bottom-4 right-4 z-50"
    rounded
    @click="isVisible = true"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axiosClient from '@/axiosClient';
import MOCK_CONFIG from '@/config/mockConfig';

const isVisible = ref(false);
const testing = ref(false);
const testResult = ref(null);
const consoleLogs = ref([]);
const mockConfig = ref(MOCK_CONFIG);

// Intercept console logs
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

const interceptConsole = () => {
  console.log = (...args) => {
    originalLog(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ');
    
    if (message.includes('MOCK') || message.includes('mock') || message.includes('Login')) {
      consoleLogs.value.push({ type: 'LOG', message });
      if (consoleLogs.value.length > 50) consoleLogs.value.shift();
    }
  };
  
  console.error = (...args) => {
    originalError(...args);
    const message = args.join(' ');
    consoleLogs.value.push({ type: 'ERROR', message });
    if (consoleLogs.value.length > 50) consoleLogs.value.shift();
  };
};

const restoreConsole = () => {
  console.log = originalLog;
  console.error = originalError;
};

const testMockLogin = async () => {
  testing.value = true;
  testResult.value = null;
  consoleLogs.value = [];
  
  try {
    console.log('Starting mock login test...');
    
    const testData = {
      usuarioName: 'admin@inroom.com',
      password: '123456'
    };
    
    console.log('Sending login request with data:', testData);
    
    const response = await axiosClient.post('/Usuarios/Login', testData);
    
    console.log('Login response received:', response.data);
    
    testResult.value = {
      success: true,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Login test failed:', error);
    
    testResult.value = {
      success: false,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    };
  } finally {
    testing.value = false;
  }
};

onMounted(() => {
  interceptConsole();
  
  // Only show in development
  if (import.meta.env.MODE === 'development') {
    // Auto show on mount for debugging
    isVisible.value = true;
  }
});

onUnmounted(() => {
  restoreConsole();
});
</script>

<style scoped>
/* Custom styles for the debug panel */
:deep(.p-button-warning) {
  background: #f59e0b;
  border-color: #f59e0b;
}

:deep(.p-button-warning:hover) {
  background: #d97706;
  border-color: #d97706;
}
</style>