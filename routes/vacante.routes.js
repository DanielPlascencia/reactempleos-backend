const express = require("express");
const router = express.Router();

//* EXPRESS VALIDATOR.
const { body } = require("express-validator");

//! IMPORTAR CONTROLADORES --
const {
  mostrarVacante,
  agregarVacante,
  mostrarVacantes,
  actualizarVacante,
  eliminarVacante,
  postularme,
  mostrarVacantesDeEmpresa,
  eliminarPostulacion,
} = require("../controllers/vacante.controllers");

//! REGISTRAR UNA NUEVA VACANTE --
router.post(
  "/agregar-vacante",
  [
    body("nombre")
      .isString()
      .withMessage("NOMBRE: Introduce puros letras")
      .notEmpty()
      .withMessage("NOMBRE: El nombre de la vacante es obligatorio"),

    body("salario")
      .isNumeric()
      .withMessage("SALARIO: Escribe digitos")
      .isLength({ min: 3 })
      .withMessage("SALARIO: Mínimo 3 digítos"),

    body("diasTrabajo")
      .notEmpty()
      .withMessage("DIAS DE TRABAJO: El nombre de la vacante es obligatorio"),

    body("descripcion")
      .isLength({ min: 20 })
      .withMessage("DESCRIPCION: Escribe una descripción más larga"),
  ],
  agregarVacante
);

//! OBTENER UNA VACANTE POR SU ID --
router.get("/mostrar-vacante/:idVacante", mostrarVacante);

//! OBTENER TODAS LAS VACANTES --
router.get("/mostrar-vacantes/", mostrarVacantes);

//! ACTUALIZAR VACANTE POR ID --
router.put(
  "/actualizar-vacante/:idVacante",
  [
    body("nombre")
      .isString()
      .withMessage("NOMBRE: Introduce puros letras")
      .notEmpty()
      .withMessage("NOMBRE: El nombre de la vacante es obligatorio"),

    body("salario")
      .isNumeric()
      .withMessage("SALARIO: Escribe digitos")
      .isLength({ min: 3 })
      .withMessage("SALARIO: Mínimo 3 digítos"),

    body("diasTrabajo")
      .notEmpty()
      .withMessage("DIAS DE TRABAJO: El nombre de la vacante es obligatorio"),

    body("descripcion")
      .isLength({ min: 20 })
      .withMessage("DESCRIPCION: Escribe una descripción más larga"),
  ],
  actualizarVacante
);

//! ELIMINAR UNA VACANTE MEDIANTE SU ID --
router.delete("/eliminar-vacante/:idVacante", eliminarVacante);

//! POSTULARSE A LA VACANTE --
router.put("/postularme/:idVacante", postularme);

router.get("/mostrar-vacantes-de-empresa/:id", mostrarVacantesDeEmpresa);

router.delete("/eliminar-postulacion/:id", eliminarPostulacion);

module.exports = router;
