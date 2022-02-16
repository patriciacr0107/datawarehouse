let token = localStorage.getItem("key");

function mostrarCiudades(err, ciudades) {
    console.log('las ciudades son ', ciudades);
}

function buscarCiudades(err, paises, callback) {

    paises.forEach(pais => {
        if (pais.id != '') {
            fetch(`http://localhost:3000/api/cities/?country=${pais.id}&sort=name`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => response.json())
                .then(response => {
                    //ciudades = response.doc;
                    let ciudades = [];

                    if (response.doc.length < 1) {
                        let ciudad = {};
                        ciudad.name = '';
                        ciudad.id = '';
                        ciudad.region = pais.regionName;
                        ciudad.regionId = pais.regionId;
                        ciudad.pais = pais.name;
                        ciudad.paisId = pais.id;

                        ciudades.push(ciudad);
                    }

                    for (let item of response.doc) {
                        let ciudad = {};
                        ciudad.name = item.name;
                        ciudad.id = item._id;
                        ciudad.region = pais.regionName;
                        ciudad.regionId = pais.regionId;
                        ciudad.pais = pais.name;
                        ciudad.paisId = pais.id;

                        ciudades.push(ciudad);
                    }

                    //return ciudades;
                    callback(null, ciudades);

                })
                .catch(error => {

                    console.error('Error obteniendo datos de ciudades:', error);
                    //return 'error';

                });
        } else {
            let ciudades = [];
            let ciudad = {};
            ciudad.name = '';
            ciudad.id = '';
            ciudad.region = pais.regionName;
            ciudad.regionId = pais.regionId;
            ciudad.pais = pais.name;
            ciudad.paisId = pais.id;

            ciudades.push(ciudad);
            callback(null, ciudades);
        }

    })


}

function buscarPaises(regiones) {

    return regiones.forEach(region => {
        fetch(`http://localhost:3000/api/countries/?region=${region._id}&sort=name`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
            .then(response => {
                //console.log(response.doc);
                //paises = response.doc;
                let paises = [];

                if (response.doc.length < 1) {
                    let pais = {};
                    pais.name = '';
                    pais.regionId = region._id;
                    pais.regionName = region.name;
                    pais.id = '';

                    paises.push(pais);
                }

                response.doc.forEach(item => {
                    let pais = {};
                    pais.name = item.name;
                    pais.regionId = region._id;
                    pais.regionName = region.name;
                    pais.id = item._id;

                    paises.push(pais);


                    //console.log('Pais: ', pais.name);
                    //mostrarPais(pais);
                    //buscarCiudades(pais._id);
                });

                return pais
            })
            .catch(error => {

                console.error('Error obteniendo datos de paises:', error);
                //return 'Error';

            });

    })


}

function buscarRegiones(limite, orden) {
    return fetch(`http://localhost:3000/api/regions/?limit=${limite}&sort=${orden}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.json());

}


buscarRegiones(2, 'ASC').then(regiones => {
    buscarPaises(null, regiones.doc, buscarCiudades)
});