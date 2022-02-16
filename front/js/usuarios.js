///////////////////variables globales
let token = localStorage.getItem("key");
let idUsuarioEdicion = '';

///////////////////Referencias a HTML
tblUsuarios = document.getElementById('tbl-usuarios');
btnGuardarUsuario = document.getElementById('btn-guardar-usuario');
btnBuscar = document.getElementById('btn-buscar');
filasPg = document.getElementById('filas-pg');

///////////////////Funciones

function crearCampoTitulo(campo) {
    let tituloCampo = document.createElement("th");
    let divCampo = document.createElement("div");
    divCampo.setAttribute("class", 'titulo orden-desc');
    divCampo.setAttribute("id", `btn-ord-${campo}`);
    divCampo.innerHTML = `<span>${campo.charAt(0).toUpperCase() + campo.slice(1)}</span>
    <span  class="material-icons-outlined material-icons icono-ordenar">
        import_export
    </span>`;

    //console.log(divCampo.classList);

    tituloCampo.appendChild(divCampo);
    return tituloCampo;
}

function agregarEventoClick(campo, campoNombre) {
    const elemento = document.getElementById(`btn-ord-${campo}`);

    elemento.addEventListener('click', e => {
        console.log(`ordenar por ${campo}`);
        console.log(elemento.classList);
        if (elemento.classList.contains("orden-desc")) {
            console.log('ingresa a ordenar descendientemente');
            limpiarTblUsuarios();
            cargarUsuarios(campoNombre, 'DESC', filasPg.value);
        } else {
            console.log('ingresa a ordenar ascendentemente');
            limpiarTblUsuarios();
            cargarUsuarios(campoNombre, 'ASC', filasPg.value);
        }

        elemento.classList.toggle('orden-desc');
    });
}

function crearEncabezado() {
    let fila = document.createElement("tr");

    fila.appendChild(crearCampoTitulo('nombre'));
    fila.appendChild(crearCampoTitulo('apellidos'));
    fila.appendChild(crearCampoTitulo('email'));
    fila.appendChild(crearCampoTitulo('perfil'));

    fila.innerHTML += `<th>
    <div class="titulo">Acciones</div>
</th>`;

    tblUsuarios.appendChild(fila);

    agregarEventoClick('nombre', 'name');
    agregarEventoClick('apellidos', 'lastname');
    agregarEventoClick('email', 'email');
    agregarEventoClick('perfil', 'role');
}

function limpiarTblUsuarios() {
    regUsuarios = document.getElementsByClassName('reg-usuario');

    for (i = regUsuarios.length - 1; i >= 0; i--) {
        tblUsuarios.removeChild(regUsuarios[i]);
    }

}

function borrarUsuarioTbl(id) {
    usuario = document.getElementById(`reg-${id}`);

    tblUsuarios.removeChild(usuario);
}

async function eliminarUsuario(id, nombre) {
    if (confirm(`Desea elminar a ${nombre} del sistema?`)) {

        console.log('se elimina usuario');

        await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                console.log(response);
                //limpiarTblUsuarios();
                borrarUsuarioTbl(id);

            })
            .catch(error => {

                console.error('Error eliminando usuario:', error);

            });
    }
}

async function buscarUsuario(id) {
    console.log('id ', id);

    await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            console.log(response);

            document.getElementById('nombre').value = response.doc.name.charAt(0).toUpperCase() + response.doc.name.slice(1);
            document.getElementById('apellidos').value = response.doc.lastname.charAt(0).toUpperCase() + response.doc.lastname.slice(1);
            document.getElementById('email').value = response.doc.email;
            document.getElementById('perfil').value = response.doc.role;
            //document.getElementById('password').disabled = true;
            //document.getElementById('password2').disabled = true;
            document.getElementById('password').style.display = 'none';
            document.getElementById('password2').style.display = 'none';
            document.getElementById('titulo-pw').style.display = 'none';
            document.getElementById('titulo-pw2').style.display = 'none';
            document.getElementById('titulo-modal').innerHTML = 'Editar Usuario';
            idUsuarioEdicion = response.doc._id;
            btnGuardarUsuario.value = 'Guardar cambios';

        })
        .catch(error => {

            console.error('Error eliminando usuario:', error);

        });

}

function mostrarFormAgregar() {
    document.getElementById('titulo-modal').innerHTML = 'Adicionar Usuario';
    document.getElementById('password').style.display = 'inline-block';
    document.getElementById('password2').style.display = 'inline-block';
    document.getElementById('nombre').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('email').value = '';
    document.getElementById('perfil').value = 'user';
    document.getElementById('titulo-pw').style.display = 'inline-block';
    document.getElementById('titulo-pw2').style.display = 'inline-block';
    btnGuardarUsuario.value = 'Guardar Usuario';
    idUsuarioEdicion = null;
}

