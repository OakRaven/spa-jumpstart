/// <reference path="../../Scripts/breeze.debug.js" />
/// <reference path="../../Scripts/q.js" />
/// <reference path="breeze.partial-entities.js" />


define([
  'services/logger',
  'durandal/system',
  'config',
  'services/model',
  'services/breeze.partial-entities'],

  function (logger, system, config, model, partialMapper) {
    var EntityQuery = breeze.EntityQuery;
    var entityNames = model.entityNames;
    var orderBy     = model.orderBy;
    var manager     = configureBreezeManager();

    var getSpeakerPartials = function (speakersObservable, forceRemote) {

      if (!forceRemote) {
        var p = getLocal('Persons', orderBy.speaker);
        if (p.length > 0) {
          speakersObservable(p);
          return Q.resolve();
        }
      }

      var query = EntityQuery
        .from('Speakers')
        .select('id, firstName, lastName, imageSource')
        .orderBy(orderBy.speaker);

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {
        var list = partialMapper.mapDtosToEntities(
          manager, data.results, entityNames.speaker, 'id');

        if (speakersObservable) {
          speakersObservable(list);
        }
        log('Retrieved [Speaker] from remote data source', data, true);
      }
    };

    var getSessionPartials = function (sessionsObservable, forceRemote) {
      if (!forceRemote) {
        var p = getLocal('Sessions', orderBy.session);
        if (p.length > 3) {
          sessionsObservable(p);
          return Q.resolve();
        }
      }

      var query = EntityQuery
        .from('Sessions')
        .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
        .orderBy(orderBy.session);

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {
        var list = partialMapper.mapDtosToEntities(
          manager, data.results, entityNames.session, 'id');
        if (sessionsObservable) {
          sessionsObservable(list);
        }
        log('Retrieved [Session] from remote data source', data, true);
      }
    };

    var getSessionById = function (sessionId, sessionObservable) {
      return manager
        .fetchEntityByKey(entityNames.session, sessionId, true)
        .then(fetchSucceeded)
        .fail(queryFailed);

      function fetchSucceeded(data) {
        var s = data.entity;
        return s.isPartial() ? refreshSession(s) : sessionObservable(s);
      }

      function refreshSession(session) {
        return EntityQuery.fromEntities(session)
          .using(manager)
          .execute()
          .then(querySucceeded)
          .fail(queryFailed);
      }

      function querySucceeded(data) {
        var s = data.results[0];
        s.isPartial(false);
        log('Retrieved [Session] from remote data source', s, true);
        return sessionObservable(s);
      }
    }

    var cancelChanges = function () {
      manager.rejectChanges();
      log('Cancelled change', null, true);
    };

    var saveChanges = function () {
      return manager.saveChanges()
        .then(saveSucceeded)
        .fail(saveFailed);

      function saveSucceeded(saveResult) {
        log('Saved data successfully', saveResult, true);
      }

      function saveFailed(error) {
        var msg = 'Save failed: ' + error.message;
        logError(msg, error);
        error.message = msg;
        throw error;
      }
    }

    var primeData = function (  ) {
      var promise = Q.all([
        getLookups(),
        getSpeakerPartials(null, true)]);

      return promise.then(success);

      function success() {
        datacontext.lookups = {
          rooms: getLocal('Rooms', 'name'),
          tracks: getLocal('Tracks', 'name'),
          timeslots: getLocal('TimeSlots', 'start'),
          speakers: getLocal('Persons', orderBy.speaker)
        };
        log('Primed data', datacontext.lookups);
      }
    }
    
    var datacontext = {
      getSpeakerPartials: getSpeakerPartials,
      getSessionPartials: getSessionPartials,
      getSessionById: getSessionById,
      cancelChanges: cancelChanges,
      saveChanges: saveChanges,
      primeData: primeData
    };

    return datacontext;

    //#region Internal methods

    function queryFailed(error) {
      var message = 'Error getting data. ' + error.message;
      logger.logError(message, error, system.getModuleId(datacontext), true);
    }

    function configureBreezeManager() {
      breeze.NamingConvention.camelCase.setAsDefault();
      var mgr = new breeze.EntityManager(config.remoteServiceName);
      model.configureMetaDataStore(mgr.metadataStore);

      return mgr;
    }

    function getLookups() {
      return EntityQuery.from("Lookups")
        .using(manager).execute()
        .fail(queryFailed);
    }

    function log(message, data, showToast) {
      logger.log(message,
        data,
        system.getModuleId(datacontext),
        showToast);
    }

    function getLocal(resource, ordering) {
      var query = EntityQuery
        .from(resource)
        .orderBy(ordering);

      return manager.executeQueryLocally(query);
    }

    //#endregion

  });