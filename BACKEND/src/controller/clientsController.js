const pool = require("./db");
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Listar clientes
const listarClientes = async (req, res) => {
    const pagina = parseInt(req.query.pagina || 1);
    const limite = parseInt(req.query.limite) || 5;
    try {
        const offset = (pagina - 1) * limite;

        const resultadoConteo = await pool.query('SELECT COUNT(*) FROM CLIENTES');
        const totalClientes = parseInt(resultadoConteo.rows[0].count);

        const listaDeClientes = await pool.query(
            'SELECT * FROM clientes LIMIT $1 OFFSET $2',
            [limite, offset]
        );
        const clientes = listaDeClientes.rows;

        const totalPaginas = Math.ceil(totalClientes / limite);
        res.status(200).json({
            mensaje: 'Operación exitosa',
            clientes,
            totalPaginas
        });
    } catch (err) {
        console.error(err);
        res.status(500).json('Error al listar clientes');
    }
}

// Registrar un nuevo cliente
const registrarCliente = async (req, res) => {
    const {
        nit,
        razon_social,
        correo,
        telefono,
        usuario_creador_id,
        estado = 'Activo' // Valor predeterminado para 'estado'
    } = req.body;

    if (!nit || !razon_social || !correo) {
        return res.status(400).json({
            mensaje: 'Los datos NIT, razón social y correo son requeridos'
        });
    }

    // Validación del formato del correo
    if (!validator.isEmail(correo)) {
        return res.status(400).json({
            mensaje: 'El formato del correo es inválido'
        });
    }

    try {
        // Verificar si el cliente ya existe por NIT o correo
        const existeCliente = await pool.query(
            'SELECT * FROM clientes WHERE NIT = $1 OR CORREO = $2',
            [nit, correo]
        );
        if (existeCliente.rows.length > 0) {
            return res.status(400).json({
                mensaje: 'Cliente ya existe'
            });
        }

        const resultado = await pool.query(
            'INSERT INTO clientes (NIT, RAZON_SOCIAL, CORREO, TELEFONO, USUARIO_CREADOR_ID, ESTADO) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nit, razon_social, correo, telefono, usuario_creador_id, estado]
        );
        const cliente = resultado.rows[0];
        const token = jwt.sign(
            {
                id: cliente.id,
                nit: cliente.nit,
                razon_social: cliente.razon_social,
                correo: cliente.correo,
                estado: cliente.estado,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            mensaje: 'Registro exitoso',
            id: cliente.id,
            nit: cliente.nit,
            razon_social: cliente.razon_social,
            correo: cliente.correo,
            telefono: cliente.telefono,
            estado: cliente.estado,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json('Error al registrar cliente');
    }
};

// Actualizar un cliente
const actualizarCliente = async (req, res) => {
    const id = parseInt(req.params.id);
    const {
        nit,
        razon_social,
        correo,
        telefono,
        usuario_creador_id,
        estado
    } = req.body;

    if (!nit || !razon_social || !correo) {
        return res.status(400).json({
            mensaje: 'Los datos NIT, razón social y correo son requeridos'
        });
    }

    // Validación del formato del correo
    if (!validator.isEmail(correo)) {
        return res.status(400).json({
            mensaje: 'El formato del correo es inválido'
        });
    }

    try {
        // Verificar si el cliente existe
        const clienteExistente = await pool.query(
            'SELECT * FROM clientes WHERE ID = $1',
            [id]
        );
        if (clienteExistente.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }

        const resultado = await pool.query(
            'UPDATE clientes SET NIT = $1, RAZON_SOCIAL = $2, CORREO = $3, TELEFONO = $4, USUARIO_CREADOR_ID = $5, ESTADO = $6 WHERE ID = $7 RETURNING *',
            [nit, razon_social, correo, telefono, usuario_creador_id, estado, id]
        );
        const clienteActualizado = resultado.rows[0];

        res.status(200).json({
            mensaje: 'Cliente actualizado exitosamente',
            cliente: clienteActualizado
        });
    } catch (err) {
        console.error(err);
        res.status(500).json('Error al actualizar cliente');
    }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const resultado = await pool.query(
            'DELETE FROM clientes WHERE ID = $1 RETURNING *', [id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensaje: 'Cliente no encontrado'
            });
        }
        res.status(200).json({
            mensaje: 'Cliente eliminado',
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Ocurrió un error al eliminar el cliente',
            error: error.message
        });
    }
};

module.exports = {
    registrarCliente,
    eliminarCliente,
    listarClientes,
    actualizarCliente
};
