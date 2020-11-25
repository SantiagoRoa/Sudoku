//Se cargan tableros predeterminados
const facil = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const normal = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
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
var numSeleccionado;
var celdaSeleccionada;
var desSeleccion;
var inicio;
var hayDificultad;
var minutos;
var segundos;
var texto_minutos;
var texto_segundos;
var mSegundos = 0;

window.onload = function () {
    generarTablero(limpio[0]);
    cargarCronometro();
    id("boton_iniciar").addEventListener("click", iniciarJuego);
    id("boton_comprobar").addEventListener("click", comprobar);
    id("boton_limpiar").addEventListener("click", reestablecer);
    id("boton_reiniciar").addEventListener("click", reiniciar);
}

function cargarCronometro() {
    texto_minutos = id("t_minutos");
    minutos = Number(texto_minutos.innerHTML);
    texto_segundos = id("t_segundos");
    segundos = Number(texto_segundos.innerHTML);
}

function iniciarJuego() {
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

function comprobar() {
    //Se comprueba que exista una partida
    if (!comprobarInicio()) alert("Primero debe iniciar un nuevo juego!");
    else {
        //Se comprueba si la solución es válida
    }
}

function comprobarInicio() {
    return inicio;
}

function reiniciar() {
    inicio = false;
    hayDificultad = false;
    limpiarTablero();
    resetearCronometro();
    mostrarDificultad();
    generarTablero(limpio[0]);
}

function generarTablero(tablero) {
    //Se limpian los tableros
    limpiarTablero();
    //Crear tablero
    let idContador = 0;
    for (let i = 0; i < 81; i++) {
        let celda = document.createElement("p");
        if (tablero.charAt(i) != "-") {
            celda.textContent = tablero.charAt(i);
        } else {
            //Prov
        }
        celda.id = idContador;
        idContador++;
        celda.classList.add("celda");
        if ((celda.id > 17 && celda.id < 27) || (celda.id > 44 && celda.id < 54)) {
            celda.classList.add("borde_inferior");
        } if ((celda.id + 1) % 9 == 3 || (celda.id + 1) % 9 == 6) {
            celda.classList.add("borde_derecho");
        }
        id("tablero").appendChild(celda);
    }
}

function mostrarDificultad() {
    let dFacil = id("boton_facil");
    let dNormal = id("boton_normal");
    let dDificil = id("boton_dificil");
    //Se oculta la dificultad que no está en juego
    if (hayDificultad) {
        if (id("dif_facil").checked) {
            dNormal.style.visibility = 'hidden';
            dDificil.style.visibility = 'hidden';
        } else if (id("dif_normal").checked) {
            console.log("entro");
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

function reestablecer() {
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


function limpiarTablero() {
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