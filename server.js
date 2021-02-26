const express=require('express');
const Web3 = require('web3');
const morgan = require('morgan'); // Mostrar peticiones por consola
const app=express();

app.set('port', process.env.PORT || 5000);


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false})); // Aceptar desde los forms los datos que envía el usuaio


// Globals Variables
app.use((req, res, next) => {
	// Habilito el acceso desde otras IPS	
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Credentials", "*");
  	res.header("Access-Control-Allow-Headers", "*");
	next();
});

app.get('/search', (req, res) => {
	var web3 = new Web3(Web3.givenProvider || "http://10.10.0.7:8545"); // Setear la IP:PUERTO donde esta escuchando el nodo de Blockchain
	const search = req.query.search;
	console.log("Buscar:",req.query.search);
  try{
  	web3.eth.getBlock(search, function (error, block) {

              if(error){
                console.log(error);              
              }

              try{
                  // Si encontró el bloque, lo retorna
                  if(block){            	
                    res.json({block});
                  } else {
                  	//Si no, pruebo a buscar la tx
                    var tx = web3.eth.getTransaction(search, function (error, tx) {

                      if(error){
                        console.log(error);                  
                      }

                      // Si encontró la TX, la retorna
      	            res.json({tx});  
      	             });
                  }
              }catch(error) {
                res.json({});                     
                // expected output: ReferenceError: nonExistentFunction is not defined
                // Note - error messages will vary depending on browser
              }
            
          });

    }catch(error) {
        res.json({});                     
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
      }
  	
  });

const http = require('http').Server(app);

// Inicio del Servidor
http.listen(app.get('port') ,() => {
	console.log("Servidor iniciado en ", app.get('ip'), app.get('port'));
});
