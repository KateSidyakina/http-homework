import Ticket from "./Ticket";
import { app } from "./app";

export default class TicketForm {
  constructor(element) {
    if (!element) {
      throw new Error("element is not defined");
    }

    this.element = element;
    this.method = null;
    this.ticketId = null;
    this.ticketStatus = null;

    this.registerEvents();
  }

  registerEvents() {
    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submit();
    });
  }

  getData() {
    const dataObject = {};
    const formData = new FormData(this.element);
    const entries = formData.entries();

    for (let item of entries) {
      const key = item[0];
      const value = item[1];

      dataObject[key] = value;
    }

    return new Ticket({
      id: this.ticketId,
      name: dataObject.name,
      status: false,
      description: dataObject.description,
      created: new Date().getTime(),
    });
  }

  onSubmit(data) {
    if (this.method === "create") {
      app.ticketService.create(data, (_, response) => {
        if (response !== null) {
          app.getModal("createTicket").close();
          app.getForm("createTicket").element.reset();
          app.update();
        }
      });
    } else if (this.method === "edit") {
      app.ticketService.update(this.ticketId, data, (_, response) => {
        if (response !== null) {
          app.getModal("createTicket").close();
          app.getForm("createTicket").element.reset();
          app.update();
        }
      });
    }
  }

  submit() {
    const options = this.getData();
    this.onSubmit(options);
  }
}
