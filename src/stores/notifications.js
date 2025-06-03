import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useNotificationStore = defineStore('notifications', () => {
  // Estado
  const notifications = ref([]);
  const maxNotifications = ref(5);
  const defaultDuration = ref(5000);

  // Getters
  const getNotifications = computed(() => notifications.value);
  const getNotificationCount = computed(() => notifications.value.length);
  const hasNotifications = computed(() => notifications.value.length > 0);

  // Funciones privadas
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const createNotification = (options) => {
    const id = generateId();
    const autoDismiss = options.duration !== false;

    return {
      id,
      type: options.type || 'default',
      title: options.title || null,
      message: options.message || '',
      duration: options.duration || defaultDuration.value,
      autoDismiss,
      progress: autoDismiss ? 100 : 0,
      timestamp: new Date(),
      ...options
    };
  };

  // Actions
  const addNotification = (options) => {
    try {
      const notification = createNotification(options);

      // Agregar al inicio del array
      notifications.value.unshift(notification);

      // Limitar el número máximo de notificaciones
      if (notifications.value.length > maxNotifications.value) {
        notifications.value = notifications.value.slice(0, maxNotifications.value);
      }

      // Auto-dismiss si está configurado
      if (notification.autoDismiss && notification.duration > 0) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
      }

      console.log('📢 Notificación añadida:', notification);
      return notification.id;
    } catch (error) {
      console.error('Error al añadir notificación:', error);
      return null;
    }
  };

  const removeNotification = (id) => {
    try {
      const index = notifications.value.findIndex(n => n.id === id);
      if (index > -1) {
        const removed = notifications.value.splice(index, 1)[0];
        console.log('🗑️ Notificación removida:', removed);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al remover notificación:', error);
      return false;
    }
  };

  const clearAllNotifications = () => {
    try {
      const count = notifications.value.length;
      notifications.value = [];
      console.log(`🧹 ${count} notificaciones eliminadas`);
      return count;
    } catch (error) {
      console.error('Error al limpiar notificaciones:', error);
      return 0;
    }
  };

  const clearNotificationsByType = (type) => {
    try {
      const initialCount = notifications.value.length;
      notifications.value = notifications.value.filter(n => n.type !== type);
      const removedCount = initialCount - notifications.value.length;
      console.log(`🧹 ${removedCount} notificaciones de tipo "${type}" eliminadas`);
      return removedCount;
    } catch (error) {
      console.error('Error al limpiar notificaciones por tipo:', error);
      return 0;
    }
  };

  const updateNotification = (id, updates) => {
    try {
      const notification = notifications.value.find(n => n.id === id);
      if (notification) {
        Object.assign(notification, updates);
        console.log('✏️ Notificación actualizada:', notification);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar notificación:', error);
      return false;
    }
  };

  // Métodos de conveniencia para tipos específicos
  const success = (message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  };

  const error = (message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 8000, // Errores duran más tiempo
      ...options
    });
  };

  const warning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    });
  };

  const info = (message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  };

  // Métodos específicos para la aplicación inRoom
  const notifyArticleCreated = (articleName) => {
    return success(`Artículo "${articleName}" creado exitosamente`, {
      title: '✅ Artículo Creado',
      duration: 4000
    });
  };

  const notifyArticleUpdated = (articleName) => {
    return success(`Artículo "${articleName}" actualizado`, {
      title: '📝 Artículo Actualizado',
      duration: 3000
    });
  };

  const notifyArticleDeleted = (articleName) => {
    return warning(`Artículo "${articleName}" eliminado`, {
      title: '🗑️ Artículo Eliminado',
      duration: 4000
    });
  };

  const notifyStockLow = (articleName, stock) => {
    return warning(`Stock bajo para "${articleName}": ${stock} unidades restantes`, {
      title: '⚠️ Stock Bajo',
      duration: 7000
    });
  };

  const notifyLoginSuccess = (userName) => {
    return success(`¡Bienvenido de vuelta, ${userName}!`, {
      title: '🎉 Inicio de Sesión Exitoso',
      duration: 3000
    });
  };

  const notifyLogout = () => {
    return info('Sesión cerrada correctamente', {
      title: '👋 Hasta luego',
      duration: 2000
    });
  };

  const notifyConnectionLost = () => {
    return error('Se perdió la conexión con el servidor', {
      title: '🌐 Sin Conexión',
      duration: false // No auto-dismiss
    });
  };

  const notifyConnectionRestored = () => {
    // Remover notificaciones de conexión perdida
    clearNotificationsByType('error');

    return success('Conexión restaurada', {
      title: '🌐 Conectado',
      duration: 3000
    });
  };

  // Configuración
  const setMaxNotifications = (max) => {
    maxNotifications.value = max;

    // Recortar si excede el nuevo límite
    if (notifications.value.length > max) {
      notifications.value = notifications.value.slice(0, max);
    }
  };

  const setDefaultDuration = (duration) => {
    defaultDuration.value = duration;
  };

  // Debug helpers (solo en desarrollo)
  const getDebugInfo = () => {
    if (import.meta.env.DEV) {
      return {
        count: notifications.value.length,
        maxNotifications: maxNotifications.value,
        defaultDuration: defaultDuration.value,
        notifications: notifications.value.map(n => ({
          id: n.id,
          type: n.type,
          message: n.message.substring(0, 50) + '...',
          timestamp: n.timestamp
        }))
      };
    }
    return { message: 'Debug info only available in development' };
  };

  const addTestNotifications = () => {
    if (import.meta.env.DEV) {
      success('Operación completada exitosamente');
      error('Error al procesar la solicitud');
      warning('Advertencia: Stock bajo detectado');
      info('Nueva actualización disponible');

      console.log('🧪 Notificaciones de prueba añadidas');
    }
  };

  return {
    // Estado
    notifications: getNotifications,

    // Getters
    getNotifications,
    getNotificationCount,
    hasNotifications,

    // Actions generales
    addNotification,
    removeNotification,
    clearAllNotifications,
    clearNotificationsByType,
    updateNotification,

    // Métodos de conveniencia
    success,
    error,
    warning,
    info,

    // Métodos específicos de inRoom
    notifyArticleCreated,
    notifyArticleUpdated,
    notifyArticleDeleted,
    notifyStockLow,
    notifyLoginSuccess,
    notifyLogout,
    notifyConnectionLost,
    notifyConnectionRestored,

    // Configuración
    setMaxNotifications,
    setDefaultDuration,

    // Debug (solo desarrollo)
    getDebugInfo,
    addTestNotifications
  };
});

// Hook de composición para usar en componentes
export const useNotifications = () => {
  const store = useNotificationStore();

  return {
    // Métodos principales
    notify: store.addNotification,
    success: store.success,
    error: store.error,
    warning: store.warning,
    info: store.info,

    // Métodos específicos
    notifyArticleCreated: store.notifyArticleCreated,
    notifyArticleUpdated: store.notifyArticleUpdated,
    notifyArticleDeleted: store.notifyArticleDeleted,
    notifyStockLow: store.notifyStockLow,

    // Estado
    notifications: store.notifications,
    hasNotifications: store.hasNotifications,

    // Acciones
    clearAll: store.clearAllNotifications,
    remove: store.removeNotification
  };
};
