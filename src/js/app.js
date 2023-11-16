import HelpDesk from "./HelpDesk";

const root = document.getElementById("root");

export const app = new HelpDesk(root);

app.init();
