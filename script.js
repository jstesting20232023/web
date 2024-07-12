let timer;
let timeLeft = 0;
const timeDisplay = document.getElementById('time');
const alarmSound = new Audio('alarm.mp3'); // Suponiendo que tienes un archivo de audio llamado 'alarm.mp3'
const datetimeDisplay = document.getElementById('datetime');
let isAlarmPlaying = false;

document.getElementById('stop').addEventListener('click', stopTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('btn-5sec').addEventListener('click', () => setTimer(5));
document.getElementById('btn-10min').addEventListener('click', () => setTimer(10 * 60));
document.getElementById('btn-15min').addEventListener('click', () => setTimer(15 * 60));
document.getElementById('btn-30min').addEventListener('click', () => setTimer(30 * 60));
document.getElementById('btn-1hr').addEventListener('click', () => setTimer(60 * 60));

function startTimer() {
    if (!timer && timeLeft > 0) { // Solo iniciar si no hay un temporizador activo y el tiempo restante es mayor que cero
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                timer = null;
                playAlarmSound(); // Reproducir el sonido al terminar el tiempo
                showNotification(); // Mostrar notificación usando API de Notificaciones
                timeLeft = 0; // No reiniciar el tiempo automáticamente
            }
        }, 1000);
    }
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
        stopAlarmSound(); // Detener el sonido de la alarma si está sonando
    }
}

function resetTimer() {
    stopTimer();
    timeLeft = 0;
    updateDisplay();
}

function setTimer(seconds) {
    stopTimer();
    timeLeft = seconds;
    updateDisplay();
    startTimer(); // Iniciar el temporizador automáticamente al establecer el tiempo
}

function updateDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

function showNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Time is up!', { 
            body: 'The timer has finished.',
            icon: 'notification-icon.png' // Opcional: puedes agregar un icono para la notificación
        });
    } else {
        alert('Time is up!');
    }
}

function playAlarmSound() {
    if (!isAlarmPlaying) {
        alarmSound.play().catch(function(error) {
            console.error('Failed to play alarm sound:', error);
        });
        isAlarmPlaying = true;
        // Resetear la bandera de reproducción después de un corto intervalo
        setTimeout(() => {
            isAlarmPlaying = false;
        }, 1000);
    }
}

function stopAlarmSound() {
    if (isAlarmPlaying) {
        alarmSound.pause(); // Pausar la reproducción del sonido
        alarmSound.currentTime = 0; // Reiniciar el tiempo de reproducción al principio
        isAlarmPlaying = false;
    }
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    const day = now.getDate();
    const ordinalSuffix = getOrdinalSuffix(day);
    const formattedDate = now.toLocaleDateString('en-US', options).replace(day, `${day}${ordinalSuffix}`);
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    datetimeDisplay.textContent = `${formattedDate}, ${formattedTime}`;
}

// Solicitar permiso para enviar notificaciones
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// Actualizar la fecha y hora cada segundo
setInterval(updateDateTime, 1000);

// Inicializar la fecha y hora al cargar la página
updateDateTime();
