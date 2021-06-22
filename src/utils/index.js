const ClientError = require('../exceptions/ClientError');

const mapDBplaylistsToModel = ({ id, name, username }) => ({ id, name, username });
const mapDBsongsToModel = ({ id, title, performer }) => ({ id, title, performer });
const catchFunction = (error, h) => {
  if (error instanceof ClientError) {
    return h.response({
      status: 'fail',
      message: error.message,
    }).code(error.statusCode);
  }
  return h.response({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  }).code(500);
};

module.exports = { mapDBplaylistsToModel, mapDBsongsToModel, catchFunction };
