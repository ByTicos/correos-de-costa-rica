(() => {
    'use strict';
    angular
        .module('correos')
        .service('servicioUsuarios', servicioUsuarios)

    servicioUsuarios.$inject = ['$log', '$http'];

    function servicioUsuarios($log, $http) {

        const asyncLocalStorage = {
            setItem: function (key, value) {
                return Promise.resolve().then(() => {
                    let response = true;
                    localStorage.setItem(key, JSON.stringify(value));
                    return response
                });
            }
        };

        let publicAPI = {
            addUsuario: _addUsuario,
            getUsuarios: _getUsuarios,
            actualizarUsuario: _actualizarUsuario,
            addPaquete: _addPaquete,
            getPaquete: _getPaquete,
            actualizarPaquete: _actualizarPaquete,
            addTarjeta: _addTarjeta,
            getTarjeta: _getTarjeta,
                }
        return publicAPI

        function _addUsuario(pNuevoUsuario) {
            let listaUsuarios = _getUsuarios();
            let respuesta = true;
            listaUsuarios.push(pNuevoUsuario);

            asyncLocalStorage.setItem('usuariosLS', listaUsuarios).then((response) => {
                respuesta = response;
            });

            return respuesta;
        };

        function _getUsuarios() {
            let listaUsuarios = [];
            let listaUsuariosLocal = JSON.parse(localStorage.getItem("usuariosLS"));
            if (listaUsuariosLocal == null) {
                listaUsuarios = [];
            }
            else {
                listaUsuariosLocal.forEach(objUsuario => {
                    let objUsuarioTemp = new Usuario(objUsuario.cedula, objUsuario.foto, objUsuario.primerNombre, objUsuario.segundoNombre, objUsuario.primerApellido, objUsuario.segundoApellido, objUsuario.correo, objUsuario.telefono, objUsuario.fechaNacimiento, objUsuario.provincia, objUsuario.canton, objUsuario.distrito, objUsuario.direccionExacta, objUsuario.tipo,objUsuario.sucursalAsignada, objUsuario.puesto);
                    objUsuarioTemp.cambiarEstado(objUsuario.estado);
                    listaUsuarios.push(objUsuarioTemp);
                });
            }
            return listaUsuarios;
        };
        
        function _actualizarUsuario(pUsuario) {
            let listaUsuarios = _getUsuarios();

            for (let i = 0; i < listaUsuarios.length; i++) {
                if (pUsuario.cedula == listaUsuarios[i].cedula) {
                    listaUsuarios[i] = pUsuario;
                }
            }
            actualizarLocal(listaUsuarios);
        };

        function _addPaquete(pNuevoPaquete) {
            let listaPaquetes = _getPaquete();
            let respuesta = true;
            
            listaPaquetes.push(pNuevoPaquete);

            asyncLocalStorage.setItem('paquetesLS', listaPaquetes).then((response) => {
                respuesta = response;
            });

           return respuesta;
        };


        function _getPaquete() {
            let listaPaquetes = [];
            let listaPaquetesLocal = JSON.parse(localStorage.getItem('paquetesLS'));

            if(listaPaquetesLocal == null){
               listaPaquetes = [];
 
            }else{
                listaPaquetesLocal.forEach(objPaquete => {
                    let objPaqueteTemp = new Paquete(objPaquete.tracking, objPaquete.distribuidor, objPaquete.precio, objPaquete.peso, objPaquete.tipoArticulo, objPaquete.descripcion );

                    let listaEstados =  objPaquete.listaEstados;

                    listaEstados.forEach(objEstado => {
                        let fecha = new Date (objEstado.fecha);
                        let hora = fecha;
                        let estadoTemp = new Estado(objEstado.usuario, fecha,hora, objEstado.estado);

                      objPaqueteTemp.addEstado(estadoTemp);
                    });

                   
                    objPaqueteTemp.cambiarEstadoDeActividad(objPaquete.estado);
                    objPaqueteTemp.mostrarEstadoTraslado (objPaquete.estadoTraslado);
                    
                    listaPaquetes.push(objPaqueteTemp);
                });
            }
            return listaPaquetes;
        };

        function _actualizarPaquete(pObjpaquete) {
            let listaPaquetes = _getPaquete();

            for (let i = 0; i < listaPaquetes.length; i++) {
                if (listaPaquetes[i].tracking == pObjpaquete.tracking ) {
                   
                    listaPaquetes[i] = pObjpaquete;
                }
            }
            actualizarPaqueteLocal (listaPaquetes);
        };


        function actualizarLocal(plistaActualizada) {
            localStorage.setItem('usuariosLS', JSON.stringify(plistaActualizada));
        }
        function actualizarPaqueteLocal(plistaPaqueteActualizada){
            localStorage.setItem('paquetesLS', JSON.stringify(plistaPaqueteActualizada));
        }


        function _addTarjeta(pnuevaTarjeta){
            let listaTarjeta = _getTarjeta();
            let respuesta = true;
            listaTarjeta.push(pnuevaTarjeta);

            asyncLocalStorage.setItem('tarjetaLS', listaTarjeta).then((response) =>{
                respuesta = response;
            });

            return respuesta;
        }

        function _getTarjeta(){
            let listaTarjeta = [];
            let listaTarjetaLocal = JSON.parse(localStorage.getItem("tarjetaLS"));

            if(listaTarjetaLocal == null){
                listaTarjeta = [];
            }else{
                listaTarjetaLocal.forEach(obj => {
                    let objTarjeta = new Tarjeta (obj.nombre, obj.numero, obj.expiracion,obj.cvc);

                    listaTarjeta.push(objTarjeta);
                });
    
                
            }
    
            return listaTarjeta;
        }

    }
})();