import { app } from "./app";
import Ticket from "./Ticket";

export default class TicketView {
  constructor(element) {
    if (!element) {
      throw new Error("element is not defined");
    }
    this.element = element;
    this.render();
    this.registerEvents();
  }

  update() {
    this.render();
  }

  registerEvents() {
    this.registerTicketClickEvent();
    this.registerStatusTicketClickEvent();
    this.registerAddTicketEvent();
    this.registerEditTicketEvents();
    this.registerRemoveTicketEvents();
  }

  registerTicketClickEvent() {
    const tickets = document.querySelectorAll(".ticket");
    for (let ticket of tickets) {
      ticket.addEventListener("click", (e) => {
        this.handleTicketClick(ticket, e);
      });
    }
  }

  handleTicketClick(ticket, e) {
    if (
      !e.target.closest(".ticket__btn") &&
      !e.target.closest(".ticket__checkbox")
    ) {
      this.toggleTicketDescription(ticket);
    }
  }

  registerStatusTicketClickEvent() {
    const statusTicketButtons = document.querySelectorAll(
      ".ticket__checkbox input"
    );
    for (let button of statusTicketButtons) {
      button.addEventListener("click", (e) => {
        this.handleStatusTicketClick(button, e);
      });
    }
  }

  handleStatusTicketClick(button) {
    app.ticketService.get(button.dataset.id, (_, response) => {
      const updatedTicket = Object.assign({}, response, {
        status: !response.status,
        created: new Date().getTime(),
      });

      app.ticketService.update(
        button.dataset.id,
        new Ticket(updatedTicket),
        (_, response) => {
          const newTicket = response.find((t) => t.id === button.dataset.id);
          const ticketDate = button
            .closest(".ticket")
            .querySelector(".ticket__date");
          ticketDate.textContent = this.formatDate(newTicket.created);
        }
      );
    });
  }

  toggleTicketDescription(ticket) {
    if (!ticket.querySelector(".ticket__description")) {
      app.ticketService.get(ticket.dataset.id, (_, response) => {
        if (response.description) {
          const descriptionNode = document.createElement("div");
          descriptionNode.classList.add(
            "ticket__description",
            "ticket__description--show"
          );
          descriptionNode.textContent = response.description;
          ticket.append(descriptionNode);
        }
      });
    } else {
      const descriptionNode = ticket.querySelector(".ticket__description");

      descriptionNode.classList.toggle("ticket__description--show");
    }
  }

  registerAddTicketEvent() {
    const addTicketButton = document.querySelector(".btn--add-ticket");
    addTicketButton.addEventListener("click", () => {
      this.handleAddTicketClick();
    });
  }

  handleAddTicketClick() {
    app.getForm("createTicket").element.reset();
    app.getForm("createTicket").method = "create";
    app.getForm("createTicket").ticketId = null;
    app.getModal("createTicket").open("Добавить тикет");
  }

  registerEditTicketEvents() {
    const editTicketButtons = document.querySelectorAll(".ticket__edit");
    for (let button of editTicketButtons) {
      button.addEventListener("click", () => {
        this.handleEditTicketClick(button);
      });
    }
  }

  handleEditTicketClick(button) {
    app.getForm("createTicket").method = "edit";
    app.getForm("createTicket").ticketId = button.dataset.id;

    const nameInput = app
      .getModal("createTicket")
      .element.querySelector("[name='name']");
    const descriptionInput = app
      .getModal("createTicket")
      .element.querySelector("[name='description']");

    app.ticketService.get(button.dataset.id, (_, response) => {
      nameInput.value = response.name;
      descriptionInput.value = response.description;

      app.getModal("createTicket").open("Изменить тикет");
    });
  }

  registerRemoveTicketEvents() {
    const removeTicketButtons = document.querySelectorAll(".ticket__remove");
    for (let button of removeTicketButtons) {
      button.addEventListener("click", () => {
        this.handleRemoveTicketClick(button);
      });
    }
  }

  handleRemoveTicketClick(button) {
    app.getModal("removeTicket").open("Удалить тикет");

    const removeButton = app
      .getModal("removeTicket")
      .element.querySelector("#remove-ticket-button");

    const removeTicketFunction = () => {
      this.removeTicket(button.dataset.id);
      removeButton.removeEventListener("click", removeTicketFunction);
    };

    removeButton.addEventListener("click", removeTicketFunction);
  }

  removeTicket(id) {
    app.ticketService.delete(id, () => {
      app.getModal("removeTicket").close();
      app.update();
    });
  }

  clear() {
    this.renderTickets([]);
  }

  render() {
    this.clear();

    app.ticketService.list((_, response) => {
      this.renderTickets(response);
    });
  }

  formatDate(date) {
    const dateObject = new Date(date);

    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedDay}.${formattedMonth}.${year} ${formattedHours}:${formattedMinutes}`;
  }

  getTicketHTML(item) {
    return `
      <div class="ticket" data-id="${item.id}">
          <div class="ticket__details">
            <div class="ticket__checkbox" data-id="${item.id}">
              <input id="status-${item.id}" data-id="${
      item.id
    }" type="checkbox" ${item.status ? "checked" : ""} />
              <label for="status-${item.id}"></label>
            </div>

            <p class="ticket__name">${item.name}</p>
          </div>
          <div class="ticket__controls">
            <div class="ticket__date">${this.formatDate(item.created)}</div>

            <div>
              <button
                class="ticket__edit ticket__btn ticket__btn--edit"
                data-id="${item.id}"
              >
                <i class="fa fa-pencil"></i>
              </button>

              <button
                class="ticket__remove ticket__btn ticket__btn--remove"
                data-id="${item.id}"
              >
                <i class="fa fa-times"></i>
              </button>
            </div>
          </div>
        </div>
    `;
  }

  renderTickets(data) {
    const content = this.element.querySelector(".list");
    content.innerHTML = "";

    if (data.length) {
      for (let item of data) {
        content.insertAdjacentHTML("beforeend", this.getTicketHTML(item));
      }
    }

    this.registerEvents();
  }
}
