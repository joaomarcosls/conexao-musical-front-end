import { Notify } from "quasar";

export default function exibiNotificacao(type, message, position, timeout) {
  Notify.create({
    type: type,
    message: message,
    position: position,
    timeout: timeout,
  });
}
