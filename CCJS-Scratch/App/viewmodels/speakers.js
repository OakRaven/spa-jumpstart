define(['services/datacontext'], function (datacontext) {
  var speakers = ko.observableArray();

  function activate() {
    return datacontext.getSpeakerPartials(speakers);
  }

  function refresh() {
    return datacontext.getSpeakerPartials(speakers, true);
  }

  var vm = {
    activate: activate,
    speakers: speakers,
    title: 'Speakers',
    refresh: refresh
  };

  return vm;
});