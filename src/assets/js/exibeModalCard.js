import { Dialog } from "quasar";
import ModalCard from "src/components/modals/ModalCard.vue";

export default function exibeModalCard(produto_id) {
  return Dialog.create({
    component: ModalCard,
    componentProps: {
      produto_id,
    },
  });
}
