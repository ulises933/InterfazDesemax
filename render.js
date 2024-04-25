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

// initializeDatabase();

let sessionId = 'sin sesion';
// BOTON DE LOGIN
document.getElementById("login").addEventListener('click',()=>{
    const arg ={
        apiToken:"uQPfdaqNgZkCnAFjORIg",
        login:"vcn_test",
        password:"Yabnet2024!"
    }
    url = config.soapUrl;
    try{
        soap.createClient(url,function(err,cliente){
            if(err) console.log("vamos mal",err);
            cliente.cvLogin(arg,function(err, result){
                if(err) console.log(err);
                sessionId= result.return.$value
                console.log(sessionId)
                // Verificar si el inicio de sesión fue exitoso
                if (sessionId) {
                    // Si es exitoso, mostrar los botones
                     document.getElementById("botones").style.display = 'block';
                      // Y ocultar el div de login
                  document.querySelector('.ring').style.display = 'none';
                }


            })
        })
    }catch(err){
        console.log('no jalo', err)
    }
    
})

// Ocultar los botones al inicio
document.getElementById("botones").style.display = 'none';
// Asegurarse de que el div de login esté visible al inicio
//document.querySelector('.ring').style.display = 'block';

// BOTON DE smartcardlist
document.getElementById("smartcardlist").addEventListener('click',()=>{
    console.log("boton smart sesionid:",sessionId)
    const arg ={
        sessionId:sessionId,
        mode:"",
        offset:1,
        limit:10,
        orderBy:"sn",
        orderDir:"ASC",
        filters:""
    }
    url = config.soapUrl;
    try{
        soap.createClient(url,function(err,cliente){
            if(err) console.log("vamos mal",err);
            cliente.cvGetListOfSmartcards(arg,function(err, result){
                if(err) console.log(err);
                console.log(result)
            })
        })
    }catch(err){
        console.log('no jalo', err)
    }
    
})

//Boton de Activar
document.getElementById("activar").addEventListener('click',()=>{
        comandoActivar()  
    
})
async function comandoActivar(){
    try{
        await cvAddSubscriber()
    }catch(err){
        console.log("no jalo",err)
    }
}
async function cvAddSubscriber(){
    const args ={
        sessionId:sessionId,
        subscriber:{
            code:"101010",
            hcId:"10101010",
            supervisor:"Lalo",
            lastName:"Garza",
            firstName:"Lalo",
            comment:"Esto es una prueba",
            technicalNotes:null,
            countryCode:"US",
            contacts:{
                contactId:101010,
                type:"email",
                isBusiness:false,
                contact:"admin@gmail.com"
            }

        }


    }  
    url = config.soapUrl;
    try{
        soap.createClient(url,function(err,cliente){
            if(err) console.log("vamos mal",err);
            cliente.cvAddSubscriber(args,function(err, result){
                if(err) console.log(err);
                console.log(result)
            })
        })
    }catch(err){
        console.log('paso 1', err)
    }
}
// Botón de reactivar
document.getElementById("Reactivar").addEventListener('click', () => {
    const arg = {
        sessionId: sessionId,
        smartcardId: "101010"
    };
    url = config.soapUrl;

    try {
        soap.createClient(url, function(err, cliente) {
            if (err) {
                console.error("Error al crear el cliente SOAP:", err);
                return;
            }
            cliente.cvEnableSmartcard(arg, function(err, result) {
                if (err) {
                    console.error("Error al llamar a cvEnableSmartcard:", err);
                } else {
                    console.log("Resultado de cvEnableSmartcard:", result.return.$value);
                }
            });
        });
    } catch (err) {
        console.error('Error al ejecutar el cliente SOAP:', err);
    }
});

// Botón de borrar todo
document.getElementById("Borrar_todo").addEventListener('click', () => {
    comandoBorrar()
});

async function comandoBorrar(){
    try{
        await cvAddSubscriber()
    }catch(err){
        console.log("no jalo",err)
    }
}
async function cvAddSubscriber(){
    const arg = {
        sessionId: sessionId,
        smartcardId: "101010"
    };
    url = config.soapUrl;

    try {
        soap.createClient(url, function(err, cliente) {
            if (err) {
                console.error("Error al crear el cliente SOAP:", err);
                return;
            }
            cliente.cvRemoveSmartcardFromSubscriber(arg, function(err, result) {
                if (err) {
                    console.error("Error al llamar a cvRemoveSmartcardFromSubscriber:", err);
                } else {
                    console.log("Resultado de cvRemoveSmartcardFromSubscriber:", result.return.$value);
                    cvDeleteSubscriber()
                }
            });
        });
    } catch (err) {
        console.error('Error al ejecutar el cliente SOAP:', err);
    }
}

async function cvDeleteSubscriber(){
    const arg = {
        sessionId: sessionId,
        code: "codigo_del_suscriptor"
    };
    url = config.soapUrl;

    try {
        soap.createClient(url, function(err, cliente) {
            if (err) {
                console.error("Error al crear el cliente SOAP:", err);
                return;
            }
            cliente.cvDeleteSubscriber(arg, function(err, result) {
                if (err) {
                    console.error("Error al llamar a cvDeleteSubscriber:", err);
                } else {
                    console.log("Resultado de cvDeleteSubscriber:", result.return.$value);
                }
            });
        });
    } catch (err) {
        console.error('Error al ejecutar el cliente SOAP:', err);
    }
}


