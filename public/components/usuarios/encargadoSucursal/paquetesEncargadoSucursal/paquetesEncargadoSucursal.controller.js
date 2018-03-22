(()=>{
  'use strict';
  angular
  .module('correos')
  .controller('controladorPaquetesEncargadoSucursal', controladorPaquetesEncargadoSucursal);
  
  controladorPaquetesEncargadoSucursal.$inject = ['$state', '$stateParams', '$location', 'servicioUsuarios'];
  
  function controladorPaquetesEncargadoSucursal($state, $stateParams, $location, servicioUsuarios) {
    let vm = this;
  
    vm.listaPaquetes = servicioUsuarios.getAllPaquetes();

    vm.cambiarEstadoTraslado = (pnuevoPaquete) => {
      
      let articulo = pnuevoPaquete.tipoArticulo;
      console.log(articulo);


 
      let objNuevoPaquete = new Paquete(pnuevoPaquete.usuario, pnuevoPaquete.tracking, pnuevoPaquete.distribuidor, pnuevoPaquete.precio, pnuevoPaquete.peso, pnuevoPaquete.tipoArticulo, pnuevoPaquete.descripcion);

      let listaEstados = pnuevoPaquete.listaEstados;

      listaEstados.forEach(objEstado => {
        objNuevoPaquete.addEstado(objEstado);
        
      });
     
      let fecha = new Date();
      let hora = fecha;
      let objEstado = new Estado(pnuevoPaquete.usuario, fecha,hora, 'Recibido en Sucursal');
      
      objNuevoPaquete.mostrarEstadoTraslado('Recibido en Sucursal');
      objNuevoPaquete.addEstado(objEstado);
      servicioUsuarios.actualizarEstadoPaquete(objNuevoPaquete);
      
  
      
    }
  
     
  }
  
  })();