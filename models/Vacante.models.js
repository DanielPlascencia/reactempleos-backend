const mongoose = require("mongoose");
const { Schema } = mongoose;

const vacanteSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  salario: {
    type: String,
    required: true,
    trim: true,
  },
  diasTrabajo: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
    required: true,
  },
  empresa: {
    type: Schema.ObjectId,
    ref: "Empresa",
  },
  usuariosPostulados: [{ type: Schema.ObjectId, ref: "Usuario" }],
});

module.exports = mongoose.model("Vacante", vacanteSchema);
