import TicketService from "./TicketService";
import TicketsView from "./TicketView";
import TicketForm from "./TicketForm";
import Modal from "./Modal";

export default class HelpDesk {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("This is not HTML element!");
    }
    this.container = container;
    this.ticketService = new TicketService();
  }

  init() {
    this.initPages();
    this.initForms();
    this.initModals();
  }

  initPages() {
    this.pages = {
      tickets: new TicketsView(this.container),
    };
  }

  initForms() {
    this.forms = {
      createTicket: new TicketForm(document.querySelector("#new-ticket-form")),
    };
  }

  initModals() {
    this.modals = {
      createTicket: new Modal(document.querySelector("#modal-new-ticket")),
      removeTicket: new Modal(document.querySelector("#modal-remove-ticket")),
    };
  }

  update() {
    this.updatePages();
  }

  getModal(modalName) {
    return this.modals[modalName];
  }

  getPage(pageName) {
    return this.pages[pageName];
  }

  getForm(formName) {
    return this.forms[formName];
  }

  updatePages() {
    this.getPage("tickets").update();
  }
}
