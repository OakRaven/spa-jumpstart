/// <reference path="../../Scripts/knockout-2.2.1.js" />

define(['services/datacontext', 'durandal/plugins/router'],
  function (datacontext, router) {
    var session = ko.observable();
    var rooms = ko.observableArray();
    var tracks = ko.observableArray();
    var timeSlots = ko.observableArray();

    var activate = function (routeData) {
      var id = parseInt(routeData.id);
      initLookups();
      return datacontext.getSessionById(id, session);
    };

    var initLookups = function () {
      rooms(datacontext.lookups.rooms);
      tracks(datacontext.lookups.tracks);
      timeSlots(datacontext.lookups.timeslots);
    };

    var goBack = function () {
      router.navigateBack();
    };

    var cancel = function () {
      datacontext.cancelChanges();
    };

    var save = function () {
      return datacontext.saveChanges();
    };

    var vm = {
      activate: activate,
      goBack: goBack,
      rooms: rooms,
      tracks: tracks,
      timeSlots: timeSlots,
      cancel: cancel,
      save: save,
      session: session,
      title: 'Session Details'
    };

    return vm;
  });