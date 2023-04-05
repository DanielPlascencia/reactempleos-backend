//! IMPORTAR DEPENDENCIAS --
const Vacante = require("../models/Vacante.models");
const { usuarioPostulado } = require("../config/mailtrap");

//* Validar formulario.
const { validationResult } = require("express-validator");

//! AGREGAR UNA VACANTE A LA DB --
const agregarVacante = async (req, res, next) => {
  const vacante = new Vacante(req.body);

  const errors = validationResult(req);

  // Si hay errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array() });
  }

  try {
    await vacante.save();
    return res.json({ msg: "La vacante se ha guardado correctamente" });
  } catch (error) {
    return res.status(400).json({
      msg: "Ha ocurrido un error al guardar la vacante: " + error.message,
    });
  }
};

//! MOSTRAR UNA VACANTE MEDIANTE SU ID.
const mostrarVacante = async (req, res, next) => {
  const { idVacante } = req.params;
  const vacanteEncontrada = await Vacante.findById({ _id: idVacante }).populate(
    {
      path: "empresa",
      populate: { path: "reclutador", select: "email nombre telefono" },
    }
  );

  if (!vacanteEncontrada) {
    return res.status(404).json({ msg: "La vacante no existe" });
  }

  res.json(vacanteEncontrada);
};

//! MOSTRAR TODAS LAS VACANTES QUE HAY EN LA DB --
const mostrarVacantes = async (req, res, next) => {
  const vacantes = await Vacante.find().populate({
    path: "empresa",
    populate: { path: "reclutador", select: "email nombre telefono" },
  });

  if (!vacantes) {
    return res.status(404).json({ msg: "No hay ninguna vacante" });
  }

  res.json(vacantes);
};

//! ACTUALIZAR LA VACANTE MEDIANTE SU ID --
const actualizarVacante = async (req, res, next) => {
  const { idVacante } = req.params;
  const actualizarVacante = req.body;

  const errors = validationResult(req);

  // Si hay errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array() });
  }

  try {
    const vacanteEncontrada = await Vacante.findById({ _id: idVacante });
    if (!vacanteEncontrada) {
      return res.status(404).json({ msg: "No se encontro ninguna vacante" });
    }

    await Vacante.findByIdAndUpdate({ _id: idVacante }, actualizarVacante, {
      new: true,
    });

    res.status(200).json({ msg: "Vacante Actualizada Correctamente" });
  } catch (error) {
    return res.status(400).json({ msg: "Ocurrió un error, intenta otra vez" });
  }
};

//! ELIMINAR LA VACANTE MEDIANTE SU ID --
const eliminarVacante = async (req, res, next) => {
  const { idVacante } = req.params;
  try {
    const vacanteEncontrada = await Vacante.findById({ _id: idVacante });
    if (!vacanteEncontrada) {
      return res.status(404).json({ msg: "La Vacante No Existe" });
    }

    await Vacante.findByIdAndDelete({ _id: idVacante });

    res.json({ msg: "Vacante Eliminada Correctamente" });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Ocurrio un error. Intentalo de nuevo" });
  }
};

//! POSTULARME A LA VACANTE MEDIANTE EL ID DE LA VACANTE Y EL ID DEL USUARIO --
const postularme = async (req, res, next) => {
  const { idVacante } = req.params;
  const { usuariosPostulados, emailUsuario, emailEmpresa } = req.body;

  try {
    const obtenerVacante = await Vacante.findById(idVacante);
    if (!obtenerVacante) {
      return res
        .status(404)
        .json({ msg: "ERROR, no hemos encontrado la vacante" });
    }

    obtenerVacante.usuariosPostulados = [
      ...obtenerVacante.usuariosPostulados,
      usuariosPostulados,
    ];

    //* Notificar por Email al usuario y empresa.
    usuarioPostulado({
      emailUsuario: emailUsuario,
      emailEmpresa: emailEmpresa,
      nombreVacante: obtenerVacante.nombre,
    });

    await obtenerVacante.save();

    res.json({ msg: "La postulación se ha hecho con éxito" });
  } catch (error) {
    res
      .status(400)
      .json({ msg: "Ocurrio un error en la consulta: " + error.message });
  }
};

//! ELIMINAR POSTULACION --
const eliminarPostulacion = async (req, res, next) => {
  const { id } = req.params;
  const eliminarPostulacion = await Vacante.findOne({ usuariosPostulados: id });
  const postulacionFiltrada = eliminarPostulacion.usuariosPostulados.filter(
    (postulacion) => postulacion != id
  );
  eliminarPostulacion.usuariosPostulados = postulacionFiltrada;
  const postulacionEliminada = await eliminarPostulacion.save();
  if (!postulacionEliminada) {
    res.status(400).json({ msg: "Hubo un error al eliminar la postulacion" });
  }

  res.json({ msg: "Postulacion elminada exitosamente" });
};

//! MOSTRAR TODAS LAS VACANTES QUE CONTIENE UNA EMPRESA --
const mostrarVacantesDeEmpresa = async (req, res, next) => {
  const { id } = req.params;
  try {
    const vacantesEncontradas = await Vacante.find({ empresa: id }).populate(
      "empresa"
    );
    if (!vacantesEncontradas) {
      return res
        .status(404)
        .json({ msg: "Esta empresa no tiene vacantes disponibles" });
    }

    res.json(vacantesEncontradas);
  } catch (error) {
    res
      .status(400)
      .json({ msg: "Ocurrio un error en la consulta: " + error.message });
  }
};

//! EXPORTAR CONTROLADORES.
module.exports = {
  agregarVacante,
  mostrarVacante,
  mostrarVacantes,
  actualizarVacante,
  eliminarVacante,
  postularme,
  mostrarVacantesDeEmpresa,
  eliminarPostulacion,
};
