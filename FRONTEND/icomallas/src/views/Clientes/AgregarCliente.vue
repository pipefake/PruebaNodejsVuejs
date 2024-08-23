<template>
  <div>
    <h1>Agregar un nuevo cliente:</h1>
    <div>
      <div class="divAgregarCliente">
        <div>
          <label>Razón social</label>
          <input v-model="razon_social" type="text">
        </div>
        <div>
          <label>NIT</label>
          <input v-model="nit" type="text">
        </div>
        <div>
          <label>Correo</label>
          <input v-model="correo" type="email">
        </div>
        <div>
          <label>Telefono</label>
          <input v-model="telefono" type="tel">
        </div>
        <div>
          <label>Estado</label>
          <input v-model="estado" type="checkbox">
        </div>
      </div>
    </div>
    <div>
      <button class="Add" @click="handleSubmit">Agregar</button>
    </div>
    <button class="btnAdd" @click="navigateBack">{{'<'}} Volver</button>
  </div>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'AgregarClienteView',
  setup() {
    const router = useRouter();
    const razon_social = ref('');
    const nit = ref('');
    const correo = ref('');
    const telefono = ref('');
    const estado = ref(false); // Default to false for a checkbox
    const usuario = sessionStorage.getItem('usuario'); // Ensure this is properly retrieved

   const handleSubmit = async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('Token no encontrado');
    return;
  }
  try {
    const result = await axios.post(
      'http://localhost:3001/clientes/crear',
      {
        nit: nit.value,
        razon_social: razon_social.value,
        correo: correo.value,
        telefono: telefono.value,
        usuario_creador_id: usuario,
        estado: estado.value
      },
      {
       headers: { Authorization: token }
      }
    );
    console.log(result.data);
    router.push('/clientes');
  } catch (err) {
    console.error('Error al agregar cliente:', err.response ? err.response.data : err.message);
  }
};


    const navigateBack = () => {
      router.back();
    };

    return {
      nit,
      razon_social,
      correo,
      telefono,
      estado,
      handleSubmit,
      navigateBack
    };
  }
};
</script>
