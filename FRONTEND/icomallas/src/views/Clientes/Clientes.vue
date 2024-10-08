<template>
  <div>
    <h1>Clientes</h1>
    <div v-if="clientes.length > 0">
      <div v-for="cliente in clientes" :key="cliente.id" class="divCliente">
        <p>Cliente: {{ cliente.razon_social }}</p>
        <p>NIT: {{ cliente.nit }}</p>
        <p>Correo: {{ cliente.correo }}</p>
        <p>Teléfono: {{ cliente.telefono }}</p>
        <button class="Edit" @click="handleEditar(cliente.id)">
          Editar
        </button>
        <button class="trash" @click="handleDelete(cliente.id)">
          Eliminar
        </button>
      </div>
    </div>
    <div v-else>
      <p>No hay clientes para mostrar.</p>
    </div>
    <button class="btnAdd" @click="navigateToAddClient">
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
    const usuarioCreadorId = localStorage.getItem('usuario'); // Ajusta según la estructura del objeto almacenado

    const getClientes = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        error.value = 'Token no encontrado';
        return;
      }
      if (!usuarioCreadorId) {
        error.value = 'ID del usuario creador no encontrado';
        return;
      }
      try {
        const response = await axios.get('http://localhost:3001/clientes/consultar', {
          headers: { Authorization: token },
          params: {
            usuario_creador_id: usuarioCreadorId
          }
        });
        clientes.value = response.data.clientes || [];
        if (response.data.mensaje !== 'Operación exitosa') {
          error.value = 'Respuesta de la API indica error: ' + response.data.mensaje;
        }
      } catch (err) {
        error.value = 'Error al obtener datos: ' + (err.response ? err.response.data : err.message);
      }
    };

    const handleEditar = (id) => {
      router.push({ path: '/editarClientes', query: { id: id } });
    };

    const handleDelete = async (id) => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        error.value = 'Token no encontrado';
        return;
      }
      try {
        const response = await axios.delete(`http://localhost:3001/clientes/borrar/${id}`, {
          headers: { Authorization: token }
        });
        if (response.data.mensaje !== 'Cliente eliminado') {
          error.value = 'Error al eliminar el cliente: ' + response.data.mensaje;
        } else {
          getClientes(); // Refrescar la lista después de eliminar un cliente
        }
      } catch (err) {
        error.value = 'Error al eliminar cliente: ' + (err.response ? err.response.data : err.message);
      }
    };

    const navigateToAddClient = () => {
      router.push('/agregarCliente');
    };

    onMounted(() => {
      getClientes();
    });

    return {
      clientes,
      handleEditar,
      handleDelete,
      navigateToAddClient,
      error
    };
  }
};
</script>

<style scoped>
.divCliente {
  margin-bottom: 10px;
  text-align: justify;
  padding: 15px;
      background: #f2f2f2;
}

.trash {
  margin-left: 10px;
  background-color: #a31919;
  color: white;
  padding: 8px;
  border-radius: 8px;
}

.Edit {
  margin-left: 10px;
  background-color: #146732;
  color: white;
  padding: 8px;
  border-radius: 8px;
}

.btnAdd {
  margin-top: 20px;
}

.error {
  color: red;
}

h1 {
  margin: 59px;
  text-decoration: underline;
}
</style>
