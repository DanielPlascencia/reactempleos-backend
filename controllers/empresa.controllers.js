const { unlink } = require("node:fs/promises");

const multer = require("multer");
const shortid = require("shortid");
const { validationResult } = require("express-validator");

const Empresa = require("../models/Empresa.models");
const Usuario = require("../models/Usuario.models");

//! MULTER - SUBIR ARCHIVOS ---------------------------------
const configuracionMulterArchivo = {
  storage: (fileStorage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, __dirname + "/../uploads/pic");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato No Válido. Sube un archivo JPG o PNG"));
    }
  },
};

const uploadArchivos = multer(configuracionMulterArchivo).single("logoEmpresa");

const subirLogoEmpresa = (req, res, next) => {
  uploadArchivos(req, res, function (error) {
    if (error) {
      return res.json({ msg: error });
    }

    next();
  });
};
//! -----------------------------------------------------------------

//! REGISTRAR UNA EMPRESA --
const registrarEmpresa = async (req, res, next) => {
  const errors = validationResult(req);

  // Si hay errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array() });
  }

  const esReclutador = await Usuario.findById({
    _id: req.body.reclutador,
  });

  if (esReclutador.rol === "Empleado") {
    return res.status(403).json({
      msg: "Los empledos no pueden registrar empresa, registrate como un Reclutador",
    });
  }

  const empresa = new Empresa(req.body);
  const reclutador = await Usuario.findOne({
    _id: req.body.reclutador,
  });

  if (empresa.reclutador) {
    //* Confirmar que el usuario ya creó una empresa.
    reclutador.empresaCreada = 1;
    reclutador.save();

    try {
      empresa.save();
      res.json({ msg: "Empresa Registrada Correctamente" });
    } catch (error) {
      return res
        .status(400)
        .json({ msg: "Ocurrió un error al agregar la empresa" });
    }
  }
};

//! MOSTRAR UNA EMPRESA POR SU ID --
const mostrarEmpresa = async (req, res, next) => {
  //* Obtener el id del usuario --
  const { idEmpresa } = req.params;

  const empresaEncontrada = await Empresa.findOne({
    _id: idEmpresa,
  }).populate("reclutador");

  if (!empresaEncontrada) {
    return res.status(404).json({ msg: "No se ha encontrado la empresa" });
  }

  res.json(empresaEncontrada);
};

//! MOSTRAR TODAS LAS EMPRESAS --
const mostrarEmpresas = async (req, res, next) => {
  const empresas = await Empresa.find().populate("reclutador").select("-__v");
  if (!empresas) {
    return res.status(404).json({ msg: "No hay empresas registradas" });
  }

  res.json(empresas);
};

//! MOSTRAR MI EMPRESA POR ID.
const mostrarMiEmpresa = async (req, res, next) => {
  //* Obtener el id del usuario --
  const { id } = req.params;

  try {
    const empresaEncontrada = await Empresa.findOne({
      reclutador: id,
    }).populate("reclutador");

    if (!empresaEncontrada) {
      return res.status(404).json({ msg: "No se ha encontrado la empresa" });
    }

    res.json(empresaEncontrada);
  } catch (error) {
    res.json({ msg: error.message });
  }
};

//! ACTUALIZAR DATOS DE LA EMPRESA MEDIANTE UN ID --
const actualizarEmpresa = async (req, res, next) => {
  const { idEmpresa, idUsuario } = req.params;
  const datosActualizados = req.body;

  const errors = validationResult(req);

  // Si hay errores.
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array() });
  }

  try {
    const usuarioEncontrado = await Usuario.findById({ _id: idUsuario });
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: "No se ha encontrado el usuario" });
    }

    const empresaEncontrada = await Empresa.findOne({
      _id: idEmpresa,
      reclutador: idUsuario,
    });

    if (!empresaEncontrada) {
      return res.status(404).json({ msg: "No se ha encontrado la empresa" });
    }

    if (req.file?.filename) {
      datosActualizados.logoEmpresa = req.file.filename;

      //* Eliminar la vieja imagen.
      if (empresaEncontrada.logoEmpresa) {
        //* Elimina solo si cambio de imagen.
        await unlink(
          `${__dirname}/../uploads/pic/${empresaEncontrada.logoEmpresa}`
        );
      }
    }

    //* Para que no se elimine la referencia del logo si no agrego imagen.
    if (!req.file?.filename) {
      datosActualizados.logoEmpresa = empresaEncontrada.logoEmpresa;
    }

    await Empresa.findByIdAndUpdate(
      { _id: idEmpresa, reclutador: idUsuario },
      datosActualizados,

      { new: true }
    );

    res.json({ msg: "Datos Actualizados Correctamente" });
  } catch (error) {
    return res.json({ msg: "Ha ocurrido un error en la consulta." });
  }
};

//! ELIMINAR EMPRESA MEDIANTE UN ID --
const eliminarEmpresa = async (req, res, next) => {
  const { idEmpresa, idUsuario } = req.params;

  const usuarioEncontrado = await Usuario.findById({ _id: idUsuario });
  if (!usuarioEncontrado) {
    return res.status(404).json({ msg: "No se ha encontrado el usuario" });
  }

  const empresaEncontrada = await Empresa.findOne({
    _id: idEmpresa,
    reclutador: idUsuario,
  });

  if (!empresaEncontrada) {
    return res.status(404).json({ msg: "No se ha encontrado la empresa" });
  }

  await Empresa.findByIdAndDelete({ _id: idEmpresa });

  res.json({ msg: "Empresa Eliminada Correctamente" });
};

//! EXPORTAR CONTROLADORES --
module.exports = {
  subirLogoEmpresa,
  registrarEmpresa,
  mostrarEmpresa,
  mostrarEmpresas,
  mostrarMiEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
};
