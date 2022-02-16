///////////////////variables globales
let token = localStorage.getItem("key");
let idContactoEdicion = null;
let canales = [];

///////////////////Referencias a HTML
const tblContactos = document.getElementById('tbl-contactos');
const btnGuardarContacto = document.getElementById('btn-guardar-contacto');
const regionSelect = document.getElementById('region');
const paisAdd = document.getElementById('pais-add');
const usuarioInput = document.getElementById('usuario');
const btnCanal = document.getElementById('btn-canal');

///////////////////Funciones

//borra la informacion mostrada de contactos
function limpiarTblContactos() {
    regContacto = document.getElementsByClassName('reg-contacto');

    for (i = regContacto.length - 1; i >= 0; i--) {
        tblContactos.removeChild(regContacto[i]);
    }

}

//mostrar datos de contacto
function mostrarContactos(contacto) {

    let fila = document.createElement("tr");
    fila.setAttribute("class", 'reg-contacto');
    fila.setAttribute("id", `reg-${contacto._id}`);

    let cmpSeleccion = document.createElement("td");
    cmpSeleccion.innerHTML = `<input type="checkbox" name="" id="sel-${contacto._id}">`;
    fila.appendChild(cmpSeleccion);

    let cmpNombre = document.createElement("td");
    cmpNombre.innerHTML = `${formatoMayusculaInicial(contacto.names)} ${formatoMayusculaInicial(contacto.surnames)}`;
    fila.appendChild(cmpNombre);

    let cmpUbicacion = document.createElement("td");
    cmpUbicacion.innerHTML = `${formatoMayusculaInicial(contacto.city.name)} (${formatoMayusculaInicial(contacto.city.country.name)})`;
    fila.appendChild(cmpUbicacion);

    let cmpCompania = document.createElement("td");
    cmpCompania.innerHTML = formatoMayusculaInicial(contacto.company.name);
    fila.appendChild(cmpCompania);

    let cmpCargo = document.createElement("td");
    cmpCargo.innerHTML = formatoMayusculaInicial(contacto.position);
    fila.appendChild(cmpCargo);


    let cmpInterest = document.createElement("td");
    cmpInterest.innerHTML = `${contacto.interest}% <meter id="int" max="100" value="${contacto.interest}" low="25" high="75" optimum="100"> ${contacto.interest}
    </meter>`;
    fila.appendChild(cmpInterest);

    let cmpOpciones = document.createElement("td");
    cmpOpciones.innerHTML = `<a href="#contenedor-edicion" onclick="buscarContacto('${contacto._id}')">
    <span class="material-icons-outlined material-icons icono-accion">
    edit
    </span></a> <span class="material-icons-outlined material-icons icono-accion" onclick="eliminarContacto('${contacto._id}','${contacto.names} ${contacto.surnames}')">
    delete
    </span>`;
    fila.appendChild(cmpOpciones);

    tblContactos.appendChild(fila);
}


//obtiene todos los usuarios de la base de datos
async function cargarContactos(cmpOrden, tipoOrden, limite) {
    let contactos = [];

    if (tipoOrden == 'DESC') {
        tipoOrden = '-';
    } else {
        tipoOrden = '';
    }

    await fetch(`http://localhost:3000/api/contacts/?limit=${limite}&sort=${tipoOrden}${cmpOrden}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            contactos = response.doc;
            limpiarTblContactos();
            contactos.forEach(contacto => {
                mostrarContactos(contacto);
            });

        })
        .catch(error => {

            console.error('Error obteniendo contactos:', error);

        });

}

//limpia los datos del select
function reiniciarSelect(select) {
    cmpSelect = document.getElementById(select);

    for (let i = cmpSelect.options.length; i >= 0; i--) {
        cmpSelect.remove(i);
    }
}

async function cargarCompanias() {

    fetch(`http://localhost:3000/api/companies/?sort=name`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            reiniciarSelect('compania-add');
            cmpSelect = document.getElementById('compania-add');
            response.doc.forEach(compania => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(compania.name);
                option.value = compania._id
                cmpSelect.add(option);
            });
            if (response.doc.length > 0) {
                cmpSelect.disabled = false;
            } else {
                cmpSelect.disabled = true;
            }
        })
        .catch(error => {

            console.error('Error consultando compañías:', error);

        });

}

