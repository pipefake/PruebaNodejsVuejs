<template>
  <div class="Home">
    <div>
      <h3 class="largeText light-title poppins-regular">
        Juan Felipe Jiménez Salazar
      </h3>
      <img class="foto" :src="fotoFelipeJimenez" alt="foto de felipe jimenez" />
      <h2 class="largeText blueTitle poppins-semibold">
        Prueba Full Stack
      </h2>
      <p class="smallText poppins-regular">
        Esta API es una prueba para mi postulación en la empresa Konecta.
      </p>
      <button id="loginBtn" class="regularText loginBtn poppins-semibold" @click="handleLogin">
        Login
      </button>
      <button id="registerBtn" class="regularText registerBtn poppins-semibold" @click="handleRegister">
        Register
      </button>
    </div>
  </div>
</template>

<script>
import './Home.css'; 

export default {
  name: 'HomeComponent',
  data() {
    return {
      fotoFelipeJimenez: require('../assets/felipejimenez.jpg') 
    };
  },
  methods: {
    handleLogin() {
      this.$router.push({ name: 'Login' });
    },
    handleRegister() {
      this.$router.push({ name: 'Register' });
    }
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
