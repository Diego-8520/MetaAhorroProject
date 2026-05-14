const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  edad: Number
});

module.exports = mongoose.model('Usuario', UsuarioSchema);