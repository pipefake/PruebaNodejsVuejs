// src/router/routesVue.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/Login/Login.vue';
import Register from '@/views/Register/Register.vue';
import Clientes from '@/views/Clientes/Clientes';
import AgregarCliente from '@/views/Clientes/AgregarCliente';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: Clientes
  },
  {
    path: '/agregarCliente',
    name: 'AgregarCliente',
    component: AgregarCliente
  }
];

const router = createRouter({
  history: createWebHistory(), // Use createWebHistory for Vue 3
  routes
});

export default router;
