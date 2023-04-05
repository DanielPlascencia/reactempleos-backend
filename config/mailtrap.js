const nodemailer = require("nodemailer");

//! FUNCIÓN PARA ENVIAR EMAIL Y QUE CONFIRME SU CUENTA
const comprobarCuenta = async (datos) => {
  const { email, nombre, token } = datos;

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9866253788b401",
      pass: "b423096e125aaf",
    },
  });

  fragmentToken = token.split(".");

  // Información del email.
  const info = await transport.sendMail({
    from: "'reactEmpleos' <noreply@reactempleos.com>",
    to: email,
    subject: "reactEmpleos - Comprueba Tu Cuenta",
    text: "Reestablece Tu Password",
    html: `<p>Hola: ${nombre}, comprueba tu password para poder iniciar sesión. </p>
            <p>Sigue el siguiente enlace para confirmar tu cuenta:</p>
            <a href="${process.env.FRONTEND_URL}/auth/comprobar-cuenta/${fragmentToken[0]}&${fragmentToken[1]}&${fragmentToken[2]}">Confirmar Cuenta</a>
            <p>Si tu no solicitaste este email puedes ignorar este mensaje.</p>
    `,
  });
};

//! FUNCIÓN PARA ENVIAR EMAIL CUANDO SE REQUIRE RECUPERAR UN PASSWORD --
const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos;

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9866253788b401",
      pass: "b423096e125aaf",
    },
  });

  fragmentToken = token.split(".");

  // Información del email.
  const info = await transport.sendMail({
    from: "'reactEmpleos' <noreply@reactempleos.com>",
    to: email,
    subject: "reactEmpleos - Recupera tu cuenta",
    text: "Reestablece Tu Password",
    html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password </p>
            <p>Sigue el siguiente enlace para generar un nuevo password:</p>
            <a href="${process.env.FRONTEND_URL}/auth/nuevo-password/${fragmentToken[0]}&${fragmentToken[1]}&${fragmentToken[2]}">Reestablecer Password</a>
            <p>Si tu no solicitaste este email puedes ignorar este mensaje.</p>
    `,
  });
};

//! FUNCIÓN PARA NOTIFICARLE AL USUARIO Y EMPRESA DE LA POSTULACION --
const usuarioPostulado = async (datos) => {
  const { emailEmpresa, emailUsuario, nombreVacante } = datos;

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "9866253788b401",
      pass: "b423096e125aaf",
    },
  });

  try {
    //* Información del email para el usuario.
    await transport.sendMail({
      from: "'reactEmpleos' <noreply@reactempleos.com>",
      to: emailUsuario,
      subject: `reactEmpleos - Te postulaste a la vacante: ${nombreVacante}`,
      text: `Postulación a la vacante: ${nombreVacante}`,
      html: `
      <p>Hola, Te has postulado correctamente a la vacante</p>
      <p>Te deseamos mucha suerte en tu proceso de selección</p>
      <p>Sólo queda esperar a que el reclutador te contacte. ¡MUCHA SUERTE!</p>

      <p>Si tu no solicitaste este email puedes ignorar este mensaje.</p>
      `,
    });

    //* Información del email para la empresa.
    await transport.sendMail({
      from: "'reactEmpleos' <noreply@reactempleos.com>",
      to: emailEmpresa,
      subject: `reactEmpleos - Nueva postulación en tu vacante: ${nombreVacante}`,
      text: "NUEVA POSTULACION EN TU VACANTE",
      html: `
    <p>Alguien se ha postulado en la vacante ${nombreVacante}</p>
    <p></p>
    
      <p>Si tu no solicitaste este email puedes ignorar este mensaje.</p>
    `,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { comprobarCuenta, emailOlvidePassword, usuarioPostulado };
