let result = 0; // Esta variable almacenará el resultado de las operaciones
let n = ["", ""]; // En este array de 2 posiciones guardaré, en la posiciones: {0 => el numero de la izquierda en la opeeracion; 1 => el numero de la derecha en la operación}
let nSelected = false; // Esta variable sirve para seleccionar entre n[0](false) y n[1] (true).
let actualOperator = ""; // Esta variable guardará el tipo de operación seleccionada '+', '-', etc

let lastWasEqual = false; // Almacenará si lo ultimo clickado fue el igual para resetear la calculadora si lo siguiente es un numero.

/**
 * Esta función recibirá un numero y lo añadira a la posicion de n que toca.
 * @param {string} number numero clickado
 */
function clickOnNumber(number) {
   addNumber(number, Number(nSelected));
}

/** Añade el punto flotante al indice de 'n' que toca */
function clickOnComa() {
   // Comprobamos que el numero en el que estamos no tenga ya el punto flotante
   let index = Number(nSelected);
   if (n[index].includes(".")) {
      return;
   }
   // Para evitar añadir el punto flotante sin un numero delante
   if (n[index] === "" || n[index] == null) {
      addNumber("0.", index);
   } else {
      addNumber(".", index);
   }
}

/**
 * Prepara la calculadora para la operación elegida.
 * Almacena en n[0] el valor de resultado, con el fin de poder concatenar operaciones de forma ilimitada.
 * @param {string} operator operacion elegida
 */
function clickOnOperator(operator) {
   // Almacenamos el resultado en n[0] y preparamos n[1] para un nuevo numero
   n[0] = String(result); // Debemos convertirlo a string ya que result lo estamos almacenando en formato number.
   n[1] = "";

   lastWasEqual = false; // Permito concatenar operaciones despues de igualar

   actualOperator = operator;
   nSelected = true;

   printOperaciones();
}

/** Esta función unicamente muestra el igual en '#operaciones' ya que la calculadora va calculando automaticamente todo el rato */
function clickOnEqual() {
   const operaciones = document.getElementById("operaciones");
   if (operaciones.innerText.charAt(operaciones.innerText.length - 1) !== "=") {
      operaciones.innerText += " =";
      lastWasEqual = true;
   }
}

/** Cambia el signo del indice de 'n' que toca */
function changeSign() {
   let index = Number(nSelected);
   // Si ya es negativo, eliminamos el primer caracter
   if (n[index].charAt(0) === "-") {
      n[index] = n[index].slice(1);
   }
   // Si es positivo, añadimos '-' al principio del string
   else {
      n[index] = "-" + n[index];
   }

   // Reimprime operaciones y resultado.
   printAll()
}

/**
 * Esta función concatenará el número a la posicion de n recibida por parametro.
 * @param {string} number numero a añadir
 * @param {number} index indice en el que añadir el numero
 */
function addNumber(number, index) {
   // Si se intenta añadir un numero justo despues de haber pulsado igual, se resetea la calculadora.
   if (lastWasEqual) {
      clearAll();
      index = 0;
   }

   // Limito el numero de cifras a 13.
   if (n[index].length > 12) {
      return;
   }

   /* PARA EVITAR CEROS A LA IZQUIERDA Y MANTENER EXPONENTES A LA DERECHA */
   // Para evitar 0 a la izquierda en cuadrados y raices
   if (number !== "." && (n[index] === "0²" || n[index] === "√0")) {
      n[index] = n[index].replace("0", number);
   }
   // Para que el simbolo '²' siempre se encuentre a la derecha
   else if (n[index].includes("²")) {
      n[index] = n[index].replace("²", number + "²");
   }
   // Para evitar 0 a la izquierda
   else if (n[index] === "0" && number !== ".") {
      n[index] = number;
   }
   // Concatenamos el numero
   else {
      n[index] += number;
   }

   // Reimprime operaciones y resultado.
   printAll();
}

/** Imprime con formato en el div '#operaciones' */
function printOperaciones() {
   const operaciones = document.getElementById("operaciones");
   operaciones.innerText = `${n[0].replace(
      ".",
      ","
   )} ${actualOperator} ${n[1].replace(".", ",")}`;
}

/** 
 * Imprime con formato el resultado de operaciones en el div '#resultado' 
 * IMPORTANTE -> Esta función llama a calc(), funcion que realiza las operaciones y modifica el valor de 'result' 
 */
function printResultado() {
   const resultado = document.getElementById("resultado");
   resultado.innerText = formatearNumero(calc());
}

/** Imprime tanto resultado como operaciones */
function printAll() {
   printResultado();
   printOperaciones();
}

/** Limpia la calculadora, resetea los valores a inicio */
function clearAll() {
   result = 0;
   n = ["", ""];
   nSelected = false;
   actualOperator = "";
   lastWasEqual = false;

   // Imprimira '#resultado' reseteado a 0
   printResultado();
   // Limpiamos '#operaciones'
   const operaciones = document.getElementById("operaciones");
   operaciones.innerText = "";
}

/** Limpia el indice de 'n' que toca */
function clearActualNumber() {
   let index = Number(nSelected);
   n[index] = "";

   printAll()
}

