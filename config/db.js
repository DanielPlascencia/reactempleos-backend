require("dotenv").config();
const mongoose = require("mongoose");

const db = mongoose.connect(
  process.env.BACKEND_DB,
  { useNewUrlParser: true },
  () => {
    try {
      return console.log("Conectado correctamente a la DB.");
    } catch (error) {
      return console.log(
        "ERROR AL CONECTARSE EN LA BASE DE DATOS. ID_ERROR: ",
        error
      );
    }
  }
);

// Importar modelos.
// require("../models/Usuarios.model");

module.exports = db;
