<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4 lexend">
    <!-- Fondo con gradiente -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20"></div>
    
    <!-- Mock Debug Panel -->
    <MockDebugPanel />
    
    <!-- Contenedor principal -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <h1 class="text-5xl font-bold text-white mb-2">
          <span class="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            inRoom
          </span>
        </h1>
        <p class="text-gray-400">Sistema de Gestión Hotelera</p>
      </div>
      
      <!-- Card de login -->
      <Card class="inroom-card">
        <template #header>
          <h2 class="text-2xl font-semibold text-center text-white">Iniciar Sesión</h2>
        </template>
        
        <template #content>
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Campo de usuario -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-300 mb-2">
                Usuario o Email
              </label>
              <InputText 
                id="username"
                v-model="credentials.usuarioName" 
                type="text" 
                size="large"
                class="w-full inroom-input"
                placeholder="Ingrese su usuario o email"
                :disabled="loading"
                required 
              />
            </div>
            
            <!-- Campo de contraseña -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <Password 
                id="password"
                v-model="credentials.password" 
                class="w-full"
                inputClass="w-full inroom-input"
                placeholder="Ingrese su contraseña"
                :feedback="false"
                :disabled="loading"
                toggleMask
                required 
              />
            </div>
            
            <!-- Mensaje de error -->
            <Message v-if="errorMessage" severity="error" :closable="false">
              {{ errorMessage }}
            </Message>
            
            <!-- Botón de login -->
            <Button 
              type="submit" 
              label="Iniciar Sesión"
              class="w-full inroom-button-gradient"
              :loading="loading"
              :disabled="loading"
            />
          </form>
          
          <!-- Info de usuarios mock (solo en desarrollo) -->
          <div v-if="showMockInfo" class="mt-6 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <h3 class="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
              <i class="pi pi-info-circle"></i>
              Usuarios de Prueba Disponibles
            </h3>
            <div class="space-y-2">
              <div 
                v-for="user in mockUsers" 
                :key="user.id"
                class="flex justify-between items-center text-xs"
              >
                <div>
                  <span class="text-gray-300">{{ user.email }}</span>
                  <span class="text-gray-500 ml-2">({{ getRoleName(user.rol) }})</span>
                </div>
                <Button 
                  size="small"
                  severity="secondary"
                  text
                  @click="fillCredentials(user)"
                  class="text-xs"
                >
                  Usar
                </Button>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-3">
              <i class="pi pi-lock text-yellow-500"></i>
              Cualquier contraseña es válida en modo mock
            </p>
          </div>
        </template>
        
        <template #footer>
          <div class="text-center text-sm text-gray-400">
            <p>© 2025 inRoom. Todos los derechos reservados.</p>
          </div>
        </template>
      </Card>
    </div>
    
    <!-- Panel de debug para desarrollo -->
    <MockDebugPanel v-if="isDevelopment" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotifications } from '@/stores/notifications';
import { shouldUseMock } from '@/config/mockConfig';
import { mockUsers } from '@/mocks/navbarMockData';
import MockDebugPanel from '@/components/UI/MockDebugPanel.vue';

// Composables
const router = useRouter();
const authStore = useAuthStore();
const { success, error: notifyError } = useNotifications();

// Estado
const credentials = ref({
  usuarioName: '',
  password: ''
});
const loading = ref(false);
const errorMessage = ref('');

// Computed
const showMockInfo = computed(() => {
  return import.meta.env.MODE === 'development' && shouldUseMock('auth');
});

const isDevelopment = computed(() => import.meta.env.MODE === 'development');

// Métodos
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const result = await authStore.login(credentials.value);
    
    if (result) {
      success(`¡Bienvenido ${authStore.getUsuarioName}!`, {
        title: 'Inicio de sesión exitoso'
      });
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        router.push('/home');
      }, 500);
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al iniciar sesión';
    notifyError('Error al iniciar sesión', {
      title: 'Credenciales incorrectas'
    });
  } finally {
    loading.value = false;
  }
};

const fillCredentials = (user) => {
  credentials.value.usuarioName = user.email;
  credentials.value.password = '123456'; // Contraseña de ejemplo
  
  // Auto-submit después de llenar
  setTimeout(() => {
    handleLogin();
  }, 300);
};

const getRoleName = (rolId) => {
  const roles = {
    1: 'Administrador',
    2: 'Supervisor',
    3: 'Operador',
    4: 'Recepcionista',
    7: 'Usuario'
  };
  return roles[rolId] || 'Usuario';
};

// Verificar si ya está autenticado
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/home');
  }
});
</script>

<style scoped>
/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.inroom-card {
  animation: fadeInUp 0.5s ease-out;
}

/* Estilos específicos del login */
:deep(.p-password-input) {
  width: 100%;
}

:deep(.p-message) {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

:deep(.p-message .p-message-icon) {
  color: #f87171;
}

/* Botón gradient específico */
.inroom-button-gradient {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.inroom-button-gradient:hover {
  background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(236, 72, 153, 0.3);
}

.inroom-button-gradient:active {
  transform: translateY(0);
}

/* Input personalizado */
.inroom-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s ease;
}

.inroom-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.inroom-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Card con glassmorphism */
:deep(.inroom-card) {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

:deep(.inroom-card .p-card-header) {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.inroom-card .p-card-body) {
  background: transparent;
}

:deep(.inroom-card .p-card-footer) {
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
