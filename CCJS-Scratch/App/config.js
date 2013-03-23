define(function () {
  toastr.options.timeout = 4000;
  toastr.options.positionClass = 'toast-bottom-right';

  var imageSettings = {
    imageBasePath: '../content/images/photos/',
    unknownPersonImageSource: 'unknown_person.jpg'
  };

  var remoteServiceName = 'api/breeze';

  var routes = [{
    url: 'sessions',
    moduleId: 'viewmodels/sessions',
    name: 'Sessions',
    visible: true
  }, {
    url: 'speakers',
    moduleId: 'viewmodels/speakers',
    name: 'Speakers',
    visible: true
  }, {
    url: 'sessiondetail/:id',
    moduleId: 'viewmodels/sessiondetail',
    name: 'View a Session',
    visible: false
  }, {
    url: 'sessionadd',
    moduleId: 'viewmodels/sessionadd',
    name: 'Add a Session',
    visible: false,
    caption: '<i class="icon-plus"></i> Add Session',
    settings: {admin: true}
  }];

  var startModule = 'sessions';

  return {
    imageSettings: imageSettings,
    routes: routes,
    startModule: startModule,
    remoteServiceName: remoteServiceName
  };
});