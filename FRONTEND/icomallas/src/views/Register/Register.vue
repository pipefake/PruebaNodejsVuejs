<template>
  <div class="Home ingresarHome">
    <div>
      <img class="foto" :src="fotoFelipeJimenez" alt="foto de felipe jimenez" />
      <h2 class="largeText blueTitle poppins-semibold">
        Registrarse
      </h2>
      <p class="smallText poppins-regular">
        Cree una cuenta para poder ingresar a la prueba Full Stack.
      </p>
      <form @submit.prevent="handleRegister">
        <input
          id="nombre"
          class="input"
          v-model="nombre"
          name="nombre"
          placeholder="Nombre"
        />
        <input
          id="email"
          class="input"
          v-model="email"
          name="email"
          placeholder="Email"
        />
        <input
          id="contrasena"
          class="input"
          type="password"
          v-model="contrasena"
          name="contrasena"
          placeholder="Contraseña"
        />
        <button
          id="registerBtn"
          class="regularText loginBtn poppins-semibold"
          type="submit"
        >
          Registrar
        </button>
      </form>
      <p v-if="mensaje">{{ mensaje }}</p>
      <router-link to="/login" class="poppins-semibold">Ya tengo una cuenta.</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import Axios for HTTP requests

export default {
  name: 'RegisterComponent',
  data() {
    return {
      fotoFelipeJimenez: require('../../assets/felipejimenez.jpg'),
      email: '',
      contrasena: '',
      nombre: '',
      mensaje: ''
    };
  },
  methods: {
    async handleRegister() {
      const usuario = { nombre: this.nombre, email: this.email, contrasena: this.contrasena };
      try {
        const respuesta = await axios.post('http://localhost:3001/usuarios', usuario, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log(respuesta);
        const mensaje = respuesta.data.mensaje;
        const token = respuesta.data.token;

        if (mensaje !== 'Registro exitoso') {
          console.log('Usuario no registrado');
          this.mensaje = 'Usuario no registrado';
        } else {
          this.mensaje = 'Registro exitoso';
          console.log('Registro');
          sessionStorage.setItem('token', token);
          this.$router.push('/login');
        }

      } catch (err) {
        this.mensaje = 'Registro Error';
        console.error(err.response ? err.response.data : err.message);
      }
    }
  }
};
</script>

<style scoped>
/* Your scoped styles here */
</style>
