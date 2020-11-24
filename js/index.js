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

var temporizador;
var numSeleccionado;
var celdaSeleccionada;
var desSeleccion;

window.onload = function () {
    id("boton_iniciar").addEventListener("click", iniciarJuego);
}

function iniciarJuego() {
    //Se selecciona la dificultad
    let tablero;
    if (id("dif_facil").checked) tablero = facil[0];
    else if (id("dif_normal").checked) tablero = normal[0];
    else tablero = dificil[0];
    //Se crea el tablero
    generarTablero(tablero);
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
        }if ((celda.id + 1) % 9 == 3 || (celda.id + 1) % 9 == 6) {
            celda.classList.add("borde_derecho");
        }

        id("tablero").appendChild(celda);
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



function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}