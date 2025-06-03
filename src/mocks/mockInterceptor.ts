// Sistema de interceptores para manejar peticiones mock
import {
  shouldUseMock,
  simulateNetworkDelay,
  shouldSimulateError,
  mockLog,
} from '@/config/mockConfig'
import MOCK_CONFIG from '@/config/mockConfig'
import authMocks from './services/authMocks'
import menuMocks from './services/menuMocks'

// Mapa de rutas a handlers mock
const mockHandlers = {
  // Auth
  'POST /login': authMocks.login,
  'POST /Usuarios/Login': authMocks.login, // Ruta específica del sistema
  'POST /logout': authMocks.logout,
  'GET /auth/me': authMocks.getCurrentUser,
  'POST /auth/refresh': authMocks.refreshToken,

  // Menu
  'GET /menu': menuMocks.getUserMenu,
  'GET /navigation/user-menu': menuMocks.getUserMenu, // Ruta específica del sistema
  'GET /menu/permissions': menuMocks.getPermissions,
}

// Función para encontrar el handler mock correcto
const findMockHandler = (method, url) => {
  // Normalizar la URL (remover query params)
  let cleanUrl = url.replace(/\?.*$/, '')

  // Si la URL es relativa (empieza con /), úsala tal cual
  // Si es absoluta, extrae el path
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = cleanUrl.replace(/^https?:\/\/[^\/]+/, '')
  }

  // Remover /api del inicio si existe
  cleanUrl = cleanUrl.replace(/^\/api/, '')

  mockLog('findHandler', `Original URL: ${url}, Clean URL: ${cleanUrl}`)

  // Buscar coincidencia exacta primero
  const exactKey = `${method} ${cleanUrl}`
  mockLog('findHandler', `Looking for exact match: ${exactKey}`)

  if (mockHandlers[exactKey]) {
    mockLog('findHandler', `Found exact match for: ${exactKey}`)
    return { handler: mockHandlers[exactKey], params: {} }
  }

  // Buscar coincidencias con parámetros
  for (const [pattern, handler] of Object.entries(mockHandlers)) {
    const [patternMethod, patternPath] = pattern.split(' ')
    if (patternMethod !== method) continue

    // Convertir pattern a regex
    const regexPattern = patternPath
      .replace(/:[^\/]+/g, '([^/]+)') // Reemplazar :param con grupo de captura
      .replace(/\//g, '\\/') // Escapar slashes

    const regex = new RegExp(`^${regexPattern}$`)
    const match = cleanUrl.match(regex)

    if (match) {
      // Extraer parámetros
      const paramNames = (patternPath.match(/:[^\/]+/g) || []).map((p) => p.substring(1))
      const params = {}

      paramNames.forEach((name, index) => {
        params[name] = match[index + 1]
      })

      return { handler, params }
    }
  }

  return null
}

// Interceptor principal para Axios
export const setupMockInterceptor = (axiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      const method = config.method.toUpperCase()
      const url = config.url

      mockLog('interceptor', `Intercepting request: ${method} ${url}`, {
        data: config.data,
        mockEnabled: MOCK_CONFIG.USE_MOCKS,
        modules: MOCK_CONFIG.modules,
      })

      // Determinar el módulo basado en la URL
      const module =
        url.includes('/auth') || url.includes('/Login')
          ? 'auth'
          : url.includes('/menu')
            ? 'menu'
            : 'general'

      // Verificar si debemos usar mock para este módulo
      mockLog(
        'interceptor',
        `Module detected: ${module}, should use mock: ${shouldUseMock(module)}`
      )

      if (!shouldUseMock(module)) {
        mockLog('interceptor', `Mocks disabled for module: ${module}`)
        return config
      }

      // Buscar handler mock
      const mockMatch = findMockHandler(method, url)
      mockLog(
        module,
        `Handler search result for ${method} ${url}:`,
        mockMatch ? 'Found' : 'Not found'
      )

      if (!mockMatch) {
        mockLog(module, `No mock handler found for: ${method} ${url}`)
        mockLog(module, `Available handlers:`, Object.keys(mockHandlers))
        return config
      }

      // Simular delay de red
      await simulateNetworkDelay()

      // Simular error si está configurado
      if (shouldSimulateError()) {
        mockLog(module, `Simulating error for: ${method} ${url}`)
        return Promise.reject({
          response: {
            status: 500,
            data: { message: 'Error simulado por el sistema de mocks' },
          },
        })
      }

      // Ejecutar handler mock
      try {
        const mockData = await mockMatch.handler({
          method,
          url,
          params: mockMatch.params,
          query: config.params,
          data: config.data,
          headers: config.headers,
        })

        mockLog(module, `Mock response for: ${method} ${url}`, mockData)

        // Crear una respuesta mock que Axios pueda procesar
        config.adapter = () => {
          return Promise.resolve({
            data: mockData,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config,
            request: {},
          })
        }
      } catch (error) {
        mockLog(module, `Mock handler error for: ${method} ${url}`, error)
        return Promise.reject(error)
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

// Función para registrar nuevos handlers mock
export const registerMockHandler = (pattern, handler) => {
  mockHandlers[pattern] = handler
}

// Función para limpiar todos los mocks
export const clearMockHandlers = () => {
  Object.keys(mockHandlers).forEach((key) => {
    delete mockHandlers[key]
  })
}

export default {
  setupMockInterceptor,
  registerMockHandler,
  clearMockHandlers,
}
