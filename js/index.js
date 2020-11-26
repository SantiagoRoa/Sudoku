//Se cargan tableros predeterminados
const facil = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const normal = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3---",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const dificil = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];
const limpio = [
    "---------------------------------------------------------------------------------",
    "---------------------------------------------------------------------------------"
];

var cronometro = null;
var inicio;
var hayDificultad = false;
var mSegundos = 0;
var errores = 0;
var numSeleccionado;
var celdaSeleccionada;
var desSeleccion;
var minutos;
var segundos;
var texto_minutos;
var texto_segundos;
var datos = [];


window.onload = function () { //Funciones a cargar después de la carga de la página
    generarTablero(limpio[0]);
    cargarCronometro();
    cargarBotones();
    cargarNumeros();
}

function cargarNumeros() { //Función que carga los números y asigna los eventos
    for (let i = 0; i < id("contenedor_num").children.length; i++) {
        id("contenedor_num").children[i].addEventListener("click", function () {
            // Seleccionar un número a la vez
            if (!desSeleccion && comprobarInicio() == true) {
                //Comprobar si número ya está seleccionado
                if (this.classList.contains("seleccionado")) {
                    this.classList.remove("seleccionado");
                    numSeleccionado = null;
                } else {
                    for (let i = 0; i < 9; i++) {
                        id("contenedor_num").children[i].classList.remove("seleccionado");
                    }
                    this.classList.add("seleccionado");
                    numSeleccionado = this;
                    actualizarMovimiento();
                }
            } else alert("Primero debe iniciar un nuevo juego!");
        });
    }
}

function cargarBotones() { //Función que asigna eventos a los botones
    //Se añade eventListener a cada boton
    id("boton_iniciar").addEventListener("click", iniciarJuego);
    id("boton_comprobar").addEventListener("click", comprobar);
    id("boton_limpiar").addEventListener("click", reestablecer);
    id("boton_reiniciar").addEventListener("click", reiniciar);
}

function cargarCronometro() { //Función que carga variables de cronómetro
    texto_minutos = id("t_minutos");
    minutos = Number(texto_minutos.innerHTML);
    texto_segundos = id("t_segundos");
    segundos = Number(texto_segundos.innerHTML);
}

function iniciarJuego() { //Función que iniciar una nueva partida
    //Se comprueba si un juego está en curso
    if (!comprobarInicio()) {
        inicio = true;
        //Se selecciona el tablero de acuerdo a la dificultad
        let tablero;
        if (id("dif_facil").checked) tablero = facil[0];
        else if (id("dif_normal").checked) tablero = normal[0];
        else tablero = dificil[0];
        hayDificultad = true;
        //Se crea el tablero
        generarTablero(tablero);
        //Se oculta el cambio de dificultad
        mostrarDificultad();
        //Se inicia el cronometro
        iniciarCronometro();
    } else alert("Seleccione la opción 'Reiniciar' para iniciar una nueva partida");
}

function comprobar() { //Función que comprueba si el tablero actual es igual a la solución
    validarSudoku();// Se recogen los números guardados en el sudoku
    //Se comprueba que exista una partida
    if (!comprobarInicio()) alert("Primero debe iniciar un nuevo juego!");
    else {
        //Se comprueba si la solución es válida
        if (datos == facil[1] || datos == normal[1] || datos == dificil[1]) {
            alert("Correcto, ha ganado!");
            inicio = false;
            detenerCronometro();
        } else {
            alert("Incorrecto, siga intentando");
            //Se registra un error
            if (id("dif_normal").checked || id("dif_dificil").checked) {
                errores++;
                actualizarErrores();
            }
        }
    }
}

function comprobarInicio() { //Función que comprueba si hay una partida en curso
    return inicio;
}

function actualizarErrores() {
    cambiarTexto("errores", errores);
}

function reiniciar() { //Función que reestablece el juego
    inicio = false;
    hayDificultad = false;
    errores = 0;
    datos = [];
    limpiarTablero();
    resetearCronometro();
    actualizarErrores();
    mostrarDificultad();
    generarTablero(limpio[0]);
}

