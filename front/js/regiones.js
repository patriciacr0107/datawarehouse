///////////////////variables globales
let token = localStorage.getItem("key");


///////////////////Referencias a HTML
tblRegiones = document.getElementById('tbl-regiones');
addRegionBtn = document.getElementById('add-region-btn');
filasPg = document.getElementById('filas-pg');
btnBuscar = document.getElementById('btn-buscar');

///////////////////Funciones

//Borra el contenido de la tabla regiones-paises-ciudades
function limpiarTblRegiones() {
    tblRegiones.innerHTML = '';
}

//Muestra los datos de la region
function mostrarRegion(region) {
    tblRegiones.innerHTML += `<tr class="fila-region" id="reg-${region.regionId}">
<td colspan="3" id="fila-reg-${region.regionId}">${region.regionName.charAt(0).toUpperCase() + region.regionName.slice(1)}</td>
<td class="opciones-tbl">
    <div class="opciones-fila">
        <span class="material-icons-outlined material-icons btn-tbl" onclick="editarRegion('${region.regionId}','${region.regionName}')">
            edit
        </span>
        <span class="material-icons-outlined material-icons btn-tbl" onclick="eliminarRegion('${region.regionId}')">
            delete
        </span>
        <div class="btn-tbl-add" onclick="crearPais('${region.regionId}')">+País</div>
    </div>
</td>
<td>
    <div class="cont-edicion-tbl" id="cont-ed-${region.regionId}">
        <input type="text" name="" id="txt-${region.regionId}" class="input">
        <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarRegion('${region.regionId}')">
            save
        </span>

    </div>
</td>
</tr>`;
}

function mostrarPais(pais) {
    console.log('muestra datos de pais: ', pais.name);

    tblRegiones.innerHTML += `<tr class="fila-otr" id="reg-${pais.paisId}">
    <td></td>
    <td colspan="2" id="fila-reg-${pais.paisId}">${pais.paisName.charAt(0).toUpperCase() + pais.paisName.slice(1)}</td>
    <td class="opciones-tbl">
        <div class="cont-opciones-tbl">
            <div class="opciones-fila"><span class="material-icons-outlined material-icons btn-tbl" onclick="editarPais('${pais.paisId}', '${pais.paisName}')">
                    edit
                </span>
                <span class="material-icons-outlined material-icons btn-tbl" onclick="borrarPais('${pais.paisId}')">
                    delete
                </span>
                <div class="btn-tbl-add" onclick="crearCiudad('${pais.paisId}')">+Ciudad</div>
            </div>
        </div>
    </td>
    <td>
        <div class="cont-edicion-tbl" id="cont-ed-${pais.paisId}">
            <input type="text" name="" id="txt-${pais.paisId}" class="input">
            <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarPais('${pais.paisId}')">
                save
            </span>

        </div>
    </td>
</tr>`;
}

//muestra las ciudades de un pais
function mostrarCiudades(ciudad) {
    console.log('muestra datos de una ciudad: ', ciudad.name);

    tblRegiones.innerHTML += `<tr class="fila-otr" id="reg-${ciudad.ciudadId}">
    <td class="region-tbl"></td>
    <td class="pais-tbl"></td>
    <td class="ciudad-tbl" id="fila-reg-${ciudad.ciudadId}">${ciudad.ciudadName.charAt(0).toUpperCase() + ciudad.ciudadName.slice(1)}</td>
    <td class="opciones-tbl">
    <div class="cont-opciones-tbl">
        <div class="opciones-fila"><span class="material-icons-outlined material-icons btn-tbl" onclick="editarCiudad('${ciudad.ciudadId}','${ciudad.ciudadName}')">
                edit
            </span>
            <span class="material-icons-outlined material-icons btn-tbl" onclick="borrarCiudad('${ciudad.ciudadId}')">
                delete
            </span>

        </div>
        </div>
    </td>
    <td>
        <div class="cont-edicion-tbl" id="cont-ed-${ciudad.ciudadId}">
            <input type="text" name="" id="txt-${ciudad.ciudadId}" class="input">
            <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarCiudad('${ciudad.ciudadId}')">
                save
            </span>

        </div>
    </td>
</tr>`;
}

