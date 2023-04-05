const express = require("express");
const router = express.Router();

//* EXPRESS VALIDATOR.
const { body } = require("express-validator");

const {
  subirLogoEmpresa,
  registrarEmpresa,
  mostrarEmpresa,
  mostrarEmpresas,
  mostrarMiEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
} = require("../controllers/empresa.controllers");

//! REGISTRAR LOS DATOS DE LA EMPRESA --
router.post(
  "/registrar-empresa/",

  [
    body("empresa")
      .notEmpty()
      .withMessage("El nombre de la empresa es obligatorio"),

    body("pais")
      .isString()
      .withMessage("País: Solo se aceptan letras")
      .notEmpty()
      .withMessage("El pais es obligatorio"),

    body("estado")
      .isString()
      .withMessage("Estado: Introduce puros letras")
      .notEmpty()
      .withMessage("El estado es obligatorio"),

    body("urlEmpresa").isURL().withMessage("Escribe una URL válida"),
  ],
  registrarEmpresa
);

//! MOSTRAR EMPRESA CON LOS DATOS DEL RECLUTADOR --
router.get("/mostrar-empresa/:idEmpresa", mostrarEmpresa);

//! MOSTRAR EMPRESAS --
router.get("/mostrar-empresas", mostrarEmpresas);

//! MOSTRAR MI EMPRESA POR ID --
router.get("/mostrar-mi-empresa/:id", mostrarMiEmpresa);

//! ACTUALIZAR DATOS DE UNA EMPRESA --
router.put(
  "/actualizar-empresa/:idEmpresa&:idUsuario",
  subirLogoEmpresa,
  [
    body("empresa")
      .notEmpty()
      .withMessage("El nombre de la empresa es obligatorio"),

    body("pais")
      .isString()
      .withMessage("Introduce puros letras")
      .notEmpty()
      .withMessage("El pais es obligatorio"),

    body("estado")
      .isString()
      .withMessage("Introduce puros letras")
      .notEmpty()
      .withMessage("El estado es obligatorio"),

    body("urlEmpresa").isURL().withMessage("Escribe una URL válida"),
  ],
  actualizarEmpresa
);

//! ELIMINAR EMPRESA --
router.delete("/eliminar-empresa/:idEmpresa&:idUsuario", eliminarEmpresa);

module.exports = router;