function mostrarUsuarios(usuario) {

    let fila = document.createElement("tr");
    fila.setAttribute("class", 'reg-usuario');
    fila.setAttribute("id", `reg-${usuario._id}`);
    //elem.setAttribute("id", `slider_${imgGif.id}`);
    let cmpNombre = document.createElement("td");
    cmpNombre.innerHTML = usuario.name.charAt(0).toUpperCase() + usuario.name.slice(1);
    fila.appendChild(cmpNombre);

    let cmpApellidos = document.createElement("td");
    cmpApellidos.innerHTML = usuario.lastname.charAt(0).toUpperCase() + usuario.lastname.slice(1);
    fila.appendChild(cmpApellidos);

    let cmpEmail = document.createElement("td");
    cmpEmail.innerHTML = usuario.email;
    fila.appendChild(cmpEmail);

    let cmpPerfil = document.createElement("td");
    cmpPerfil.innerHTML = usuario.role == 'admin' ? 'Admin' : 'Básico';
    fila.appendChild(cmpPerfil);

    let cmpOpciones = document.createElement("td");
    cmpOpciones.innerHTML = `<a href="#contenedor-edicion" onclick="buscarUsuario('${usuario._id}')">
    <span class="material-icons-outlined material-icons icono-accion">
    edit
    </span></a> <span class="material-icons-outlined material-icons icono-accion" onclick="eliminarUsuario('${usuario._id}','${usuario.name} ${usuario.lastname}')">
    delete
    </span>`;
    fila.appendChild(cmpOpciones);

    tblUsuarios.appendChild(fila);
}

//obtiene todos los usuarios de la base de datos
async function cargarUsuarios(cmpOrden, tipoOrden, limite) {
    let usuarios = [];

    if (tipoOrden == 'DESC') {
        tipoOrden = '-';
    } else {
        tipoOrden = '';
    }

    await fetch(`http://localhost:3000/api/users/?limit=${limite}&sort=${tipoOrden}${cmpOrden}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            console.log(response.doc);
            usuarios = response.doc;
            limpiarTblUsuarios();
            usuarios.forEach(usuario => {
                //console.log('usuario', usuario.name);
                mostrarUsuarios(usuario);
            });

        })
        .catch(error => {

            console.error('Error:', error);

        });

}

function validarUsuario(usuario) {

    let camposValidos = false;

    if (usuario.name == '') {
        alert('Nombre incorrecto');
    } else if (usuario.lastname == '') {
        alert('Apellidos incorrectos');
    } else if (usuario.email == '') {
        alert('email incorrecto');
    } else if (usuario.password == '' || usuario.password.length < 8) {
        alert('contraseña incorrecta');
    } else if (usuario.passwordConfirm == '') {
        alert('Por favor ingrese nuevamente la contraseña');
    } else if (usuario.password !== usuario.passwordConfirm) {
        alert('La contraseña no coincide con el valor ingresado');
    } else {
        camposValidos = true;
    }

    return camposValidos;
}

function validarUsuarioEditado(usuario) {

    let camposValidos = false;

    if (usuario.name == '') {
        alert('Nombre incorrecto');
    } else if (usuario.lastname == '') {
        alert('Apellidos incorrectos');
    } else if (usuario.email == '') {
        alert('email incorrecto');
    } else {
        camposValidos = true;
    }

    return camposValidos;
}


async function guardarUsuario(usuario) {
    await fetch('http://localhost:3000/api/users/sign-up', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
    }).then(response => response.json())
        .then(response => {
            console.log(response.user);
            console.log('Usuario guardado correctamente');
            alert('Usuario guardado correctamente');
            limpiarTblUsuarios();
            cargarUsuarios('name', 'ASC', filasPg.value);
            /*opacity: 0;
    pointer-events: none;*/
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando usuario');
        });
}

async function guardarCambiosUsuario(usuario) {
    await fetch(`http://localhost:3000/api/users/${idUsuarioEdicion}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
    }).then(response => response.json())
        .then(response => {
            console.log(response.user);
            console.log('Cambios guardados correctamente');
            alert('Cambios guardados correctamente');
            limpiarTblUsuarios();
            cargarUsuarios('name', 'ASC', filasPg.value);
            /*opacity: 0;
    pointer-events: none;*/
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Error guardando cambios');
        });
}

async function buscarUsuarios(txtBuscar) {
    let usuarios = [];

    await fetch(`http://localhost:3000/api/users/?name=${txtBuscar}&limit=10&sort=names`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json())
        .then(response => {
            console.log(response.doc);
            usuarios = response.doc;
            limpiarTblUsuarios();
            usuarios.forEach(usuario => {
                console.log('usurio', usuario.name);
                mostrarUsuarios(usuario);
            });

        })
        .catch(error => {

            console.error('Error:', error);

        });

}

///////////////////eventos

btnGuardarUsuario.addEventListener('click', e => {
    let usuario = {};

    usuario.name = document.getElementById('nombre').value;
    usuario.lastname = document.getElementById('apellidos').value;
    usuario.email = document.getElementById('email').value;
    usuario.role = document.getElementById('perfil').value;

    if (btnGuardarUsuario.value == 'Guardar Usuario') {
        usuario.password = document.getElementById('password').value;
        usuario.passwordConfirm = document.getElementById('password2').value;
        if (validarUsuario(usuario)) {
            guardarUsuario(usuario);
        }
    } else {
        if (validarUsuarioEditado(usuario)) {
            guardarCambiosUsuario(usuario);
        }
    }

})

btnBuscar.addEventListener('click', e => {
    txtBuscar = document.getElementById('txt-buscar').value;

    if (txtBuscar == '') {
        alert('Por favor ingrese el nombre a buscar');
    }
    else {
        buscarUsuarios(txtBuscar);
    }
});

filasPg.addEventListener('change', e => {
    limpiarTblUsuarios();
    cargarUsuarios('name', 'ASC', filasPg.value);
})

/////////////////////////////////////////////////////

crearEncabezado();
cargarUsuarios('name', 'ASC', '10');