function mostrarDatos(ciudades) {

    let regiones = '';
    let paises = '';

    console.log('ciudades ', ciudades);

    console.log('tamaño ', ciudades.length);
    for (let ciudad of ciudades) {
        regiones = ciudad.regionId;
        console.log(`ciudad |${ciudad.id}|`);
        if (ciudad.id == "") {
            if (ciudad.paisId == "") {
                mostrarRegion({
                    name: ciudad.regionNombre,
                    _id: ciudad.regionId
                });
            }
        }
    }
}

/*
async function cargarRegion2() {
    let cities = [];


    let regiones = await fetch(`http://localhost:3000/api/regions/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((json) => json);

    //   console.log(regiones.doc[0]._id);

    regiones.doc.forEach(async (element) => {
        //   console.log(element._id);

        let paises = await fetch(
            `http://localhost:3000/api/countries/?region=${element._id}&sort=name`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then((response) => response.json())
            .then((json) => json);

        let inicioR = 0;
        if (paises.doc.length == 0) {
            //mostrarRegion(element);
            let ciudadesArr = {};
            ciudadesArr.nombre = '';
            ciudadesArr.id = '';
            ciudadesArr.paisNombre = '';
            ciudadesArr.paisId = '';
            ciudadesArr.regionNombre = element.name;
            ciudadesArr.regionId = element._id;

            cities.push(ciudadesArr);
        }



        paises.doc.forEach(async (pais) => {
            //   console.log(element._id);



            let ciudades = await fetch(
                `http://localhost:3000/api/cities/?country=${pais._id}&sort=name`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
                .then((response) => response.json())
                // .then((json) => json);
                .then((json) => json);
            //   console.log('ciudades', ciudades);

            if (ciudades.doc.length == 0) {
                //if (inicioR == 0) {
                //mostrarRegion(element);
                //    inicioR = 1;
                //}
                //mostrarPais(pais);
                let ciudadesArr = {};
                ciudadesArr.nombre = '';
                ciudadesArr.id = '';
                ciudadesArr.paisNombre = pais.name;
                ciudadesArr.paisId = pais._id;
                ciudadesArr.regionNombre = element.name;
                ciudadesArr.regionId = element._id;

                cities.push(ciudadesArr);
            }

            ciudades.doc.forEach(ciudad => {
                //if (inicioR == 0) {
                //mostrarRegion(element);
                //    inicioR = 1;
                //}
                //if (inicioP == 0) {
                //mostrarPais(pais);
                //    inicioP = 1;
                //}
                //mostrarCiudades(ciudad);
                let ciudadesArr = {};
                ciudadesArr.nombre = ciudad.name;
                ciudadesArr.id = ciudad._id;
                ciudadesArr.paisNombre = pais.name;
                ciudadesArr.paisId = pais._id;
                ciudadesArr.regionNombre = element.name;
                ciudadesArr.regionId = element._id;

                cities.push(ciudadesArr);
            });

        });
    });


    console.log(cities);
    return cities;
}*/

async function cargarRegion(limite, region) {
    let url = region != '' ? `http://localhost:3000/api/regions/?name=${region}` :
        (limite == 'todas' ? `http://localhost:3000/api/regions/` :
            `http://localhost:3000/api/regions/?limit=${limite}`);




    let regiones = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            console.log('retorna regiones', response.doc);
            //console.log('Region guardada correctamente');
            //mostrarNuevaRegion(response.doc);
            return response.doc;
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error cargando region');
        });
    return regiones;
}

async function cargarPaises(regiones) {
    paisesArr = [];

    for (let region of regiones) {
        let paises = await fetch(`http://localhost:3000/api/countries/?region=${region._id}&sort=name`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                let paisesXRegion = [];

                if (response.doc.length == 0) {
                    paisesXRegion.push({
                        regionName: region.name,
                        regionId: region._id,
                        paisName: '',
                        paisId: ''
                    });
                }

                for (let pais of response.doc) {
                    paisesXRegion.push({
                        regionName: region.name,
                        regionId: region._id,
                        paisName: pais.name,
                        paisId: pais._id
                    });
                }

                return paisesXRegion;
            })
            .catch(error => {

                console.error('Error:', error);
                alert('Error cargando paises');
            });

        paisesArr = paisesArr.concat(paises);
    }

    console.log('retorna paises ', paisesArr);
    return paisesArr;


}

