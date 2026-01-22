// ACADEMIA ELIJUNIO - Timer Manager

class TimerManager {
    constructor() {
        this.totalTime = 90 * 60; // 90 minutos em segundos
        this.timeLeft = this.totalTime;
        this.timerInterval = null;
        this.isRunning = false;
        this.startTime = null;
        this.pausedTime = null;
        this.hasStarted = false; // Nova variável para controlar se já começou
        
        // Obter referência da música do treino
        this.workoutMusic = document.getElementById('workout-music');
        // Obter elementos dos botões
        this.startBtn = document.getElementById('start-timer');
        this.pauseBtn = document.getElementById('pause-timer');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.updateButtonStatesAndText(); // Atualizar botões
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

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.startTime = Date.now() - (this.totalTime - this.timeLeft) * 1000;
        
        // Tocar música do treino APENAS na primeira vez
        if (!this.hasStarted) {
            this.playWorkoutMusicOnce();
            this.hasStarted = true;
        }
        
        // Atualizar interface
        this.updateButtonStatesAndText();
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
        this.updateButtonStatesAndText();
        this.updateTimerStatus('Treino pausado', 'paused');
    }

    reset() {
        this.isRunning = false;
        this.hasStarted = false; // Resetar flag
        clearInterval(this.timerInterval);
        this.timeLeft = this.totalTime;
        this.startTime = null;
        this.pausedTime = null;
        
        // Parar e resetar música do treino
        this.stopWorkoutMusic();
        
        // Atualizar interface
        this.updateDisplay();
        this.updateButtonStatesAndText();
        this.updateTimerStatus('Pronto para começar', 'idle');
        
        // Parar qualquer som de finalização
        const finishSound = document.getElementById('finish-sound');
        if (finishSound) {
            finishSound.pause();
            finishSound.currentTime = 0;
        }
    }

    // Função para tocar música do treino UMA VEZ
    playWorkoutMusicOnce() {
        if (this.workoutMusic) {
            // Verificar se o áudio está carregado
            if (this.workoutMusic.readyState >= 2) {
                this.workoutMusic.currentTime = 0;
                this.workoutMusic.play().catch(e => {
                    console.log("Erro ao tocar música do treino:", e);
                    // Tentar com volume baixo para evitar restrições do navegador
                    this.workoutMusic.volume = 0.1;
                    this.workoutMusic.play().catch(e2 => console.log("Segunda tentativa falhou:", e2));
                });
            } else {
                console.log("Música do treino ainda não carregada");
                // Tentar carregar novamente
                this.workoutMusic.load();
                this.workoutMusic.addEventListener('canplaythrough', () => {
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

    // Atualizar estados e texto dos botões
    updateButtonStatesAndText() {
        // Lógica para o botão Iniciar/Continuar
        if (this.startBtn) {
            if (this.isRunning) {
                // Quando está rodando, esconder o botão
                this.startBtn.style.display = 'none';
                this.startBtn.disabled = true;
                this.startBtn.style.opacity = '0.5';
                this.startBtn.style.cursor = 'not-allowed';
            } else {
                // Quando não está rodando
                this.startBtn.style.display = 'flex';
                this.startBtn.disabled = false;
                this.startBtn.style.opacity = '1';
                this.startBtn.style.cursor = 'pointer';
                
                // Definir texto apropriado
                if (this.hasStarted && this.timeLeft < this.totalTime) {
                    // Já começou antes e está pausado
                    this.startBtn.innerHTML = '<i class="fas fa-play"></i> Continuar';
                } else {
                    // Nunca começou ou foi resetado
                    this.startBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar';
                }
            }
        }

        // Lógica para o botão Pausar
        if (this.pauseBtn) {
            if (this.isRunning) {
                // Quando está rodando, mostrar botão Pausar
                this.pauseBtn.style.display = 'flex';
                this.pauseBtn.disabled = false;
                this.pauseBtn.style.opacity = '1';
                this.pauseBtn.style.cursor = 'pointer';
                this.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
            } else {
                // Quando não está rodando, esconder botão Pausar
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
        this.hasStarted = false; // Resetar para permitir iniciar novamente
        clearInterval(this.timerInterval);
        
        // Atualizar interface
        this.updateButtonStatesAndText();
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