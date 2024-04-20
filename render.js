const axios = require('axios');
const sql = require('mssql');
const fs = require('fs');
const qs = require('qs');

const configFile = fs.readFileSync('config.json');
const config = JSON.parse(configFile);

const configdb = {
    user: config.dbConfig.user,
    password: config.dbConfig.password,
    server: config.dbConfig.server,
    database: config.dbConfig.database,
    port: config.dbConfig.port > 0 ? config.dbConfig.port : undefined,
    options: {
        encrypt: false,
        trustServerCertificate: true, // Solo para pruebas
        enableArithAbort: true
    }
};

async function initializeDatabase() {
    try {
        await sql.connect(configdb);
        console.log('Conexión a la base de datos establecida');
    } catch (err) {
        console.error('Error al conectar con la base de datos:', err);
    }
}

initializeDatabase();

let keepRunning = false;
async function fetchAndProcess() {
    while (keepRunning) {
        try {
            const result = await sql.query`EXEC [ProcesaComandosDesemax]`;
            const rows = result.recordset;
            if (rows.length > 0) {
                await processRows(rows);
            } else {
                await new Promise(resolve => setTimeout(resolve, 60000)); // Espera un minuto
            }
        } catch (err) {
            console.error('Error en procesamiento:', err);
        }
    }
}

async function processRows(rows) {
    for (const row of rows) {
        if (row.Comando === 'activar') {
            await activateCommand(row);
        } else if (row.Comando === 'suspender') {
            await suspenderCommand(row);
        } else if (row.Comando === 'reactivar') {
            await reactivarCommand(row);
        }else if (row.Comando === 'borrar' || row.Comando === 'borrartodo') {
            await borrarCommand(row);
        }
        
    }
}
//------------------------------- ACTIVAR --------------------------------------------------------------------
async function activateCommand(row) {
    const data = qs.stringify({
        data: '{"username":"test_softtv", "password": "grcirck52sxca"}'
    });
    const config3 = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    };

    try {
        const response = await axios.post(`${config.apiBaseUrl2}/login`, data, config3);
        console.log('respuesta:', response.data);
        if (response.status === 200) {
            const auth = 'auth=' + response.data.auth;
            
            const config4 = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    //  'Cookie': auth
                },
                withCredentials: true
            };
            console.log(config4)
            await createCustomer(row, config4);
        }
    } catch (error) {
        console.error('Error en la activación:', error);
    }
}

async function createCustomer(row, config4) {
    const data2 = qs.stringify({
        data: `{"id": ${row.Contrato}, "last_name": "${row.Apellido_Paterno}", "first_name": "${row.Nombre}", "external_id": "${row.Contrato}", "address_floor": "", "comment": "Creado"}`
    });

    try {
        const response = await axios.post(`${config.apiBaseUrl2}/customers`, data2, config4);
        if (response.status === 201) {
            await sql.query`EXEC [AddRelCustomerContratoDesemax] ${row.Contrato}`;
            await CrearMac(row,config4)
        }
    } catch (error) {
        console.error('Error al crear cliente:', error);
    }
}
async function CrearMac (row, config4) {
    const data2 = qs.stringify({
        data: `{"mac_address":"${row.MacAddress}","type":"GPON", "customer_id": ${row.Contrato}}`
    });

    try {
        const response = await axios.post(`${config.apiBaseUrl2}/MacAddress`, data2, config4);
        if (response.status === 201) {
            await CrearAccount(row,config4)
        }
    } catch (error) {
        console.error('Error al crear cliente:', error);
    }
}
async function CrearAccount(row, config4){
    const data2 = qs.stringify({
        data: `{"username":"${row.Contrato}","password":"${row.Contrato}","net":"${row.idNet}","profile":${row.profile_id},"enabled":true,"billable":true,"customer":${row.Contrato}}`
    });

    try {
        const response = await axios.post(`${config.apiBaseUrl2}/accounts`, data2, config4);
        if (response.status === 201) {
            const resultado = await sql.query`EXEC [AddAccountDesemax] ${row.Contrato}, ${row.Contrato}, ${response.data.id}, ${row.Contrato}, ${row.Contrato}, ${row.idNet}, ${row.profile_id}`;
            const rows2 = resultado.recordset;
            if (rows2.length > 0 && rows2[0].resultado === 1) {  // Asegurarse de acceder correctamente al resultado.
                await sql.query`EXEC [ModificaComandoDesemax] '', 'Cliente Activado', '${row.MacAddress}', ${row.Consecutivo}`;
            } else {
                console.log('Operación no realizada'); // Usar console.log o console.error según el caso.
            }
        }
    } catch (error) {
        console.error('Error al crear cuenta:', error);
    }
}
//------------------------------- FIN ACTIVAR --------------------------------------------------------------------

//------------------------------- INICIO SUSPENDER -----------------------------------------------------------------------
async function suspenderCommand(row) {
    const data = qs.stringify({
        data: '{"username":"test_softtv", "password": "grcirck52sxca"}'
    });
    const config3 = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    };

    try {
        const response = await axios.post(`${config.apiBaseUrl2}/login`, data, config3);
        console.log('respuesta:', response.data);
        if (response.status === 200) {
            const auth = 'auth=' + response.data.auth;
            
            const config4 = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    //  'Cookie': auth
                },
                withCredentials: true
            };
            console.log(config4)
            await accountSuspender(row, config4);
        }
    } catch (error) {
        console.error('Error en la activación:', error);
    }
}

