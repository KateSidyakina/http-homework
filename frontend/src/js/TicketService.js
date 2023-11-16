import createRequest from "./createRequest";

export default class TicketService {
  list(callback) {
    createRequest({
      url: "http://localhost:3000?method=allTickets",
      method: "GET",
      callback,
    });
  }

  get(id, callback) {
    createRequest({
      url: "http://localhost:3000?method=ticketById&id=" + id,
      method: "GET",
      callback,
    });
  }

  create(data, callback) {
    createRequest({
      url: "http://localhost:3000?method=createTicket",
      data,
      method: "POST",
      callback,
    });
  }

  update(id, data, callback) {
    createRequest({
      url: "http://localhost:3000?method=updateById&id=" + id,
      data,
      method: "POST",
      callback,
    });
  }

  delete(id, callback) {
    createRequest({
      url: "http://localhost:3000?method=deleteById&id=" + id,
      method: "GET",
      callback,
    });
  }
}