async function cargarCiudades(paises) {
    ciudadesArr = [];

    //console.log('esto es lo que llega en ciudades');
    //console.table(paises);
    let region = paises[0].regionId;
    mostrarRegion(paises[0]);
    for (let pais of paises) {
        if (region != pais.regionId) {
            mostrarRegion(pais);
        }

        if (pais.paisId != '') {
            mostrarPais(pais)
        }
        if (pais.paisId == '') {
            let ciudadesXPais = [];
            let ciudadXPais = {
                regionName: pais.regionName,
                regionId: pais.regionId,
                paisName: pais.paisName,
                paisId: pais.paisId,
                ciudadName: '',
                ciudadId: ''
            };
            ciudadesXPais.push(ciudadXPais);
            ciudadesArr = ciudadesArr.concat(ciudadesXPais);





        } else {
            //console.log('id de pais ', pais.paisId);
            //console.log('id de pais ', pais.paisName);
            //console.log('region ', pais.regionName);
            let ciudades = await fetch(`http://localhost:3000/api/cities/?country=${pais.paisId}&sort=name`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json())
                .then(response => {
                    let ciudadesXPais = [];

                    //console.log('ciudades ', response.doc);
                    if (response.doc.length == 0) {
                        let ciudadXPais = {
                            regionName: pais.regionName,
                            regionId: pais.regionId,
                            paisName: pais.paisName,
                            paisId: pais.paisId,
                            ciudadName: '',
                            ciudadId: ''
                        };

                        ciudadesXPais.push(ciudadXPais);

                        /*mostrarRegion(ciudadXPais);

                        if (ciudadXPais.paisId != '') {
                            mostrarPais(ciudadXPais)
                        }*/
                    }

                    for (let ciudad of response.doc) {
                        let ciudadXPais = {
                            regionName: pais.regionName,
                            regionId: pais.regionId,
                            paisName: pais.paisName,
                            paisId: pais.paisId,
                            ciudadName: ciudad.name,
                            ciudadId: ciudad._id
                        };
                        ciudadesXPais.push(ciudadXPais);

                        //mostrarRegion(ciudadXPais);
                        //mostrarPais(ciudadXPais);
                        mostrarCiudades(ciudadXPais);

                    }

                    return ciudadesXPais;
                })
                .catch(error => {

                    console.error('Error:', error);
                    //alert('Error cargando paises');
                });

            ciudadesArr = ciudadesArr.concat(ciudades);
        }


    }

    console.log('retorna ciudades ', ciudadesArr);
    return ciudadesArr;


}

async function cargarDatos(limite, region) {
    let regiones = await cargarRegion(limite, region);
    console.table(regiones);
    let paises = await cargarPaises(regiones);
    console.table(paises);
    let ciudades = await cargarCiudades(paises);
    console.table(ciudades);
}

async function guardarRegion(id) {
    InputEditar = document.getElementById(`txt-${id}`);

    let regionReg = { name: InputEditar.value };
    fetch(`http://localhost:3000/api/regions/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(regionReg)
    }).then(response => response.json())
        .then(response => {
            console.log(response);
            console.log('Region guardada correctamente');

            filaRegion = document.getElementById(`fila-reg-${id}`)
            filaRegion.innerHTML = response.doc.name.charAt(0).toUpperCase() + response.doc.name.slice(1);
            document.getElementById(`cont-ed-${id}`).style.display = 'none';
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando region');
        });

}

async function guardarPais(id) {
    InputEditar = document.getElementById(`txt-${id}`);

    let paisReg = { name: InputEditar.value };
    fetch(`http://localhost:3000/api/countries/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paisReg)
    }).then(response => response.json())
        .then(response => {
            console.log(response);
            console.log('Pais guardado correctamente');

            filaRegion = document.getElementById(`fila-reg-${id}`)
            filaRegion.innerHTML = response.doc.name.charAt(0).toUpperCase() + response.doc.name.slice(1);
            document.getElementById(`cont-ed-${id}`).style.display = 'none';
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando pais');
        });
}

