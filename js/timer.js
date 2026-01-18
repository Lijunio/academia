// ACADEMIA ELIJUNIO - Timer Manager

class TimerManager {
    constructor() {
        this.totalTime = 90 * 60; // 90 minutos em segundos
        this.timeLeft = this.totalTime;
        this.timerInterval = null;
        this.isRunning = false;
        this.startTime = null;
        this.pausedTime = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        const startBtn = document.getElementById('start-timer');
        const pauseBtn = document.getElementById('pause-timer');
        const resetBtn = document.getElementById('reset-timer');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.start());
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pause());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startTime = Date.now() - (this.totalTime - this.timeLeft) * 1000;
        
        // Atualizar interface
        this.updateButtonStates();
        this.updateTimerStatus('Treino em andamento', 'running');

        // Iniciar contagem regressiva
        this.timerInterval = setInterval(() => {
            this.timeLeft = Math.max(0, this.totalTime - Math.floor((Date.now() - this.startTime) / 1000));
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.pausedTime = this.timeLeft;
        
        // Atualizar interface
        this.updateButtonStates();
        this.updateTimerStatus('Treino pausado', 'paused');
    }

    reset() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.timeLeft = this.totalTime;
        this.startTime = null;
        this.pausedTime = null;
        
        // Atualizar interface
        this.updateDisplay();
        this.updateButtonStates();
        this.updateTimerStatus('Pronto para começar', 'idle');
        
        // Parar qualquer som
        const finishSound = document.getElementById('finish-sound');
        if (finishSound) {
            finishSound.pause();
            finishSound.currentTime = 0;
        }
    }

    updateDisplay() {
        const timerElement = document.getElementById('main-timer');
        if (!timerElement) return;

        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Mudar cor quando estiver nos últimos 5 minutos
        if (this.timeLeft <= 5 * 60) {
            timerElement.style.background = 'linear-gradient(90deg, #ff2e2e, #ff6b6b)';
            timerElement.style.webkitBackgroundClip = 'text';
            timerElement.style.webkitTextFillColor = 'transparent';
        } else {
            timerElement.style.background = 'linear-gradient(90deg, #ff2e2e, #2e5bff)';
            timerElement.style.webkitBackgroundClip = 'text';
            timerElement.style.webkitTextFillColor = 'transparent';
        }
    }

    updateButtonStates() {
        const startBtn = document.getElementById('start-timer');
        const pauseBtn = document.getElementById('pause-timer');

        if (startBtn) {
            startBtn.disabled = this.isRunning;
            if (this.isRunning) {
                startBtn.style.opacity = '0.5';
                startBtn.style.cursor = 'not-allowed';
            } else {
                startBtn.style.opacity = '1';
                startBtn.style.cursor = 'pointer';
            }
        }

        if (pauseBtn) {
            pauseBtn.disabled = !this.isRunning;
            if (!this.isRunning) {
                pauseBtn.style.opacity = '0.5';
                pauseBtn.style.cursor = 'not-allowed';
            } else {
                pauseBtn.style.opacity = '1';
                pauseBtn.style.cursor = 'pointer';
            }
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
        clearInterval(this.timerInterval);
        
        // Atualizar interface
        this.updateButtonStates();
        this.updateTimerStatus('Treino finalizado!', 'finished');
        
        // Reproduzir som de finalização
        const finishSound = document.getElementById('finish-sound');
        if (finishSound) {
            finishSound.currentTime = 0;
            finishSound.play().catch(e => console.log("Áudio não pode ser reproduzido:", e));
        }
        
        // Mostrar notificação
        this.showTimeUpNotification();
    }

    showTimeUpNotification() {
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = 'time-up-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #00d26a; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 1000; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-flag-checkered"></i>
                <span>Tempo de treino finalizado! Parabéns!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remover após 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Formatar tempo para leitura humana
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else {
            return `${minutes}m ${secs}s`;
        }
    }

    // Obter tempo decorrido
    getElapsedTime() {
        return this.totalTime - this.timeLeft;
    }

    // Obter tempo restante formatado
    getTimeLeftFormatted() {
        return this.formatTime(this.timeLeft);
    }

    // Obter porcentagem concluída
    getProgressPercentage() {
        return ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
    }
}

// Inicializar timer quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.timerManager = new TimerManager();
});

// Expor funções do timer globalmente
function startTimer() {
    if (window.timerManager) window.timerManager.start();
}

function pauseTimer() {
    if (window.timerManager) window.timerManager.pause();
}

function resetTimer() {
    if (window.timerManager) window.timerManager.reset();
}