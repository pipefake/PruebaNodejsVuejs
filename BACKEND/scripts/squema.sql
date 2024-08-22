--Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL
);

--Tabla de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nit VARCHAR(20) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    usuario_creador_id INTEGER,
    estado VARCHAR(50) DEFAULT 'Activo',
    FOREIGN KEY (usuario_creador_id) REFERENCES usuarios(id)
);