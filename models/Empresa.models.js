const mongoose = require("mongoose");
const { Schema } = mongoose;

const empresaSchema = new Schema({
  empresa: {
    type: String,
    trim: true,
    required: true,
  },
  pais: {
    type: String,
    trim: true,
    required: true,
  },
  estado: {
    type: String,
    trim: true,
    required: true,
  },
  ubicacion: {
    type: String,
    trim: true,
  },
  logoEmpresa: {
    type: String,
    default: "",
  },
  urlEmpresa: {
    type: String,
  },
  reclutador: {
    type: Schema.ObjectId,
    ref: "Usuario",
  },
});

module.exports = mongoose.model("Empresa", empresaSchema);
