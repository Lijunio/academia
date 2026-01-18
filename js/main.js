// ACADEMIA ELIJUNIO - Main JavaScript (CORRIGIDO)

class WorkoutManager {
    constructor() {
        this.currentWorkout = null;
        this.exercises = [];
        this.completedExercises = new Set();
        this.isResting = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
    }

    bindEvents() {
        // Botão finalizar treino
        const finishBtn = document.getElementById('finish-workout');
        if (finishBtn) {
            finishBtn.addEventListener('click', () => this.finishWorkout());
        }

        // Botão pular descanso
        const skipRestBtn = document.getElementById('skip-rest');
        if (skipRestBtn) {
            skipRestBtn.addEventListener('click', () => this.skipRest());
        }
    }

    // Inicializar treino específico
    initWorkout(type, exercises) {
        this.currentWorkout = type;
        this.exercises = exercises;
        this.renderExercises();
        this.updateStats();
    }

    // Renderizar lista de exercícios (CORRIGIDO)
    renderExercises() {
        const container = document.getElementById('exercises-list');
        if (!container) return;

        container.innerHTML = '';

        this.exercises.forEach((exercise, index) => {
            const exerciseElement = this.createExerciseElement(exercise, index + 1);
            container.appendChild(exerciseElement);
        });

        // Adicionar eventos aos checkboxes
        document.querySelectorAll('.checkbox-input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleExerciseComplete(e));
        });

        // Adicionar eventos aos controles do carrossel
        document.querySelectorAll('.slider-nav').forEach(button => {
            button.addEventListener('click', (e) => this.handleSliderNav(e));
        });

        // Adicionar eventos aos dots do carrossel
        document.querySelectorAll('.slider-dot').forEach(dot => {
            dot.addEventListener('click', (e) => this.handleSliderDot(e));
        });
    }

    // Criar elemento de exercício (CORRIGIDO)
    createExerciseElement(exercise, number) {
        const isCompleted = this.completedExercises.has(exercise.id);
        const hasMultipleImages = exercise.images && exercise.images.length > 1;
        
        const div = document.createElement('div');
        div.className = `exercise-card ${isCompleted ? 'completed' : ''}`;
        div.dataset.id = exercise.id;
        
        div.innerHTML = `
            <div class="exercise-header">
                <div class="exercise-number">${number}</div>
                <div class="exercise-info">
                    <h3 class="exercise-name">${exercise.name}</h3>
                    <div class="exercise-sets">${exercise.sets}</div>
                    <p class="exercise-description">${exercise.description}</p>
                </div>
            </div>

            ${exercise.images && exercise.images.length > 0 ? this.createImageSlider(exercise.images) : ''}

            <div class="exercise-complete">
                <label class="complete-checkbox">
                    <input type="checkbox" class="checkbox-input" data-id="${exercise.id}" ${isCompleted ? 'checked' : ''}>
                    <div class="checkbox-custom">
                        <i class="fas fa-check"></i>
                    </div>
                    <span class="checkbox-label">✔ Concluído</span>
                </label>
            </div>
        `;
        
        return div;
    }

    // Criar carrossel de imagens (CORRIGIDO)
