/// <reference path="../../Scripts/knockout-2.2.1.js" />

define(['services/datacontext', 'durandal/plugins/router', 'durandal/app'],
  function (datacontext, router, app) {
    var session = ko.observable();
    var rooms = ko.observableArray();
    var tracks = ko.observableArray();
    var timeSlots = ko.observableArray();
    var isSaving = ko.observable(false);

    var activate = function (routeData) {
      var id = parseInt(routeData.id);
      initLookups();
      return datacontext.getSessionById(id, session);
    };

    var canDeactivate = function () {
      if (hasChanges()) {
        var title = 'Do you want to leave "' + session().title() + '" ?';
        var msg = 'Navigate away and cancel your changes?';
        return app.showMessage(title, msg, ['Yes', 'No'])
          .then(confirm);
      }

      function confirm(selectedOption)
      {
        if (selectedOption === 'Yes') {
          cancel();
        }

        return selectedOption;
      }

      return true;
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
      isSaving(true)
      return datacontext.saveChanges().fin(complete);

      function complete() {
        isSaving(false);
      }
    };

    var hasChanges = ko.computed(function () {
      return datacontext.hasChanges();
    });

    var canSave = ko.computed(function () {
      return hasChanges() && !isSaving();
    });

    var vm = {
      activate: activate,
      canDeactivate: canDeactivate,
      goBack: goBack,
      rooms: rooms,
      tracks: tracks,
      timeSlots: timeSlots,
      cancel: cancel,
      canSave: canSave,
      save: save,
      hasChanges: hasChanges,
      session: session,
      title: 'Session Details'
    };

    return vm;
  });