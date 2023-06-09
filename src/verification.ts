import * as nodemailer from "nodemailer";
import prompt from "prompt-sync";
import { emailCredentials } from "./credentials";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: emailCredentials,
});

function generateVerificationCode() {
  const codeLength = 6;
  const characters = "0123456789";
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    const index = Math.floor(Math.random() * characters.length);
    code += characters[index];
  }
  return code;
}

function validateEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export async function sendVerificationCode(email: string) {
  if (!validateEmail(email)) {
    console.log("Dirección de correo electrónico inválida.");
    return;
  }

  const code = generateVerificationCode();

  const mailOptions = {
    from: emailCredentials.user,
    to: email,
    subject: "Código de verificación",
    text: `Tu código de verificación es: ${code}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado:", info.response);
  } catch (error) {
    console.log("Error al enviar el correo electrónico:", error);
    return;
  }

  const promptSync = prompt();
  let attempts = 0;

  while (true) {
    const userCode = promptSync("Ingresa el código de verificación: ");
    if (userCode === code) {
      console.log("Verificación exitosa. Código de verificación válido.");
      break;
    } else {
      attempts++;
      if (attempts < 3) {
        console.log("Código de verificación inválido. Intenta nuevamente.");
      } else {
        console.log("Has intentado demasiadas veces. Verificación fallida.");
        break;
      }
    }
  }
}
