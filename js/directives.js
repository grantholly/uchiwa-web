'use strict';

var directiveModule = angular.module('uchiwa.directives', []);

directiveModule.directive('panelActions', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      resolveFn: '=',
      resolveLegend: '@',
      silenceFn: '='
    },
    templateUrl: $rootScope.partialsPath + '/panel/actions.html'
  };
}]);

directiveModule.directive('clearStashes', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      clearFn: '=',
      resolveLegend: '@'
    },
    templateUrl: $rootScope.partialsPath = '/panel/clear.html'
  }
}]);

directiveModule.directive('panelLimit', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      filters: '=',
      permalink: '='
    },
    templateUrl: $rootScope.partialsPath + '/panel/limit.html'
  };
}]);

directiveModule.directive('relativeTime', ['$filter', '$rootScope', function ($filter, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      timestamp: '='
    },
    templateUrl: $rootScope.partialsPath + '/directives/relative-time.html',
    link: function (scope) {
      scope.date = $filter('getTimestamp')(scope.timestamp);
    }
  };
}]);

directiveModule.directive('silenceIcon', function () {
  return {
    restrict: 'E',
    scope: {
      acknowledged: '='
    },
    template: '<span class="fa-stack">' +
      '<i class="fa fa-fw {{ acknowledged | getAckClass }}"></i>' +
      '<i class="fa fa-ban fa-stack-1x text-danger" ng-if="acknowledged"></i>' +
      '</span>'
  };
});

directiveModule.directive('siteTheme', ['conf', '$cookies', '$rootScope', function (conf, $cookies, $rootScope) {
  return {
    restrict: 'EA',
    link: function (scope, element) {
      var lookupTheme = function (themeName) {
        return $rootScope.themes[$rootScope.themes.map(function (t) {
          return t.name;
        }).indexOf(themeName)];
      };
      var setTheme = function (theme) {
        var themeName = angular.isDefined(theme) ? theme : conf.theme;
        scope.currentTheme = lookupTheme(themeName);

        if (angular.isUndefined(scope.currentTheme)) {
          scope.currentTheme = $rootScope.themes[0];
        }

        var name = scope.currentTheme.name;
        var enterprise = scope.currentTheme.enterprise || false;

        var oneYearExpiration = new Date();
        oneYearExpiration.setYear(oneYearExpiration.getFullYear()+1);
        $cookies.put('uchiwa_theme', name, { 'expires': oneYearExpiration });

        var path = enterprise ? 'css/' : 'bower_components/uchiwa-web/css/';
        element.attr('href', path + name + '/' + name + '.css');
      };
      scope.$on('theme:changed', function (event, theme) {
        setTheme(theme.name);
      });
      var currentTheme = $cookies.get('uchiwa_theme');
      setTheme(currentTheme);
    }
  };
}]);

directiveModule.directive('statusGlyph', ['$filter', function ($filter) {
  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {

      function updateGlyph(style) {
        element.removeAttr('class');
        element.addClass('fa fa-fw');
        switch(style) {
          case 0:
            element.addClass('fa-check-circle');
            break;
          case 1:
            element.addClass('fa-exclamation-circle');
            break;
          case 2:
            element.addClass('fa-times-circle-o');
            break;
          case 3:
            element.addClass('fa-question-circle');
            break;
        }

        var status = $filter('getStatusClass')(style);
        element.addClass('text-' + status);
      }

      scope.$watch(attrs.statusGlyph, function(value) {
        updateGlyph(value);
      });
    }
  };
}]);
