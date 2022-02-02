//variables globales

//Referencias a HTML
const btnIngreso = document.getElementById('btn-ingreso');

//
async function ingresar(usuario, password) {
    let data = {};
    let user;
    data.email = usuario;
    data.password = password;

    console.log(data);
    const request = await fetch('http://localhost:3000/api/users/sign-in', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            //,'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImFkbWluIiwiZnVsbG5hbWUiOiJhZG1pbmlzdHJhdG9yIiwicGhvbmUiOjM0NTY3ODksImFkZHJlc3MiOiJjYWxsZSAxMjMiLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNjQzNDE3NTYyLCJleHAiOjE2NDM1MDM5NjJ9.a8BXoa32XK6UTbnZ7y19cXj4QtfW51R7Hg8PFCK8ais';
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(response => {
            user = response;
            console.log('response', response);
            //almacenar datos en localstorage
            //redirigir a contactos
            window.location.href = "contactos.html";
        })
        .catch(error => {

            console.error('Error:', error);
            alert('Usuario o contraseña incorrecto');
        });
    //const user = await request.json();


    console.log('user', user);
    if (!user) {
        console.log('ingreso');
        return;
    }
}

//eventos
btnIngreso.addEventListener('click', e => {
    const usuario = document.getElementById('usuario');
    const password = document.getElementById('password');

    console.log('usuario', usuario.value);
    if (usuario.value == '' || password.value == '') {
        alert('Usuario o contraseña incorrecto');
        return 0;
    }

    //validar correo
    //registro

    ingresar(usuario.value, password.value);

})