async function accountSuspender(row, config4){
    const data2 = qs.stringify({
        data: `{"id":${row.account_id},"enabled":false}`
    });

    try {
        const response = await axios.put(`${config.apiBaseUrl2}/accounts`, data2, config4);
        if (response.status === 201) {
             await sql.query`EXEC [UpdateAccountDesemax] ${row.account_id}, 0, 0, 0,0, 0, 0,1`;
            // const rows2 = resultado.recordset;
            // if (rows2.length > 0 && rows2[0].resultado === 1) {  // Asegurarse de acceder correctamente al resultado.
            //     await sql.query`EXEC [ModificaComandoDesemax] '', 'Cliente Activado', '${row.MacAddress}', ${row.Consecutivo}`;
            // } else {
            //     console.log('Operación no realizada'); // Usar console.log o console.error según el caso.
            // }
        }
    } catch (error) {
        console.error('Error al suspender cuenta:', error);
    }
}
//------------------------------- FIN SUSPENDER --------------------------------------------------------------------------------------------------

// ------------------------------ INICIO reactivarCommand ---------------------------------------------------------------------------------------------
async function reactivarCommand(row) {
    const data = qs.stringify({
        data: '{"username":"test_softtv", "password": "grcirck52sxca"}'
    });
    const config3 = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    };

    try {
        const response = await axios.post(`${config.apiBaseUrl2}/login`, data, config3);
        console.log('respuesta:', response.data);
        if (response.status === 200) {
            const auth = 'auth=' + response.data.auth;
            
            const config4 = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    //  'Cookie': auth
                },
                withCredentials: true
            };
            console.log(config4)
            await accountReactivar(row, config4);
        }
    } catch (error) {
        console.error('Error en la activación:', error);
    }
}

async function accountReactivar(row, config4){
    const data2 = qs.stringify({
        data: `{"id":${row.account_id},"enabled":true}`
    });

    try {
        const response = await axios.put(`${config.apiBaseUrl2}/accounts`, data2, config4);
        if (response.status === 201) {
            await sql.query`EXEC [UpdateAccountDesemax] ${row.account_id}, 0, 0, 0,0, 0, 1,1`;
            // const rows2 = resultado.recordset;
            // if (rows2.length > 0 && rows2[0].resultado === 1) {  // Asegurarse de acceder correctamente al resultado.
            //     await sql.query`EXEC [ModificaComandoDesemax] '', 'Cliente Activado', '${row.MacAddress}', ${row.Consecutivo}`;
            // } else {
            //     console.log('Operación no realizada'); // Usar console.log o console.error según el caso.
            // }
        }
    } catch (error) {
        console.error('Error al reactivar cuenta:', error);
    }
}

// ------------------------------ FIN reactivarCommand ---------------------------------------------------------------------------------------------

// ------------------------------ INICIO Borrar ---------------------------------------------------------------------------------------------
async function suspenderCommand(row) {
    const data = qs.stringify({
        data: '{"username":"test_softtv", "password": "grcirck52sxca"}'
    });
    const config3 = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    };

    try {
        const response = await axios.post(`${config.apiBaseUrl2}/login`, data, config3);
        console.log('respuesta:', response.data);
        if (response.status === 200) {
            const auth = 'auth=' + response.data.auth;
            
            const config4 = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    //  'Cookie': auth
                },
                withCredentials: true
            };
            console.log(config4)
            await accountSuspender(row, config4);
        }
    } catch (error) {
        console.error('Error en la activación:', error);
    }
}

async function accountSuspender(row, config4){
    const data2 = qs.stringify({
        data: `{"id":${row.account_id},"enabled":false}`
    });

    try {
        const response = await axios.put(`${config.apiBaseUrl2}/accounts`, data2, config4);
        if (response.status === 201) {
            const resultado = await sql.query`EXEC [UpdateAccountDesemax] ${row.account_id}, 0, 0, 0,0, 0, 0,1`;
            // const rows2 = resultado.recordset;
            // if (rows2.length > 0 && rows2[0].resultado === 1) {  // Asegurarse de acceder correctamente al resultado.
            //     await sql.query`EXEC [ModificaComandoDesemax] '', 'Cliente Activado', '${row.MacAddress}', ${row.Consecutivo}`;
            // } else {
            //     console.log('Operación no realizada'); // Usar console.log o console.error según el caso.
            // }
        }
    } catch (error) {
        console.error('Error al crear cuenta:', error);
    }
}

// ------------------------------ FIN BORRAR ---------------------------------------------------------------------------------------------

// ------------------------------ INICIO COMPAQ ---------------------------------------------------------------------------------------------


// ------------------------------ FIN COMPAQ ---------------------------------------------------------------------------------------------




document.getElementById('start').addEventListener('click', () => {
    keepRunning = true;
    fetchAndProcess();

});

document.getElementById('stop').addEventListener('click', () => {
    keepRunning = false;
});
