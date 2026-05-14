const express = require('express');
const router = express.Router();
const Ahorro = require('../models/ahorro');

router.get('/reporte/resumen/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const ahorros = await Ahorro.find({ uid }).sort({ createdAt: 1 });

    res.json({
      resumen: {
        total_registros: ahorros.length,
        total_ahorrado: ahorros.reduce((sum, a) => sum + a.ahorroTotal, 0),
        metas_cumplidas: ahorros.filter((a) => a.cumplioMeta).length,
        metas_pendientes: ahorros.filter((a) => !a.cumplioMeta).length,
        ultimo_registro: ahorros.length ? ahorros[ahorros.length - 1].createdAt : null,
      },
      detalle: ahorros,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reporte', error: error.message });
  }
});

router.get('/:uid', async (req, res) => {
  try {
    const ahorros = await Ahorro.find({ uid: req.params.uid }).sort({ createdAt: -1 });
    res.json(ahorros);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ahorros', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      uid,
      displayName,
      email,
      nombreAhorro,
      descripcionAhorro,
      ahorroMensual,
      meses,
      meta,
    } = req.body;

    if (!uid || !nombreAhorro || !ahorroMensual || !meses || !meta) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const ahorroTotal = Number(ahorroMensual) * Number(meses);
    const cumplioMeta = ahorroTotal >= Number(meta);
    const diferenciaMeta = ahorroTotal - Number(meta);

    const nuevo = await Ahorro.create({
      uid,
      displayName,
      email,
      nombreAhorro,
      descripcionAhorro,
      ahorroMensual,
      meses,
      meta,
      ahorroTotal,
      cumplioMeta,
      diferenciaMeta,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear ahorro', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombreAhorro, descripcionAhorro, ahorroMensual, meses, meta } = req.body;

    const ahorroTotal = Number(ahorroMensual) * Number(meses);
    const cumplioMeta = ahorroTotal >= Number(meta);
    const diferenciaMeta = ahorroTotal - Number(meta);

    const actualizado = await Ahorro.findByIdAndUpdate(
      req.params.id,
      {
        nombreAhorro,
        descripcionAhorro,
        ahorroMensual,
        meses,
        meta,
        ahorroTotal,
        cumplioMeta,
        diferenciaMeta,
      },
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Ahorro no encontrado' });
    }

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar ahorro', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Ahorro.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ message: 'Ahorro no encontrado' });
    }

    res.json({ message: 'Ahorro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar ahorro', error: error.message });
  }
});

module.exports = router;