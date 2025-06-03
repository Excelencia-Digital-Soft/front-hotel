<template>
  <div class="inroom-navbar">
    <Menubar :model="menuItems" class="h-full w-full flex justify-between items-center">
      <!-- Logo -->
      <template #start>
        <router-link
          :to="{ name: 'Home' }"
          class="flex items-center space-x-2 hover-scale group z-10"
        >
          <span
            class="text-white text-2xl font-bold tracking-wide lexend-exa group-hover:text-pink-100 transition-colors duration-200"
          >
            inRoom
          </span>
          <Avatar :image="pinImage" class="ml-2" shape="circle" />
        </router-link>
      </template>

      <!-- Items del menú principal -->
      <template #item="{ item, props, hasSubmenu, root }">
        <router-link
          v-if="!hasSubmenu"
          :to="item.routeName ? { name: item.routeName } : item.path || '/'"
          v-ripple
          class="inroom-button-primary flex items-center space-x-2 no-underline"
          @click="closeAllMenus"
        >
          <i v-if="item.icon" :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
        <a
          v-else
          v-ripple
          class="inroom-button-primary flex items-center space-x-2 cursor-pointer no-underline"
          @click="toggleSubmenu(item.label)"
        >
          <i v-if="item.icon" :class="item.icon"></i>
          <span>{{ item.label }}</span>
          <i
            v-if="hasSubmenu"
            :class="[
              'pi pi-angle-down ml-auto',
              { 'pi-angle-down': root, 'pi-angle-right': !root },
            ]"
          ></i>
        </a>
      </template>

      <!-- Área de usuario/perfil -->
      <template #end>
        <div class="flex items-center gap-4 z-10">
          <!-- Loading state -->
          <div v-if="menuStore.isMenuLoading" class="text-white text-lg flex items-center">
            <ProgressSpinner style="width: 20px; height: 20px" strokeWidth="4" class="mr-2" />
            <span>Cargando menú...</span>
          </div>

          <!-- Error state -->
          <div
            v-else-if="menuStore.getMenuError"
            class="glass-effect text-red-200 text-sm px-3 py-2 rounded-lg"
          >
            <i class="pi pi-exclamation-triangle mr-2"></i>
            Error: {{ menuStore.getMenuError }}
          </div>

          <!-- Perfil del usuario -->
          <div
            v-if="USE_MOCK_DATA.value ? isAuthenticated : authStore.isAuthenticated"
            class="relative"
          >
            <button
              @click="toggleProfileMenu"
              class="inroom-button-primary flex items-center space-x-2"
              :class="{ 'bg-white/20': showProfileMenu }"
            >
              <UserCircleIcon class="w-6 h-6" />
              <span class="hidden md:inline">Mi Perfil</span>
              <span class="md:hidden">{{ currentUserData?.nombreUsuario?.charAt(0) || 'U' }}</span>
              <i
                class="pi pi-chevron-down text-sm transition-transform duration-200"
                :class="{ 'rotate-180': showProfileMenu }"
              ></i>
            </button>

            <!-- Dropdown del perfil -->
            <div
              v-show="showProfileMenu"
              class="inroom-dropdown absolute top-full right-0 mt-3 w-72 animate-slide-down z-50"
              style="z-index: 1030"
            >
              <!-- Header del perfil -->
              <div class="px-4 py-3 border-b border-gray-200/20">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-12 h-12 bg-inroom-gradient rounded-full flex items-center justify-center"
                  >
                    <UserCircleIcon class="w-8 h-8 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-gray-800 font-semibold truncate">
                      {{ currentUserData?.nombreUsuario || 'Usuario' }}
                    </div>
                    <div class="text-gray-500 text-sm truncate">
                      {{ currentUserData?.email || 'Sin email configurado' }}
                    </div>
                    <div class="text-xs text-gray-400 mt-1">
                      Rol: {{ getRoleName(currentUserData?.rol) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Opciones del menú -->
              <div class="py-2">
                <router-link
                  :to="{ name: 'UserProfile' }"
                  class="inroom-dropdown-item flex items-center rounded-lg mx-2"
                  @click="closeProfileMenu"
                >
                  <i class="pi pi-user mr-3 text-lg"></i>
                  <div>
                    <div class="font-medium">Mi Perfil</div>
                    <div class="text-xs opacity-70">Configurar cuenta</div>
                  </div>
                </router-link>

                <router-link
                  v-if="canManageUsers"
                  :to="{ name: 'UsuariosManager' }"
                  class="inroom-dropdown-item flex items-center rounded-lg mx-2"
                  @click="closeProfileMenu"
                >
                  <i class="pi pi-users mr-3 text-lg"></i>
                  <div>
                    <div class="font-medium">Gestión de Usuarios</div>
                    <div class="text-xs opacity-70">Administrar usuarios</div>
                  </div>
                </router-link>

                <div class="inroom-dropdown-item flex items-center rounded-lg mx-2">
                  <i class="pi pi-palette mr-3 text-lg"></i>
                  <div>
                    <div class="font-medium">Tema</div>
                    <div class="text-xs opacity-70">Personalizar interfaz</div>
                  </div>
                </div>

                <hr class="my-2 border-gray-200/20" />

                <!-- Opción para cambiar usuario (solo en modo mock) -->
                <button
                  v-if="USE_MOCK_DATA.value"
                  @click="switchMockUser"
                  class="inroom-dropdown-item w-full text-left flex items-center rounded-lg mx-2"
                >
                  <i class="pi pi-user-edit mr-3 text-lg"></i>
                  <div>
                    <div class="font-medium">Cambiar Usuario</div>
                    <div class="text-xs opacity-70">Probar con otro rol</div>
                  </div>
                </button>

                <button
                  @click="handleLogout"
                  class="inroom-dropdown-item w-full text-left flex items-center rounded-lg mx-2"
                >
                  <i class="pi pi-sign-out mr-3 text-lg"></i>
                  <div>
                    <div class="font-medium">Cerrar Sesión</div>
                    <div class="text-xs opacity-70">Salir de la aplicación</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Menú móvil -->
          <MenuMobile
            v-if="USE_MOCK_DATA.value ? isAuthenticated : authStore.isAuthenticated"
            class="flex lg:hidden"
            :menu-items="menuItems"
            :is-authenticated="USE_MOCK_DATA.value ? isAuthenticated : authStore.isAuthenticated"
            @close-menu="closeAllMenus"
          />

          <!-- Botón de login para usuarios no autenticados -->
          <router-link
            v-else
            :to="{ name: 'Login' }"
            class="inroom-button-primary flex items-center space-x-2"
          >
            <i class="pi pi-sign-in"></i>
            <span class="hidden md:inline">Iniciar Sesión</span>
          </router-link>
        </div>
      </template>
    </Menubar>

    <!-- Overlay para cerrar menús al hacer clic fuera -->
    <div
      v-if="showProfileMenu || activeSubmenu"
      @click="closeAllMenus"
      class="fixed inset-0 z-40 bg-transparent"
      style="z-index: 1020"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
  import { useAuthStore } from '@/stores/auth.js'
  import { useMenuStore } from '@/stores/menu.js'
  import { useNotifications } from '@/stores/notifications.js'
  import { useRouter } from 'vue-router'
  import { UserCircleIcon } from '@heroicons/vue/20/solid'
  import MenuMobile from './MenuMobile.vue'
  import pinImage from '@/assets/pinwhite.png'

  // Importar datos mock y configuración
  import {
    mockMenuItems,
    mockUsers,
    mockStates,
    filterMenuByPermissions,
    getUserPermissions,
  } from '@/mocks/navbarMockData.js'
  import { shouldUseMock } from '@/config/mockConfig'

  // Composables y stores
  const authStore = useAuthStore()
  const menuStore = useMenuStore()
  const router = useRouter()
  const { success: notifySuccess, info: notifyInfo } = useNotifications()

  // Estado reactivo
  const showProfileMenu = ref(false)
  const activeSubmenu = ref(null)
  const isLoading = ref(false)
  const hasError = ref(false)
  const isAuthenticated = ref(true)

  // MOCK: Estado de usuario para pruebas
  const USE_MOCK_DATA = computed(() => shouldUseMock('menu')) // Usar configuración global
  const mockCurrentUser = ref(mockUsers[0]) // Admin por defecto

  // Mapear los ítems del menú al formato de PrimeVue
  const menuItems = ref([])

  const mapMenuItems = () => {
    if (USE_MOCK_DATA.value) {
      // Usar datos mock
      const userPermissions = getUserPermissions(mockCurrentUser.value.rol)
      const filteredMenu = filterMenuByPermissions(mockMenuItems, userPermissions)

      menuItems.value = filteredMenu.map((item) => ({
        label: item.titulo,
        icon: item.icono,
        routeName: item.rutaNombre,
        path: item.path,
        items: item.subItems?.map((subItem) => ({
          label: subItem.titulo,
          icon: subItem.icono,
          routeName: subItem.rutaNombre,
          path: subItem.path,
        })),
      }))
    } else {
      // Usar datos del store real
      menuItems.value = menuStore.getMenuItems.map((item) => ({
        label: item.titulo,
        icon: item.icono,
        routeName: item.routeName,
        path: item.path,
        items: item.subItems?.map((subItem) => ({
          label: subItem.titulo,
          icon: subItem.icono,
          routeName: subItem.routeName,
          path: subItem.path,
        })),
      }))
    }
  }

  // Computed properties
  const canManageUsers = computed(() => {
    if (USE_MOCK_DATA.value) {
      const userRole = mockCurrentUser.value?.rol
      return userRole === 1 || userRole === 2 // Admin o Supervisor
    }
    const userRole = authStore.auth?.rol
    return userRole === 1 || userRole === 2 // Admin o Supervisor
  })

  // Computed para obtener datos del usuario actual
  const currentUserData = computed(() => {
    if (USE_MOCK_DATA.value) {
      return mockCurrentUser.value
    }
    return authStore.auth
  })

  // Métodos para control de menús
  const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value
    activeSubmenu.value = null // Cerrar otros menús
  }

  const toggleSubmenu = (submenuName) => {
    activeSubmenu.value = activeSubmenu.value === submenuName ? null : submenuName
    showProfileMenu.value = false // Cerrar menú de perfil
  }

  const closeProfileMenu = () => {
    showProfileMenu.value = false
  }

  const closeAllMenus = () => {
    showProfileMenu.value = false
    activeSubmenu.value = null
  }

  // Utilidades
  const getRoleName = (rolId) => {
    const roles = {
      1: 'Administrador',
      2: 'Supervisor',
      3: 'Operador',
      4: 'Recepcionista',
      7: 'Usuario',
    }
    return roles[rolId] || 'Usuario'
  }

  const handleLogout = async () => {
    try {
      const userName = currentUserData.value?.nombreUsuario || 'Usuario'

      if (USE_MOCK_DATA.value) {
        // Simular logout con datos mock
        mockCurrentUser.value = null
        isAuthenticated.value = false
      } else {
        await authStore.logout()
      }

      closeAllMenus()

      notifyInfo(`Hasta luego, ${userName}`, {
        title: '👋 Sesión Cerrada',
      })

      // Redireccionar después de un breve delay para mostrar la notificación
      setTimeout(() => {
        router.push('/guest')
      }, 1000)
    } catch (error) {
      console.error('Error durante el logout:', error)
    }
  }

  // Función para cambiar entre usuarios mock
  const switchMockUser = () => {
    const currentIndex = mockUsers.findIndex((u) => u.id === mockCurrentUser.value.id)
    const nextIndex = (currentIndex + 1) % mockUsers.length
    const nextUser = mockUsers[nextIndex]

    mockCurrentUser.value = nextUser

    // Actualizar el menú con los permisos del nuevo usuario
    mapMenuItems()

    // Cerrar el menú desplegable
    closeProfileMenu()

    // Mostrar notificación
    notifySuccess(`Cambiado a: ${nextUser.nombreUsuario}`, {
      title: `🔄 Rol: ${getRoleName(nextUser.rol)}`,
    })
  }

  // Event listeners
  const handleClickOutside = (event) => {
    const navbar = event.target.closest('.inroom-navbar')
    if (!navbar) {
      closeAllMenus()
    }
  }

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      closeAllMenus()
    }
  }

  // Watchers
  watch(
    () => menuStore.getMenuItems,
    () => {
      mapMenuItems()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => authStore.isAuthenticated,
    (isAuth, wasAuth) => {
      console.log(`NavBar Watch: isAuthenticated cambió de ${wasAuth} a ${isAuth}`)

      if (isAuth) {
        console.log('NavBar: Usuario autenticado, cargando menú...')
        menuStore.fetchUserMenu()

        // Mostrar notificación de bienvenida si es un nuevo login
        if (!wasAuth) {
          const userName = authStore.auth?.nombreUsuario || 'Usuario'
          notifySuccess(`¡Bienvenido de vuelta, ${userName}!`, {
            title: '🎉 Inicio de Sesión Exitoso',
          })
        }
      } else {
        console.log('NavBar: Usuario no autenticado, limpiando menú...')
        menuStore.clearMenu()
        closeAllMenus()
      }
    },
    { immediate: true }
  )

  // Lifecycle hooks
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)

    if (USE_MOCK_DATA.value) {
      // Cargar datos mock inmediatamente
      mapMenuItems()
      isAuthenticated.value = true
    } else {
      // Cargar menú inicial si ya está autenticado
      if (authStore.isAuthenticated) {
        menuStore.fetchUserMenu()
      }
    }
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscapeKey)
  })
