"use strict";
/**
* 	Custom Socket to FTP CMS system
* 	Copyright 2015, by Cesar Anton Dorantes @reicek for http://oxxogas.com . All rights reserved
**/
(function(){
/**
*	Main App Module
**/
	var Oxxogas		= angular.module('Oxxogas',['ngRoute']);
/**
*	Dynamic navigation
**/
//* // Requires ngRoute
	Oxxogas.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'components/welcome.html'
//				controller: '_controller'
			})
//*
			.when('/Slides', {
				templateUrl: 'components/slides.html'
				,controller: 'slides_controller'
			})
//*/
//*
			.when('/Billetigas', {
				templateUrl: 'components/billetigas.html'
				,controller: 'billetigas_controller'
			})
//*/
//*
			.when('/Contacto', {
				templateUrl: 'components/contacto.html'
				,controller: 'contacto_controller'
			})
//*/
//*
			.when('/Autotips', {
				templateUrl: 'components/autotips.html'
				,controller: 'autotips_controller'
			})
//*/
//*
			.when('/Estaciones', {
				templateUrl: 'components/estaciones.html'
				,controller: 'estaciones_controller'
			})
//*/
/*
			.when('/', {
				templateUrl: 'components/.html'
//				,controller: '_controller'
			})
//*/
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode({
			enabled: false
		});
	});
// */
/**
*	Factories
**/
//*
	Oxxogas.factory('sections_factory', function()
	{
		var sections = {titles:[]};
		return sections
	});
// */
//*
	Oxxogas.factory('socket_service', function($rootScope)
	{
		var socket = io.connect();
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {  
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				})
			}
		};
	});
// */
/**
*	Controllers
**/
//*
	Oxxogas.controller('cms_controller', function($scope, $location, socket_service, sections_factory)
	{
		$scope.sections	= sections_factory;
		$scope.goTo		= function(title){
			var path = "/"+title;
			$location.path(path)
		};
		var socket = socket_service;
		
		socket.on('socket', function(data){
			console.log('_________________');
			console.log("Connected")
			console.log('_________________');
		});
		
		socket.on('downloaded', function(data){
			$("#loading")	.addClass("hidden");
			$scope.sections.titles.push(data.title)
		});
	});
// */
//*
	Oxxogas.controller('slides_controller', function($scope, sections_factory)
	{
		var fileName	= "numeroSlides";
		var path		= "/js/"+fileName+".json"
		var getFile		= $http.get(path);
		getFile.success(function(data, status, headers, config) {
			$scope.section = data;
		})
		getFile.error(function(data, status, headers, config) {
			console.log("______________");
			console.log("Error:");
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			console.log("______________");
		});
	});
// */
//*
	Oxxogas.controller('billetigas_controller', function($scope, $http, sections_factory)
	{
		$scope.promociones = [];
		$scope.addNew	= function() {
			$scope.promociones.push({nombre:"",promocion:"",imagen:""})
		};
		var fileName	= "misBilletigas";
		var path		= "/js/"+fileName+".json"
		var getFile		= $http.get(path);
		getFile.success(function(data, status, headers, config) {
			$scope.promociones = data;
		})
		getFile.error(function(data, status, headers, config) {
			console.log("______________");
			console.log("Error:");
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			console.log("______________");
		});
	});
// */
//*
	Oxxogas.controller('contacto_controller', function($scope, $http, sections_factory)
	{
		$scope.contactos = [];
		$scope.addNew	= function() {
			$scope.contactos.push({id:"",correo1:"",correo2:""})
		};
		var fileName	= "contacto";
		var path		= "/js/"+fileName+".json"
		var getFile		= $http.get(path);
		getFile.success(function(data, status, headers, config) {
			$scope.contactos = data;
		})
		getFile.error(function(data, status, headers, config) {
			console.log("______________");
			console.log("Error:");
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			console.log("______________");
		});
	});
// */
//*
	Oxxogas.controller('autotips_controller', function($scope, $http, sections_factory)
	{
		$scope.tips = [];
		$scope.addNew	= function() {
			$scope.tips.push({id:"",titulo:"",texto:"",imagen:""})
		};
		var fileName	= "autoTips";
		var path		= "/js/"+fileName+".json"
		var getFile		= $http.get(path);
		getFile.success(function(data, status, headers, config) {
			$scope.tips = data;
		})
		getFile.error(function(data, status, headers, config) {
			console.log("______________");
			console.log("Error:");
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			console.log("______________");
		});
	});
// */
//*
	Oxxogas.controller('estaciones_controller', function($scope, $http, sections_factory)
	{
		$scope.estaciones = [];
		$scope.addNew	= function() {
			$scope.estaciones.push({PLAZA:"",MUNICIPIO:"",NOMBRE:"",DIRECCION:"",LNG:"",LAT:""})
		};
		var fileName	= "localizadorEstaciones";
		var path		= "/js/"+fileName+".json"
		var getFile		= $http.get(path);
		getFile.success(function(data, status, headers, config) {
			$scope.estaciones = data;
			for (var i=0,limit = $scope.estaciones.length; i < limit; i++) {
				$scope.estaciones[i]["preview"] = "https://www.google.com/maps/embed/v1/view?key=AIzaSyCFRYZ2l-2rdQ8bGa2r9kftl9FteUgSwHY&center="+$scope.estaciones[i].LNG+","+$scope.estaciones[i].LAT+"&zoom=10&maptype=map";
			}
		})
		getFile.error(function(data, status, headers, config) {
			console.log("______________");
			console.log("Error:");
			console.log(data);
			console.log(status);
			console.log(headers);
			console.log(config);
			console.log("______________");
		});
	});
// */
/*
	Oxxogas.controller('_controller', function($scope, sections)
	{
	});
// */
})()