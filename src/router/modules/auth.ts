import GuestLayout from '@/layouts/GuestLayoutSimple.vue'
import LoginView from '@/views/auth/LoginView.vue'

export default [
  {
    path: '/',
    redirect: '/guest/login',
  },
  {
    path: '/guest',
    component: GuestLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: '',
        redirect: { name: 'Login' },
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: { title: 'Iniciar Sesión' },
      },
    ],
  },
]
