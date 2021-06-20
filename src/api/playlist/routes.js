const routes = (handler) => [{
  method: 'POST',
  path: '/playlists',
  handler: handler.postPlaylistHandler,
},
{
  method: 'GET',
  path: '/playlists',
  handler: handler.getPlaylistHandler,
},
{
  method: 'DELETE',
  path: '/playlists/{playlistId}',
  handler: handler.deletePlaylistHandler,
},
{
  method: 'POST',
  path: '/playlists/{playlistId}/songs',
  handler: handler.postSongToPlaylistHandler,
},
{
  method: 'GET',
  path: '/playlists/{playlistId}/songs',
  handler: handler.getSongInPlaylistHandler,
},
{
  method: 'DELETE',
  path: '/playlists/{playlistId}/songs',
  handler: handler.deleteSongInPlaylistHandler,
},
];
module.exports = routes;
