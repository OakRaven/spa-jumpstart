define(['services/datacontext'], function (datacontext) {
  var sessions = ko.observableArray();
  
  function activate() {
    return datacontext.getSessionPartials(sessions);
  }

  function refresh() {
    return datacontext.getSessionPartials(sessions, true);
  }

  var vm = {
    activate: activate,
    sessions: sessions,
    title: 'Sessions',
    refresh: refresh
  };

  return vm;
});