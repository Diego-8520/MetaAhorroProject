const mongoose = require('mongoose');

const ahorroSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    displayName: { type: String, default: 'Usuario sin nombre' },
    email: { type: String, default: '' },

    nombreAhorro: { type: String, required: true },
    descripcionAhorro: { type: String, default: '' },

    ahorroMensual: { type: Number, required: true },
    meses: { type: Number, required: true },
    meta: { type: Number, required: true },

    ahorroTotal: { type: Number, required: true },
    cumplioMeta: { type: Boolean, required: true },
    diferenciaMeta: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ahorro', ahorroSchema);