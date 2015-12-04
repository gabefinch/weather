var weather = angular.module('weather', []);

weather.factory('weatherFactory', ['$http', '$q', function ($http, $q){
  function getWeather (zipcode) {
    var defer = $q.defer();
    $http.get('http://api.wunderground.com/api/8c1a8ef70cc596b2/conditions/forecast/q/' + zipcode + '.json')
      .success(function(data){
        defer.resolve(data);
      })
      .error(function(status){
        console.log('Error: ' + status);
        defer.reject(status);
      });
    return defer.promise;
  }
  return { getWeather: getWeather};
}]);


weather.controller('weatherCtrl', ['$scope', 'weatherFactory', function($scope, weatherFactory) {
  $scope.findWeather = function(zipcode) {
    weatherFactory.getWeather(zipcode).then(function(data){

      var current = data.current_observation;

      $scope.city = current.display_location.full;
      $scope.currentTemp = Math.round(current.temp_f);
      $scope.currentWeather = current.weather;
      $scope.currentIconPath = current.icon_url;

      var forecast = data.forecast.simpleforecast;

      $scope.forecast24hr = {
        day: forecast.forecastday[1].date.weekday,
        iconUrl: forecast.forecastday[1].icon_url,
        temp: Math.round((parseInt(forecast.forecastday[1].high.fahrenheit) + parseInt(forecast.forecastday[1].low.fahrenheit)) / 2)
      };
      $scope.forecast48hr = {
        day: forecast.forecastday[2].date.weekday,
        iconUrl: forecast.forecastday[2].icon_url,
        temp: Math.round((parseInt(forecast.forecastday[2].high.fahrenheit) + parseInt(forecast.forecastday[2].low.fahrenheit)) / 2)
      };
      $scope.forecast72hr = {
        day: forecast.forecastday[3].date.weekday,
        iconUrl: forecast.forecastday[3].icon_url,
        temp: Math.round((parseInt(forecast.forecastday[3].high.fahrenheit) + parseInt(forecast.forecastday[3].low.fahrenheit)) / 2)
      };

    });
  }

  $scope.zipcode = '33101';
  $scope.findWeather($scope.zipcode);

}]);
