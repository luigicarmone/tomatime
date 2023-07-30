const url = require('url');

async function getBodyParams(request) {
  try {
    const buffers = [];

    for await (const chunk of request) {
      buffers.push(chunk);
    }

    return JSON.parse(Buffer.concat(buffers).toString());
  } catch (e) {
    return null;
  }
}

function getQueryParams(request) {
  const urlParams = url.parse(request.url, true); //parsa l'url per prendere la prorpieta query
  return urlParams.query;
}

module.exports = {
  getBodyParams,
  getQueryParams
}