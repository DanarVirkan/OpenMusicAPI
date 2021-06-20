const ClientError = require('../exceptions/ClientError');

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

module.exports = { mapDBsongsToModel, catchFunction };
