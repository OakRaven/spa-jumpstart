define(['config'], function (config) {
  var imageSettings = config.imageSettings;

  var orderBy = {
    speaker: 'firstName, lastName',
    session: 'timeSlotId, level, speaker.firstName'
  };

  var entityNames = {
    speaker:  'Person',
    session:  'Session',
    room:     'Room',
    track:    'Track',
    timeslot: 'TimeSlot'
  };
  
  var model = {
    configureMetaDataStore: configureMetaDataStore,
    entityNames: entityNames,
    orderBy: orderBy
  };

  return model;

  function configureMetaDataStore(metadataStore) {
    metadataStore.registerEntityTypeCtor(
      'Session', function () { this.isPartial = false; }, sessionInitializer);
    metadataStore.registerEntityTypeCtor(
      'Person', function () { this.isPartial = false; }, personInitializer);
    metadataStore.registerEntityTypeCtor(
      'TimeSlot', null, timeSlotInitializer);
  }

  function sessionInitializer(session) {
    session.tagsFormatted = ko.computed(function () {
      var text = session.tags();
      return text ? text.replace(/\|/g, ', ') : text;
    });
  }

  function personInitializer(person) {
    person.fullName = ko.computed(function () {
      return person.firstName() + ' ' + person.lastName();
    });

    person.imageName = ko.computed(function () {
      return makeImageName(person.imageSource());
    });
  };

  function timeSlotInitializer(timeSlot) {
    timeSlot.name = ko.computed(function () {
      return timeSlot.start() ? moment.utc(timeSlot.start()).format('ddd hh:mm a') : '';
    });
  }

  function makeImageName(source) {
    return config.imageSettings.imageBasePath +
        (source || imageSettings.unknownPersonImageSource);
  };

});