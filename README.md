# Intel 8080 con Co-procesador de Punto Flotante (Fork educativo)

Este proyecto es un fork del [emulador y ensamblador de Intel 8080 de alexeiiw](https://github.com/alexeiiw/8080), construido íntegramente con HTML5, CSS3 y JavaScript puro, sin frameworks ni dependencias. El objetivo de este fork es llevar el simulador un paso más allá: **añadir un co-procesador de punto flotante** que permita a los estudiantes experimentar, de forma visual e interactiva, cómo una CPU delega operaciones especializadas a una unidad auxiliar.

## La idea detrás del fork

Cuando estudiamos arquitectura de computadoras, uno de los conceptos más importantes —y también más abstractos— es el **co-procesamiento**. Las CPUs modernas no hacen todo solas: delegan el punto flotante, los gráficos o la inteligencia artificial a unidades especializadas. El Intel 8087, co-procesador del 8086, fue el ejemplo histórico que estableció este patrón, y su modelo de pila de registros (ST(0) a ST(7)) sigue vivo hoy en SSE, AVX y las FPUs actuales.

Este fork reproduce ese modelo de forma conceptual y didáctica. El CPU 8080 actúa como procesador anfitrión, y un co-procesador FPU recibe instrucciones y operandos a través de una pequeña ventana de memoria mapeada (las direcciones F000h a F003h). Los estudiantes pueden así **ver** cómo se comunican dos procesadores, cómo se apila y desapila información, y cómo se comportan los flags de excepción ante situaciones como una división por cero.

## Qué añade este fork

Sobre el emulador original (que ya incluye su núcleo completo del 8080, ensamblador integrado, dashboard de registros, visualizador de pila y mapa de memoria), este fork incorpora:

Un **módulo de co-procesador FPU** con ocho registros de pila, once instrucciones, registro de control y flags de estado. Un **panel visual** que muestra en tiempo real el contenido de la pila ST(0)–ST(7), los flags C0 a C3 y los flags de excepción (IE, ZE, OE, UE, PE), junto con un LED indicador de actividad y la última instrucción ejecutada. Un **ensamblador extendido** que reconoce los nuevos mnemónicos y los traduce automáticamente a las secuencias de bytes del 8080. Cuatro **programas de ejemplo** comentados que cubren aritmética básica, funciones matemáticas y manejo de excepciones. Y tooltips explicativos en español sobre cada flag del FPU.

## Cómo se comunican la CPU y el FPU

El CPU y el co-procesador se hablan a través de cuatro puertos mapeados en memoria. Cuando el programa escribe en la dirección F000h, el valor va a parar al puerto de datos del FPU. Al escribir en F001h, se dispara la ejecución de la instrucción FPU correspondiente al opcode escrito. El resultado queda disponible en F002h, y los flags de estado se pueden consultar en F003h. Este esquema es una simplificación didáctica del diseño real del 8087, pero conserva la esencia: una CPU que delega y un co-procesador que responde.

## Instrucciones disponibles

El FPU reconoce once mnemónicos que el ensamblador expande a secuencias de instrucciones 8080 estándar. Para cargar un valor desde memoria a la pila se usa **FLD**, y para guardar el tope de la pila en memoria se usa **FST**. Las operaciones aritméticas básicas son **FADD**, **FSUB**, **FMUL** y **FDIV**. También hay funciones matemáticas como **FSQRT**, **FSIN** y **FCOS**, además de **FINT** (que trunca el tope de la pila a un entero) y **FSTAT** (que devuelve los flags del FPU al CPU). Cada uno de estos mnemónicos se traduce internamente a entre 3 y 11 bytes de código 8080, dependiendo de la complejidad de la operación.

## Un programa de ejemplo

Para probar el FPU basta con escribir algo como esto en el editor:

ORG 0000h
FLD DATO1 ; ST(0) = 3
FLD DATO2 ; ST(0) = 2, ST(1) = 3
FADD ; ST(0) = 5
FST RESULT ; guarda 5 en RESULT
HLT

DATO1: DB 3
DATO2: DB 2
RESULT: DB 0


Al pulsar **Assemble & Load** y luego **Step** varias veces, se puede observar cómo la pila del FPU se va llenando: primero aparece el 3, luego el 2, después el resultado de la suma (5) y finalmente el valor se guarda en memoria. Todo esto ocurre en paralelo a la ejecución normal del 8080, que va realizando las instrucciones LDA, STA y MVI que el ensamblador generó por debajo.

## Estructura del proyecto

Los archivos nuevos que introduce este fork son `fpu.js` (el núcleo del co-procesador), `fpu-ui.js` (el actualizador del panel visual), y la carpeta `examples/` con los cuatro programas de ejemplo. El ensamblador (`assembler.js`) y el núcleo del CPU (`cpu.js`) fueron modificados para integrar la lógica del FPU, y la hoja de estilos (`styles.css`) se amplió para dar formato al nuevo panel.

## Cómo ejecutarlo

Para probarlo localmente, clona el repositorio, entra en la carpeta y sirve el proyecto con cualquier servidor estático. Si tienes Python instalado, basta con ejecutar `python3 -m http.server 8000` desde la raíz y abrir `http://localhost:8000` en el navegador. A partir de ahí puedes escribir programas con instrucciones FPU, ensamblarlos y ejecutarlos paso a paso.

## Por qué es útil para enseñar

Este fork cubre varios conceptos que normalmente son difíciles de visualizar. Permite entender cómo funciona la comunicación entre una CPU y un co-procesador. Muestra el modelo de pila de registros que usa la familia x87 y que sigue presente en los procesadores modernos. Introduce los flags de excepción de IEEE 754 de forma tangible: al dividir por cero, el flag ZE se enciende en rojo; al calcular la raíz de un número negativo, se activa IE. Y, sobre todo, permite depurar paso a paso, viendo cómo cada instrucción del 8080 va transformando el estado del co-procesador.

## Créditos

El proyecto original del emulador Intel 8080 fue desarrollado por [alexeiiw](https://github.com/alexeiiw/8080) y liberado bajo licencia MIT. Este fork que añade el co-procesador de punto flotante está disponible en [fipalacios26/8080](https://github.com/fipalacios26/8080), en la rama `feature/fpu-coprocessor`.