</script>

<style scoped>
  /* Rotación del chevron */
  .rotate-180 {
    transform: rotate(180deg);
  }

  /* Quitar subrayado de los enlaces */
  .no-underline {
    text-decoration: none !important;
  }

  /* Z-index para overlay */
  .z-40 {
    z-index: 1020;
  }

  .z-50 {
    z-index: 1030;
  }

  /* Animaciones personalizadas */
  .animate-slide-down {
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Hover effect personalizado para el logo */
  .group:hover .group-hover\:text-pink-100 {
    color: #fce7f3;
  }

  /* Estilos responsive para el menú */
  @media (max-width: 768px) {
    .inroom-navbar {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .inroom-dropdown {
      width: calc(100vw - 2rem);
      max-width: 320px;
      right: 0;
      left: auto;
    }
  }

  /* Fix para el z-index del menubar de PrimeVue */
  :deep(.p-menubar) {
    z-index: 1000;
    position: relative;
  }

  :deep(.p-menubar .p-menubar-root-list) {
    gap: 0.5rem;
  }

  /* Ajustes para el submenu */
  :deep(.p-submenu-list) {
    z-index: 1010 !important;
    position: fixed !important;
  }

  /* Ajustes específicos para los overlays de PrimeVue */
  :deep(.p-submenu-list),
  :deep(.p-tieredmenu),
  :deep(.p-menu) {
    z-index: 1010 !important;
  }

  /* Loading spinner personalizado */
  :deep(.p-progress-spinner-circle) {
    stroke: currentColor;
  }

  /* Asegurar que los enlaces no tengan estilos por defecto */
  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: inherit;
    text-decoration: none;
  }

  /* Fix para el avatar hover */
  :deep(.p-avatar) {
    transition: all 0.2s ease-in-out;
  }

  :deep(.p-avatar:hover) {
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.6);
  }
</style>
