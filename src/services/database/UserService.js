const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUser(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO music_user VALUES($1,$2,$3,$4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyUser(username) {
    const query = {
      text: 'SELECT username FROM music_user WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (result.rowCount > 0) {
      throw new InvariantError('Username sudah dipakai');
    }
  }

  async verifyUserCredentials(username, password) {
    const query = {
      text: 'SELECT id, password FROM music_user WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Kredensial yang anda berikan salah');
    }
    const { id, password: hashedPassword } = result.rows[0];
    const match = bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new InvariantError('Kredensial yang anda berikan salah');
    }
    return id;
  }
}
module.exports = UserService;
