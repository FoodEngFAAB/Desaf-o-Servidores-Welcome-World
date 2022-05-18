const http = require('http')
const url = require('url')
const fs = require('fs')

//Agrega la fecha actual al comienzo del contenido de cada archivo creado en formato “dd/mm/yyyy”.
//Considera que si el día o el mes es menor a 10 concatenar un “0” a la izquierda.
//Considera que si el día o el mes es menor a 10 concatenar un “0” a la izquierda.

let day = new Date().getDate()
let month = new Date().getMonth() + 1
let year = new Date().getFullYear()

if (day < 10) {
    day = `0${day}`
}
if (month < 10) {
    month = `0${month}`
}


let updatedDate = (`${day}/${month}/${year}`)

//Crear servidor en Node con módulo http
http.createServer(function (req, res) {

    //Almacena en una constante los parámetros recibidos por cliente haciendo uso del método parse y propiedad query del módulo url
    const parameters = url.parse(req.url, true).query;
    const file = parameters.archivo;
    const content = parameters.contenido;
    const name = parameters.nombre;
    const newName = parameters.nuevoNombre;

    //Disponibilizar una ruta para crear un archivo a partir de los parámetros de la consulta recibida.
    //Se hace uso del método writeFile del File System usando parámetros de la url (file y )
    if (req.url.includes(`/crear`)) {
        fs.writeFile(file, `${updatedDate}\n${content}`, "utf8", (error) => {

            //Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.
            if (error) {
                res.write(`Ups! Lo siento, he cometido un error al crear el archivo.\nError: ${error}.`)
            } else {
                res.write(`El archivo ${file} fue creado exitosamente.`)
            }
            res.end()
        })
    }

    //Disponibilizar una ruta para devolver el contenido de un archivo cuyo nombre es declarado en los parámetros de la consulta recibida.
    //Se hace uso del método readFile del File System para recuperar el contenido
    if (req.url.includes(`/leer`)) {
        fs.readFile(file, "utf8", (error, data) => {
            //Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.            
            if (error) {
                res.write(`Ups! Lo siento, ha habido  un error al leer el archivo: ${file}.\nDeberé volver a primero básico.\nError: ${error}.`)
            } else {
                res.write(`EL archivo ${file} fue leído exitosamente.\nEl contenido es:\n`)
                res.write(data)
            }
            res.end()
        })
    }

    //Disponibilizar una ruta para renombrar un archivo, cuyo nombre y nuevo nombre es declarado en los parámetros de la consulta recibida.
    //Se hace uso del método rename del File System
    if (req.url.includes(`/renombrar`)) {
        fs.rename(name, newName, (error, data) => {
            //Devolver un mensaje declarando el éxito o fracaso de lo solicitado en cada consulta recibida.            
            if (error) {
                res.write(`Ups! Lo siento, ha habido un error al renombrar el archivo: ${name}.\nError: ${error}.`)
            } else {
                res.write(`Se ha renombrado exitosamente el archivo ${name}.\nEl archivo ahora se llama ${newName}.`)
            }
            res.end()
        })
    }

    //Disponibilizar una ruta para eliminar un archivo, cuyo nombre es declarado en los parámetros de la consulta recibida.
    //Se hace uso del método unLink del File System
    if (req.url.includes(`/eliminar`)) {
        setTimeout(() => {
            fs.unlink(file, (error, data) => {
                if (error) {
                    res.write(`Ups! Lo siento, ha habido un error al eliminar el archivo ${file}.\nError: ${error}.`)
                } else {
                    res.write(`El archivo ${file} fue eliminado exitosamente.`)
                }
            })
        }, 3000)
    }
}).listen(8080, () => console.log('Escuchando el puerto 8080'))