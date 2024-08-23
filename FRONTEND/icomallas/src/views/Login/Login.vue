<template>
  <div class="Home ingresarHome">
    <div>
      <img class="foto" :src="fotoFelipeJimenez" alt="foto de felipe jimenez" />
      <h2 class="largeText blueTitle poppins-semibold">
        Ingresar
      </h2>
      <p class="smallText poppins-regular">
        Bienvenidos a esta prueba técnica Full Stack.
      </p>
      <form @submit.prevent="handleLogin">
        <input
          id="email"
          class="input"
          name="email"
          v-model="email"
          placeholder="Email"
        />
        <input
          id="contrasena"
          class="input"
          type="password"
          name="contrasena"
          v-model="contrasena"
          placeholder="Contraseña"
        />
        <button
          id="loginBtn"
          class="regularText loginBtn poppins-semibold"
          type="submit"
        >
          Login
        </button>
      </form>
      <a class="poppins-semibold" @click="handleRegister">Crear una nueva cuenta.</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios for HTTP requests

export default {
  name: 'LoginComponent',
  data() {
    return {
      fotoFelipeJimenez: require('../../assets/felipejimenez.jpg'),
      email: '',
      contrasena: ''
    };
  },
  methods: {
    async handleLogin() {
      const usuario = { email: this.email, contrasena: this.contrasena };
      try {
        const respuesta = await axios.post('http://localhost:3001/usuarios/login', usuario, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(respuesta);
        const mensaje = respuesta.data.mensaje;
        const token = respuesta.data.token;

        if (mensaje !== 'Bienvenido') {
          console.log('Algo anda mal');
          // Optionally handle errors or show a message
        } else {
          console.log('Bienvenido');
          sessionStorage.setItem('token', token);
          this.$router.push('/clientes'); // Navigate to the /inicio route
        }
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        // Optionally handle errors or show a message
      }
    },
    handleRegister() {
      this.$router.push('/register'); // Navigate to the register page
    }
  }
};
</script>

<style scoped>
/* Your scoped styles here */
</style>