//Carga el select de las ciudades
async function cargarCiudades(paisId) {
    await fetch(`http://localhost:3000/api/cities/?sort=name&country=${paisId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            reiniciarSelect('ciudad');
            cmpSelect = document.getElementById('ciudad');
            response.doc.forEach(ciudad => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(ciudad.name);
                option.value = ciudad._id
                cmpSelect.add(option);
            });
            if (response.doc.length > 0) {
                cmpSelect.disabled = false;
            } else {
                cmpSelect.disabled = true;
            }
        })
        .catch(error => {

            console.error('Error:', error);

        });
}

//Carga el select de los paises
async function cargarPaises(region) {
    let paises = await fetch(`http://localhost:3000/api/countries/?sort=name&region=${region}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            //console.log(response.doc);
            reiniciarSelect('pais-add');
            cmpSelect = document.getElementById('pais-add');
            response.doc.forEach(pais => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(pais.name);
                option.value = pais._id
                cmpSelect.add(option);
            });
            if (response.doc.length > 0) {
                cmpSelect.disabled = false;
                return cmpSelect.value;
            } else {
                cmpSelect.disabled = true;
                return '';
            }

        })
        .catch(error => {

            console.error('Error:', error);

        });

    if (paises != '') {
        await cargarCiudades(paises);
    } else {
        reiniciarSelect('ciudad');
    }

}

//Carga el select de los paises
async function cargarRegiones() {
    let regiones = await fetch(`http://localhost:3000/api/regions/?sort=name`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            //console.log(response.doc);
            reiniciarSelect('region');
            cmpSelect = document.getElementById('region');
            response.doc.forEach(region => {
                var option = document.createElement("option");
                option.text = formatoMayusculaInicial(region.name);
                option.value = region._id
                cmpSelect.add(option);
            });
            if (response.doc.length > 0) {
                cmpSelect.disabled = false;
                return cmpSelect.value;
            } else {
                cmpSelect.disabled = true;
                return '';
            }

        })
        .catch(error => {

            console.error('Error:', error);

        });

    if (regiones != '') {
        await cargarPaises(regiones);
    } else {
        reiniciarSelect('pais-add');
    }
}

//reinicia campos de formulario para adicionar compañia
function mostrarFormAgregar() {
    document.getElementById('titulo-modal').innerHTML = 'Adicionar Contacto';
    document.getElementById('nombre').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('email').value = '';
    document.getElementById('cargo').value = '';
    document.getElementById('direccion').value = '';
    document.getElementById('interes').value = '';
    document.getElementById('usuario').value = '';
    document.getElementById('datos-canal-tbl').innerHTML = `<tr>
    <th>
        Canal
    </th>
    <th>
        Cuenta
    </th>
    <th>
        Preferencia
    </th>
</tr>`;
    document.getElementById('btn-canal').style.display = 'none';
    btnGuardarContacto.value = 'Guardar Compañía';
    idContactoEdicion = null;
    document.getElementById('compania-add').disabled = true;
    document.getElementById('region').disabled = true;
    document.getElementById('pais-add').disabled = true;
    document.getElementById('ciudad').disabled = true;
    cargarCompanias();
    cargarRegiones();
}

function mostrarCanal(canal) {

    let canalTbl = document.getElementById('datos-canal-tbl');
    let fila = document.createElement("tr");
    //fila.setAttribute("class", 'reg-contacto');
    //fila.setAttribute("id", `reg-${contacto._id}`);

    let cmpNombreCanal = document.createElement("td");
    cmpNombreCanal.innerHTML = formatoMayusculaInicial(canal.canal);
    fila.appendChild(cmpNombreCanal);

    let cmpCuentaUsuario = document.createElement("td");
    cmpCuentaUsuario.innerHTML = canal.cuentaUsuario
    fila.appendChild(cmpCuentaUsuario);

    let cmpPreferencia = document.createElement("td");
    cmpPreferencia.innerHTML = canal.preferencia;
    fila.appendChild(cmpPreferencia);

    canalTbl.appendChild(fila);
}

///////////////////eventos

regionSelect.addEventListener('change', e => {
    cargarPaises(regionSelect.value);
});

paisAdd.addEventListener('change', e => {
    cargarCiudades(paisAdd.value);
});

usuarioInput.addEventListener('keypress', e => {
    if (usuarioInput.value.length > 0) {
        btnCanal.style.display = 'block';
    } else {
        btnCanal.style.display = 'none';
    }

})

btnCanal.addEventListener('click', e => {
    canal = {
        canal: document.getElementById('canal').value,
        cuentaUsuario: document.getElementById('usuario').value,
        preferencia: document.getElementById('preferencia').value
    };

    canales.push(canal);

    mostrarCanal(canal);
    document.getElementById('usuario').value = '';
    btnCanal.style.display = 'none';
})

cargarContactos('name', 'ASC', 10);