createImageSlider(images) {
    if (!images || images.length === 0) return '';
    
    const hasMultiple = images.length > 1;
    const dotsHtml = hasMultiple ? 
        images.map((_, i) => `<button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('') : 
        '';
    
    // Fallback específico para cada tipo de erro
    const fallbackImages = [
        'https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1598974357801-cbca100e5d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ];
    
    // Para exercícios com múltiplas imagens, podemos definir legendas
    const getImageAlt = (index, total) => {
        if (total === 1) return "Demonstração do exercício";
        const variations = ["Cabo", "Máquina", "Halteres", "Barra"];
        return variations[index] || `Opção ${index + 1}`;
    };
    
    return `
        <div class="exercise-images" ${hasMultiple ? `data-count="${images.length}"` : ''}>
            <div class="image-slider" data-current="0">
                ${images.map((img, i) => 
                    `<img src="${img}" class="slider-image ${i === 0 ? 'active' : ''}" 
                          alt="${getImageAlt(i, images.length)}" 
                          onerror="this.onerror=null; this.src='${fallbackImages[i % fallbackImages.length]}'"
                          loading="lazy">`
                ).join('')}
                
                ${hasMultiple ? `
                    <button class="slider-nav slider-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="slider-nav slider-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="slider-dots">${dotsHtml}</div>
                ` : ''}
            </div>
        </div>
    `;
}

    // Marcar exercício como concluído (CORRIGIDO)
    handleExerciseComplete(event) {
        const checkbox = event.target;
        const exerciseId = parseInt(checkbox.dataset.id);
        const exerciseCard = checkbox.closest('.exercise-card');

        if (checkbox.checked) {
            this.completedExercises.add(exerciseId);
            if (exerciseCard) {
                exerciseCard.classList.add('completed');
            }
            
            // Encontrar próximo exercício não concluído
            const nextIndex = this.findNextUncompletedExercise();
            
            // Determinar tempo de descanso
            if (nextIndex !== -1 && nextIndex < this.exercises.length) {
                const currentExercise = this.exercises.find(e => e.id === exerciseId);
                const nextExercise = this.exercises[nextIndex];
                
                let restTime = 45; // 45 segundos padrão
                
                if (currentExercise && nextExercise) {
                    // Se grupos musculares diferentes, 90 segundos
                    if (currentExercise.muscleGroup !== nextExercise.muscleGroup) {
                        restTime = 90;
                    }
                    
                    // Mostrar overlay de descanso
                    this.showRestOverlay(restTime, nextExercise);
                }
            }
        } else {
            this.completedExercises.delete(exerciseId);
            if (exerciseCard) {
                exerciseCard.classList.remove('completed');
            }
        }

        this.updateProgress();
        this.updateStats();
    }

    // Encontrar próximo exercício não concluído
    findNextUncompletedExercise() {
        for (let i = 0; i < this.exercises.length; i++) {
            if (!this.completedExercises.has(this.exercises[i].id)) {
                return i;
            }
        }
        return -1; // Todos concluídos
    }

    // Mostrar overlay de descanso (CORRIGIDO)
    showRestOverlay(seconds, nextExercise) {
        this.isResting = true;
        
        const overlay = document.querySelector('.rest-overlay');
        const nextExerciseName = document.querySelector('.next-exercise-name');
        const muscleGroupElement = document.querySelector('.muscle-group');
        const restTypeElement = document.querySelector('.rest-type');
        
        if (nextExerciseName && nextExercise) {
            nextExerciseName.textContent = nextExercise.name;
        }
        
        if (muscleGroupElement && nextExercise) {
            // Converter nome do grupo muscular para formato legível
            const groupNames = {
                'peito': 'Peito',
                'quadriceps': 'Quadríceps',
                'ombro': 'Ombro',
                'triceps': 'Tríceps',
                'costas': 'Costas',
                'posterior': 'Posterior',
                'biceps': 'Bíceps'
            };
            muscleGroupElement.textContent = groupNames[nextExercise.muscleGroup] || nextExercise.muscleGroup;
        }
        
        if (restTypeElement) {
            restTypeElement.textContent = seconds === 45 ? '45 segundos' : '1 minuto 30';
        }
        
        if (overlay) {
            overlay.classList.add('active');
        }
        
        // Iniciar timer de descanso
        this.startRestTimer(seconds);
    }

    // Iniciar timer de descanso
    startRestTimer(seconds) {
        const minutesDisplay = document.getElementById('rest-minutes');
        const secondsDisplay = document.getElementById('rest-seconds');
        const progressCircle = document.querySelector('.progress-ring-circle');
        
        if (!minutesDisplay || !secondsDisplay || !progressCircle) return;
        
        let timeLeft = seconds;
        const totalTime = seconds;
        
        // Configurar animação do círculo
        const circumference = 2 * Math.PI * 90;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
        
        const updateTimer = () => {
            if (!this.isResting) return;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            minutesDisplay.textContent = minutes.toString().padStart(2, '0');
            secondsDisplay.textContent = seconds.toString().padStart(2, '0');
            
            // Atualizar progresso do círculo
            const offset = circumference - (timeLeft / totalTime) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            
            if (timeLeft <= 0) {
                this.endRestTimer();
                return;
            }
            
            timeLeft--;
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    // Finalizar timer de descanso
    endRestTimer() {
        this.isResting = false;
        
        // Reproduzir som "Let's go!"
        const letsgoSound = document.getElementById('letsgo-sound');
        if (letsgoSound) {
            letsgoSound.currentTime = 0;
            letsgoSound.play().catch(e => console.log("Áudio não pode ser reproduzido:", e));
        }
        
        // Fechar overlay
        const overlay = document.querySelector('.rest-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Atualizar interface
        this.updateProgress();
    }

    // Pular descanso
    skipRest() {
        this.isResting = false;
        
        const overlay = document.querySelector('.rest-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Navegação do carrossel (CORRIGIDO)
    handleSliderNav(event) {
        const button = event.currentTarget;
        const slider = button.closest('.image-slider');
        if (!slider) return;
        
        const images = slider.querySelectorAll('.slider-image');
        const dots = slider.querySelector('.slider-dots');
        const dotButtons = dots ? dots.querySelectorAll('.slider-dot') : null;
        
        const currentIndex = parseInt(slider.dataset.current || '0');
        let nextIndex;
        
        if (button.classList.contains('slider-next')) {
            nextIndex = (currentIndex + 1) % images.length;
        } else {
            nextIndex = (currentIndex - 1 + images.length) % images.length;
        }
        
        // Atualizar imagem ativa
        images[currentIndex].classList.remove('active');
        images[nextIndex].classList.add('active');
        
        // Atualizar dots
        if (dotButtons) {
            dotButtons[currentIndex]?.classList.remove('active');
            dotButtons[nextIndex]?.classList.add('active');
        }
        
        // Atualizar índice atual
        slider.dataset.current = nextIndex;
    }

    // Navegação por dots do carrossel (NOVO)
    handleSliderDot(event) {
        const dot = event.currentTarget;
        const index = parseInt(dot.dataset.index);
        const slider = dot.closest('.image-slider');
        
        if (!slider) return;
        
        const images = slider.querySelectorAll('.slider-image');
        const dots = slider.querySelector('.slider-dots');
        const dotButtons = dots ? dots.querySelectorAll('.slider-dot') : null;
        
        const currentIndex = parseInt(slider.dataset.current || '0');
        
        // Atualizar imagem ativa
        images[currentIndex].classList.remove('active');
        images[index].classList.add('active');
        
        // Atualizar dots
        if (dotButtons) {
            dotButtons[currentIndex]?.classList.remove('active');
            dotButtons[index]?.classList.add('active');
        }
        
        // Atualizar índice atual
        slider.dataset.current = index;
    }

    // Atualizar progresso geral (CORRIGIDO)
    updateProgress() {
        const totalExercises = this.exercises.length;
        const completed = this.completedExercises.size;
        const progressPercent = totalExercises > 0 ? (completed / totalExercises) * 100 : 0;
        
        // Atualizar barra de progresso
        const progressFill = document.getElementById('workout-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        // Atualizar porcentagem
        const progressPercentElement = document.querySelector('.progress-percent');
        if (progressPercentElement) {
            progressPercentElement.textContent = `${Math.round(progressPercent)}%`;
        }
    }

    // Atualizar estatísticas (CORRIGIDO - removendo calorias estimadas)
    updateStats() {
        const totalExercises = this.exercises.length;
        const completed = this.completedExercises.size;
        
        // Exercícios concluídos
        const completedElement = document.getElementById('completed-exercises');
        if (completedElement) {
            completedElement.textContent = completed;
        }
        
        // Séries totais (CORRIGIDO)
        const totalSetsElement = document.getElementById('total-sets');
        if (totalSetsElement && this.exercises.length > 0) {
            let totalSets = 0;
            this.exercises.forEach(ex => {
                // Extrair número de séries do formato "4x 6–8"
                const setsMatch = ex.sets.match(/^(\d+)x/);
                if (setsMatch) {
                    totalSets += parseInt(setsMatch[1]);
                }
            });
            totalSetsElement.textContent = totalSets;
        }
        
        // Remover ou ocultar elemento de calorias estimadas
        const caloriesElement = document.getElementById('estimated-calories');
        const statCard = caloriesElement?.closest('.stat-card');
        if (statCard) {
            statCard.style.display = 'none'; // Oculta o card de calorias
        }
    }

    // Finalizar treino
    finishWorkout() {
        if (confirm('Tem certeza que deseja finalizar o treino? Todos os dados serão salvos.')) {
            // Reproduzir som de finalização
            const finishSound = document.getElementById('finish-sound');
            if (finishSound) {
                finishSound.currentTime = 0;
                finishSound.play().catch(e => console.log("Áudio não pode ser reproduzido:", e));
            }
            
            // Salvar progresso no localStorage
            this.saveProgress();
            
            // Redirecionar para página inicial após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
            // Mostrar mensagem de sucesso
            alert('Treino finalizado com sucesso! Redirecionando...');
        }
    }

    // Salvar progresso
    saveProgress() {
        const progress = {
            workout: this.currentWorkout,
            completedExercises: Array.from(this.completedExercises),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('academia_elijunio_progress', JSON.stringify(progress));
    }

    // Carregar progresso
    loadProgress() {
        const saved = localStorage.getItem('academia_elijunio_progress');
        if (saved) {
            try {
                const progress = JSON.parse(saved);
                if (progress.workout === this.currentWorkout && progress.completedExercises) {
                    progress.completedExercises.forEach(id => {
                        this.completedExercises.add(id);
                    });
                    
                    // Atualizar checkboxes
                    document.querySelectorAll('.checkbox-input').forEach(checkbox => {
                        const exerciseId = parseInt(checkbox.dataset.id);
                        if (this.completedExercises.has(exerciseId)) {
                            checkbox.checked = true;
                            const card = checkbox.closest('.exercise-card');
                            if (card) {
                                card.classList.add('completed');
                            }
                        }
                    });
                    
                    this.updateProgress();
                    this.updateStats();
                }
            } catch (e) {
                console.error('Erro ao carregar progresso:', e);
            }
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.workoutManager = new WorkoutManager();
    
    // Verificar se há progresso salvo
    setTimeout(() => {
        if (window.workoutManager) {
            window.workoutManager.loadProgress();
        }
    }, 100);
});

// Função global para inicializar treino específico
function initWorkout(type, exercises) {
    if (window.workoutManager) {
        window.workoutManager.initWorkout(type, exercises);
    }
}

// Animações de entrada suaves
document.addEventListener('DOMContentLoaded', () => {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.workout-card, .exercise-card, .stat-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Aplicar estilos iniciais para animação
    document.querySelectorAll('.workout-card, .exercise-card, .stat-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
    
    // Disparar animação na carga inicial
    setTimeout(animateOnScroll, 100);
    
    // Disparar animação no scroll
    window.addEventListener('scroll', animateOnScroll);
});