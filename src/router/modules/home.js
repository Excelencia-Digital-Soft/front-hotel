import MainLayout from "@/layouts/MainLayout.vue";
import Home from "@/views/Home.vue";

export default [
  {
    path: "/home",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { 
        path: "", 
        name: "Home", 
        component: Home 
      },
      { 
        path: "/dashboard", 
        name: "Dashboard", 
        component: Home, 
        meta: { title: 'Dashboard' } 
      },
    ],
  },
];
