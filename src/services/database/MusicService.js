const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBsongsToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class MusicService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong({
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, createdAt],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menambah lagu');
    }
    await this._cacheService.delete('music:all');
    return result.rows[0].id;
  }

  async getSongs() {
    try {
      const result = await this._cacheService.get('music:all');
      return JSON.parse(result);
    } catch {
      const result = await this._pool.query('SELECT * FROM songs');
      const mapped = result.rows.map(mapDBsongsToModel);
      await this._cacheService.set('music:all', JSON.stringify(mapped));
      return mapped;
    }
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('id tidak ditemukan');
    }
    return result.rows[0];
  }

  async updateSongById(id, {
    title,
    year,
    performer,
    genre,
    duration,
  }) {
    const updated = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "updatedAt" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updated, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('id tidak ditemukan');
    }
    await this._cacheService.delete('music:all');
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('id tidak ditemukan');
    }
    await this._cacheService.delete('music:all');
  }
}

module.exports = MusicService;