/** Elimina el último caracter */
function backspace() {
   let index = Number(nSelected);

   // Si pulsa eliminar cuando lo último fue igualar solamente eliminamos el igual
   if (lastWasEqual) {
      lastWasEqual = false;
      printAll();
      return;
   }

   // Si pulsa eliminar cuando toca n[1] y no hay nada escrito, elimino el operador y paso a n[0]
   if (nSelected && (n[index] === "" || n[index] == null)) {
      actualOperator = '';
      nSelected = false;
   }
   // Elimino el ultimo caracter del indice de 'n' que toca
   else {
      n[index] = n[index].slice(0, -1);
   }

   printAll();
}

/** Devuelve el resultado de la operación elegida entre n[0] y n[1] */
function calc() {
   let n0 = 0;
   let n1 = 0;

   /* CALCULO DE RAICES Y ELEVADOS */
   // Calculamos el elevado de n[0] antes de operar y convertimos a Float
   if (n[0].includes("²")) {
      n0 = Math.pow(parseFloat(n[0].replace('²', '')), 2);
   } 
   // Calculamos la raiz de n[0] antes de operar y convertimos a Float
   else if (n[0].includes("√")) {
      n0 = Math.sqrt(parseFloat(n[0].replace('√', '')), 2);
   }
   // Si no incluye ninguna operación de raiz o cuadrado
   else {
      n0 = parseFloat(n[0]);
   }

   // Calculamos el elevado de n[1] antes de operar y convertimos a Float
   if (n[1].includes("²")) {
      n1 = Math.pow(parseFloat(n[1].replace('²', '')), 2);
   }
   // Calculamos la raiz de n[1] antes de operar y convertimos a Float
   else if (n[1].includes("√")) {
      n1 = Math.sqrt(parseFloat(n[1].replace('√', '')), 2);
   }
   // Si no incluye ninguna operación de raiz o cuadrado
   else {
      n1 = parseFloat(n[1]);
   }

   /* EVITAMOS ERRORES DE TIPO NaN */
   // Si n[0] no tiene valor, resultado será 0.
   if (isNaN(n0)) {
      result = 0;
      return result;
   }
   // Si n[1] no tiene valor, resultado sera n[1].
   if (isNaN(n1)) {
      result = n0;
      return result;
   }
   
   /* CALCULAMOS SEGÚN LA OPERACIÓN ELEGIDA */
   switch (actualOperator) {
      case "": {
         result = n0;
         return result;
      }
      case "+": {
         result = n0 + n1;
         return result;
      }
      case "-": {
         result = n0 - n1;
         return result;
      }
      case "x": {
         result = n0 * n1;
         return result;
      }
      case "÷": {
         result = n0 / n1;
         return result;
      }
      case "%": {
         result = n0 * (n1 / 100);
         return result;
      }
      default:
         return "Math ERROR";
   }
}

/**
 * Esta función formatea el numero a imprimir en el resultado, separando cada 3 numeros por '.' y la coma flotante como ','.
 * @param {float} number numero en for
 * @returns string con el numero formateado.
 */
function formatearNumero(number) {
   if (String(number).length < 13) {
      return new Intl.NumberFormat("es-ES", {
         minimumFractionDigits: 0,
         maximumFractionDigits: 20,
         signDisplay: "auto",
      }).format(number);
   }
   // Usamos notación cientifica si el número excede de 13 digitos para evitar que se salga de la pantalla de la calculadora
   else {
      return new Intl.NumberFormat("es-ES", {
         minimumFractionDigits: 0,
         maximumFractionDigits: 20,
         notation: "scientific",
         signDisplay: "auto",
      }).format(number);
   }
}

/****************** FUNCIONES ESPECIALES ******************/

/** Esta funcion realiza la función reciproca de un numero, es decir divide 1 entre el numero que tengamos en ese momento en resultado */
function reciprocalFunction() {
   n[0] = "1";
   n[1] = String(result);
   actualOperator = "÷";

   nSelected = true;

   printAll();
}

/** Esta función realiza el cuadrado del indice de 'n' que toca */
function toSquare() {   
   let index = Number(nSelected);

   // Evitamos elevar una cadena vacía
   if (n[index].length < 1) {
      n[index] = "0";
   }

   // Si se intenta hacer el cuadrado de una raiz, calculamos la raiz 
   if (n[index].includes('√')) {
      n[index] = String(Math.sqrt(parseFloat(n[index].replace('√', '')), 2));
   }

   // Para evitar concatenar demasiados "²", al elevar al cuadrado algo elevado al cuadrado, calculamos el valor del primer cuadrado.
   if (n[index].includes('²')) {
      n[index] = String(Math.pow(parseFloat(n[index].replace('²', '')), 2));
   }
   n[index] += '²';
   
   printAll()
}

/** Esta función realiza la raiz cuadrada del indice de 'n' que toca */
function toSquareRoot() {
   let index = Number(nSelected);

   // Evitamos elevar una cadena vacía
   if (n[index].length < 1) {
      n[index] = "0";
   }

   // Si se intenta hacer la raiz de un cuadrado, calculamos el cuadrado 
   if (n[index].includes('²')) {
      n[index] = String(Math.pow(parseFloat(n[index].replace('²', '')), 2));
   }

   // Para evitar concatenar demasiados "√", al hacer la raiz cuadrada a otra raiz cuadrada, reemplazamos por el calculo.
   if (n[index].includes('√')) {
      n[index] = String(Math.sqrt(parseFloat(n[index].replace('√', '')), 2));
   }
   n[index] = '√' + n[index];
   
   printAll()
}