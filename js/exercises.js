// ACADEMIA ELIJUNIO - Exercises Data and Management

class ExercisesManager {
    constructor() {
        this.exercisesData = {
            'A': this.getWorkoutAExercises(),
            'B': this.getWorkoutBExercises()
        };
    }

    getWorkoutAExercises() {
        return [
            // PEITO (3 PORÇÕES)
            {
                id: 1,
                name: "Supino reto (barra)",
                sets: "4x 6–8",
                description: "Peitoral médio",
                muscleGroup: "peito",
                images: [
                    "imagens/treino-a/supinoreto.webp"
                ]
            },
            {
                id: 2,
                name: "Supino inclinado (halteres)",
                sets: "3x 8–10",
                description: "Peitoral superior",
                muscleGroup: "peito",
                images: [
                    "imagens/treino-a/supinoinclinado.jpg"
                ]
            },
            {
                id: 3,
                name: "Crucifixo cabo ou máquina",
                sets: "3x 12–15",
                description: "Alongamento e definição do peitoral",
                muscleGroup: "peito",
                images: [
                    "imagens/treino-a/crossover.webp",
                    "imagens/treino-a/voador.webp"
                ]
            },
            // OMBRO (ANTERIOR + LATERAL)
            {
                id: 4,
                name: "Desenvolvimento halteres",
                sets: "3x 8–10",
                description: "Ombro anterior",
                muscleGroup: "ombro",
                images: [
                    "imagens/treino-a/desenvolvimento.webp"
                ]
            },
            {
                id: 5,
                name: "Elevação lateral",
                sets: "4x 12–15",
                description: "Ombro lateral",
                muscleGroup: "ombro",
                images: [
                    "imagens/treino-a/elevacaolateral.jpg",
                    "imagens/treino-a/elevacaolateralinclinado.png"
                ]
            },
            // TRÍCEPS (3 CABEÇAS)
            {
                id: 6,
                name: "Tríceps testa",
                sets: "3x 8–10",
                description: "Cabeça longa",
                muscleGroup: "triceps",
                images: [
                    "imagens/treino-a/tricepstesta1.webp",
                    "imagens/treino-a/tricepstesta2.gif",
                    "imagens/treino-a/tricepstesta3.webp"
                ]
            },
            {
                id: 7,
                name: "Tríceps corda",
                sets: "3x 10–12",
                description: "Cabeça lateral",
                muscleGroup: "triceps",
                images: [
                    "imagens/treino-a/tricepscorda.gif"
                ]
            },
            {
                id: 8,
                name: "Mergulho banco/paralela",
                sets: "3x 8–10",
                description: "Cabeça medial + força geral",
                muscleGroup: "triceps",
                images: [
                    "imagens/treino-a/tricepsmergulho.png",
                    "imagens/treino-a/paralelas.webp"
                ]
            },
            // QUADRÍCEPS + GLÚTEO
            {
                id: 9,
                name: "Agachamento livre ou hack",
                sets: "4x 6–8",
                description: "Quadríceps + Glúteo",
                muscleGroup: "quadriceps",
                images: [
                    "imagens/treino-a/agachamentolivre.avif",
                    "imagens/treino-a/agachamentohack.webp"
                ]
            },
            {
                id: 10,
                name: "Leg press",
                sets: "3x 10–12",
                description: "Quadríceps",
                muscleGroup: "quadriceps",
                images: [
                    "imagens/treino-a/legpress.webp"
                ]
            },
            {
                id: 11,
                name: "Cadeira extensora",
                sets: "3x 12–15",
                description: "Quadríceps",
                muscleGroup: "quadriceps",
                images: [
                    "imagens/treino-a/cadeiraextensora.webp"
                ]
            },
            // ADUTOR / ABDUTOR
            {
                id: 12,
                name: "Cadeira adutora",
                sets: "3x 12–15",
                description: "Adutores da coxa",
                muscleGroup: "adutor",
                images: [
                    "imagens/treino-a/cadeiraadutora.webp"
                ]
            },
            {
                id: 13,
                name: "Cadeira abdutora",
                sets: "3x 12–15",
                description: "Abdutores da coxa",
                muscleGroup: "abdutor",
                images: [
                    "imagens/treino-a/cadeiraabdutora.gif"
                ]
            }
        ];
    }

