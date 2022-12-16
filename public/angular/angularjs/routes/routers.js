// Definindo Rotas
jms_app.config(function($routeProvider){
    $routeProvider
      .when("/", {
        template:"<h1>Home Page</h1>"
      })
      .otherwise({redirectTo: '/'});
  });