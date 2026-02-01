// ACADEMIA ELIJUNIO - Main JavaScript com Sistema de Pesos, Relatórios e Justificativas

class WorkoutManager {
    constructor() {
        this.currentWorkout = null;
        this.exercises = [];
        this.completedExercises = new Set();
        this.exerciseData = {};
        this.isResting = false;
        this.currentExerciseId = null;
        this.attemptedGenerateWithoutCompletion = false;
        
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
            finishBtn.addEventListener('click', () => this.generateReport());
        }

        // Botão pular descanso
        const skipRestBtn = document.getElementById('skip-rest');
        if (skipRestBtn) {
            skipRestBtn.addEventListener('click', () => this.skipRest());
        }

        // Botão salvar peso
        const saveWeightBtn = document.getElementById('save-weight-btn');
        if (saveWeightBtn) {
            saveWeightBtn.addEventListener('click', () => this.saveWeight());
        }

        // Botão cancelar peso
        const cancelWeightBtn = document.querySelector('.btn-cancel-weight');
        if (cancelWeightBtn) {
            cancelWeightBtn.addEventListener('click', () => this.hideWeightModal());
        }

        // Botões de fechar modal
        document.querySelectorAll('.close-weight-modal, .close-report-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) modal.classList.remove('active');
            });
        });

        // Botões de incremento/decremento de peso
        const decreaseBtn = document.querySelector('.weight-btn.decrease');
        const increaseBtn = document.querySelector('.weight-btn.increase');
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => this.adjustWeight(-2.5));
        }
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => this.adjustWeight(2.5));
        }

        // Botões de peso pré-definido
        document.querySelectorAll('.weight-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const weight = parseFloat(e.target.dataset.weight);
                this.setWeight(weight);
                this.setActivePreset(e.target);
            });
        });

        // Botão copiar relatório
        const copyTextBtn = document.getElementById('copy-text-btn');
        if (copyTextBtn) {
            copyTextBtn.addEventListener('click', () => this.copyReportText());
        }

        // Botão Telegram
        const telegramBtn = document.getElementById('telegram-report-btn');
        if (telegramBtn) {
            telegramBtn.addEventListener('click', () => this.sendToTelegram());
        }

        // Botão WhatsApp
        const whatsappBtn = document.getElementById('whatsapp-report-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => this.sendToWhatsApp());
        }
    }

    // ===== SISTEMA DE TREINO =====
    initWorkout(type, exercises) {
        this.currentWorkout = type;
        this.exercises = exercises;
        this.exerciseData = {};
        this.completedExercises.clear();
        this.attemptedGenerateWithoutCompletion = false;
        this.renderExercises();
        this.updateStats();
        this.loadSavedData();
    }

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

    createExerciseElement(exercise, number) {
        const isCompleted = this.completedExercises.has(exercise.id);
        const exerciseData = this.exerciseData[exercise.id];
        const hasWeightData = exerciseData && exerciseData.weight;
        
        const div = document.createElement('div');
        div.className = `exercise-card ${isCompleted ? 'completed' : ''}`;
        div.dataset.id = exercise.id;
        
        let weightInfoHtml = '';
        if (hasWeightData) {
            weightInfoHtml = `
                <div class="exercise-weight-info">
                    <div class="weight-info-header">
                        <i class="fas fa-weight-hanging"></i>
                        <h4>Desempenho Registrado</h4>
                    </div>
                    <div class="weight-info-content">
                        <div class="weight-info-item">
                            <i class="fas fa-dumbbell"></i>
                            <span class="label">Peso:</span>
                            <span class="value">${exerciseData.weight} kg</span>
                        </div>
                        ${exerciseData.variation ? `
                        <div class="weight-info-item">
                            <i class="fas fa-exchange-alt"></i>
                            <span class="label">Variação:</span>
                            <span class="value">${exerciseData.variation}</span>
                        </div>
                        ` : ''}
                        ${exerciseData.notes ? `
                        <div class="weight-info-item">
                            <i class="fas fa-sticky-note"></i>
                            <span class="label">Notas:</span>
                            <span class="value">${exerciseData.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
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
            
            ${weightInfoHtml}

            <div class="exercise-complete">
                <label class="complete-checkbox">
                    <input type="checkbox" class="checkbox-input" data-id="${exercise.id}" ${isCompleted ? 'checked' : ''}>
                    <div class="checkbox-custom">
                        <i class="fas fa-check"></i>
                    </div>
                    <span class="checkbox-label">${hasWeightData ? 'Concluído ✓' : 'Concluído'}</span>
                </label>
            </div>
        `;
        
        return div;
    }

    createImageSlider(images) {
        if (!images || images.length === 0) return '';
        
        const hasMultiple = images.length > 1;
        const dotsHtml = hasMultiple ? 
            images.map((_, i) => `<button class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('') : 
            '';
        
        return `
            <div class="exercise-images" ${hasMultiple ? `data-count="${images.length}"` : ''}>
                <div class="image-slider" data-current="0">
                    ${images.map((img, i) => 
                        `<img src="${img}" class="slider-image ${i === 0 ? 'active' : ''}" 
                              alt="Demonstração do exercício" 
                              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'"
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

    handleExerciseComplete(event) {
        const checkbox = event.target;
        const exerciseId = parseInt(checkbox.dataset.id);
        const exerciseCard = checkbox.closest('.exercise-card');
        const exercise = this.exercises.find(e => e.id === exerciseId);

        if (!exercise) return;

        if (checkbox.checked) {
            this.currentExerciseId = exerciseId;
            this.showWeightModal(exercise);
        } else {
            this.completedExercises.delete(exerciseId);
            delete this.exerciseData[exerciseId];
            
            if (exerciseCard) {
                exerciseCard.classList.remove('completed');
                const weightInfo = exerciseCard.querySelector('.exercise-weight-info');
                if (weightInfo) weightInfo.remove();
            }
            
            this.updateProgress();
            this.updateStats();
            this.saveData();
        }
    }

    // ===== SISTEMA DE PESOS =====
    showWeightModal(exercise) {
        const modal = document.querySelector('.weight-modal-overlay');
        const variationsContainer = document.getElementById('exercise-variations');
        const weightInput = document.getElementById('weight-input');
        const notesInput = document.getElementById('exercise-notes');
        
        if (!modal || !variationsContainer) return;
        
        const hasMultipleImages = exercise.images && exercise.images.length > 1;
        
        let variationsHtml = '';
        if (hasMultipleImages) {
            const variationNames = ['Cabo', 'Máquina', 'Halteres', 'Barra', 'Smith', 'Livre'];
            variationsHtml = `
                <div class="variation-title">Selecione a variação utilizada:</div>
                <div class="variation-options">
                    ${exercise.images.map((_, index) => {
                        const variationName = variationNames[index] || `Opção ${index + 1}`;
                        return `
                            <div class="variation-option" data-index="${index}">
                                <div class="variation-icon">
                                    <i class="fas fa-dumbbell"></i>
                                </div>
                                <div class="variation-text">
                                    <div class="variation-name">${variationName}</div>
                                    <div class="variation-description">${exercise.name} - ${variationName.toLowerCase()}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } else {
            variationsHtml = `
                <div class="no-variations">
                    <i class="fas fa-check-circle"></i>
                    <p>Este exercício possui apenas uma variação</p>
                </div>
            `;
        }
        
        variationsContainer.innerHTML = variationsHtml;
        
        if (hasMultipleImages) {
            document.querySelectorAll('.variation-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.variation-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                });
            });
            
            const firstOption = variationsContainer.querySelector('.variation-option');
            if (firstOption) firstOption.classList.add('selected');
        }
        
        weightInput.value = '20';
        notesInput.value = '';
        
        document.querySelectorAll('.weight-preset').forEach(p => p.classList.remove('active'));
        
        modal.classList.add('active');
    }

    hideWeightModal() {
        const modal = document.querySelector('.weight-modal-overlay');
        if (modal) modal.classList.remove('active');
    }

    adjustWeight(amount) {
        const weightInput = document.getElementById('weight-input');
        if (!weightInput) return;
        
        let currentWeight = parseFloat(weightInput.value) || 0;
        let newWeight = currentWeight + amount;
        
        newWeight = Math.max(0, Math.min(300, newWeight));
        
        weightInput.value = newWeight.toFixed(1);
        this.updateActivePreset(newWeight);
    }

    setWeight(weight) {
        const weightInput = document.getElementById('weight-input');
        if (!weightInput) return;
        weightInput.value = weight;
    }

    setActivePreset(button) {
        document.querySelectorAll('.weight-preset').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    updateActivePreset(weight) {
        document.querySelectorAll('.weight-preset').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.weight) === weight) {
                btn.classList.add('active');
            }
        });
    }

    saveWeight() {
        if (!this.currentExerciseId) return;
        
        const weightInput = document.getElementById('weight-input');
        const notesInput = document.getElementById('exercise-notes');
        const selectedVariation = document.querySelector('.variation-option.selected');
        
        if (!weightInput) return;
        
        const weight = parseFloat(weightInput.value);
        if (isNaN(weight) || weight <= 0) {
            alert('Por favor, insira um peso válido!');
            return;
        }
        
        const exercise = this.exercises.find(e => e.id === this.currentExerciseId);
        if (!exercise) return;
        
        this.exerciseData[this.currentExerciseId] = {
            weight: weight,
            variation: selectedVariation ? selectedVariation.querySelector('.variation-name').textContent : null,
            notes: notesInput.value.trim() || null,
            date: new Date().toISOString(),
            name: exercise.name,
            sets: exercise.sets
        };
        
        this.completedExercises.add(this.currentExerciseId);
        this.updateExerciseCard(this.currentExerciseId);
        this.updateProgress();
        this.updateStats();
        this.saveData();
        this.hideWeightModal();
        
        const nextIndex = this.findNextUncompletedExercise();
        if (nextIndex !== -1 && nextIndex < this.exercises.length) {
            const currentExercise = this.exercises.find(e => e.id === this.currentExerciseId);
            const nextExercise = this.exercises[nextIndex];
            
            let restTime = 45;
            if (currentExercise && nextExercise && currentExercise.muscleGroup !== nextExercise.muscleGroup) {
                restTime = 90;
            }
            
            this.showRestOverlay(restTime, nextExercise);
        }
        
        const letsgoSound = document.getElementById('letsgo-sound');
        if (letsgoSound) {
            letsgoSound.currentTime = 0;
            letsgoSound.play().catch(e => console.log("Áudio não pode ser reproduzido:", e));
        }
    }

    updateExerciseCard(exerciseId) {
        const exercise = this.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;
        
        const exerciseCard = document.querySelector(`.exercise-card[data-id="${exerciseId}"]`);
        if (!exerciseCard) return;
        
        const exerciseData = this.exerciseData[exerciseId];
        const hasWeightData = exerciseData && exerciseData.weight;
        
        exerciseCard.classList.add('completed');
        
        const checkbox = exerciseCard.querySelector('.checkbox-input');
        const checkboxLabel = exerciseCard.querySelector('.checkbox-label');
        if (checkbox) checkbox.checked = true;
        if (checkboxLabel) checkboxLabel.textContent = 'Concluído ✓';
        
        const existingWeightInfo = exerciseCard.querySelector('.exercise-weight-info');
        if (existingWeightInfo) existingWeightInfo.remove();
        
        if (hasWeightData) {
            const weightInfoHtml = `
                <div class="exercise-weight-info">
                    <div class="weight-info-header">
                        <i class="fas fa-weight-hanging"></i>
                        <h4>Desempenho Registrado</h4>
                    </div>
                    <div class="weight-info-content">
                        <div class="weight-info-item">
                            <i class="fas fa-dumbbell"></i>
                            <span class="label">Peso:</span>
                            <span class="value">${exerciseData.weight} kg</span>
                        </div>
                        ${exerciseData.variation ? `
                        <div class="weight-info-item">
                            <i class="fas fa-exchange-alt"></i>
                            <span class="label">Variação:</span>
                            <span class="value">${exerciseData.variation}</span>
                        </div>
                        ` : ''}
                        ${exerciseData.notes ? `
                        <div class="weight-info-item">
                            <i class="fas fa-sticky-note"></i>
                            <span class="label">Notas:</span>
                            <span class="value">${exerciseData.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            const exerciseComplete = exerciseCard.querySelector('.exercise-complete');
            if (exerciseComplete) {
                exerciseComplete.insertAdjacentHTML('beforebegin', weightInfoHtml);
            }
        }
    }

    // ===== SISTEMA DE DESCANSO =====
    findNextUncompletedExercise() {
        for (let i = 0; i < this.exercises.length; i++) {
            if (!this.completedExercises.has(this.exercises[i].id)) {
                return i;
            }
        }
        return -1;
    }

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
            const groupNames = {
                'peito': 'Peito',
                'quadriceps': 'Quadríceps',
                'ombro': 'Ombro',
                'triceps': 'Tríceps',
                'costas': 'Costas',
                'posterior': 'Posterior',
                'biceps': 'Bíceps',
                'antebraco': 'Antebraço',
                'panturrilha': 'Panturrilha',
                'adutor': 'Adutor',
                'abdutor': 'Abdutor'
            };
            muscleGroupElement.textContent = groupNames[nextExercise.muscleGroup] || nextExercise.muscleGroup;
        }
        
        if (restTypeElement) {
            restTypeElement.textContent = seconds === 45 ? '45 segundos' : '1 minuto 30';
        }
        
        if (overlay) {
            overlay.classList.add('active');
        }
        
        this.startRestTimer(seconds);
    }

    startRestTimer(seconds) {
        const minutesDisplay = document.getElementById('rest-minutes');
        const secondsDisplay = document.getElementById('rest-seconds');
        const progressCircle = document.querySelector('.progress-ring-circle');
        
        if (!minutesDisplay || !secondsDisplay || !progressCircle) return;
        
        let timeLeft = seconds;
        const totalTime = seconds;
        
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = 0;
        
        const updateTimer = () => {
            if (!this.isResting) return;
            
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            minutesDisplay.textContent = minutes.toString().padStart(2, '0');
            secondsDisplay.textContent = seconds.toString().padStart(2, '0');
            
            const progress = timeLeft / totalTime;
            const offset = circumference * progress;
            progressCircle.style.strokeDashoffset = circumference - offset;
            
            if (timeLeft <= 0) {
                this.endRestTimer();
                return;
            }
            
            timeLeft--;
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    endRestTimer() {
        this.isResting = false;
        
        const letsgoSound = document.getElementById('letsgo-sound');
        if (letsgoSound) {
            letsgoSound.currentTime = 0;
            letsgoSound.play().catch(e => console.log("Áudio não pode ser reproduzido:", e));
        }
        
        const overlay = document.querySelector('.rest-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        this.updateProgress();
    }

    skipRest() {
        this.isResting = false;
        
        const overlay = document.querySelector('.rest-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

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
        
        images[currentIndex].classList.remove('active');
        images[nextIndex].classList.add('active');
        
        if (dotButtons) {
            dotButtons[currentIndex]?.classList.remove('active');
            dotButtons[nextIndex]?.classList.add('active');
        }
        
        slider.dataset.current = nextIndex;
    }

    handleSliderDot(event) {
        const dot = event.currentTarget;
        const index = parseInt(dot.dataset.index);
        const slider = dot.closest('.image-slider');
        
        if (!slider) return;
        
        const images = slider.querySelectorAll('.slider-image');
        const dots = slider.querySelector('.slider-dots');
        const dotButtons = dots ? dots.querySelectorAll('.slider-dot') : null;
        
        const currentIndex = parseInt(slider.dataset.current || '0');
        
        images[currentIndex].classList.remove('active');
        images[index].classList.add('active');
        
        if (dotButtons) {
            dotButtons[currentIndex]?.classList.remove('active');
            dotButtons[index]?.classList.add('active');
        }
        
        slider.dataset.current = index;
    }

    updateProgress() {
        const totalExercises = this.exercises.length;
        const completed = this.completedExercises.size;
        const progressPercent = totalExercises > 0 ? (completed / totalExercises) * 100 : 0;
        
        const progressFill = document.getElementById('workout-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        const progressPercentElement = document.querySelector('.progress-percent');
        if (progressPercentElement) {
            progressPercentElement.textContent = `${Math.round(progressPercent)}%`;
        }
    }

    updateStats() {
        const totalExercises = this.exercises.length;
        const completed = this.completedExercises.size;
        
        const completedElement = document.getElementById('completed-exercises');
        if (completedElement) {
            completedElement.textContent = completed;
        }
        
        const totalSetsElement = document.getElementById('total-sets');
        if (totalSetsElement && this.exercises.length > 0) {
            let totalSets = 0;
            this.exercises.forEach(ex => {
                const setsMatch = ex.sets.match(/^(\d+)x/);
                if (setsMatch) {
                    totalSets += parseInt(setsMatch[1]);
                }
            });
            totalSetsElement.textContent = totalSets;
        }
        
        const totalWeightElement = document.getElementById('total-weight');
        if (totalWeightElement) {
            let totalWeight = 0;
            let weightCount = 0;
            
            Object.values(this.exerciseData).forEach(data => {
                if (data.weight) {
                    totalWeight += data.weight;
                    weightCount++;
                }
            });
            
            totalWeightElement.textContent = weightCount > 0 ? totalWeight.toFixed(1) : '0';
        }
    }

    // ===== SISTEMA DE RELATÓRIOS E JUSTIFICATIVAS =====
    generateReport() {
        const completedCount = this.completedExercises.size;
        const totalCount = this.exercises.length;
        const allCompleted = completedCount === totalCount;

        if (allCompleted) {
            this.generateFullReport();
        } else {
            if (this.attemptedGenerateWithoutCompletion) {
                this.showJustificationsModal();
            } else {
                this.showIncompleteAlert();
                this.attemptedGenerateWithoutCompletion = true;
            }
        }
    }

    showIncompleteAlert() {
        const uncompletedCount = this.exercises.length - this.completedExercises.size;
        
        const alertHtml = `
            <div class="incomplete-alert-modal modal-overlay active">
                <div class="incomplete-alert">
                    <div class="alert-header">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Treino Incompleto</h3>
                    </div>
                    <div class="alert-content">
                        <p>Você completou <strong>${this.completedExercises.size}</strong> de <strong>${this.exercises.length}</strong> exercícios.</p>
                        <p><strong>${uncompletedCount} exercício(s) não foi(ram) marcado(s) como concluído(s).</strong></p>
                        <div class="uncompleted-list">
                            <h4>Exercícios pendentes:</h4>
                            <ul>
                                ${this.getUncompletedExercises().map(ex => 
                                    `<li><i class="fas fa-times-circle"></i> ${ex.name} (${ex.sets})</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <p class="alert-info">Clique novamente em "Gerar Relatório" se desejar justificar os exercícios não realizados.</p>
                    </div>
                    <div class="alert-actions">
                        <button class="btn-cancel-alert">Voltar ao Treino</button>
                        <button class="btn-justify-now">Justificar Agora</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', alertHtml);

        const modal = document.querySelector('.incomplete-alert-modal');
        const cancelBtn = modal.querySelector('.btn-cancel-alert');
        const justifyBtn = modal.querySelector('.btn-justify-now');

        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });

        justifyBtn.addEventListener('click', () => {
            modal.remove();
            this.showJustificationsModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showJustificationsModal() {
        const uncompletedExercises = this.getUncompletedExercises();
        
        const justificationsHtml = `
            <div class="justifications-modal modal-overlay active">
                <div class="justifications-modal-content">
                    <div class="modal-header">
                        <h2><i class="fas fa-clipboard-check"></i> Justificar Exercícios Não Realizados</h2>
                        <button class="close-justifications-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <p class="modal-subtitle">Por favor, explique por que não realizou os exercícios abaixo:</p>
                        
                        <div class="justifications-list">
                            ${uncompletedExercises.map((exercise, index) => `
                                <div class="justification-item" data-id="${exercise.id}">
                                    <div class="justification-header">
                                        <div class="exercise-info">
                                            <h4>${exercise.name}</h4>
                                            <span class="exercise-sets">${exercise.sets}</span>
                                        </div>
                                        <div class="justification-toggle">
                                            <button class="toggle-justification-btn ${this.exerciseData[exercise.id]?.justification ? 'active' : ''}" 
                                                    data-id="${exercise.id}">
                                                <i class="fas fa-check"></i>
                                                <span>${this.exerciseData[exercise.id]?.justification ? 'Justificado' : 'Justificar'}</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="justification-textarea ${this.exerciseData[exercise.id]?.justification ? 'active' : ''}">
                                        <textarea id="justification-${exercise.id}" 
                                                  placeholder="Ex: Estava cansado, lesão, falta de tempo, equipamento ocupado..."
                                                  rows="3">${this.exerciseData[exercise.id]?.justification || ''}</textarea>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="justification-options">
                            <h4><i class="fas fa-lightbulb"></i> Sugestões de justificativas:</h4>
                            <div class="options-grid">
                                <button class="option-btn" data-text="Falta de tempo">Falta de tempo</button>
                                <button class="option-btn" data-text="Equipamento ocupado">Equipamento ocupado</button>
                                <button class="option-btn" data-text="Cansaço excessivo">Cansaço excessivo</button>
                                <button class="option-btn" data-text="Lesão/Desconforto">Lesão/Desconforto</button>
                                <button class="option-btn" data-text="Foco em outro grupo">Foco em outro grupo</button>
                                <button class="option-btn" data-text="Outro motivo">Outro motivo</button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel-justifications">Cancelar</button>
                        <button class="btn-save-justifications" id="save-justifications-btn">
                            <i class="fas fa-save"></i> Salvar Justificativas e Gerar Relatório
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', justificationsHtml);

        const modal = document.querySelector('.justifications-modal');
        
        modal.querySelectorAll('.toggle-justification-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = parseInt(e.currentTarget.dataset.id);
                const textarea = modal.querySelector(`#justification-${exerciseId}`);
                const textareaContainer = textarea.closest('.justification-textarea');
                
                textareaContainer.classList.toggle('active');
                e.currentTarget.classList.toggle('active');
                
                if (textareaContainer.classList.contains('active')) {
                    textarea.focus();
                }
            });
        });

        modal.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                const activeTextarea = modal.querySelector('.justification-textarea.active textarea');
                if (activeTextarea) {
                    activeTextarea.value = text;
                } else {
                    this.showNotification('Selecione um exercício para justificar primeiro!', 'warning');
                }
            });
        });

        const cancelBtn = modal.querySelector('.btn-cancel-justifications');
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });

        const saveBtn = modal.querySelector('#save-justifications-btn');
        saveBtn.addEventListener('click', () => this.saveJustifications());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    saveJustifications() {
        const modal = document.querySelector('.justifications-modal');
        if (!modal) return;

        const justificationItems = modal.querySelectorAll('.justification-item');
        let hasJustification = false;

        justificationItems.forEach(item => {
            const exerciseId = parseInt(item.dataset.id);
            const textarea = item.querySelector('textarea');
            const isActive = item.querySelector('.justification-textarea').classList.contains('active');
            
            if (isActive && textarea.value.trim()) {
                if (!this.exerciseData[exerciseId]) {
                    this.exerciseData[exerciseId] = {};
                }
                this.exerciseData[exerciseId].justification = textarea.value.trim();
                this.exerciseData[exerciseId].justified = true;
                hasJustification = true;
            } else if (isActive && !textarea.value.trim()) {
                this.showNotification('Preencha a justificativa para este exercício!', 'warning');
                textarea.focus();
                return false;
            }
        });

        if (hasJustification) {
            modal.remove();
            this.generateFullReport(true);
        }
    }

    getUncompletedExercises() {
        return this.exercises.filter(ex => !this.completedExercises.has(ex.id));
    }

    generateFullReport(hasJustifications = false) {
        this.showReportModal(hasJustifications);
    }

    showReportModal(hasJustifications = false) {
        const modal = document.querySelector('.report-modal-overlay');
        if (!modal) return;

        this.fillReportData(hasJustifications);
        this.generateReportText(hasJustifications);
        modal.classList.add('active');
    }

    hideReportModal() {
        const modal = document.querySelector('.report-modal-overlay');
        if (modal) modal.classList.remove('active');
    }

    fillReportData(hasJustifications = false) {
        const completedCount = this.completedExercises.size;
        const totalCount = this.exercises.length;
        const uncompletedCount = totalCount - completedCount;

        const elements = {
            workoutName: document.getElementById('report-workout-name'),
            date: document.getElementById('report-date'),
            totalExercises: document.getElementById('report-total-exercises'),
            completedExercises: document.getElementById('report-completed-exercises'),
            uncompletedExercises: document.getElementById('report-uncompleted-exercises'),
            avgWeight: document.getElementById('report-avg-weight'),
            exercisesList: document.getElementById('report-exercises-list'),
            summaryDate: document.getElementById('summary-date'),
            summaryWorkout: document.getElementById('summary-workout'),
            summaryCompleted: document.getElementById('summary-completed'),
            summaryTotalWeight: document.getElementById('summary-total-weight'),
            summaryNotes: document.getElementById('summary-notes'),
            justificationsSection: document.getElementById('justifications-section'),
            justificationsList: document.getElementById('justifications-list')
        };

        if (elements.workoutName) {
            elements.workoutName.textContent = this.currentWorkout === 'A' 
                ? 'Treino A (Peito + Quadríceps + Tríceps)' 
                : 'Treino B (Costas + Posterior + Bíceps)';
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        if (elements.date) elements.date.textContent = dateStr;
        if (elements.summaryDate) elements.summaryDate.textContent = dateStr;

        if (elements.totalExercises) elements.totalExercises.textContent = totalCount;
        if (elements.completedExercises) elements.completedExercises.textContent = completedCount;
        if (elements.uncompletedExercises) elements.uncompletedExercises.textContent = uncompletedCount;

        let totalWeight = 0;
        let weightCount = 0;
        Object.values(this.exerciseData).forEach(data => {
            if (data.weight) {
                totalWeight += data.weight;
                weightCount++;
            }
        });

        const avg = weightCount > 0 ? (totalWeight / weightCount).toFixed(1) : '0';
        if (elements.avgWeight) elements.avgWeight.textContent = avg;

        if (elements.exercisesList) {
            elements.exercisesList.innerHTML = '';
            
            this.exercises.forEach(exercise => {
                const exerciseData = this.exerciseData[exercise.id];
                const isCompleted = this.completedExercises.has(exercise.id);
                const hasWeight = exerciseData && exerciseData.weight;
                const hasJustification = exerciseData && exerciseData.justification;

                let statusClass = '';
                let statusIcon = '';
                let statusText = '';

                if (isCompleted && hasWeight) {
                    statusClass = 'completed';
                    statusIcon = '<i class="fas fa-check-circle"></i>';
                    statusText = 'Concluído';
                } else if (hasJustification) {
                    statusClass = 'justified';
                    statusIcon = '<i class="fas fa-comment-alt"></i>';
                    statusText = 'Justificado';
                } else {
                    statusClass = 'not-completed';
                    statusIcon = '<i class="fas fa-times-circle"></i>';
                    statusText = 'Não realizado';
                }

                const exerciseHtml = `
                    <div class="report-exercise-item ${statusClass}">
                        <div class="exercise-item-header">
                            <div class="exercise-item-info">
                                <div class="exercise-status">${statusIcon} ${statusText}</div>
                                <div class="exercise-item-name">${exercise.name}</div>
                            </div>
                            ${hasWeight ? 
                                `<div class="exercise-item-weight">${exerciseData.weight} kg</div>` : 
                                `<div class="exercise-item-weight">-- kg</div>`
                            }
                        </div>
                        
                        <div class="exercise-item-details">
                            <div class="exercise-item-detail">
                                <i class="fas fa-layer-group"></i>
                                <span class="label">Séries:</span>
                                <span class="value">${exercise.sets}</span>
                            </div>
                            
                            ${hasWeight && exerciseData.variation ? `
                                <div class="exercise-item-detail">
                                    <i class="fas fa-exchange-alt"></i>
                                    <span class="label">Variação:</span>
                                    <span class="value">${exerciseData.variation}</span>
                                </div>
                            ` : ''}
                            
                            ${hasWeight && exerciseData.notes ? `
                                <div class="exercise-item-detail">
                                    <i class="fas fa-sticky-note"></i>
                                    <span class="label">Notas:</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${hasWeight && exerciseData.notes ? `
                            <div class="exercise-notes">
                                ${exerciseData.notes}
                            </div>
                        ` : ''}
                        
                        ${hasJustification ? `
                            <div class="exercise-justification">
                                <i class="fas fa-comment-dots"></i>
                                <strong>Justificativa:</strong> ${exerciseData.justification}
                            </div>
                        ` : ''}
                    </div>
                `;
                
                elements.exercisesList.insertAdjacentHTML('beforeend', exerciseHtml);
            });
        }

        if (elements.justificationsSection && elements.justificationsList) {
            const justifiedExercises = this.exercises.filter(ex => 
                this.exerciseData[ex.id] && this.exerciseData[ex.id].justification
            );

            if (justifiedExercises.length > 0) {
                elements.justificationsSection.style.display = 'block';
                elements.justificationsList.innerHTML = justifiedExercises.map(ex => {
                    const data = this.exerciseData[ex.id];
                    return `
                        <div class="justification-summary-item">
                            <div class="justification-exercise">
                                <strong>${ex.name}</strong> (${ex.sets})
                            </div>
                            <div class="justification-text">
                                ${data.justification}
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                elements.justificationsSection.style.display = 'none';
            }
        }

        if (elements.summaryWorkout) {
            elements.summaryWorkout.textContent = this.currentWorkout === 'A' ? 'Treino A' : 'Treino B';
        }

        if (elements.summaryCompleted) {
            elements.summaryCompleted.textContent = `${completedCount}/${totalCount}`;
        }

        if (elements.summaryTotalWeight) {
            elements.summaryTotalWeight.textContent = `${totalWeight.toFixed(1)} kg`;
        }

        const allNotes = Object.values(this.exerciseData)
            .filter(data => data.notes)
            .map(data => data.notes)
            .join(' | ');

        if (elements.summaryNotes) {
            elements.summaryNotes.textContent = allNotes || 'Nenhuma observação registrada';
        }
    }

    generateReportText(hasJustifications = false) {
        const textOutput = document.getElementById('report-text-output');
        if (!textOutput) return;

        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });

        const timeStr = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        const workoutName = this.currentWorkout === 'A' 
            ? 'TREINO A - Peito + Quadríceps + Tríceps' 
            : 'TREINO B - Costas + Posterior + Bíceps';

        const completedCount = this.completedExercises.size;
        const totalCount = this.exercises.length;
        const completionRate = Math.round((completedCount / totalCount) * 100);

        let reportText = `🏋️‍♂️ *RELATÓRIO DE TREINO - ACADEMIA ELIJUNIO* 🏋️‍♂️\n\n`;
        reportText += `📅 Data: ${dateStr}\n`;
        reportText += `⏰ Horário: ${timeStr}\n`;
        reportText += `💪 Treino: ${workoutName}\n`;
        reportText += `✅ Progresso: ${completedCount}/${totalCount} exercícios (${completionRate}%)\n\n`;

        const completedWithWeight = this.exercises.filter(ex => 
            this.completedExercises.has(ex.id) && this.exerciseData[ex.id]?.weight
        );

        if (completedWithWeight.length > 0) {
            reportText += `📊 *EXERCÍCIOS COMPLETOS:*\n\n`;
            
            completedWithWeight.forEach(exercise => {
                const data = this.exerciseData[exercise.id];
                reportText += `✅ *${exercise.name}*\n`;
                reportText += `   🔸 Peso: ${data.weight} kg\n`;
                reportText += `   🔸 Séries: ${exercise.sets}\n`;
                if (data.variation) {
                    reportText += `   🔸 Variação: ${data.variation}\n`;
                }
                if (data.notes) {
                    reportText += `   🔸 Observações: ${data.notes}\n`;
                }
                reportText += `\n`;
            });
        }

        const justifiedExercises = this.exercises.filter(ex => 
            this.exerciseData[ex.id]?.justification
        );

        if (justifiedExercises.length > 0) {
            reportText += `📝 *EXERCÍCIOS JUSTIFICADOS:*\n\n`;
            
            justifiedExercises.forEach(exercise => {
                const data = this.exerciseData[exercise.id];
                reportText += `💬 *${exercise.name}*\n`;
                reportText += `   🔸 Status: Não realizado\n`;
                reportText += `   🔸 Justificativa: ${data.justification}\n`;
                reportText += `   🔸 Séries planejadas: ${exercise.sets}\n\n`;
            });
        }

        const uncompletedWithoutJustification = this.exercises.filter(ex => 
            !this.completedExercises.has(ex.id) && !this.exerciseData[ex.id]?.justification
        );

        if (uncompletedWithoutJustification.length > 0) {
            reportText += `⚠️ *EXERCÍCIOS NÃO REALIZADOS:*\n\n`;
            
            uncompletedWithoutJustification.forEach(exercise => {
                reportText += `❌ ${exercise.name} (${exercise.sets})\n`;
            });
            reportText += `\n`;
        }

        let totalWeight = 0;
        Object.values(this.exerciseData).forEach(data => {
            if (data.weight) totalWeight += data.weight;
        });

        reportText += `📈 *RESUMO GERAL:*\n`;
        reportText += `   ✅ Exercícios completos: ${completedCount}\n`;
        reportText += `   💬 Exercícios justificados: ${justifiedExercises.length}\n`;
        reportText += `   ❌ Exercícios não realizados: ${uncompletedWithoutJustification.length}\n`;
        reportText += `   🏋️ Peso total levantado: ${totalWeight.toFixed(1)} kg\n`;
        reportText += `   ⚖️ Peso médio (exercícios com peso): ${completedWithWeight.length > 0 ? (totalWeight / completedWithWeight.length).toFixed(1) : '0'} kg\n`;
        reportText += `   ⏱️ Tempo estimado: ${this.calculateEstimatedTime()} minutos\n\n`;

        if (completionRate === 100) {
            reportText += `🎉 *TREINO COMPLETO!* Parabéns pela dedicação!\n\n`;
        } else if (justifiedExercises.length > 0) {
            reportText += `👏 *TREINO PARCIALMENTE CONCLUÍDO* - Bom trabalho nas justificativas!\n\n`;
        } else {
            reportText += `💪 *CONTINUE ASSIM!* Cada treino conta!\n\n`;
        }

        reportText += `🔥 *Foco • Disciplina • Resultados* 🔥\n`;
        reportText += `#AcademiaElijunio #${this.currentWorkout === 'A' ? 'TreinoA' : 'TreinoB'}`;

        textOutput.value = reportText;
    }

    calculateEstimatedTime() {
        const completedCount = this.completedExercises.size;
        return completedCount * 5;
    }

    copyReportText() {
        const textOutput = document.getElementById('report-text-output');
        if (!textOutput) return;
        
        textOutput.select();
        textOutput.setSelectionRange(0, 99999);
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showNotification('Relatório copiado para a área de transferência!', 'success');
                
                const copyBtn = document.getElementById('copy-text-btn');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    copyBtn.style.background = 'var(--accent-green)';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.style.background = '';
                    }, 2000);
                }
            }
        } catch (err) {
            console.error('Erro ao copiar:', err);
            this.showNotification('Erro ao copiar o relatório.', 'error');
        }
    }

    sendToTelegram() {
        const textOutput = document.getElementById('report-text-output');
        if (!textOutput || !textOutput.value) return;
        
        const reportText = encodeURIComponent(textOutput.value);
        const telegramChatId = '-1002074157691';
        const telegramBotToken = 'SEU_BOT_TOKEN_AQUI';
        
        if (telegramBotToken === 'SEU_BOT_TOKEN_AQUI') {
            const telegramURL = `https://t.me/share/url?url=${encodeURIComponent('Relatório de Treino')}&text=${reportText}`;
            window.open(telegramURL, '_blank');
            this.showNotification('Abra o Telegram para enviar o relatório!', 'info');
        } else {
            const apiURL = `https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${reportText}&parse_mode=Markdown`;
            
            fetch(apiURL)
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        this.showNotification('Relatório enviado para o Telegram!', 'success');
                    } else {
                        this.showNotification('Erro ao enviar para o Telegram.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    this.showNotification('Erro de conexão com o Telegram.', 'error');
                });
        }
    }

    sendToWhatsApp() {
        const textOutput = document.getElementById('report-text-output');
        if (!textOutput || !textOutput.value) return;
        
        const reportText = encodeURIComponent(textOutput.value);
        const phoneNumber = '31973112693';
        const whatsappGroupLink = 'https://chat.whatsapp.com/SEU_LINK_DO_GRUPO';
        
        if (whatsappGroupLink !== 'https://chat.whatsapp.com/SEU_LINK_DO_GRUPO') {
            window.open(whatsappGroupLink, '_blank');
            this.showNotification('Entre no grupo do WhatsApp para enviar o relatório!', 'info');
            
            setTimeout(() => {
                const whatsappURL = `https://wa.me/?text=${reportText}`;
                window.open(whatsappURL, '_blank');
            }, 2000);
        } else {
            const whatsappURL = `https://wa.me/55${phoneNumber}?text=${reportText}`;
            window.open(whatsappURL, '_blank');
            this.showNotification('Abra o WhatsApp para enviar o relatório!', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#00d26a' : type === 'error' ? '#ff4757' : type === 'warning' ? '#ffa502' : '#2e86de'}; 
                        color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
                        z-index: 3000; display: flex; align-items: center; gap: 10px; max-width: 300px; animation: slideIn 0.3s ease;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    saveData() {
        const data = {
            workout: this.currentWorkout,
            completedExercises: Array.from(this.completedExercises),
            exerciseData: this.exerciseData,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`academia_elijunio_${this.currentWorkout}`, JSON.stringify(data));
    }

    loadSavedData() {
        const saved = localStorage.getItem(`academia_elijunio_${this.currentWorkout}`);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                if (data.workout === this.currentWorkout) {
                    if (data.completedExercises) {
                        data.completedExercises.forEach(id => {
                            this.completedExercises.add(id);
                        });
                    }
                    
                    if (data.exerciseData) {
                        this.exerciseData = data.exerciseData;
                    }
                    
                    this.updateExerciseCardsFromData();
                    this.updateProgress();
                    this.updateStats();
                }
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
            }
        }
    }

    updateExerciseCardsFromData() {
        Object.keys(this.exerciseData).forEach(exerciseId => {
            this.updateExerciseCard(parseInt(exerciseId));
        });
    }

    clearSavedData() {
        localStorage.removeItem(`academia_elijunio_${this.currentWorkout}`);
        this.completedExercises.clear();
        this.exerciseData = {};
        this.renderExercises();
        this.updateProgress();
        this.updateStats();
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.workoutManager = new WorkoutManager();
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
    
    document.querySelectorAll('.workout-card, .exercise-card, .stat-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    });
    
    setTimeout(animateOnScroll, 100);
    window.addEventListener('scroll', animateOnScroll);
});