function generarTablero(tablero) { //Función que crea el tablero
    //Se limpian los tableros
    limpiarTablero();
    //Crear tablero
    let idContador = 0;
    for (let i = 0; i < 81; i++) {
        //Crear una nueva etiqueta <p>
        let celda = document.createElement("p");
        //Revisa si la celda debe o no estar en blanco
        if (tablero.charAt(i) != "-") {
            //Añade la información correspondiente a la celda
            celda.textContent = tablero.charAt(i);
        } else {
            //Añadir eventListener a la celda
            celda.addEventListener("click", function () {
                //Si se puede seleccionar
                if (!desSeleccion && comprobarInicio() == true) {
                    //Si la celda ya está seleccionada
                    if (celda.classList.contains("seleccionado")) {
                        //Remover seleccion
                        celda.classList.remove("seleccionado");
                        celdaSeleccionada = null;
                    } else {
                        //Deseleccionar todas las otras celdas
                        for (let i = 0; i < 81; i++) {
                            qsa(".celda")[i].classList.remove("seleccionado");
                        }
                        //Añadir seleccion y actualizar la variable
                        celda.classList.add("seleccionado");
                        celdaSeleccionada = celda;
                        actualizarMovimiento();
                    }
                } else {
                    alert("Primero debe iniciar un nuevo juego!");
                }
            });
        }
        //Le asigna un id a la celda
        celda.id = idContador;
        //Pasa a la siguiente celda
        idContador++;
        //Añade clase celda a todas las celdas
        celda.classList.add("celda");
        //Se comprueba si la celda tiene frontera gruesa
        if ((celda.id > 17 && celda.id < 27) || (celda.id > 44 && celda.id < 54)) {
            celda.classList.add("borde_inferior");
        } if ((celda.id + 1) % 9 == 3 || (celda.id + 1) % 9 == 6) {
            celda.classList.add("borde_derecho");
        }
        //Se añade una celda al tablero
        id("tablero").appendChild(celda);
    }
}

function actualizarMovimiento() { //Función que comprueba y posiciona los números en la celda
    //Si una celda y número están seleciconados
    if (celdaSeleccionada && numSeleccionado) {
        // Poner el número seleccionado en la celda
        celdaSeleccionada.textContent = numSeleccionado.textContent;
        //Si la dificultad fácil está seleccionada
        if (id("dif_facil").checked) {
            asistirMovimiento();
        } else {
            //Deseleccionar la celda
            celdaSeleccionada.classList.remove("seleccionado");
            numSeleccionado.classList.remove("seleccionado");
            //Limpair las variables seleccionadas
            numSeleccionado = null;
            celdaSeleccionada = null;
        }
    }
}

function asistirMovimiento() { //Función que indica al usuario si un movimiento es incorrecto
    //Si el número corresponde a la solución
    if (comprobarCeldaCorrecta(celdaSeleccionada)) {
        //Deseleccionar la celda
        celdaSeleccionada.classList.remove("seleccionado");
        numSeleccionado.classList.remove("seleccionado");
        //Limpair las variables seleccionadas
        numSeleccionado = null;
        celdaSeleccionada = null;
    } else { //Si el número no corresponde a la solución
        errores++;
        desSeleccion = true;
        //Estilizar celda
        celdaSeleccionada.classList.add("incorrecto");
        //Esperar 1 seg
        setTimeout(function () {
            //Reactivar selección
            desSeleccion = false;
            //Restaurar estilo
            celdaSeleccionada.classList.remove("incorrecto");
            celdaSeleccionada.classList.remove("seleccionado");
            numSeleccionado.classList.remove("seleccionado");
            //Limpiar texto
            celdaSeleccionada.textContent = "";
            celdaSeleccionada = null;
            numSeleccionado = null;
            //Registrar error
            actualizarErrores();
        }, 1000);
    }
}

//Función que recoge los numeros del sudoku y los almacena en un arreglo
function validarSudoku() {
    let numCelda;
    for (let i = 0; i < 81; i++) {
        numCelda = id(i.toString()).textContent;
        datos[i] = numCelda;
    }
    datos = datos.join('');
}

function comprobarCeldaCorrecta(celda) { //Función que comprueba si una celda corresponde a la solución
    //Ajustar solución basada en la dificultad
    let solucion;
    if (id("dif_facil").checked) solucion = facil[1];
    else if (id("dif_normal").checked) solucion = normal[1];
    else solucion = dificil[1];
    //Si el número de la celda es igual al número de la solución
    if (solucion.charAt(celda.id) == celda.textContent) return true;
    else return false;
}

