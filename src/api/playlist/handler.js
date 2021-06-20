class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: owner } = request.auth.credentials;
      const id = await this._service.addPlaylist({ name, owner });
      return h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId: id,
        },
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  async getPlaylistHandler(request, h) {
    try {
      const { id: owner } = request.auth.credentials;
      const playlists = await this._service.getPlaylistByOwner(owner);
      return h.response({
        status: 'success',
        data: {
          playlists,
        },
      }).code(200);
    } catch {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      await this._service.verifyPlaylistOwner(playlistId, owner);
      await this._service.deletePlaylist(playlistId);
      return h.response({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      }).code(200);
    } catch {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;
      await this._service.verifyPlaylistOwner(playlistId, owner);
      await this._service.addSongToPlaylist({ playlistId, songId });
      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      }).code(201);
    } catch {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  async getSongInPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      this._service.verifyPlaylistOwner(playlistId, owner);
      const songs = await this._service.getSongInPlaylist(playlistId);
      return h.response({
        status: 'success',
        data: {
          songs,
        },
      }).code(200);
    } catch {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }

  async deleteSongInPlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: owner } = request.auth.credentials;
      this._service.verifyPlaylistOwner(owner);
      this._service.deleteSongInPlaylist({ playlistId, songId });
      return h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      }).code(200);
    } catch {
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      }).code(500);
    }
  }
}
module.exports = PlaylistHandler;
