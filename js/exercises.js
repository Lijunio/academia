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
            {
                id: 1,
                name: "Supino reto (halteres)",
                sets: "4x 6–8",
                description: "Peitoral médio",
                muscleGroup: "peito",
                images: [
                    "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 2,
                name: "Supino inclinado (halteres)",
                sets: "3x 8–10",
                description: "Peitoral superior",
                muscleGroup: "peito",
                images: [
                    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 3,
                name: "Crucifixo no cabo ou máquina",
                sets: "3x 12–15",
                description: "Alongamento e definição do peitoral",
                muscleGroup: "peito",
                images: [
                    "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 4,
                name: "Agachamento livre ou hack",
                sets: "4x 6–8",
                description: "Quadríceps + Glúteo",
                muscleGroup: "quadriceps",
                images: [
                    "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 5,
                name: "Leg press",
                sets: "3x 10–12",
                description: "Quadríceps",
                muscleGroup: "quadriceps",
                images: [
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 6,
                name: "Cadeira extensora",
                sets: "3x 12–15",
                description: "Quadríceps",
                muscleGroup: "quadriceps",
                images: [
                    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 7,
                name: "Desenvolvimento halteres",
                sets: "3x 8–10",
                description: "Ombro anterior",
                muscleGroup: "ombro",
                images: [
                    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 8,
                name: "Elevação lateral",
                sets: "4x 12–15",
                description: "Ombro lateral",
                muscleGroup: "ombro",
                images: [
                    "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 9,
                name: "Tríceps testa (barra W)",
                sets: "3x 8–10",
                description: "Cabeça longa",
                muscleGroup: "triceps",
                images: [
                    "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 10,
                name: "Tríceps corda (polia)",
                sets: "3x 10–12",
                description: "Cabeça lateral",
                muscleGroup: "triceps",
                images: [
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 11,
                name: "Tríceps mergulho banco ou paralela",
                sets: "3x 8–10",
                description: "Cabeça medial + força geral",
                muscleGroup: "triceps",
                images: [
                    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            }
        ];
    }

    getWorkoutBExercises() {
        return [
            {
                id: 1,
                name: "Barra fixa ou puxada frente",
                sets: "4x 6–8",
                description: "Grande dorsal (largura)",
                muscleGroup: "costas",
                images: [
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 2,
                name: "Remada curvada barra",
                sets: "3x 8–10",
                description: "Espessura",
                muscleGroup: "costas",
                images: [
                    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 3,
                name: "Remada baixa",
                sets: "3x 10–12",
                description: "Costas médias",
                muscleGroup: "costas",
                images: [
                    "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 4,
                name: "Levantamento terra romeno",
                sets: "4x 6–8",
                description: "Posterior + Glúteo",
                muscleGroup: "posterior",
                images: [
                    "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 5,
                name: "Mesa flexora",
                sets: "3x 10–12",
                description: "Posterior",
                muscleGroup: "posterior",
                images: [
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 6,
                name: "Afundo andando ou no lugar",
                sets: "3x 10 cada perna",
                description: "Quadríceps + Glúteo",
                muscleGroup: "posterior",
                images: [
                    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 7,
                name: "Elevação posterior (halter ou máquina)",
                sets: "3x 12–15",
                description: "Ombro posterior",
                muscleGroup: "ombro",
                images: [
                    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 8,
                name: "Encolhimento barra",
                sets: "4x 10–12",
                description: "Trapézio superior",
                muscleGroup: "ombro",
                images: [
                    "https://images.unsplash.com/photo-1534367507877-0edd93bd013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 9,
                name: "Rosca direta barra",
                sets: "3x 8–10",
                description: "Cabeça curta e longa",
                muscleGroup: "biceps",
                images: [
                    "https://images.unsplash.com/photo-1598974357801-cbca100e5d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                id: 10,
                name: "Rosca alternada inclinada",
                sets: "3x 10–12",
                description: "Ênfase cabeça longa",
                muscleGroup: "biceps",
                images: [
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
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
            'quadriceps': '#00d26a',
            'ombro': '#2e5bff',
            'triceps': '#ff6b00',
            'costas': '#9c27b0',
            'posterior': '#2196f3',
            'biceps': '#ff9800'
        };
        
        return colors[muscleGroup] || '#b0b0b0';
    }

    getMuscleGroupName(muscleGroup) {
        const names = {
            'peito': 'Peito',
            'quadriceps': 'Quadríceps',
            'ombro': 'Ombro',
            'triceps': 'Tríceps',
            'costas': 'Costas',
            'posterior': 'Posterior',
            'biceps': 'Bíceps'
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