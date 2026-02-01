// ACADEMIA ELIJUNIO - Main JavaScript com Sistema de Pesos e Relatórios

class WorkoutManager {
    constructor() {
        this.currentWorkout = null;
        this.exercises = [];
        this.completedExercises = new Set();
        this.exerciseData = {}; // Armazenar dados dos exercícios (peso, variação, notas)
        this.isResting = false;
        this.currentExerciseId = null; // Exercício atual para registro de peso
        
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

        // Botão fechar modal de peso
        const closeWeightModal = document.querySelector('.close-weight-modal');
        if (closeWeightModal) {
            closeWeightModal.addEventListener('click', () => this.hideWeightModal());
        }

        // Botão fechar modal de relatório
        const closeReportModal = document.querySelector('.close-report-modal');
        if (closeReportModal) {
            closeReportModal.addEventListener('click', () => this.hideReportModal());
        }

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

    // Inicializar treino específico
    initWorkout(type, exercises) {
        this.currentWorkout = type;
        this.exercises = exercises;
        this.exerciseData = {}; // Resetar dados
        this.completedExercises.clear();
        this.renderExercises();
        this.updateStats();
        this.loadSavedData();
    }

    // Renderizar lista de exercícios
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

    // Criar elemento de exercício
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

    // Criar carrossel de imagens
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

    // Marcar exercício como concluído
    handleExerciseComplete(event) {
        const checkbox = event.target;
        const exerciseId = parseInt(checkbox.dataset.id);
        const exerciseCard = checkbox.closest('.exercise-card');
        const exercise = this.exercises.find(e => e.id === exerciseId);

        if (!exercise) return;

        if (checkbox.checked) {
            // Salvar ID do exercício atual
            this.currentExerciseId = exerciseId;
            
            // Mostrar modal para registrar peso
            this.showWeightModal(exercise);
            
        } else {
            // Desmarcar exercício
            this.completedExercises.delete(exerciseId);
            delete this.exerciseData[exerciseId];
            
            if (exerciseCard) {
                exerciseCard.classList.remove('completed');
                // Remover info de peso
                const weightInfo = exerciseCard.querySelector('.exercise-weight-info');
                if (weightInfo) weightInfo.remove();
            }
            
            this.updateProgress();
            this.updateStats();
            this.saveData();
        }
    }

    // Mostrar modal de registro de peso
    showWeightModal(exercise) {
        const modal = document.querySelector('.weight-modal-overlay');
        const variationsContainer = document.getElementById('exercise-variations');
        const weightInput = document.getElementById('weight-input');
        const notesInput = document.getElementById('exercise-notes');
        
        if (!modal || !variationsContainer) return;
        
        // Configurar variações baseadas nas imagens
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
        
        // Adicionar eventos às variações
        if (hasMultipleImages) {
            document.querySelectorAll('.variation-option').forEach(option => {
                option.addEventListener('click', () => {
                    document.querySelectorAll('.variation-option').forEach(o => o.classList.remove('selected'));
                    option.classList.add('selected');
                });
            });
            
            // Selecionar primeira variação por padrão
            const firstOption = variationsContainer.querySelector('.variation-option');
            if (firstOption) firstOption.classList.add('selected');
        }
        
        // Resetar inputs
        weightInput.value = '20';
        notesInput.value = '';
        
        // Limpar presets ativos
        document.querySelectorAll('.weight-preset').forEach(p => p.classList.remove('active'));
        
        // Mostrar modal
        modal.classList.add('active');
    }

    // Esconder modal de peso
    hideWeightModal() {
        const modal = document.querySelector('.weight-modal-overlay');
        if (modal) modal.classList.remove('active');
    }

    // Ajustar peso
    adjustWeight(amount) {
        const weightInput = document.getElementById('weight-input');
        if (!weightInput) return;
        
        let currentWeight = parseFloat(weightInput.value) || 0;
        let newWeight = currentWeight + amount;
        
        // Limitar entre 0 e 300 kg
        newWeight = Math.max(0, Math.min(300, newWeight));
        
        weightInput.value = newWeight.toFixed(1);
        
        // Atualizar preset ativo
        this.updateActivePreset(newWeight);
    }

    // Definir peso específico
    setWeight(weight) {
        const weightInput = document.getElementById('weight-input');
        if (!weightInput) return;
        
        weightInput.value = weight;
    }

    // Definir preset ativo
    setActivePreset(button) {
        document.querySelectorAll('.weight-preset').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    // Atualizar preset ativo baseado no peso
    updateActivePreset(weight) {
        document.querySelectorAll('.weight-preset').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.weight) === weight) {
                btn.classList.add('active');
            }
        });
    }

    // Salvar peso do exercício
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
        
        // Salvar dados do exercício
        this.exerciseData[this.currentExerciseId] = {
            weight: weight,
            variation: selectedVariation ? selectedVariation.querySelector('.variation-name').textContent : null,
            notes: notesInput.value.trim() || null,
            date: new Date().toISOString(),
            name: exercise.name,
            sets: exercise.sets
        };
        
        // Marcar como concluído
        this.completedExercises.add(this.currentExerciseId);
        
        // Atualizar interface
        this.updateExerciseCard(this.currentExerciseId);
        this.updateProgress();
        this.updateStats();
        this.saveData();
        
        // Esconder modal
        this.hideWeightModal();
        
        // Encontrar próximo exercício não concluído
        const nextIndex = this.findNextUncompletedExercise();
        
        // Determinar tempo de descanso
        if (nextIndex !== -1 && nextIndex < this.exercises.length) {
            const currentExercise = this.exercises.find(e => e.id === this.currentExerciseId);
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
        
        // Reproduzir som de confirmação
        const letsgoSound = document.getElementById('letsgo-sound');
        if (letsgoSound) {
            letsgoSound.currentTime = 0;
            letsgoSound.play().catch(e => console.log("Áudio não pode ser reproduzido:", e));
        }
    }

    // Atualizar card do exercício
    updateExerciseCard(exerciseId) {
        const exercise = this.exercises.find(e => e.id === exerciseId);
        if (!exercise) return;
        
        const exerciseCard = document.querySelector(`.exercise-card[data-id="${exerciseId}"]`);
        if (!exerciseCard) return;
        
        const exerciseData = this.exerciseData[exerciseId];
        const hasWeightData = exerciseData && exerciseData.weight;
        
        // Atualizar classe completed
        exerciseCard.classList.add('completed');
        
        // Atualizar checkbox
        const checkbox = exerciseCard.querySelector('.checkbox-input');
        const checkboxLabel = exerciseCard.querySelector('.checkbox-label');
        if (checkbox) checkbox.checked = true;
        if (checkboxLabel) checkboxLabel.textContent = 'Concluído ✓';
        
        // Remover info de peso existente
        const existingWeightInfo = exerciseCard.querySelector('.exercise-weight-info');
        if (existingWeightInfo) existingWeightInfo.remove();
        
        // Adicionar nova info de peso
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
            
            // Inserir antes do exercise-complete
            const exerciseComplete = exerciseCard.querySelector('.exercise-complete');
            if (exerciseComplete) {
                exerciseComplete.insertAdjacentHTML('beforebegin', weightInfoHtml);
            }
        }
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

    // Mostrar overlay de descanso
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

    // Finalizar timer de descanso
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

    // Pular descanso
    skipRest() {
        this.isResting = false;
        
        const overlay = document.querySelector('.rest-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // Navegação do carrossel
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

    // Navegação por dots do carrossel
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

    // Atualizar progresso geral
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

    // Atualizar estatísticas
    updateStats() {
        const totalExercises = this.exercises.length;
        const completed = this.completedExercises.size;
        
        // Exercícios concluídos
        const completedElement = document.getElementById('completed-exercises');
        if (completedElement) {
            completedElement.textContent = completed;
        }
        
        // Séries totais
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
        
        // Peso total registrado
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

    // Gerar relatório
    generateReport() {
        const completedCount = this.completedExercises.size;
        const totalCount = this.exercises.length;
        
        if (completedCount === 0) {
            alert('Complete pelo menos um exercício antes de gerar o relatório!');
            return;
        }
        
        this.showReportModal();
    }

    // Mostrar modal de relatório
    showReportModal() {
        const modal = document.querySelector('.report-modal-overlay');
        if (!modal) return;
        
        // Preencher dados do relatório
        this.fillReportData();
        
        // Gerar texto do relatório
        this.generateReportText();
        
        // Mostrar modal
        modal.classList.add('active');
    }

    // Esconder modal de relatório
    hideReportModal() {
        const modal = document.querySelector('.report-modal-overlay');
        if (modal) modal.classList.remove('active');
    }

    // Preencher dados do relatório
    fillReportData() {
        const workoutName = document.getElementById('report-workout-name');
        const reportDate = document.getElementById('report-date');
        const totalExercises = document.getElementById('report-total-exercises');
        const avgWeight = document.getElementById('report-avg-weight');
        const exercisesList = document.getElementById('report-exercises-list');
        const summaryDate = document.getElementById('summary-date');
        const summaryWorkout = document.getElementById('summary-workout');
        const summaryCompleted = document.getElementById('summary-completed');
        const summaryTotalWeight = document.getElementById('summary-total-weight');
        const summaryNotes = document.getElementById('summary-notes');
        
        if (!workoutName || !exercisesList) return;
        
        // Nome do treino
        workoutName.textContent = this.currentWorkout === 'A' ? 'Treino A (Peito + Quadríceps + Tríceps)' : 'Treino B (Costas + Posterior + Bíceps)';
        
        // Data atual
        const now = new Date();
        const dateStr = now.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        if (reportDate) reportDate.textContent = dateStr;
        if (summaryDate) summaryDate.textContent = dateStr;
        
        // Estatísticas
        const completedCount = this.completedExercises.size;
        const totalCount = this.exercises.length;
        
        if (totalExercises) totalExercises.textContent = completedCount;
        
        // Peso médio
        let totalWeight = 0;
        let weightCount = 0;
        Object.values(this.exerciseData).forEach(data => {
            if (data.weight) {
                totalWeight += data.weight;
                weightCount++;
            }
        });
        
        const avg = weightCount > 0 ? (totalWeight / weightCount).toFixed(1) : '0';
        if (avgWeight) avgWeight.textContent = avg;
        
        // Lista de exercícios
        exercisesList.innerHTML = '';
        Object.entries(this.exerciseData).forEach(([id, data]) => {
            const exercise = this.exercises.find(e => e.id === parseInt(id));
            if (!exercise || !data.weight) return;
            
            const exerciseHtml = `
                <div class="report-exercise-item">
                    <div class="exercise-item-header">
                        <div class="exercise-item-name">${exercise.name}</div>
                        <div class="exercise-item-weight">${data.weight} kg</div>
                    </div>
                    <div class="exercise-item-details">
                        <div class="exercise-item-detail">
                            <i class="fas fa-layer-group"></i>
                            <span class="label">Séries:</span>
                            <span class="value">${exercise.sets}</span>
                        </div>
                        ${data.variation ? `
                        <div class="exercise-item-detail">
                            <i class="fas fa-exchange-alt"></i>
                            <span class="label">Variação:</span>
                            <span class="value">${data.variation}</span>
                        </div>
                        ` : ''}
                        ${data.notes ? `
                        <div class="exercise-item-detail">
                            <i class="fas fa-sticky-note"></i>
                            <span class="label">Notas:</span>
                        </div>
                        ` : ''}
                    </div>
                    ${data.notes ? `
                    <div class="exercise-notes" style="margin-top: 10px; color: var(--text-secondary); font-size: 0.9rem;">
                        ${data.notes}
                    </div>
                    ` : ''}
                </div>
            `;
            
            exercisesList.insertAdjacentHTML('beforeend', exerciseHtml);
        });
        
        // Resumo
        if (summaryWorkout) {
            summaryWorkout.textContent = this.currentWorkout === 'A' ? 'Treino A' : 'Treino B';
        }
        
        if (summaryCompleted) {
            summaryCompleted.textContent = `${completedCount}/${totalCount}`;
        }
        
        if (summaryTotalWeight) {
            summaryTotalWeight.textContent = `${totalWeight.toFixed(1)} kg`;
        }
        
        // Notas gerais
        const allNotes = Object.values(this.exerciseData)
            .filter(data => data.notes)
            .map(data => data.notes)
            .join(' | ');
        
        if (summaryNotes) {
            summaryNotes.textContent = allNotes || 'Nenhuma observação registrada';
        }
    }

    // Gerar texto do relatório
    generateReportText() {
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
        
        const workoutName = this.currentWorkout === 'A' ? 
            'TREINO A - Peito + Quadríceps + Tríceps' : 
            'TREINO B - Costas + Posterior + Bíceps';
        
        let reportText = `🏋️‍♂️ *RELATÓRIO DE TREINO - ACADEMIA ELIJUNIO* 🏋️‍♂️\n\n`;
        reportText += `📅 Data: ${dateStr}\n`;
        reportText += `⏰ Horário: ${timeStr}\n`;
        reportText += `💪 Treino: ${workoutName}\n`;
        reportText += `✅ Progresso: ${this.completedExercises.size}/${this.exercises.length} exercícios\n\n`;
        reportText += `📊 *DESEMPENHO POR EXERCÍCIO:*\n\n`;
        
        // Calcular totais
        let totalWeight = 0;
        let completedWithWeight = 0;
        
        Object.entries(this.exerciseData).forEach(([id, data]) => {
            const exercise = this.exercises.find(e => e.id === parseInt(id));
            if (!exercise || !data.weight) return;
            
            totalWeight += data.weight;
            completedWithWeight++;
            
            reportText += `➡️ *${exercise.name}*\n`;
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
        
        const avgWeight = completedWithWeight > 0 ? (totalWeight / completedWithWeight).toFixed(1) : '0';
        
        reportText += `📈 *RESUMO GERAL:*\n`;
        reportText += `   ✅ Exercícios completos: ${this.completedExercises.size}\n`;
        reportText += `   🏋️ Peso total levantado: ${totalWeight.toFixed(1)} kg\n`;
        reportText += `   ⚖️ Peso médio: ${avgWeight} kg\n`;
        reportText += `   ⏱️ Tempo estimado: ${this.calculateEstimatedTime()} minutos\n\n`;
        reportText += `🔥 *Foco • Disciplina • Resultados* 🔥\n`;
        reportText += `#AcademiaElijunio #${this.currentWorkout === 'A' ? 'TreinoA' : 'TreinoB'}`;
        
        textOutput.value = reportText;
    }

    // Calcular tempo estimado
    calculateEstimatedTime() {
        const completedCount = this.completedExercises.size;
        // Estimativa: 5 minutos por exercício
        return completedCount * 5;
    }

    // Copiar texto do relatório
    copyReportText() {
        const textOutput = document.getElementById('report-text-output');
        if (!textOutput) return;
        
        textOutput.select();
        textOutput.setSelectionRange(0, 99999); // Para mobile
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // Mostrar notificação
                this.showNotification('Relatório copiado para a área de transferência!', 'success');
                
                // Mudar texto do botão temporariamente
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

    // Enviar para Telegram
    sendToTelegram() {
        const textOutput = document.getElementById('report-text-output');
        if (!textOutput || !textOutput.value) return;
        
        const reportText = encodeURIComponent(textOutput.value);
        const telegramChatId = '-1002074157691'; // Substitua pelo ID do seu grupo
        const telegramBotToken = 'SEU_BOT_TOKEN_AQUI'; // Você precisará criar um bot no Telegram
        
        // Se não tiver token configurado, usar método alternativo
        if (telegramBotToken === 'SEU_BOT_TOKEN_AQUI') {
            // Método alternativo: abrir Telegram com mensagem pré-preenchida
            const telegramURL = `https://t.me/share/url?url=${encodeURIComponent('Relatório de Treino')}&text=${reportText}`;
            window.open(telegramURL, '_blank');
            this.showNotification('Abra o Telegram para enviar o relatório!', 'info');
        } else {
            // Método com bot (requer configuração)
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

    // Enviar para WhatsApp
    sendToWhatsApp() {
        const textOutput = document.getElementById('report-text-output');
        if (!textOutput || !textOutput.value) return;
        
        const reportText = encodeURIComponent(textOutput.value);
        const phoneNumber = '31973112693'; // Seu número para WhatsApp individual
        
        // Para grupo do WhatsApp (necessário link do grupo)
        const whatsappGroupLink = 'https://chat.whatsapp.com/SEU_LINK_DO_GRUPO'; // Substitua pelo link do seu grupo
        
        // Tentar enviar para grupo primeiro
        if (whatsappGroupLink !== 'https://chat.whatsapp.com/SEU_LINK_DO_GRUPO') {
            // Método para grupo (requer que o usuário entre no link)
            window.open(whatsappGroupLink, '_blank');
            this.showNotification('Entre no grupo do WhatsApp para enviar o relatório!', 'info');
            
            // Depois de entrar no grupo, enviar mensagem
            setTimeout(() => {
                const whatsappURL = `https://wa.me/?text=${reportText}`;
                window.open(whatsappURL, '_blank');
            }, 2000);
        } else {
            // Método para número individual
            const whatsappURL = `https://wa.me/55${phoneNumber}?text=${reportText}`;
            window.open(whatsappURL, '_blank');
            this.showNotification('Abra o WhatsApp para enviar o relatório!', 'info');
        }
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        // Remover notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) existingNotification.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#00d26a' : type === 'error' ? '#ff4757' : '#2e86de'}; 
                        color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); 
                        z-index: 3000; display: flex; align-items: center; gap: 10px; max-width: 300px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Salvar dados localmente
    saveData() {
        const data = {
            workout: this.currentWorkout,
            completedExercises: Array.from(this.completedExercises),
            exerciseData: this.exerciseData,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(`academia_elijunio_${this.currentWorkout}`, JSON.stringify(data));
    }

    // Carregar dados salvos
    loadSavedData() {
        const saved = localStorage.getItem(`academia_elijunio_${this.currentWorkout}`);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // Verificar se os dados são do mesmo treino
                if (data.workout === this.currentWorkout) {
                    // Carregar exercícios concluídos
                    if (data.completedExercises) {
                        data.completedExercises.forEach(id => {
                            this.completedExercises.add(id);
                        });
                    }
                    
                    // Carregar dados dos exercícios
                    if (data.exerciseData) {
                        this.exerciseData = data.exerciseData;
                    }
                    
                    // Atualizar interface
                    this.updateExerciseCardsFromData();
                    this.updateProgress();
                    this.updateStats();
                }
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
            }
        }
    }

    // Atualizar cards de exercícios a partir dos dados salvos
    updateExerciseCardsFromData() {
        Object.keys(this.exerciseData).forEach(exerciseId => {
            this.updateExerciseCard(parseInt(exerciseId));
        });
    }

    // Limpar dados salvos
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