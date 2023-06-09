import { sendVerificationCode } from "./verification";
import prompt from "prompt-sync";

const promptSync = prompt();
const email = promptSync("Ingresa la dirección de correo electrónico: ");
sendVerificationCode(email);