//Boton de suspender
document.getElementById("suspender").addEventListener('click', () => {
    const arg = {
        sessionId: sessionId,
        smartcardId: "10101010"
    };
    url = config.soapUrl;

    try {
        soap.createClient(url, function(err, cliente) {
            if (err) {
                console.error("Error al crear el cliente SOAP:", err);
                return;
            }
            cliente.cvDisableSmartcard(arg, function(err, result) {
                if (err) {
                    console.error("Error al llamar a cvDisableSmartcard:", err);
                } else {
                    console.log("Resultado de cvDisableSmartcard:", result.return.$value);
                }
            });
        });
    } catch (err) {
        console.error('Error al ejecutar el cliente SOAP:', err);
    }
});

//Boton de Campaq
document.getElementById("campaq").addEventListener('click',()=>{
    const arg ={
        apiToken:"uQPfdaqNgZkCnAFjORIg",
        login:"vcn_test",
        password:"Yabnet2024!"
    }
    url = config.soapUrl;
    try{
        soap.createClient(url,function(err,cliente){
            if(err) console.log("vamos mal",err);
            cliente.cvLogin(arg,function(err, result){
                if(err) console.log(err);
                console.log(result.return.$value)
            })
        })
    }catch(err){
        console.log('no jalo', err)
    }
    
})
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
            
        }else if(row.Comando === 'campaq'){
            await CompaqCommand(row)
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
        if (response.status === 200) {
             await sql.query`EXEC [UpdateAccountDesemax] ${row.account_id}, 0, 0, 0,0, 0, 0,1`;
             await sql.query`EXEC [ModificaComandoDesemax] '', 'Cliente Suspendido', '${row.MacAddress}', ${row.Consecutivo}`;
            
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
        if (response.status === 200) {
            await sql.query`EXEC [UpdateAccountDesemax] ${row.account_id}, 0, 0, 0,0, 0, 1,1`;
                await sql.query`EXEC [ModificaComandoDesemax] '', 'Cliente Reactivado', '${row.MacAddress}', ${row.Consecutivo}`;
            
        }
    } catch (error) {
        console.error('Error al reactivar cuenta:', error);
    }
}

// ------------------------------ FIN reactivarCommand ---------------------------------------------------------------------------------------------

// ------------------------------ INICIO Borrar ---------------------------------------------------------------------------------------------
async function borrarCommand(row) {
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
            await QuitarMac(row, config4);
        }
    } catch (error) {
        console.error('Error en la activación:', error);
    }
}

async function accountBorrar(row, config4){
    const data2 = qs.stringify({
        data: `{"id":${row.account_id},"enabled":false}`
    });

    try {
        const response = await axios.delete(`${config.apiBaseUrl2}/accounts/${row.account_id}`, config4);
        if (response.status === 200) {
            
            const resultado=await sql.query`EXEC [UpdateAccountDesemax] ${row.account_id}, 0, 0, 0,0, 0, 0,3`;
               await sql.query`EXEC [ModificaComandoDesemax] '', 'Cliente Borrado', '${row.MacAddress}', ${row.Consecutivo}`;
            
        }
    } catch (error) {
        console.error('Error al crear cuenta:', error);
    }
}
async function QuitarMac(row, config4){
    const data2 = qs.stringify({
        data: `{"mac_address":"${row.MacAddress}","customer":null}`
    });

    try {
        const response = await axios.put(`${config.apiBaseUrl2}/MacAddress`, data2,config4);
        if (response.status === 200) {
            console.log('si jala')
            accountBorrar(row, config4)

        }
    } catch (error) {
        console.error('Error al crear cuenta:', error);
    }

}

// ------------------------------ FIN BORRAR ---------------------------------------------------------------------------------------------

// ------------------------------ INICIO COMPAQ ---------------------------------------------------------------------------------------------
async function CompaqCommand(row) {
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
            await accountCompaq(row, config4);
        }
    } catch (error) {
        console.error('Error en la activación:', error);
    }
}

async function accountCompaq(row, config4){
    const data2 = qs.stringify({
        data: `{"id":${row.account_id},"enabled":true, "profile":${row.profile_id}, "net":${row.idNet}}`
    });

    try {
        const response = await axios.put(`${config.apiBaseUrl2}/accounts`, data2, config4);
        if (response.status === 200) {
            await sql.query`EXEC [UpdateAccountDesemax] ${row.account_id}, 0, 0, 0,${row.idNet}, ${row.profile_id}, 1,2`;
                await sql.query`EXEC [ModificaComandoDesemax] '', 'Compaq Exitoso', '${row.MacAddress}', ${row.Consecutivo}`;
            
        }
    } catch (error) {
        console.error('Error al reactivar cuenta:', error);
    }
}

// ------------------------------ FIN COMPAQ ---------------------------------------------------------------------------------------------




document.getElementById('start').addEventListener('click', () => {
    keepRunning = true;
    fetchAndProcess();

});

document.getElementById('stop').addEventListener('click', () => {
    keepRunning = false;
});