function mostrarDificultad() { //Función que muestra/oculta los niveles de dificultad
    let dFacil = id("boton_facil");
    let dNormal = id("boton_normal");
    let dDificil = id("boton_dificil");
    //Se oculta la dificultad que no está en juego
    if (hayDificultad) {
        if (id("dif_facil").checked) {
            dNormal.style.visibility = 'hidden';
            dDificil.style.visibility = 'hidden';
        } else if (id("dif_normal").checked) {
            dFacil.style.visibility = 'hidden';
            dDificil.style.visibility = 'hidden';
        } else {
            dFacil.style.visibility = 'hidden';
            dNormal.style.visibility = 'hidden';
        }
    } else {
        //Se muestra el selector de dificultad
        dFacil.style.visibility = 'visible';
        dNormal.style.visibility = 'visible';
        dDificil.style.visibility = 'visible';
    }
}

function reestablecer() { //Función que limpia los números ingresados en el tablero
    if (inicio) {
        let tablero;
        if (id("dif_facil").checked) tablero = facil[0];
        else if (id("dif_normal").checked) tablero = normal[0];
        else tablero = dificil[0];
        generarTablero(tablero);
    } else {
        alert("Primero debe iniciar un nuevo juego!");
    }
}

function limpiarTablero() { //Función que vacía el tablero por completo
    let celdas = qsa(".celda"); //Acceder a las celdas
    //Limpiar las celdas
    for (let i = 0; i < celdas.length; i++) {
        celdas[i].remove();
    }
    //Deseleccionar números
    for (let i = 0; i < id("contenedor_num").children.length; i++) {
        id("contenedor_num").children[i].classList.remove("seleccionado");
    }
    //Limpiar variables
    celdaSeleccionada = null;
    numSeleccionado = null;
}

//Cronómetro
function obtenerTiempo(iniciarTiempo) {
    let tiempoAcumulado = 0;
    if (iniciarTiempo > 0) {
        var tiempoActual = new Date();
        tiempoAcumulado = (tiempoActual.getTime() - iniciarTiempo);
        return tiempoAcumulado;
    }
    else {
        return tiempoAcumulado;
    }
}

function iniciarCronometro() {
    cronometro = pararContador(cronometro);
    var iniciarTiempo = iniciarContador();
    cronometro = setInterval(function () {
        var tiempoAcumulado = obtenerTiempo(iniciarTiempo);
        if (segundos < 10) {
            texto_segundos.innerHTML = "0" + segundos;
        }
        else {
            texto_segundos.innerHTML = segundos;
        }
        texto_minutos.innerHTML = minutos;
        mSegundos
            = tiempoAcumulado;
        if (minutos >= 59 && segundos >= 59 && mSegundos
            > 900) {
            cronometro = pararContador(cronometro);
            return true;
        }
        if (segundos > 59) {
            segundos = 0;
            minutos++;
        }
        if (mSegundos
            > 999) {
            mSegundos
                = 0;
            segundos++;
            iniciarCronometro();
        }
        //Comprueba si han pasado 5 minutos en dificultad Difícil
        if (id("dif_dificil").checked && minutos > 5) {
            //Detiene el cronómetro y acaba el juego
            minutos = 5;
            alert("Se acabó el tiempo!");
            detenerCronometro();
            inicio = false;
        }
    }, 10);
}

function detenerCronometro() {
    cronometro = pararContador(cronometro);
    return true;
}

function resetearCronometro() {
    cronometro = pararContador(cronometro);
    segundos = 0;
    minutos = 0;
    cambiarTexto("t_minutos", "0");
    cambiarTexto("t_segundos", "00");
    return true;
}

function pararContador(cronometro) {
    if (cronometro) {
        clearInterval(cronometro);
        return cronometro;
    }
    else return cronometro;
}

function iniciarContador() {
    var tiempoActual = new Date();
    return tiempoActual.getTime();
}
//Fin cronómetro

//Funciones de miscelanea

function id(ident) {
    return document.getElementById(ident);
}

function cambiarTexto(ident, mensaje) {
    id(ident).innerHTML = mensaje;
}


function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}