async function guardarCiudad(id) {
    InputEditar = document.getElementById(`txt-${id}`);

    let ciudadReg = { name: InputEditar.value };
    fetch(`http://localhost:3000/api/cities/${id}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ciudadReg)
    }).then(response => response.json())
        .then(response => {
            console.log(response);
            console.log('Ciudad guardada correctamente');

            filaPais = document.getElementById(`fila-reg-${id}`)
            filaPais.innerHTML = response.doc.name.charAt(0).toUpperCase() + response.doc.name.slice(1);
            document.getElementById(`cont-ed-${id}`).style.display = 'none';
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando pais');
        });
}

//muestra campo de edicion para region
function editarRegion(id, nombre) {
    document.getElementById(`cont-ed-${id}`).style.display = 'flex'
    InputEditar = document.getElementById(`txt-${id}`);
    InputEditar.value = nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

//muestra campo de edicion para pais
function editarPais(id, nombre) {
    /*console.log('id ', id);
    document.getElementById(`cont-ed-${id}`).style.display = 'flex'
    InputEditar = document.getElementById(`txt-${id}`);
    InputEditar.value = nombre.charAt(0).toUpperCase() + nombre.slice(1);*/
    editarRegion(id, nombre);

}

//muestra campo de edicion para ciudad
function editarCiudad(id, nombre) {
    editarRegion(id, nombre);

}

async function eliminarRegion(id) {
    filaRegion = document.getElementById(`fila-reg-${id}`);
    let des = confirm(`Desea borrar la region ${filaRegion.innerHTML}?`);

    if (des) {
        fetch(`http://localhost:3000/api/regions/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                console.log('Region borrada correctamente');
                limpiarTblRegiones()
                cargarDatos('todas', '');
                //filaRegion = document.getElementById(`reg-${id}`);
                //filaRegion.remove();
            })
            .catch(error => {

                console.error('Error:', error);
                alert('Error guardando region');
            });
    }
}

async function borrarPais(id) {
    filaPais = document.getElementById(`fila-reg-${id}`);
    let des = confirm(`Desea borrar el país ${filaPais.innerHTML}?`);

    if (des) {
        fetch(`http://localhost:3000/api/countries/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                console.log('Pais borrado correctamente');
                limpiarTblRegiones()
                cargarDatos('todas', '');
                //filaPais = document.getElementById(`reg-${id}`);
                //filaPais.remove();
            })
            .catch(error => {

                console.error('Error:', error);
                alert('Error guardando region');
            });
    }
}

async function borrarCiudad(id) {
    filaCiudad = document.getElementById(`fila-reg-${id}`);
    let des = confirm(`Desea borrar la ciudad ${filaCiudad.innerHTML}?`);

    if (des) {
        fetch(`http://localhost:3000/api/cities/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                console.log('Ciudad borrada correctamente');

                filaCiudad = document.getElementById(`reg-${id}`);
                filaCiudad.remove();
            })
            .catch(error => {

                console.error('Error:', error);
                alert('Error borrando ciudad');
            });
    }
}

function mostrarNuevaRegion(datosRegion) {
    console.log('datos region ', datosRegion);

    filaNueva = document.getElementById('fila-nueva-region');

    filaNueva.setAttribute("id", `reg-${datosRegion._id}`);

    filaNueva.innerHTML = `
<td colspan="3" id="fila-reg-${datosRegion._id}">${datosRegion.name.charAt(0).toUpperCase() + datosRegion.name.slice(1)}</td>
<td class="opciones-tbl">
    <div class="opciones-fila">
        <span class="material-icons-outlined material-icons btn-tbl" onclick="editarRegion('${datosRegion._id}','${datosRegion.name}')">
            edit
        </span>
        <span class="material-icons-outlined material-icons btn-tbl" onclick="eliminarRegion('${datosRegion._id}')">
            delete
        </span>
        <div class="btn-tbl-add" onclick="crearPais('${datosRegion._id}')">+País</div>
    </div>
</td>
<td>
    <div class="cont-edicion-tbl" id="cont-ed-${datosRegion._id}">
        <input type="text" name="" id="txt-${datosRegion._id}" class="input">
        <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarRegion('${datosRegion._id}')">
            save
        </span>

    </div>
</td>
    `;
}

