const routes = (handler) => [{
  method: 'POST',
  path: '/collaborations',
  handler: handler.postCollaboratorHandler,
  options: {
    auth: 'music_jwt',
  },
},
{
  method: 'DELETE',
  path: '/collaborations',
  handler: handler.deleteCollaboratorHandler,
  options: {
    auth: 'music_jwt',
  },
}];
module.exports = routes;
