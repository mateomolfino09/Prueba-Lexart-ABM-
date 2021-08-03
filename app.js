const API_URL = 'https://crudcrud.com/api/f9f1e2130bb449daaedf5ccc13ba4651'
const boton = document.getElementById('btn')

let formulario = document.getElementById('formulario');
const table = document.getElementById('data-table');
let datos = new FormData(formulario) 

let clientes = [] ;

formulario.addEventListener('submit', function(e){
    e.preventDefault() ;
    let client = {
        nombre: document.getElementById('nombres').value ,
        apellidos : document.getElementById('apellidos').value ,
        rut : document.getElementById('rut').value ,
        tipo : document.getElementById('tipo').value ,
        telefono : document.getElementById('telefono').value  ,
        activo : document.getElementById('activo').value ,
        id_: document.getElementById('_id').value
    }
    let clientJSON = JSON.stringify(client) ;
    //enviar a API //Error CORS
     fetch(`${API_URL}`, {
         method: 'POST',
         body: clientJSON ,
         mode: "cors" ,
         headers: {
        'Access-Control-Allow-Origin': '*' ,
        'Content-type': 'application/json' ,
        "Access-Control-Allow-Headers" : "Access-Control-Allow-Origin",
        "Access-Control-Request-Headers" : 'access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin' ,
        "Access-Control-Allow-Origin" : "*" ,
        "Access-Control-Allow-Credentials" : "true" ,
        "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS" ,
  }
     })  

clientes.push(client) ;
let inputs = document.querySelectorAll('input') ;    

  function selectedRowtoInput() {
    let rIndex ;
    for(let i=0; i<table.rows.length; i++) {
     table.rows[i].onclick = function() {
       rIndex = this.rowIndex ;
       document.getElementById('_id').value = this.cells[0].innerHTML ;
       document.getElementById('nombres').value = this.cells[1].innerHTML ;
       document.getElementById('apellidos').value = this.cells[2].innerHTML ;
       document.getElementById('rut').value = this.cells[3].innerHTML ;
       document.getElementById('tipo').value = this.cells[4].innerHTML ;
       document.getElementById('telefono').value = this.cells[5].innerHTML ;
       document.getElementById('activo').value = this.cells[6].innerHTML ;
       table.rows[rIndex].remove()
     }
    }
    boton.textContent = 'Editar' ;

  } 
  //RowToInputConGet(id) //alternativa boton select con GET desde la API
   

  function crearNuevaFila (client) {
    let tableref = document.getElementById("data-table") ;
    let nuevafila = tableref.insertRow(-1) ;
  
    //contenido celdas generadas
    let nuevacelda = nuevafila.insertCell(0) ;
    nuevacelda.textContent= client.id_ ;

    nuevacelda = nuevafila.insertCell(1) ;
    nuevacelda.textContent= client.nombre ;

    nuevacelda = nuevafila.insertCell(2) ;
    nuevacelda.textContent= client.apellidos ;

    nuevacelda= nuevafila.insertCell(3) ;
    nuevacelda.textContent= client.rut ;

    nuevacelda = nuevafila.insertCell(4) ;
    nuevacelda.textContent= client.tipo ;

    nuevacelda = nuevafila.insertCell(5) ;
    nuevacelda.textContent= client.telefono ;

    nuevacelda = nuevafila.insertCell(6) ;
    nuevacelda.textContent = client.activo ;

    //boton eliminar
    let nuevaceldaeliminar = nuevafila.insertCell(7) ;
    let deleteButton = document.createElement('button') ;
    deleteButton.textContent = 'Delete' ;
    deleteButton.style.background= '#1f53c5';
    nuevaceldaeliminar.appendChild(deleteButton) ;

    deleteButton.addEventListener('click',(event) => {
      rIndex = event.target.parentNode.parentNode.rowIndex
      let id = clientes[rIndex - 1].id_
      //deleteFromAPI(id)  //Eliminar de la API 
      event.target.parentNode.parentNode.remove()
    } )

    //boton seleccionar
    let nuevaceldaseleccionar = nuevafila.insertCell(8) ;
    let selectButton = document.createElement('button') ;
    selectButton.textContent ='Select' ;
    selectButton.style.background= '#1f53c5';
    
    nuevaceldaseleccionar.appendChild(selectButton) ;

    selectButton.addEventListener('click', (event) => {
      rIndex = event.target.parentNode.parentNode.rowIndex
      let id = clientes[rIndex - 1].id_
      selectedRowtoInput() ;
      //RowToInputConGet(id) //Alternativa con GET mas abajo
    })
  }
  if (boton.textContent === 'Registrar Cliente') {
  crearNuevaFila(client) ;
  }
  else {
  //El if estaba para verificar si editamos al cliente o lo registramos
  //editarFila(idfetch) //Alternativa con PUT mas abajo
  crearNuevaFila(client) //creamos para dejarlo funcional mientras no funciona la API
  }
  inputs.forEach(input => input.value = '') ;
})

//Alternativas y extras con la API

// editar 
 function editarFila(idfetch) {
   let j=0 ;
   while (idfetch != clientes[j]._id) {
     j++
   }
   let cliente = clientes[j] ;
   cliente.nombre = document.getElementById('nombres').value ,
   cliente.apellidos = document.getElementById('apellidos').value ,
   cliente.rut = document.getElementById('rut').value ,
   cliente.tipo = document.getElementById('tipo').value ,
   cliente.telefono = document.getElementById('telefono').value  ,
   cliente.activo = document.getElementById('activo').value ,
   crearNuevaFila(cliente) ;
   fetch(`${API_URL}/${idfetch}`, {
     method: 'PUT' ,
     headers: {

     } ,
     body: JSON.stringify(cliente)
   })
   .then(res => res.json()) 
   boton.textContent = 'Registrar Cliente'
 }

 // agregar clientes registrados a lista
 function clientesRegistrados() {
   fetch(API_URL) 
    .then(res => res.json())
    .then(data => { //hay que ver si ya es el objeto, sino lo hacemos
      data.forEach(item => {
        itemp = json.parse(item)
        crearNuevaFila(itemp) //creamos una fila con los clientes ya registrados
      })
    })
 }
 //clientesRegistrados()

//Eliminar de base de datos
 function deleteFromAPI(id) {
  fetch(`${API_URL}/${id}`,{
   method : 'DELETE' ,
  })
  .then(res => res.json())
  .then(() => location.reload())
}


//Pasar el elemento a el formulario para poder editarlo
function RowToInputConGet(id) {
  fetch(API_URL)
    .then(res => res.json()) 
    .then(data => {   //habria que ver si data es un cliente o todos los clientes registrados
      data.forEach(cliente)  //suponiendo que es todos
      if (cliente.id_ === id) { //si cumple lo mandamos al formulario
       document.getElementById('_id').value = cliente.id_;
       document.getElementById('nombres').value = cliente.nombre ;
       document.getElementById('apellidos').value = cliente.apellidos ;
       document.getElementById('rut').value = cliente.rut;
       document.getElementById('tipo').value = cliente.tipo ;
       document.getElementById('telefono').value = cliente.tel ;
       document.getElementById('activo').value = cliente.activo ;
      }
      boton.textContent('Editar')
    })

}
