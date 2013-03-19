/// <reference path="../../Scripts/breeze.debug.js" />
/// <reference path="../../Scripts/q.js" />


define(['services/logger', 'durandal/system', 'config', 'services/model'],

  function (logger, system, config, model) {

    var EntityQuery = breeze.EntityQuery,
      manager = configureBreezeManager();

    var getSpeakers = function (speakersObservable) {
      var query = EntityQuery
        .from('Speakers')
        .orderBy('firstName, lastName');

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {
        if (speakersObservable) {
          speakersObservable(data.results);
          log('Retrieved [Speaker] from remote data source', data, true);
        }
      }
    };

    var getSessions = function (sessionsObservable) {
      var query = EntityQuery
        .from('Sessions')
        .orderBy('timeSlotId, level, speaker.firstName');

      return manager.executeQuery(query)
        .then(querySucceeded)
        .fail(queryFailed);

      function querySucceeded(data) {
        if (sessionsObservable) {
          sessionsObservable(data.results);
          log('Retrieved [Session] from remote data source', data, true);
        }
      }
    };

    var primeData = function () {
      return Q.all([getLookups(), getSpeakers()]);
    }
    
    var datacontext = {
      getSpeakers: getSpeakers,
      getSessions: getSessions,
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

    //#endregion

  });