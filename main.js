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
   const index = Number(nSelected);

   // Si se encuentran los numeros especiales 'π' o 'e' se reemplaza todo
   if (n[index].includes("π") || n[index].includes("e")) {
      n[index] = "";
   }

   addNumber(number, index);
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
   operator = operator === "/" ? "÷" : operator; // Para permitir añadir division por teclado usando la tecla '/'
   operator = operator === "*" ? "x" : operator; // Para permitir añadir multiplicacion por teclado usando la tecla '*'
   
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

/** Esta función añade 'π' o 'e' a la operación */
function clickOnSpecialNumber(number) {
   const index = Number(nSelected);

   // Reemplazamos cualquier numero que haya por el numero especial seleccionado.
   if (!n[index]) {
      n[index] = number;
   } else if (n[index].includes('log')) {
      n[index] = n[index].replace(/\(([^)]+)\)/g, `(${number})`); // Reemplazamos todo lo que hay dentro del parentesis
   } else {
      n[index] = n[index].replace(/(\d+(\.)?(\d+)?|π|e)/g, number); // Reemplazamos unicamentes numeros, comas decimales y PI o E.
   }
   printAll();
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
   // Para evitar 0 a la izquierda en cuadrados, raices y factoriales
   if (number !== "." && (n[index] === "0²" || n[index] === "√0" || n[index] === "0!")) {
      n[index] = n[index].replace("0", number);
   }
   // Para que el simbolo '²' siempre se encuentre a la derecha
   else if (n[index].includes("²")) {
      n[index] = n[index].replace("²", number + "²");
   }
   // Para que el simbolo '!' siempre se encuentre a la derecha
   else if (n[index].includes("!")) {
      n[index] = n[index].replace("!", number + "!");
   }
   // Para evitar 0 a la izquierda en logaritmos
   else if (number !== "." && (n[index].includes("(0") && !n[index].includes("(0."))) {
      n[index] = n[index].replace("(0", "(" + number);
   }
   // Para evitar añadir numeros fuera del parentesis de los logaritmos
   else if (n[index].includes(")")) {
      n[index] = n[index].replace(")", number + ")");
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

/** Elimina el último caracter, recalcula y reimprime todo */
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

/**
 * Realiza los cálculos matemáticos básicos y avanzados basados en el operador seleccionado.
 * 
 * - Convierte los valores de 'n' a números de punto flotante y procesa caracteres especiales 
 *   asociados a cálculos avanzados (², √, log) mediante la función `calcAdvanced`.
 * - Calcula el resultado según el operador seleccionado (`actualOperator`), que puede incluir 
 *   operaciones básicas (+, -, x, ÷, %) o dejar el valor sin cambios si no se selecciona un operador.
 * - Modifica la variable global `result` con el resultado del cálculo.
 * 
 * @returns {number|string} El resultado del cálculo como un número o "Math ERROR" si ocurre un error.
 */
function calc() {
   // Transformamos los indices de 'n' a Float, y calculamos las funciones avanzadas porque tienen caracteres especiales
   const numbers = [parseFloat(calcAdvanced(n[0])), parseFloat(calcAdvanced(n[1]))]
   
   /* CALCULAMOS SEGÚN LA OPERACIÓN ELEGIDA */
   switch (actualOperator) {
      case "": {
         result = numbers[0];
         return result;
      }
      case "+": {
         result = numbers[0] + numbers[1];
         return result;
      }
      case "-": {
         result = numbers[0] - numbers[1];
         return result;
      }
      case "x": {
         result = numbers[0] * numbers[1];
         return result;
      }
      case "÷": {
         result = numbers[0] / numbers[1];
         return result;
      }
      case "%": {
         result = numbers[0] * (numbers[1] / 100);
         return result;
      }
      default:
         return "Math ERROR";
   }
}

/**
 * Realiza cálculos avanzados sobre un número representado como cadena.  
 * Identifica caracteres especiales asociados a operaciones matemáticas avanzadas (², √, log) y realiza el cálculo correspondiente.  
 * Si no se encuentra un carácter especial, devuelve la cadena original.
 * 
 * @param {string} number - Cadena que representa un número, posiblemente con caracteres especiales (², √, log).
 * @returns {string} Cadena que representa el número con el cálculo aplicado si lo requiere; de lo contrario, la cadena original sin modificaciones.
 */
function calcAdvanced(number) {
   number = preventEmptyNumber(number); // Evitamos que la cadena se encuentre vacía

   // Calculamos numeros especiales
   if (number.includes("π")) {
      number = number.replace("π", String(Math.PI))
   } else if (number.includes("e")) {
      number = number.replace("e", String(Math.E))
   }
   
   // Calculamos funciones especiales
   switch (true) {
      // Cuadrado
      case number.includes("²"): return String(calcSquare(number));
      // Raiz
      case number.includes("√"): return String(calcSquareRoot(number));
      // Factorial
      case number.includes("!"): return String(calcFact(number));
      // Logaritmo base 10
      case number.includes("log10"): return String(calcLog10(number));
      // Logaritmo base 2
      case number.includes("log2"): return String(calcLog2(number));
      // Logaritmo neperiano
      case number.includes("ln"): return String(calcLn(number));
      // Si no hay caracter especial
      default: return number;
   }
}

/** 
 * Calcula el cuadrado del numero recibido por parametro.
 * 
 * @param {string} number - Cadena que representa un número.
 * @returns {number} El numero elevado al cuadrado.
 */
function calcSquare(number) {
   return Math.pow(parseFloat(number.replace('²', '')), 2);
}

/** 
 * Calcula la raiz cuadrada del numero recibido por parametro.
 * 
 * @param {string} number - Cadena que representa un número.
 * @returns {number} El numero tras realizarle la raiz cuadrada.
 */
function calcSquareRoot(number) {
   return Math.sqrt(parseFloat(number.replace('√', '')), 2);
}

/** 
 * Calcula el factorial del numero recibido por parametro.
 * 
 * @param {string} number - Cadena que representa un número.
 * @returns {number} El numero tras realizarle el factorial.
 */
function calcFact(number) {
   const parsedNumber = parseFloat(number.replace("!"));

   if (parsedNumber === 0 || parsedNumber === 1) return 1;

   let result = 1;
   for (let i = 2; i <= parsedNumber; i++) {
      result *= i;
   }
   return result;
}

/** 
 * Calcula el logaritmo en base 10 del numero recibido por parametro.
 * 
 * @param {string} number - Cadena que representa un número.
 * @returns {number} El numero tras realizarle el logaritmo en base 10.
 */
function calcLog10(number) {
   return Math.log10(parseFloat(number.replace('log10(', '').replace(')', '')), 2);
}

/** 
 * Calcula el logaritmo del numero recibido por parametro.
 * 
 * @param {string} number - Cadena que representa un número.
 * @returns {number} El numero tras realizarle el logaritmo en base 2.
 */
function calcLog2(number) {
   return Math.log2(parseFloat(number.replace('log2(', '').replace(')', '')), 2);
}

/** 
 * Calcula el logaritmo neperiano del numero recibido por parametro.
 * 
 * @param {string} number - Cadena que representa un número.
 * @returns {number} El numero tras realizarle el logaritmo neperiano.
 */
function calcLn(number) {
   return Math.log(parseFloat(number.replace('ln(', '').replace(')', '')), 2);
}

/**
 * Devuelve "0" si el número es una cadena vacía; de lo contrario, devuelve la cadena original.
 *
 * @param {string} number - Cadena que representa un número.
 * @returns {string} "0" si la cadena está vacía; en caso contrario, la cadena original.
 */
function preventEmptyNumber(number) {
   if (number.length < 1) {
      return "0";
   }
   return number;
}

/**
 * Esta función formatea el numero a imprimir en el resultado, separando cada 3 numeros por '.' y la coma flotante como ','.
 * 
 * @param {number} number El número a formatear
 * @returns {string} El número formateado.
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

   n[index] = calcAdvanced(n[index]) + "²";
   printAll();
}

/** Esta función realiza la raiz cuadrada del indice de 'n' que toca */
function toSquareRoot() {
   let index = Number(nSelected);

   n[index] = "√" + calcAdvanced(n[index]);
   printAll();
}

function toFact() {
   let index = Number(nSelected);

   n[index] = calcAdvanced(n[index]) + '!';
   printAll();
}

function toLog10() {
   let index = Number(nSelected);

   n[index] = "log10(" + calcAdvanced(n[index]) + ")";
   printAll();
}

function toLog2() {
   let index = Number(nSelected);

   n[index] = "log2(" + calcAdvanced(n[index]) + ")";
   printAll();
}

function toLn() {
   let index = Number(nSelected);

   n[index] = "ln(" + calcAdvanced(n[index]) + ")";
   printAll();
}

document.addEventListener("keydown", (event) => {
   const key = event.key;

   // Verifica que es un numero
   if (!isNaN(key)) {
      clickOnNumber(key);
      return;
   }
   
   // Verifica que es un operador
   if ("*/+-%x".includes(key)) {
      clickOnOperator(key);
      return;
   }

   // Verifica que es el separador decimal
   if (key === ',' || key === '.') {
      clickOnComa();
      return;
   }

   // Verifica que es el backspace
   if (key === 'Backspace') {
      backspace();
   }
})

/* CIENTIFICA */
const CALCULATOR_TYPES = {
   STANDARD: "Estándar",
   SCIENTIFIC: "Científica",
};
let calculatorType = CALCULATOR_TYPES.STANDARD;

function toggleCalculatorType() {
   const padElement = document.getElementById("pad");
   const calculatorTypeNameElement = document.getElementById("type-name");

   if (calculatorType === CALCULATOR_TYPES.STANDARD) {
      swapToScientific(padElement);
   } else {
      swapToStandard(padElement);
   }
   calculatorTypeNameElement.innerText = calculatorType;
}

function swapToStandard(padElement) {
   calculatorType = CALCULATOR_TYPES.STANDARD;

   padElement.classList.replace("scientific", "standard");
}
function swapToScientific(padElement) {
   calculatorType = CALCULATOR_TYPES.SCIENTIFIC;
   
   padElement.classList.replace("standard", "scientific");
}