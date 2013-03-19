define(['services/datacontext'], function (datacontext) {
  var speakers = ko.observableArray();
  var initialized = false;

  var vm = {
    activate: activate,
    speakers: speakers,
    title: 'Speakers',
    refresh: refresh
  };

  return vm;

  function activate() {
    if (initialized) { return; }
    initialized = true;
    return refresh();
  }

  function refresh() {
    return datacontext.getSpeakers(speakers);
  }
});