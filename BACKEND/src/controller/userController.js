const pool = require("./db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Agregar nuevo usuario
const agregarUsuario = async (req, res) => {
    const { nombre, email, contrasena } = req.body;

    // Verificar que el correo y la contraseña están presentes
    if (!email || !contrasena) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }

    // Validar el formato del correo
    if (!validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'Correo Incorrecto' });
    }

    // Generar el hash de la contraseña
    const hash = await bcrypt.hash(contrasena, 10);
    try {
        // Verificar si el correo ya existe en la base de datos
        const existeCorreo = await pool.query('SELECT * FROM public.usuarios WHERE correo = $1', [email]);
        if (existeCorreo.rows.length > 0) {
            return res.status(400).json({ mensaje: 'Correo ya existe' });
        }

        // Insertar el nuevo usuario en la base de datos
        const result = await pool.query('INSERT INTO public.usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id', [nombre, email, hash]);
        const usuario = result.rows[0];
        // Crear un token JWT para el nuevo usuario
        const token = jwt.sign({ id: usuario.id, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Enviar la respuesta con los detalles del nuevo usuario
        res.status(201).json({
            mensaje: 'Registro exitoso',
            id: usuario.id,
            nombre: nombre,
            email: email,
            token
        });
    } catch (err) {
        console.error('Error al registrar usuario:', err.message);
        res.status(500).json({ mensaje: 'Error al registrar usuario', error: err.message });
    }
};

// Inicio de sesión
const iniciarSesion = async (req, res) => {
    const { email, contrasena } = req.body;

    // Verificar que el correo y la contraseña están presentes
    if (!email || !contrasena) {
        return res.status(400).json({ mensaje: 'Correo y contraseña son requeridos' });
    }

    // Validar el formato del correo
    if (!validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'Correo Incorrecto' });
    }

    try {
        // Buscar el usuario por correo
        const result = await pool.query('SELECT * FROM public.usuarios WHERE correo = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ mensaje: 'Correo Incorrecto' });
        }
        const usuario = result.rows[0];
        // Comparar la contraseña ingresada con la almacenada en la base de datos
        const contrasenaCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);
        if (contrasenaCorrecta) {
            // Crear un token JWT para el usuario
            const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
            // Enviar la respuesta con el token y los detalles del usuario
            res.json({
                mensaje: 'Bienvenido',
                id: usuario.id,
                nombre: usuario.nombre,
                token,
                email: usuario.correo
            });
        } else {
            res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }
    } catch (err) {
        console.error('Error al iniciar sesión:', err.message);
        res.status(500).json({ mensaje: 'Error al iniciar sesión', error: err.message });
    }
}
// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    // Verificar que el identificador está presente
    if (!id) {
        return res.status(400).json({ mensaje: 'ID del usuario es requerido' });
    }

    try {
        // Eliminar el usuario de la base de datos
        const result = await pool.query('DELETE FROM public.usuarios WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Enviar respuesta de éxito
        res.json({ mensaje: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar usuario:', err.message);
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: err.message });
    }
}
// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, contrasena } = req.body;

    // Verificar que el identificador está presente
    if (!id) {
        return res.status(400).json({ mensaje: 'ID del usuario es requerido' });
    }

    // Verificar al menos un campo para actualizar
    if (!nombre && !email && !contrasena) {
        return res.status(400).json({ mensaje: 'Al menos un campo (nombre, correo, o contraseña) debe ser proporcionado para actualizar' });
    }

    // Validar el formato del correo si se proporciona
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ mensaje: 'Correo Incorrecto' });
    }

    try {
        // Generar el hash de la nueva contraseña si se proporciona
        let hash = null;
        if (contrasena) {
            hash = await bcrypt.hash(contrasena, 10);
        }

        // Preparar la consulta para actualizar los campos proporcionados
        let query = 'UPDATE public.usuarios SET';
        const values = [];
        let index = 1;

        if (nombre) {
            query += ` nombre = $${index++},`;
            values.push(nombre);
        }
        if (email) {
            query += ` correo = $${index++},`;
            values.push(email);
        }
        if (hash) {
            query += ` contrasena = $${index++},`;
            values.push(hash);
        }

        // Eliminar la coma final y añadir la cláusula WHERE
        query = query.slice(0, -1); // Elimina la última coma
        query += ' WHERE id = $' + index;
        values.push(id);

        // Ejecutar la consulta de actualización
        const result = await pool.query(query, values);
        if (result.rowCount === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Enviar respuesta de éxito
        res.json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar usuario:', err.message);
        res.status(500).json({ mensaje: 'Error al actualizar usuario', error: err.message });
    }
}


module.exports = {
    iniciarSesion,
    agregarUsuario,
    eliminarUsuario,
    actualizarUsuario
};