const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{playlistId}',
    handler: handler.postExportsMusicHandler,
    options: {
      auth: 'music_jwt',
    },
  },
];
module.exports = routes;
