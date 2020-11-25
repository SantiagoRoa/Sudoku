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

var temporizador;
var numSeleccionado;
var celdaSeleccionada;
var desSeleccion;
var inicio;
var hayDificultad;

window.onload = function () {
    generarTablero(limpio[0]);
    id("boton_iniciar").addEventListener("click", iniciarJuego);
    id("boton_comprobar").addEventListener("click", iniciarJuego);
    id("boton_limpiar").addEventListener("click", reestablecer);
    id("boton_reiniciar").addEventListener("click", reiniciar);
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
    }else alert("Seleccione la opción 'Reiniciar' para iniciar una nueva partida");
}

function comprobarInicio(){
    return inicio;
}

function reiniciar() {
    inicio = false;
    hayDificultad = false;
    limpiarTablero();
    mostrarDificultad();
    generarTablero(limpio[0]);
}

function mostrarDificultad() {
    let dFacil = id("boton_facil");
    let dNormal = id("boton_normal");
    let dDificil = id("boton_dificil");
    //Se oculta la dificultad que no está en juego
    if (hayDificultad) {
        if (id("dif_facil")) {
            dNormal.style.visibility = 'hidden';
            dDificil.style.visibility = 'hidden';
        } else if (id("dif_normal")) {
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
    if (temporizador) limpiarTiempo(temporizador); //Limpiar temporizador
    //Deseleccionar números
    for (let i = 0; i < id("contenedor_num").children.length; i++) {
        id("contenedor_num").children[i].classList.remove("seleccionado");
    }
    //Limpiar variables
    celdaSeleccionada = null;
    numSeleccionado = null;
}



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