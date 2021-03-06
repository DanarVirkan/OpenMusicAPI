exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"music_user"',
    },
  });
  pgm.createIndex('playlists', 'owner');
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
  pgm.dropIndex('playlists', 'owner');
};
