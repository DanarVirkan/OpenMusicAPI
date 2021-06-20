const routes = (handler) => [{
  method: 'POST',
  path: '/playlists',
  handler: handler.postPlaylistHandler,
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists',
  handler: handler.getPlaylistHandler,
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'DELETE',
  path: '/playlists/{playlistId}',
  handler: handler.deletePlaylistHandler,
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'POST',
  path: '/playlists/{playlistId}/songs',
  handler: handler.postSongToPlaylistHandler,
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'GET',
  path: '/playlists/{playlistId}/songs',
  handler: handler.getSongInPlaylistHandler,
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'DELETE',
  path: '/playlists/{playlistId}/songs',
  handler: handler.deleteSongInPlaylistHandler,
  options: {
    auth: 'music_jwt',
  },
},
];
module.exports = routes;
