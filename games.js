// Datos para los juegos
const wordsData = [
    { text: 'perro', type: 'sustantivo' },
    { text: 'feliz', type: 'adjetivo' },
    { text: 'correr', type: 'verbo' },
    { text: 'libro', type: 'sustantivo' },
    { text: 'grande', type: 'adjetivo' },
    { text: 'saltar', type: 'verbo' },
    { text: 'maestro', type: 'sustantivo' },
    { text: 'rápido', type: 'adjetivo' },
    { text: 'leer', type: 'verbo' }
];

const storiesData = [
    {
        title: "El Día en el Parque",
        content: "El [1] juega en el parque. Es un día [2] y soleado. Los niños [3] y se divierten mucho.",
        blanks: [
            { id: 1, correct: 'perro', options: ['perro', 'feliz', 'correr'] },
            { id: 2, correct: 'caluroso', options: ['caluroso', 'libro', 'saltar'] },
            { id: 3, correct: 'corren', options: ['corren', 'grande', 'maestro'] }
        ]
    },
    {
        id: 2,
        title: "La Aventura en la Escuela",
        content: "La [1] explica la lección con su voz [2]. Los estudiantes [3] atentamente y toman notas en sus [4].",
        blanks: [
            { id: 1, correct: 'maestra', options: ['maestra', 'rápido', 'leer'], hint: "Persona que enseña" },
            { id: 2, correct: 'clara', options: ['clara', 'ciudad', 'escribir'], hint: "Que se entiende bien" },
            { id: 3, correct: 'escuchan', options: ['escuchan', 'pequeño', 'libro'], hint: "Prestar atención a los sonidos" },
            { id: 4, correct: 'cuadernos', options: ['cuadernos', 'feliz', 'saltar'], hint: "Donde escribimos en clase" }
        ]
    },
    {
        id: 3,
        title: "El Cumpleaños Sorpresa",
        content: "Hoy es mi [1] y mis amigos me prepararon una [2] sorpresa. El pastel es [3] y [4]. Todos [5] y [6] juntos.",
        blanks: [
            { id: 1, correct: 'cumpleaños', options: ['cumpleaños', 'alegre', 'celebran'], hint: "Aniversario del nacimiento" },
            { id: 2, correct: 'fiesta', options: ['fiesta', 'grande', 'feliz'], hint: "Reunión para celebrar" },
            { id: 3, correct: 'delicioso', options: ['delicioso', 'regalo', 'soplar'], hint: "Que sabe muy bien" },
            { id: 4, correct: 'colorido', options: ['colorido', 'velas', 'reír'], hint: "Con muchos colores" },
            { id: 5, correct: 'ríen', options: ['ríen', 'amigos', 'globos'], hint: "Expresar alegría" },
            { id: 6, correct: 'juegan', options: ['juegan', 'festejo', 'dulce'], hint: "Realizar actividades divertidas" }
        ]
    },
];

const exercisesData = [
    {
        question: "¿Cuál de estas palabras es un sustantivo?",
        options: ["correr", "feliz", "libro", "rápido"],
        correct: 2,
        explanation: "Los sustantivos son palabras que nombran personas, animales, cosas o ideas. 'Libro' es un sustantivo."
    },
    {
        type: "true-false",
        question: "'Saltar' es un adjetivo.",
        options: ["Verdadero", "Falso"],
        correct: 1,
        explanation: "'Saltar' es un verbo porque expresa una acción."
    },
    {
        type: "fill-blank",
        question: "Completa la frase: El ___ amarillo vuela alto.",
        correct: "pájaro",
        hint: "Un animal con alas",
        explanation: "Necesitamos un sustantivo que nombre un animal que puede volar."
    }
];

// Funciones para cargar los juegos
function loadClassificationGame() {
    const wordsContainer = document.getElementById('words-container');
    wordsContainer.innerHTML = '';
    
    // Mezclar las palabras para que aparezcan en orden aleatorio
    const shuffledWords = [...wordsData].sort(() => Math.random() - 0.5);
    
    shuffledWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.textContent = word.text;
        wordElement.setAttribute('draggable', 'true');
        wordElement.setAttribute('id', `word-${word.text}`);
        wordElement.setAttribute('ondragstart', 'drag(event)');
        wordElement.setAttribute('data-type', word.type);
        wordsContainer.appendChild(wordElement);
    });
}