//muestra en la tabla los datos del nuevo pais
function mostrarNuevoPais(pais) {
    filaNueva = document.getElementById('fila-nuevo-pais');

    filaNueva.setAttribute("id", `reg-${pais._id}`);

    filaNueva.innerHTML = `
    <td></td>
    <td colspan="2" id="fila-reg-${pais._id}">${pais.name.charAt(0).toUpperCase() + pais.name.slice(1)}</td>
    <td class="opciones-tbl">
        <div class="cont-opciones-tbl">
            <div class="opciones-fila"><span class="material-icons-outlined material-icons btn-tbl" onclick="editarPais('${pais.paisId}', '${pais.paisName}')">
                    edit
                </span>
                <span class="material-icons-outlined material-icons btn-tbl" onclick="borrarPais('${pais._id}')">
                    delete
                </span>
                <div class="btn-tbl-add" onclick="crearCiudad('${pais._id}')">+Ciudad</div>
            </div>
        </div>
    </td>
    <td>
        <div class="cont-edicion-tbl" id="cont-ed-${pais._id}">
            <input type="text" name="" id="txt-${pais._id}" class="input">
            <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarPais('${pais._id}')">
                save
            </span>

        </div>
    </td>
    `;
}

//muestra en la tabla los datos de la nueva ciudad
function mostrarNuevaCiudad(ciudad) {
    filaNueva = document.getElementById('fila-nueva-ciudad');

    filaNueva.setAttribute("id", `reg-${ciudad._id}`);

    filaNueva.innerHTML = `
    <td class="region-tbl"></td>
    <td class="pais-tbl"></td>
    <td class="ciudad-tbl" id="fila-reg-${ciudad._id}">${ciudad.name.charAt(0).toUpperCase() + ciudad.name.slice(1)}</td>
    <td class="opciones-tbl">
    <div class="cont-opciones-tbl">
        <div class="opciones-fila"><span class="material-icons-outlined material-icons btn-tbl" onclick="editarCiudad('${ciudad._id}','${ciudad.name}')">
                edit
            </span>
            <span class="material-icons-outlined material-icons btn-tbl" onclick="borrarCiudad('${ciudad._id}')">
                delete
            </span>

        </div>
        </div>
    </td>
    <td>
        <div class="cont-edicion-tbl" id="cont-ed-${ciudad._id}">
            <input type="text" name="" id="txt-${ciudad._id}" class="input">
            <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarCiudad('${ciudad._id}')">
                save
            </span>

        </div>
    </td>
    `;
}

//almacena en la base de datos el pais nuevo
async function guardarPaisNuevo(region) {
    let paisReg = {
        name: document.getElementById('txt-nuevo-pais').value,
        region: region
    };
    console.log('array de pais', paisReg);
    fetch('http://localhost:3000/api/countries/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paisReg)
    }).then(response => response.json())
        .then(response => {
            console.log(response);
            console.log('Pais guardado correctamente');
            mostrarNuevoPais(response.doc);
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando pais');
        });
}

//almacena en la base de datos la ciudad nueva
async function guardarCiudadNueva(pais) {
    let ciudadReg = {
        name: document.getElementById('txt-nueva-ciudad').value,
        country: pais
    };

    fetch('http://localhost:3000/api/cities/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ciudadReg)
    }).then(response => response.json())
        .then(response => {
            console.log(response);
            console.log('Ciudad guardada correctamente');
            mostrarNuevaCiudad(response.doc);
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando ciudad');
        });
}

