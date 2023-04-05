const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const usuarioSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  nombre: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: {
    type: String,
    trim: true,
  },
  rol: {
    type: String,
  },
  foto: {
    type: String,
    default: "",
  },
  cv: {
    type: String,
  },
  url: String,
  token: String,
  confirmado: {
    type: Number,
    default: 0,
  },
  empresaCreada: {
    type: Number,
    default: 0,
  },
});

// Método para hashear los passwords.
usuarioSchema.pre("save", async function (next) {
  // Si el password ya esta hasheado...
  if (!this.isModified("password")) {
    return next();
  }

  // Si no esta hasheado.
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;

  next();
});

module.exports = mongoose.model("Usuario", usuarioSchema);
