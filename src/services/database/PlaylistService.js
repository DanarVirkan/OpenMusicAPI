const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists ($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new InvariantError('Anda tidak berhak mengakses');
    }
  }

  async getPlaylistByOwner(owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result;
  }

  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal mengapus playlist');
    }
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1,$2,$3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
  }

  async getSongInPlaylist(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists_songs WHERE playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result;
  }

  async deleteSongInPlaylist({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus lagu dari playlist');
    }
  }
}
module.exports = PlaylistService;