//crea una nueva fila para la ciudad y muestra el input para insertarla
function crearCiudad(idPais) {
    existe = !!document.getElementById('fila-nueva-ciudad');

    if (existe) {
        document.getElementById('fila-nueva-ciudad').remove();
    }

    filaPais = document.getElementById(`reg-${idPais}`);

    indPais = filaPais.rowIndex;

    nuevoPais = tblRegiones.insertRow(indPais + 1);
    nuevoPais.setAttribute("class", 'fila-otr');
    nuevoPais.setAttribute("id", 'fila-nueva-ciudad');

    nuevoPais.innerHTML = `
    <td class="region-tbl"></td>
    <td class="pais-tbl"></td>
    <td class="ciudad-tbl"></td>
    <td class="opciones-tbl">
    
    </td>
    <td>
        <div class="cont-edicion-tbl" id="cont-ed-nva-ciudad">
            <input type="text" name="" id="txt-nueva-ciudad" class="input" placeholder="Ingrese la nueva ciudad">
            <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarCiudadNueva('${idPais}')">
                save
            </span>

        </div>
    </td>`;

    document.getElementById('cont-ed-nva-ciudad').style.display = 'flex';
}

//crea una nueva fila para el pais y muestra el input para insertarlo
function crearPais(idRegion) {
    existe = !!document.getElementById('fila-nuevo-pais');

    if (existe) {
        document.getElementById('fila-nuevo-pais').remove();
    }

    filaRegion = document.getElementById(`reg-${idRegion}`);

    indRegion = filaRegion.rowIndex;

    nuevoPais = tblRegiones.insertRow(indRegion + 1);
    nuevoPais.setAttribute("class", 'fila-otr');
    nuevoPais.setAttribute("id", 'fila-nuevo-pais');

    nuevoPais.innerHTML = `
    <td></td>
    <td colspan="2"></td>
    <td class="opciones-tbl">
    </td>
    <td>
        <div class="cont-edicion-tbl" id = "cont-ed-nvo-pais">
            <input type="text" name="" id="txt-nuevo-pais" class="input" placeholder='Ingrese el nuevo pais'>
            <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarPaisNuevo('${idRegion}')">
                save
            </span>

        </div>
    </td>
</tr>`;

    document.getElementById('cont-ed-nvo-pais').style.display = 'flex';
}

async function crearRegion(region) {
    let regionReg = { name: region };
    fetch('http://localhost:3000/api/regions/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(regionReg)
    }).then(response => response.json())
        .then(response => {
            console.log(response);
            console.log('Region guardada correctamente');
            mostrarNuevaRegion(response.doc);
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando region');
        });

}

function guardarRegionNueva() {
    crearRegion(document.getElementById('txt-nueva-region').value);
}

///////////////////////////eventos

addRegionBtn.addEventListener('click', e => {
    existe = !!document.getElementById('fila-nueva-region');

    if (existe) {
        document.getElementById('fila-nueva-region').remove();
    }

    nuevaRegion = tblRegiones.insertRow(0);
    nuevaRegion.setAttribute("class", 'fila-region');
    nuevaRegion.setAttribute("id", 'fila-nueva-region');
    nuevaRegion.innerHTML += `
    <td colspan="3"></td>
    <td class="opciones-tbl">
    </td>
    <td>
        <div class="cont-edicion-tbl" id="cont-ed-nva-region">
            <input type="text" name="" id="txt-nueva-region" class="input" placeholder='Ingrese el nombre de la nueva region'>
            <span class="material-icons-outlined material-icons btn-tbl" onclick="guardarRegionNueva()">
                save
            </span>
    
        </div>
    </td>
    `;

    document.getElementById('cont-ed-nva-region').style.display = 'flex';
});

filasPg.addEventListener('change', e => {
    limpiarTblRegiones();
    cargarDatos(filasPg.value, '');
});

btnBuscar.addEventListener('click', e => {
    txtBuscar = document.getElementById('txt-buscar').value;

    if (txtBuscar == '') {
        alert('Por favor ingrese la region a buscar');
    }
    else {
        //buscarRegion(txtBuscar);
        limpiarTblRegiones();
        cargarDatos('', txtBuscar);
    }
})

//cargarRegion().then(ciudades => console.log('a', ciudades));
cargarDatos(2, '');