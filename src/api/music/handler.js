const { catchFunction } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class MusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateMusicPayload(request.payload);
      const {
        title, year, performer, genre, duration,
      } = request.payload;
      const id = await this._service.addSong({
        title, year, performer, genre, duration,
      });
      return h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId: id,
        },
      }).code(201);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async getSongsHandler(_, h) {
    try {
      const songs = await this._service.getSongs();
      return h.response({
        status: 'success',
        data: {
          songs,
        },
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async getSongByIdHandler(request, h) {
    const id = request.params.songId;
    try {
      const song = await this._service.getSongById(id);
      if (!song) {
        throw new NotFoundError(`gagal mendapatkan lagu dengan id ${id}`);
      }
      return h.response({
        status: 'success',
        data: {
          song,
        },
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async putSongByIdHandler(request, h) {
    const id = request.params.songId;
    try {
      this._validator.validateMusicPayload(request.payload);
      const {
        title, year, performer, genre, duration,
      } = request.payload;
      await this._service.updateSongById(id, {
        title, year, performer, genre, duration,
      });
      return h.response({
        status: 'success',
        message: 'lagu berhasil diperbarui',
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }

  async deleteSongByIdHandler(request, h) {
    const id = request.params.songId;
    try {
      await this._service.deleteSongById(id);
      return h.response({
        status: 'success',
        message: 'lagu berhasil dihapus',
      }).code(200);
    } catch (error) {
      return catchFunction(error, h);
    }
  }
}

module.exports = MusicHandler;
