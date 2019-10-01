fidgetGroupCtrl.$inject = ['$http', '$sce', '$scope', '$window', '$location', '$routeParams', '$attrs', 'editorService',
    'popupService', 'deviceService', 'scriptManagerService', 'projectService', 'variableService', 'settingsWindowService',
    '$timeout', '$rootScope'];

function fidgetGroupCtrl($http, $sce, $scope, $window, $location, $routeParams, $attrs, editorService,
    popupService, deviceService, scriptManagerService, projectService, variableService, settingsWindowService,
    $timeout, $rootScope) {

    //current fidget is
    var fid;

    //hold reference to watchers to be able to remove when it is necesarry
    var watchers = [];
    $scope.initGroup = function (f) {
        //remove existing watchers
        angular.forEach(watchers, function (w) { w(); });
        watchers = [];

        fid = f.id;

        //add watchers to be able to calculate the size
        watchers.push($scope.$watchCollection(function () { return f.fidgets; }, function () {
            updateFidgets(f);
        }));

        watchers.push($scope.$watchGroup([
            function () { return f.properties.layout; },
            function () { return f.properties.width; },
            function () { return f.properties.height; },
            function () { return f.fidgets.length; },
            function () { return f.properties.borderWidth; },
            function () { return f.properties.margin; }
        ],
            function () {
                updateFidgets(f);
            }));
    }

    //reset fidget to be able to watch
    $scope.$watch(function () { return projectService.loaded }, function () {
        $scope.initGroup(projectService.getFidgetById(fid));
    });

    //update child fidgets
    function updateFidgets(fidget) {
        if (!fidget.properties.layout) return;

        var l = fidget.properties.layout;
        var w = (100 / fidget.fidgets.length).toFixed(0);
        var i = 0;
        var m = fidget.properties.margin;
        var c = fidget.fidgets.length;

        angular.forEach(fidget.fidgets, function (f) {
            f.properties.width = l == "vertical" ? "100%" : w.toString() + "% - " + m * (c - 1) / c;
            f.properties.height = l == "vertical" ? w.toString() + "% - " + m * (c - 1) / c : "100%";
            f.properties.top = l == "horizontal" ? "0" : i * (f.properties.height + m);
            f.properties.left = l == "horizontal" ? i * (f.properties.width + m) : "0";

            i++;
        });
    }
}