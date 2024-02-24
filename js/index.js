const reiniciarButton = document.getElementById("reiniciar");
const preparacionMinutos = document.getElementById("preparacionMinutos");
const preparacionSegundos = document.getElementById("preparacionSegundos");

const trabajoMinutos = document.getElementById("trabajoMinutos");
const trabajoSegundos = document.getElementById("trabajoSegundos");

const descansoMinutos = document.getElementById("descansoMinutos");
const descansoSegundos = document.getElementById("descansoSegundos");

const rondasInput = document.getElementById("rondas");
const timerDisplay = document.getElementById("timer");
const iniciarButton = document.getElementById("iniciar");
const detenerButton = document.getElementById("detener");
const pausarButton = document.getElementById("pausar");

const timer = document.getElementById("timer");
const configuracion = document.getElementById("configuracion");
const audio = document.getElementById("timbre");

let preparacionTime, trabajoTime, descansoTime;
let timerInterval;
let rondaActual = 0;
let tipoRonda = ""; // Variable para indicar el tipo de ronda actual (trabajo o descanso)
let primeraEjecucion = true;
let timerPaused = false;
let tiempoRestante = 0; // Variable

iniciarButton.addEventListener("click", () => {
  preparacionTime =
    parseInt(preparacionMinutos.value, 10) * 60 +
    parseInt(preparacionSegundos.value, 10);
  trabajoTime =
    parseInt(trabajoMinutos.value, 10) * 60 +
    parseInt(trabajoSegundos.value, 10);
  descansoTime =
    parseInt(descansoMinutos.value, 10) * 60 +
    parseInt(descansoSegundos.value, 10);
  rondas = parseInt(rondasInput.value, 10);
  rondaActual = 0;
  tipoRonda = ""; // Reiniciar el tipo de ronda
  primeraEjecucion = true;

  detenerTemporizador();
  iniciarTemporizador(preparacionTime, "preparacion");
});

detenerButton.addEventListener("click", () => {
  detenerTemporizador();
});

reiniciarButton.addEventListener("click", () => {
  detenerTemporizador(); // Detener el temporizador actual
  iniciarTemporizador(); // Reanudar con el tiempo restante y tipo de ronda
});

pausarButton.addEventListener("click", () => {
  if (timerPaused) {
    // Si el temporizador está pausado, reanudarlo
    timerPaused = false;
    iniciarTemporizador(tiempoRestante, tipoRonda); // Reanudar con el tiempo restante y tipo de ronda
  } else {
    // Si el temporizador está corriendo, pausarlo
    clearInterval(timerInterval);
    timerPaused = true;
    tiempoRestante = calcularTiempoRestante(); // Almacenar el tiempo restante al pausar
  }
});

/* const iniciarTemporizador = () => {
  // Verificar si se han completado todas las rondas
  if (rondas === 0) {
    detenerTemporizador();
    timerDisplay.textContent = "¡Fin de las rondas!";
    return;
  }
  // Si es la primera ronda, incluir el tiempo de preparación
  if (primeraEjecucion) {
    primeraEjecucion = false;
    duracion = preparacionTime;
  } else if (tipoRonda === "trabajo") {
    // Si la ronda anterior fue de trabajo, establecer el tiempo de descanso
    duracion = descansoTime;
    tipoRonda = "descanso";
  } else {
    // Si la ronda anterior fue de descanso, establecer el tiempo de trabajo
    duracion = trabajoTime;
    tipoRonda = "trabajo";
  }

  let timer = duracion,
    minutos,
    segundos;

  timerInterval = setInterval(() => {
    minutos = Math.floor(timer / 60);
    segundos = timer % 60;

    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    timerDisplay.textContent = minutos + ":" + segundos;

    if (--timer < 0) {
      clearInterval(timerInterval);
      if (
        (rondaActual % 2 === 1 && duracion === trabajoTime) ||
        (rondaActual % 2 === 0 && duracion === descansoTime)
      ) {
        rondas--;
      }
      audio.play();
      setTimeout(() => {
        audio.pause();
      }, 1000); // Detiene la reproducción después de 5 segundos (5000 milisegundos)
      iniciarTemporizador();
    }
  }, 1000);
};
 */

const iniciarTemporizador = (
  tiempo = preparacionTime,
  tipo = "preparacion"
) => {
  if (rondas === 0) {
    detenerTemporizador();
    timerDisplay.textContent = "¡Fin de las rondas!";
    return;
  }

  let duracion = tiempo;
  tipoRonda = tipo;

  let timer = duracion,
    minutos,
    segundos;

  timerInterval = setInterval(() => {
    minutos = Math.floor(timer / 60);
    segundos = timer % 60;

    minutos = minutos < 10 ? "0" + minutos : minutos;
    segundos = segundos < 10 ? "0" + segundos : segundos;

    timerDisplay.textContent = minutos + ":" + segundos;

    if (--timer < 0) {
      clearInterval(timerInterval);
      if (tipoRonda === "descanso") {
        rondas--; // Decrementar rondas al finalizar un ciclo de trabajo-descanso
      }
      audio.play();
      setTimeout(() => {
        audio.pause();
      }, 1000); // Detener la reproducción después de 5 segundos (5000 milisegundos)
      iniciarTemporizador(
        tipo === "preparacion"
          ? trabajoTime
          : tipo === "trabajo"
          ? descansoTime
          : preparacionTime,
        tipo === "preparacion"
          ? "trabajo"
          : tipo === "trabajo"
          ? "descanso"
          : "preparacion"
      ); // Cambiar al siguiente tipo de ronda
    }
  }, 1000);
};

const calcularTiempoRestante = () => {
  let tiempoTotal;
  if (tipoRonda === "trabajo") {
    tiempoTotal = trabajoTime;
  } else if (tipoRonda === "descanso") {
    tiempoTotal = descansoTime;
  } else {
    tiempoTotal = preparacionTime;
  }

  const minutos = parseInt(timerDisplay.textContent.split(":")[0], 10) * 60;
  const segundos = parseInt(timerDisplay.textContent.split(":")[1], 10);
  const resta = minutos + segundos;
  return resta;
};

const detenerTemporizador = () => {
  clearInterval(timerInterval);
  timerDisplay.textContent = "--:--";
};

window.addEventListener("beforeinstallprompt", (e) => {
  // Mostrar el botón de instalación en la barra de direcciones (URL)
  e.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("El usuario aceptó la instalación");
    } else {
      console.log("El usuario canceló la instalación");
    }
  });
});
