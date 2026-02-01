// ACADEMIA ELIJUNIO - Timer Manager

class TimerManager {
    constructor() {
        this.totalTime = 90 * 60; // 90 minutos em segundos
        this.timeLeft = this.totalTime;
        this.timerInterval = null;
        this.isRunning = false;
        this.startTime = null;
        this.pausedTime = null;
        this.hasStarted = false;
        this.workoutStartTime = null;
        this.observers = [];
        
        this.workoutMusic = document.getElementById('workout-music');
        this.startBtn = document.getElementById('start-timer');
        this.pauseBtn = document.getElementById('pause-timer');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.updateButtonStatesAndText();
    }

    bindEvents() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.start());
        }

        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pause());
        }

        const resetBtn = document.getElementById('reset-timer');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    // Métodos para observer pattern
    addObserver(callback) {
        this.observers.push(callback);
    }

    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    notifyObservers(event) {
        this.observers.forEach(callback => {
            try {
                callback(event);
            } catch (e) {
                console.error('Erro no observer:', e);
            }
        });
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.hasStarted = true;
        
        // Notificar que o timer começou
        this.notifyObservers('timerStarted');
        
        if (!this.workoutStartTime) {
            this.workoutStartTime = Date.now();
        }
        
        if (this.pausedTime !== null) {
            // Continuar de onde parou
            this.startTime = Date.now() - (this.totalTime - this.pausedTime) * 1000;
        } else {
            // Começar do início
            this.startTime = Date.now() - (this.totalTime - this.timeLeft) * 1000;
        }
        
        this.playWorkoutMusicOnce();
        this.sendWhatsAppMessage();
        
        this.updateButtonStatesAndText();
        this.updateTimerStatus('Treino em andamento', 'running');

        this.timerInterval = setInterval(() => {
            this.timeLeft = Math.max(0, this.totalTime - Math.floor((Date.now() - this.startTime) / 1000));
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    // ENVIAR MENSAGEM PARA WHATSAPP
    sendWhatsAppMessage() {
        try {
            const phoneNumber = "31997077639";
            const message = "Boraaa, hora do show porra uhuuuuu, biirlllll!";
            const whatsappURL = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            // Abrir em nova aba sem focar
            const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer,width=600,height=700');
            if (newWindow) {
                // Focar na janela principal novamente
                setTimeout(() => window.focus(), 100);
            }
            
            console.log("✅ Mensagem WhatsApp enviada para: 55" + phoneNumber);
        } catch (error) {
            console.error("❌ Erro ao enviar mensagem WhatsApp:", error);
        }
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.pausedTime = this.timeLeft;
        
        // Notificar que o timer pausou
        this.notifyObservers('timerPaused');
        
        this.stopWorkoutMusic();
        
        this.updateButtonStatesAndText();
        this.updateTimerStatus('Treino pausado', 'paused');
    }

    reset() {
        this.isRunning = false;
        this.hasStarted = false;
        clearInterval(this.timerInterval);
        this.timeLeft = this.totalTime;
        this.startTime = null;
        this.pausedTime = null;
        this.workoutStartTime = null;
        
        // Notificar que o timer resetou
        this.notifyObservers('timerReset');
        
        this.stopWorkoutMusic();
        
        this.updateDisplay();
        this.updateButtonStatesAndText();
        this.updateTimerStatus('Pronto para começar', 'idle');
        
        const finishSound = document.getElementById('finish-sound');
        if (finishSound) {
            finishSound.pause();
            finishSound.currentTime = 0;
        }
    }

    playWorkoutMusicOnce() {
        if (this.workoutMusic) {
            if (this.workoutMusic.readyState >= 2) {
                this.workoutMusic.currentTime = 0;
                this.workoutMusic.volume = 0.3;
                this.workoutMusic.play().catch(e => {
                    console.log("Erro ao tocar música do treino:", e);
                });
            } else {
                console.log("Música do treino ainda não carregada");
                this.workoutMusic.load();
                this.workoutMusic.addEventListener('canplaythrough', () => {
                    this.workoutMusic.volume = 0.3;
                    this.workoutMusic.play().catch(e => console.log("Erro após carregar música:", e));
                }, { once: true });
            }
        }
    }

    stopWorkoutMusic() {
        if (this.workoutMusic) {
            this.workoutMusic.pause();
            this.workoutMusic.currentTime = 0;
        }
    }

    updateButtonStatesAndText() {
        if (this.startBtn) {
            if (this.isRunning) {
                this.startBtn.style.display = 'none';
                this.startBtn.disabled = true;
                this.startBtn.style.opacity = '0.5';
                this.startBtn.style.cursor = 'not-allowed';
            } else {
                this.startBtn.style.display = 'flex';
                this.startBtn.disabled = false;
                this.startBtn.style.opacity = '1';
                this.startBtn.style.cursor = 'pointer';
                
                if (this.hasStarted && this.timeLeft < this.totalTime) {
                    this.startBtn.innerHTML = '<i class="fas fa-play"></i> Continuar';
                } else {
                    this.startBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
                }
            }
        }

        if (this.pauseBtn) {
            if (this.isRunning) {
                this.pauseBtn.style.display = 'flex';
                this.pauseBtn.disabled = false;
                this.pauseBtn.style.opacity = '1';
                this.pauseBtn.style.cursor = 'pointer';
                this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            } else {
                this.pauseBtn.style.display = 'none';
                this.pauseBtn.disabled = true;
                this.pauseBtn.style.opacity = '0.5';
                this.pauseBtn.style.cursor = 'not-allowed';
            }
        }
    }

    updateDisplay() {
        const timerElement = document.getElementById('main-timer');
        if (!timerElement) return;

        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Mudar cor conforme tempo
        if (this.timeLeft <= 5 * 60) {
            timerElement.style.background = 'linear-gradient(90deg, #ff2e2e, #ff6b6b)';
            timerElement.style.webkitBackgroundClip = 'text';
            timerElement.style.webkitTextFillColor = 'transparent';
            timerElement.classList.add('pulse');
        } else if (this.timeLeft <= 15 * 60) {
            timerElement.style.background = 'linear-gradient(90deg, #ff9f43, #ff6b6b)';
            timerElement.style.webkitBackgroundClip = 'text';
            timerElement.style.webkitTextFillColor = 'transparent';
            timerElement.classList.remove('pulse');
        } else {
            timerElement.style.background = 'linear-gradient(90deg, var(--accent-red), var(--accent-blue))';
            timerElement.style.webkitBackgroundClip = 'text';
            timerElement.style.webkitTextFillColor = 'transparent';
            timerElement.classList.remove('pulse');
        }
    }

    updateTimerStatus(text, status) {
        const statusElement = document.getElementById('timer-status');
        if (!statusElement) return;

        let icon = 'fa-clock';
        let color = '#b0b0b0';

        switch (status) {
            case 'running':
                icon = 'fa-play';
                color = '#00d26a';
                break;
            case 'paused':
                icon = 'fa-pause';
                color = '#ff2e2e';
                break;
            case 'finished':
                icon = 'fa-flag-checkered';
                color = '#2e5bff';
                break;
        }

        statusElement.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
        statusElement.style.color = color;
    }

    handleTimeUp() {
        this.isRunning = false;
        this.hasStarted = false;
        clearInterval(this.timerInterval);
        
        this.updateButtonStatesAndText();
        this.updateTimerStatus('Treino finalizado!', 'finished');
        
        const finishSound = document.getElementById('finish-sound');
        if (finishSound) {
            finishSound.currentTime = 0;
            finishSound.play().catch(e => console.log("Áudio não pode ser reproduzido:", e));
        }
        
        this.stopWorkoutMusic();
        this.showTimeUpNotification();
    }

    showTimeUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'time-up-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #00d26a; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 1000; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-flag-checkered"></i>
                <span>Tempo de treino finalizado! Parabéns!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs.toString().padStart(2, '0')}s`;
        } else {
            return `${secs}s`;
        }
    }

    getElapsedTime() {
        if (!this.workoutStartTime) return 0;
        
        const now = this.isRunning ? Date.now() : (this.pausedTime ? 
            Date.now() - (this.totalTime - this.pausedTime) * 1000 : 
            Date.now());
            
        const elapsed = Math.floor((now - this.workoutStartTime) / 1000);
        return Math.min(elapsed, 90 * 60);
    }

    getTimeLeftFormatted() {
        return this.formatTime(this.timeLeft);
    }

    getProgressPercentage() {
        return ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
    }
}

// Inicializar timer quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.timerManager = new TimerManager();
});

// Adicionar estilo para animação de pulso
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .timer-digits.pulse {
        animation: pulse 1s infinite;
    }
`;
document.head.appendChild(style);