    getWorkoutBExercises() {
        return [
            // COSTAS (LARGURA + ESPESSURA)
            {
                id: 1,
                name: "Barra fixa ou puxada frente",
                sets: "4x 6–8",
                description: "Grande dorsal (largura)",
                muscleGroup: "costas",
                images: [
                    "imagens/treino-b/barrafixa.webp",
                    "imagens/treino-b/puxadafrente.jpg"
                ]
            },
            {
                id: 2,
                name: "Remada curvada barra",
                sets: "3x 8–10",
                description: "Espessura",
                muscleGroup: "costas",
                images: [
                    "imagens/treino-b/remadacurvada.jpg"
                ]
            },
            {
                id: 3,
                name: "Remada baixa",
                sets: "3x 10–12",
                description: "Costas médias",
                muscleGroup: "costas",
                images: [
                    "imagens/treino-b/remadabaixa.webp"
                ]
            },
            // OMBRO POSTERIOR + TRAPÉZIO
            {
                id: 4,
                name: "Elevação posterior",
                sets: "3x 12–15",
                description: "Ombro posterior",
                muscleGroup: "ombro",
                images: [
                    "imagens/treino-b/elevacaoposterior.gif",
                    "imagens/treino-b/maquinaposterior.gif"
                ]
            },
            {
                id: 5,
                name: "Encolhimento barra",
                sets: "4x 10–12",
                description: "Trapézio superior",
                muscleGroup: "ombro",
                images: [
                    "imagens/treino-b/encolhimento.gif"
                ]
            },
            // BÍCEPS
            {
                id: 6,
                name: "Rosca direta",
                sets: "3x 8–10",
                description: "Cabeça curta e longa",
                muscleGroup: "biceps",
                images: [
                    "imagens/treino-b/roscadireta.gif"
                ]
            },
            {
                id: 7,
                name: "Rosca alternada inclinada",
                sets: "3x 10–12",
                description: "Ênfase cabeça longa",
                muscleGroup: "biceps",
                images: [
                    "imagens/treino-b/roscainclinada.gif"
                ]
            },
            // ANTEBRAÇO
            {
                id: 8,
                name: "Rosca punho",
                sets: "3x 15–20",
                description: "Flexores do antebraço",
                muscleGroup: "antebraco",
                images: [
                "imagens/treino-b/roscapunho1.gif",
                "imagens/treino-b/roscapunho2.gif"
                ]
            },
            {
                id: 9,
                name: "Rosca punho reversa",
                sets: "3x 15–20",
                description: "Extensores do antebraço",
                muscleGroup: "antebraco",
                images: [
                    "imagens/treino-b/roscapunho-reversa1.gif",
                    "imagens/treino-b/roscapunho-reversa2.gif"
                ]
            },
            // POSTERIOR + GLÚTEO
            {
                id: 10,
                name: "Levantamento terra romeno",
                sets: "4x 6–8",
                description: "Posterior + Glúteo",
                muscleGroup: "posterior",
                images: [
                    "imagens/treino-b/terra-romeno.webp"
                ]
            },
            {
                id: 11,
                name: "Mesa flexora",
                sets: "3x 10–12",
                description: "Posterior",
                muscleGroup: "posterior",
                images: [
                    "imagens/treino-b/mesaflexora.webp"
                ]
            },
            {
                id: 12,
                name: "Afundo andando ou no lugar",
                sets: "3x 10 cada perna",
                description: "Quadríceps + Glúteo",
                muscleGroup: "posterior",
                images: [
                    "imagens/treino-b/afundo.gif"
                ]
            },
            // PANTURRILHAS
            {
                id: 13,
                name: "Panturrilha em pé",
                sets: "4x 10–15",
                description: "Panturrilha (gastrocnêmio)",
                muscleGroup: "panturrilha",
                images: [
                    "imagens/treino-b/panturrilha-pe.gif"
                ]
            },
            {
                id: 14,
                name: "Panturrilha sentada",
                sets: "3x 15–20",
                description: "Panturrilha (sóleo)",
                muscleGroup: "panturrilha",
                images: [
                    "imagens/treino-b/panturrilha-sentada.gif"
                ]
            }
        ];
    }

    getExercises(workoutType) {
        return this.exercisesData[workoutType] || [];
    }

    getExerciseById(workoutType, exerciseId) {
        const exercises = this.getExercises(workoutType);
        return exercises.find(ex => ex.id === exerciseId);
    }

    getNextExercise(currentExerciseId, workoutType) {
        const exercises = this.getExercises(workoutType);
        const currentIndex = exercises.findIndex(ex => ex.id === currentExerciseId);
        
        if (currentIndex < exercises.length - 1) {
            return exercises[currentIndex + 1];
        }
        
        return null;
    }

    getMuscleGroupColor(muscleGroup) {
        const colors = {
            'peito': '#ff2e2e',
            'ombro': '#2e5bff',
            'triceps': '#ff6b00',
            'quadriceps': '#00d26a',
            'adutor': '#9c27b0',
            'abdutor': '#7b1fa2',
            'costas': '#2196f3',
            'biceps': '#ff9800',
            'antebraco': '#795548',
            'posterior': '#4caf50',
            'panturrilha': '#607d8b'
        };
        
        return colors[muscleGroup] || '#b0b0b0';
    }

    getMuscleGroupName(muscleGroup) {
        const names = {
            'peito': 'Peito',
            'ombro': 'Ombro',
            'triceps': 'Tríceps',
            'quadriceps': 'Quadríceps',
            'adutor': 'Adutor',
            'abdutor': 'Abdutor',
            'costas': 'Costas',
            'biceps': 'Bíceps',
            'antebraco': 'Antebraço',
            'posterior': 'Posterior',
            'panturrilha': 'Panturrilha'
        };
        
        return names[muscleGroup] || muscleGroup;
    }

    getRestTime(currentMuscleGroup, nextMuscleGroup) {
        // 45 segundos para mesmo grupo muscular
        // 90 segundos para grupos musculares diferentes
        return currentMuscleGroup === nextMuscleGroup ? 45 : 90;
    }

    calculateTotalSets(exercises) {
        return exercises.reduce((total, ex) => {
            const setsMatch = ex.sets.match(/(\d+)x/);
            return total + (setsMatch ? parseInt(setsMatch[1]) : 0);
        }, 0);
    }

    calculateEstimatedTime(exercises) {
        // Estimativa: 2 minutos por série
        const totalSets = this.calculateTotalSets(exercises);
        return totalSets * 2;
    }
}

// Inicializar manager
document.addEventListener('DOMContentLoaded', () => {
    window.exercisesManager = new ExercisesManager();
});

// Exportar funções úteis
function getWorkoutExercises(type) {
    if (window.exercisesManager) {
        return window.exercisesManager.getExercises(type);
    }
    return [];
}

function getMuscleGroupColor(muscleGroup) {
    if (window.exercisesManager) {
        return window.exercisesManager.getMuscleGroupColor(muscleGroup);
    }
    return '#b0b0b0';
}