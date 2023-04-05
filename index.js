//! DEPENDENCIAS.
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const db = require("./config/db");

//! RUTAS.
const routerUsuarios = require("./routes/usuario.routes");
const routerEmpresa = require("./routes/empresa.routes");
const routerVacante = require("./routes/vacante.routes");
const routerAuth = require("./routes/auth.routes");

//! Habilitar bodyParser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//! Habilitar CORS.
app.use(cors());

//! Habilitar Carpeta Pública.
app.use(express.static(path.join("./uploads/pic")));
app.use(express.static(path.join("./uploads/docs")));

// Rutas.
app.use("/api/usuarios", routerUsuarios);
app.use("/api/empresa", routerEmpresa);
app.use("/api/vacantes", routerVacante);
app.use("/api/auth", routerAuth);

const PORT = process.env.PORT || process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log("Servidor escuchando en el puerto: " + PORT);
});