function loadStoryActivity() {
    const story = storiesData[0];
    const storyContent = document.getElementById('story-content');
    const optionsContainer = document.getElementById('story-options');
    
    // Mostrar la historia con espacios en blanco
    let storyHTML = `<h3>${story.title}</h3><p>`;
    const parts = story.content.split(/\[(\d+)\]/);
    
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) { // Es un número entre corchetes
            const blankId = parseInt(parts[i]);
            storyHTML += `<span class="blank" id="blank-${blankId}"></span>`;
        } else {
            storyHTML += parts[i];
        }
    }
    
    storyHTML += '</p>';
    storyContent.innerHTML = storyHTML;
    
    // Mostrar las opciones para completar
    optionsContainer.innerHTML = '';
    story.blanks.forEach(blank => {
        blank.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.setAttribute('onclick', `selectOption(${blank.id}, '${option}')`);
            optionsContainer.appendChild(optionElement);
        });
    });
}

function loadExercise() {
    const exercise = exercisesData[0];
    const exerciseContent = document.getElementById('exercise-content');
    
    let exerciseHTML = `
        <div class="exercise-question">
            <p>${exercise.question}</p>
            <div class="exercise-options">
    `;
    
    exercise.options.forEach((option, index) => {
        exerciseHTML += `
            <div class="option" onclick="checkExerciseAnswer(${index}, ${exercise.correct})">
                ${option}
            </div>
        `;
    });
    
    exerciseHTML += `
            </div>
        </div>
    `;
    
    exerciseContent.innerHTML = exerciseHTML;
}

// Funciones para el juego de clasificación
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    ev.target.appendChild(draggedElement);
}

function checkClassification() {
    const feedbackElement = document.getElementById('classification-feedback');
    let allCorrect = true;
    let message = '';
    
    // Verificar cada categoría
    const categories = ['sustantivos', 'adjetivos', 'verbos'];
    categories.forEach(category => {
        const categoryElement = document.getElementById(category);
        const wordsInCategory = categoryElement.getElementsByClassName('word');
        
        for (let word of wordsInCategory) {
            const wordType = word.getAttribute('data-type');
            const categoryType = category.slice(0, -1); // Quita la 's' final
            
            if (wordType !== categoryType) {
                allCorrect = false;
                word.style.backgroundColor = '#ff9999';
            } else {
                word.style.backgroundColor = '#99ff99';
            }
        }
    });
    
    if (allCorrect) {
        message = '<div class="feedback correct">¡Excelente! Todas las palabras están en la categoría correcta.</div>';
        // Reproducir sonido de éxito
        playSound('success');
    } else {
        message = '<div class="feedback incorrect">Algunas palabras no están en la categoría correcta. Intenta de nuevo.</div>';
        // Reproducir sonido de error
        playSound('error');
    }
    
    feedbackElement.innerHTML = message;
}

// Funciones para la historia interactiva
function selectOption(blankId, option) {
    const blankElement = document.getElementById(`blank-${blankId}`);
    blankElement.textContent = option;
    blankElement.setAttribute('data-selected', option);
    
    // Verificar si todos los espacios están completos
    checkStoryCompletion();
}

function checkStoryCompletion() {
    const feedbackElement = document.getElementById('story-feedback');
    const story = storiesData[0];
    let allCorrect = true;
    
    story.blanks.forEach(blank => {
        const blankElement = document.getElementById(`blank-${blank.id}`);
        const selected = blankElement.getAttribute('data-selected');
        
        if (!selected || selected !== blank.correct) {
            allCorrect = false;
        }
    });
    
    if (allCorrect) {
        feedbackElement.innerHTML = '<div class="feedback correct">¡Historia completa y correcta! Buen trabajo.</div>';
        playSound('success');
    }
}

// Funciones para los ejercicios
function checkExerciseAnswer(selectedIndex, correctIndex) {
    const feedbackElement = document.getElementById('exercise-feedback');
    const exercise = exercisesData[0];
    
    if (selectedIndex === correctIndex) {
        feedbackElement.innerHTML = `
            <div class="feedback correct">
                ¡Correcto! ${exercise.explanation}
            </div>
        `;
        playSound('success');
    } else {
        feedbackElement.innerHTML = `
            <div class="feedback incorrect">
                Incorrecto. La respuesta correcta es "${exercise.options[correctIndex]}". 
                ${exercise.explanation}
            </div>
        `;
        playSound('error');
    }
}

// Función para reproducir sonidos
function playSound(type) {
    // En una implementación real, aquí cargarías y reproducirías un sonido
    console.log(`Reproduciendo sonido de ${type}`);
}

// Inicializar juegos al cargar la página
window.onload = function() {
    loadClassificationGame();
    loadStoryActivity();
    loadExercise();
};