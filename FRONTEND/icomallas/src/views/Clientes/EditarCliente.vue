<template>
  <div>
    <h1>Editar al cliente:</h1>
    <div>
      <div class="divAgregarCliente">
        <div>
          <label>Razón social</label>
          <input v-model="razon_social" :placeholder="razon_social">
        </div>
        <div>
          <label>NIT</label>
          <input v-model="nit" :placeholder="nit">
        </div>
        <div>
          <label>Correo</label>
          <input v-model="correo" :placeholder="correo">
        </div>
        <div>
          <label>Telefono</label>
          <input v-model="telefono" :placeholder="telefono">
        </div>
        <div>
          <label>Estado</label>
          <input type="checkbox" v-model="estado">
        </div>
      </div>
    </div>
    <div>
      <button class="Add" @click="handleSubmit">Guardar cambios</button>
    </div>
    <button class="btnAdd" @click="navigateBack">{{'<'}} Volver</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'EditarClienteView',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const razon_social = ref('');
    const nit = ref('');
    const correo = ref('');
    const telefono = ref('');
    const estado = ref(false);

    const fetchCliente = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado');
        return;
      }

      const id = route.query.id;
      console.log('ID obtenido:', id); // Verifica el ID aquí
      try {
        const response = await axios.get(`http://localhost:3001/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const cliente = response.data.cliente;
        razon_social.value = cliente.razon_social;
        nit.value = cliente.nit;
        correo.value = cliente.correo;
        telefono.value = cliente.telefono;
        estado.value = cliente.estado === 'Activo'; // Ajusta según el valor de estado en la respuesta
      } catch (err) {
        console.error('Error al obtener datos del cliente:', err);
      }
    };

 const handleSubmit = async () => {
  const token = sessionStorage.getItem('token');

  const usuario_creador = localStorage.getItem('usuario');
  console.log(usuario_creador);
  if (!token) {
    console.error('Token no encontrado');
    return;
  }

  const id = route.query.id;
  if (!id) {
    console.error('ID no encontrado');
    return;
  }

  try {
    const result = await axios.post(
      `http://localhost:3001/clientes/actualizar/${id}`,
      {
        nit: nit.value,
        razon_social: razon_social.value,
        correo: correo.value,
        telefono: telefono.value,
        usuario_creador_id: usuario_creador,
        estado: estado.value ? 'Activo' : 'Inactivo'
      },
      {
        headers: { Authorization: token } // Asegúrate de que el token sea correcto
      }
    );
    console.log(result.data);
    router.push('/clientes');
  } catch (err) {
    console.error('Error al editar cliente:', err);
  }
};


    const navigateBack = () => {
      router.back();
    };

    onMounted(() => {
      fetchCliente();
    });

    return {
      razon_social,
      nit,
      correo,
      telefono,
      estado,
      handleSubmit,
      navigateBack
    };
  }
};
</script>

<style scoped>
.divAgregarCliente {
  margin-bottom: 10px;
  text-align: justify;
  padding: 5%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-around;
  flex-wrap: wrap;
  gap: 11px;
}

.btnAdd {
  margin-top: 20px;
}

.error {
  color: red;
}

h1 {
  margin: 30px;
  font-size: 39px;
}
</style>
