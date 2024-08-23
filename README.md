# Tabla de Contenidos
1.Descripcion
2.Requisitos
3.Instalacion
5.Mejores prácticas
6.Seguridad




## Descripción
Este proyecto es una aplicación para gestionar clientes usando Node.js y PostgreSQL. Permite realizar operaciones CRUD y consulta filtrada basada en el asesor autenticado y autorización con JWT. Para la creación del frontend implemento Vuejs.


Requisitos Backend:
Node.js
Base de datos SQL (PostgreSQL/MySQL)
Express.js
bcryptjs
jsonwebtoken (JWT)
dotenv
validator
cors
nodemon

Requisitos de Frontend:
Node.js
Axios
Vue.js 
Vue Router
FontAwesome y Iconify 
Ionicons y Material Design Icons 

Instalación backend:

1. clonar el repositorio
2.  intalar dependencias (npm i / npm install)
3. Ejecutar el script SQL para crear las tablas y secuencias. El archivo schema.sql tiene la creación de las tablas para insertarlas en postgres
el archivo .env contiene información detallada sobre la base de datos utilizada llamada también "icomallas".
5. correr el aplicacito ( node app.js)

Instalación Frontend:

1. clonar el repositorio
2. intalar dependencias (npm i / npm install)
3. correr el aplicativo ( npm start)

Mejores prácticas:
Este proyecto se versionó en github con 2 ramas las cuales son frontend y backend, en los avances significativos se realizaron los respectivos comits y creación de tag.

Este proyecto contiene un README para el entendimiento de los usuarios que esten interesados en este proyecto.



Seguridad:
autentificacion y autorizacion: utilizando JWT y almacenando el token y rol con ssesionstorage de manera segura.
hashing, se utiliza bcryptjs para el hasheo de las contraseñas antes de ser almacenadas en la base de datos

