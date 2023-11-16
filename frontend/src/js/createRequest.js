const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";

  if (options.method === "GET") {
    xhr.open(options.method, options.url);
    xhr.send();
  } else {
    xhr.open(options.method, options.url);
    xhr.send(JSON.stringify(options.data));
  }

  if (options.callback) {
    xhr.addEventListener("load", () => options.callback(null, xhr.response));
    xhr.addEventListener("error", (e) => options.callback(e.type, null));
  }
};

export default createRequest;
