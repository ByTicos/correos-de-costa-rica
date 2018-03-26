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
            actualizarEstadoPaquete: _actualizarEstadoPaquete,
            actualizarRepartidor: _actualizarRepartidor,
            // actualizarLicencias: _actualizarLicencias,
            addTarjeta: _addTarjeta,
            getTarjeta: _getTarjeta,
            getRol: _getRol,
            getRolSucursal: _getRolSucursal,
            getAllPaquetes: _getAllPaquetes,
            actualizarTarjeta: _actualizarTarjeta,
            addPaqueteConvenio:_addPaqueteConvenio,
            getPaquetesConvenio:_getPaquetesConvenio
            }
        return publicAPI

        function _addUsuario(pNuevoUsuario) {
            let listaUsuarios = _getUsuarios();
            let respuesta = true;
            listaUsuarios.push(pNuevoUsuario);

            localStorage.setItem('usuariosLS', JSON.stringify(listaUsuarios));/*.then((response) => {
                respuesta = response;
            })*/

            return respuesta;
        };

        

        function _getUsuarios() {
            let listaUsuarios = [];
            let admin = new Usuario('', '', 'Administrador', '', '', '', 'administrador@correos.cr', '', '', '', '', '', '', '5', '', 'Administrador', '');
            let listaUsuariosLocal = JSON.parse(localStorage.getItem("usuariosLS"));
            if (listaUsuariosLocal == null) {
                listaUsuarios = [admin];
                actualizarLocal(listaUsuarios);
            }
            else {
                listaUsuariosLocal.forEach(objUsuario => {
                    let objUsuarioTemp = new Usuario(objUsuario.cedula, objUsuario.foto, objUsuario.primerNombre, objUsuario.segundoNombre, objUsuario.primerApellido, objUsuario.segundoApellido, objUsuario.correo, objUsuario.telefono, objUsuario.fechaNacimiento, objUsuario.provincia, objUsuario.canton, objUsuario.distrito, objUsuario.direccionExacta, objUsuario.tipo, objUsuario.sucursalAsignada, objUsuario.puesto, objUsuario.vehiculo, []);
                    objUsuarioTemp.cambiarEstado(objUsuario.estado);


                    objUsuario.listaLicencias.forEach(objLicencia => {

                        let objLicenciaTemp = new Licencia(objLicencia.numLicencia, objLicencia.tipoLicencia, objLicencia.vencimiento);
                        objUsuarioTemp.listaLicencias.push(objLicenciaTemp);
                    });



                    objUsuario.tarjeta.forEach(objTarjeta => {
                        let objTarjetaTemp = new Tarjeta(objTarjeta.id, objTarjeta.nombre, objTarjeta.numero, objTarjeta.expiracion, objTarjeta.cvv);

                        objUsuarioTemp.registrarTarjeta(objTarjetaTemp);
                    });

                    objUsuario.listaPaquetesConvenios.forEach(objPaqueteConv => {
                        let objPaqueteConvTemp = new PaqueteConv(objPaqueteConv.cliente, objPaqueteConv.convenio, new Date(objPaqueteConv.fecha));

                        objUsuarioTemp.agregarPaqueteConvenio(objPaqueteConvTemp);
                    });

                    objUsuario.listaPaquetes.forEach(objPaquete => {
                        let objPaqueteTemp = new Paquete(objPaquete.usuario, objPaquete.tracking, objPaquete.distribuidor, objPaquete.precio,objPaquete.peso, objPaquete.Kilometro,objPaquete.tipoArticulo, objPaquete.descripcion);

                        let listaEstados = objPaquete.listaEstados;

                        listaEstados.forEach(objEstado => {
                            let fecha = new Date(objEstado.fecha);
                            let hora = fecha;
                            let estadoTemp = new Estado(objEstado.usuario, fecha, hora, objEstado.estado);

                            objPaqueteTemp.addEstado(estadoTemp);
                            
                        });
                        objPaqueteTemp.cambiarEstadoDeActividad(objPaquete.estado);
                        objPaqueteTemp.mostrarEstadoTraslado(objPaquete.estadoTraslado);

                        objUsuarioTemp.agregarPaquete(objPaqueteTemp);
                    });
                    listaUsuarios.push(objUsuarioTemp);
                });

            };
            return listaUsuarios;
        };

        function _addPaqueteConvenio(pNuevoPaquete){
            let listaUsuarios = _getUsuarios();
            let usuario = pNuevoPaquete.cliente;
            let respuesta = true;
            for (let i = 0; i < listaUsuarios.length; i++) {
                if (usuario == listaUsuarios[i].correo) {
                    listaUsuarios[i].agregarPaqueteConvenio(pNuevoPaquete);
                }
            }
            console.log(listaUsuarios);
            actualizarLocal(listaUsuarios);
            return respuesta;
        };
        function _getPaquetesConvenio() {
            let listaUsuarios = _getUsuarios();
            let listaPaquetesConvenios = [];
            let session = JSON.parse(sessionStorage.getItem('sesion'));

            for (let i = 0; i < listaUsuarios.length; i++) {
                if (session.correo == listaUsuarios[i].correo) {
                    if (listaUsuarios[i].listaPaquetesConvenios != null) {
                        listaPaquetesConvenios = listaUsuarios[i].listaPaquetesConvenios;
                    }
                }
            }
            return listaPaquetesConvenios;
        };
        
        function _actualizarUsuario(pUsuario) {
            let listaUsuarios = _getUsuarios();

            for (let i = 0; i < listaUsuarios.length; i++) {
                if (pUsuario.correo == listaUsuarios[i].correo) {
                    listaUsuarios[i] = pUsuario;
                }
            }
            actualizarLocal(listaUsuarios);
        };

           function _addPaquete (pNuevoPaquete) {
                let listaUsuarios = _getUsuarios();
                let sesion = JSON.parse(sessionStorage.getItem('sesion'));
                let respuesta = true;

                for(let i = 0; i < listaUsuarios.length; i++){
                    if (sesion.nombre == listaUsuarios[i].primerNombre){
                    listaUsuarios[i].agregarPaquete(pNuevoPaquete);
                    }
                }

                actualizarLocal(listaUsuarios);
                return respuesta;
                
            };


        function _getPaquete() {
            let ListaUsuarios = _getUsuarios();
            let listaPaquetes = [];
            let session = JSON.parse (sessionStorage.getItem ('sesion'));

            for (let i = 0; i < ListaUsuarios.length; i++) {
                if (session.nombre == ListaUsuarios[i].primerNombre ) {
                    if (ListaUsuarios[i].listaPaquetes != null) {
                       listaPaquetes =  ListaUsuarios[i].listaPaquetes;
                    }
                }
                
            }
            
            return listaPaquetes;
        };

        function _getAllPaquetes(){
        let listaUsuarios = _getUsuarios();
        let listaPaquetes = [];
        for (let i = 0; i < listaUsuarios.length; i++){
            let listaPaquetesTemp = listaUsuarios[i].listaPaquetes;
            if(listaPaquetesTemp != []){
            let paqueteTemp = {};
            for(let j = 0; j < listaPaquetesTemp.length; j++){
                paqueteTemp = listaPaquetesTemp[j];
                listaPaquetes.push(paqueteTemp);
            }
            }
        }
        return listaPaquetes;
        }


        function _actualizarPaquete(pObjpaquete) {
            let listaUsuarios = _getUsuarios();
            let sesion = JSON.parse(sessionStorage.getItem('sesion'));
            for (let i = 0; i < listaUsuarios.length; i++) {
                if(listaUsuarios[i].correo == sesion.correo){
                    for (let j = 0; j < listaUsuarios[i].listaPaquetes.length; j++) {
                        if (listaUsuarios[i].listaPaquetes[j].tracking == pObjpaquete.tracking) {
                            listaUsuarios[i].listaPaquetes[j] = pObjpaquete;
                        }
                    }
                }
            }
            actualizarLocal(listaUsuarios);

        };

        function _actualizarEstadoPaquete(pObjpaquete) {
            let listaUsuarios = _getUsuarios();
            
            for (let i = 0; i < listaUsuarios.length; i++) {
                if(listaUsuarios[i].primerNombre == pObjpaquete.usuario){
                    for (let j = 0; j < listaUsuarios[i].listaPaquetes.length; j++) {
                        if (listaUsuarios[i].listaPaquetes[j].tracking == pObjpaquete.tracking) {
                            listaUsuarios[i].listaPaquetes[j] = pObjpaquete;
                        }
                    }
                }
            }
            actualizarLocal(listaUsuarios);

        };


        function actualizarLocal(plistaActualizada) {
            localStorage.setItem('usuariosLS', JSON.stringify(plistaActualizada));
        }
        function actualizarPaqueteLocal(plistaPaqueteActualizada){
            localStorage.setItem('paquetesLS', JSON.stringify(plistaPaqueteActualizada));
        }
        

            function _getLicencia() {
                let listaLicencia = [];
                let listaLicenciaLocal = JSON.parse(localStorage.getItem('licenciasLS'));
    
                if(listaLicenciaLocal == null){
                   listaLicencia = [];
     
                }else{
                    listaLicenciaLocal.forEach(objLicencia => {
                        let objLicenciaTemp = new Licencia(objLicencia.numLicencia, objLicencia.tipoLicencia, objLicencia.pVencimientoLicencia );
    
                        listaLicencia.push(objLicenciaTemp);
                    });
                }
                return listaLicencia;
            };
    
            function _actualizarLicencia(pObjlicencia) {
                let listaLicencia = _getLicencia();
    
                for (let i = 0; i < listaLicencia.length; i++) {
                    if (listaLicencia[i].traking == pObjlicencia.traking ) {
                       
                        listaLicencia[i] = pObjlicencia;
                    }
                }
                actualizarLicenciaLocal (listaLicencia);
            }

        function _getRol() {
            let session = JSON.parse(sessionStorage.getItem('sesion'));
            let rol = session.tipo;
            return rol;
        }

        function _getRolSucursal() {
            let session = JSON.parse(sessionStorage.getItem ('sesion'));
            let rol = session.sucursalAsignada;
            return rol;
        }
        


        function _addTarjeta(pnuevaTarjeta, pusuario){
                let listaUsuarios = _getUsuarios();
                let listaTarjeta = [];

                for(let i = 0; i < listaUsuarios.length; i++){
                    if(pusuario.obtenerTarjeta().id == listaUsuarios[i].obtenerTarjeta().id){
                        listaUsuarios[i].registrarTarjeta(pnuevaTarjeta);
                    }
                }
                actualizarLocal(listaUsuarios);
        
            };



        function _getTarjeta(objUsuario){
            let listaUsuarios = _getUsuarios();
            let listaTarjeta = [];
            let listaTarjetaLocal = JSON.parse(localStorage.getItem("tarjetaLS"));

           for(let i = 0; i < listaUsuarios.length; i++){
               if (objUsuario.obtenerTarjeta().id == listaUsuarios[i].obtenerTarjeta().id){
                listaTarjeta = listaUsuarios[i].obtenerTarjeta();
               }
            }
    
            return listaTarjeta;
            }

            function actualizarLocal(plistaActualizada){
                localStorage.setItem('usuariosLS', JSON.stringify(plistaActualizada));
              }
    

        function _actualizarRepartidor(pObjRepartidor) {
            let listaUsuarios = _getUsuarios();
            let sesion = JSON.parse(sessionStorage.getItem('sesion'));
            for (let i = 0; i < listaUsuarios.length; i++) {
                if(listaUsuarios[i].correo == sesion.correo){
                    for (let j = 0; j < listaUsuarios[i].listaUsuarios.length; j++) {
                        if (listaUsuarios[i].listaUsuarios[j].tipo == '3') {
                            listaUsuarios[i].listaUsuarios[j] = licencias;
                        }
                    }
                }
            }
            actualizarLocal(listaUsuarios);

        };
    };    

        function _actualizarTarjeta(pObjTarjeta) {
            let listaUsuarios = _getUsuarios();
            let sesion = JSON.parse(sessionStorage.getItem('sesion'));
            for (let i = 0; i < listaUsuarios.length; i++) {
                if(listaUsuarios[i].correo == sesion.correo){
                    for (let j = 0; j < listaUsuarios[i].tarjeta.length; j++) {
                        if (listaUsuarios[i].tarjeta[j].id == pObjTarjeta.id) {
                            listaUsuarios[i].tarjeta[j] = pObjTarjeta;
                        }
                    }
                }
            }
            actualizarLocal(listaUsuarios);

        };    
})();