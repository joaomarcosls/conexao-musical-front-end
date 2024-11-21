import { boot } from "quasar/wrappers";
import Card from "../components/globais/Card";

export default boot(async ({ app }) => {
  app.component("card", Card);
});
