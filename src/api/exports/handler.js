const { catchFunction } = require('../../utils');

class ExportsHandler {
  constructor(producerService, playlistService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postExportsMusicHandler = this.postExportsMusicHandler.bind(this);
  }

  async postExportsMusicHandler(request, h) {
    try {
      const userId = request.auth.credentials.id;
      const { playlistId } = request.params;
      await this._playlistService.verifyPlaylistOwner(playlistId, userId);
      await this._playlistService.verifyCollabPlaylist(playlistId, userId);
      this._validator.validateExportMusicPayload(request.payload);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this._producerService.sendMessage('export:music', JSON.stringify(message));
      return h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}
module.exports = ExportsHandler;
