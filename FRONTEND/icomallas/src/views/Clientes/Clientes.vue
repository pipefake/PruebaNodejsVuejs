<template>
  <div>
    <h1>Clientes</h1>
    <div v-if="clientes.length > 0">
      <div v-for="cliente in clientes" :key="cliente.id" class="divCliente">
        <p> Cliente:{{ cliente.razon_social }}</p>
        <p> NIT: {{ cliente.nit }}</p>
        <p> Correo: {{ cliente.correo }}</p>
        <p> Telefono: {{ cliente.telefono }}</p>
        <button class="trash" @click="handleDelete(cliente.id)">
          Delete
        </button>
      </div>
    </div>
    <div v-else>
      <p>No hay clientes para mostrar.</p>
    </div>
    <button class="btnAdd" @click="handleEdit">
      +
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'ClientesView',
  setup() {
    const router = useRouter();
    const clientes = ref([]);
    const error = ref('');

    const getClientes = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        error.value = 'Token no encontrado';
        return;
      }
      try {
        const response = await axios.get('http://localhost:3001/clientes/consultar', {
          headers: { Authorization: token }
        });
        console.log('Response data:', response.data);
        clientes.value = response.data.clientes || [];
        console.log('Clientes array:', clientes.value);
        if (response.data.mensaje !== 'Okay') {
          error.value = 'Respuesta de la API indica error: ' + response.data.mensaje;
        } else {
          clientes.value = response.data.clientes || [];
        }
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        error.value = 'Error al obtener datos: ' + (err.response ? err.response.data : err.message);
      }
    };

    const handleEdit = () => {
      router.push('/agregarCliente');
    };

    const handleDelete = async (id) => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        error.value = 'Token no encontrado';
        return;
      }
      try {
        const response = await axios.delete(`http://localhost:3001/clientes/borrar/${id}`, {
          headers: { Authorization: `${token}` }
        });
        console.log('Respuesta:', response.data);
        if (response.data.mensaje !== 'Deleted Cliente') {
          error.value = 'Error al eliminar el cliente: ' + response.data.mensaje;
        } else {
          getClientes();
        }
      } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        error.value = 'Error al eliminar cliente: ' + (err.response ? err.response.data : err.message);
      }
    };

    onMounted(() => {
      getClientes();
    });

    return {
      clientes,
      handleEdit,
      handleDelete,
      error
    };
  }
};
</script>

<style scoped>
.divCliente {
  margin-bottom: 10px;
  margin-bottom: 10px;
    text-align: justify;
    padding: 5%;
}

.trash {
  margin-left: 10px;
      background-color: #a31919;
    color: white;
    padding: 2%;
    border-radius: 8px;
}

.btnAdd {
  margin-top: 20px;
}

.error {
  color: red;
}
h1{
    margin: 15%;
       
    text-decoration: underline;
}
</style>
