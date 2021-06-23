const { catchFunction } = require('../../utils');

class CollaborationHandler {
  constructor(collaborationService, playlistService, validator) {
    this._collaborationService = collaborationService;
    this._playlistService = playlistService;
    this._validator = validator;
    this.postCollaboratorHandler = this.postCollaboratorHandler.bind(this);
    this.deleteCollaboratorHandler = this.deleteCollaboratorHandler.bind(this);
  }

  async postCollaboratorHandler(request, h) {
    try {
      this._validator.validatePostCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: owner } = request.auth.credentials;
      await this._playlistService.verifyPlaylistOwner(playlistId, owner);
      const id = await this._collaborationService.addCollaborator({ playlistId, userId });
      return h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId: id,
        },
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async deleteCollaboratorHandler(request, h) {
    try {
      this._validator.validateDeleteCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: owner } = request.auth.credentials;
      await this._playlistService.verifyPlaylistOwner(playlistId, owner);
      await this._collaborationService.deleteCollaborator({ playlistId, userId });
      return h.response({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}
module.exports = CollaborationHandler;
