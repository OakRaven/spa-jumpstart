define(['config'], function (config) {
  
  var model = {
    configureMetaDataStore: configureMetaDataStore
  };

  return model;

  function configureMetaDataStore(metadataStore) {
    metadataStore.registerEntityTypeCtor('Session', null, sessionInitializer);
    metadataStore.registerEntityTypeCtor('Person', null, personInitializer);
    metadataStore.registerEntityTypeCtor('TimeSlot', null, timeSlotInitializer);
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
        (source || config.imageSettings.unknownPersonImageSource);
  };

});