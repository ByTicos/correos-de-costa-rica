(() => {
  'use strict';
  angular
  .module('correos')
  .service('servicioLogin', servicioLogin);

  servicioLogin.$inject = ['$log', '$http', 'servicioUsuarios', 'servicioSesion'];

  function servicioLogin($log, $http, servicioUsuarios, servicioSesion){

    let publicAPI = {
      inicioSesion : _inicioSesion,
      cerrarSesion: _cerrarSesion
    }
    return publicAPI
    
    function _inicioSesion(pCredenciales) {
      
      let listaUsuarios = servicioUsuarios.getUsuarios();
      let incioExitoso = false;

      for(let i = 0; i<listaUsuarios.length; i++){
        if(listaUsuarios[i].correo == pCredenciales.correo){
          servicioSesion.crear(
            {
              nombre: listaUsuarios[i].primerNombre,
              correo: listaUsuarios[i].correo,
              tipo: listaUsuarios[i].tipo
            }
          );
          incioExitoso = true;
        }
      }

      return incioExitoso;
    }
    function _cerrarSesion(){
      servicioSesion.destruir();
    }
  }

})();