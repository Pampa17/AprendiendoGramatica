// ------------------------------
// Datos para los juegos
// ------------------------------

// Palabras para el juego de clasificación, cada una con su tipo gramatical
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

// Datos de la historia interactiva
const storiesData = [
    {
        title: "El Día en el Parque",
        content: "El [1] juega en el parque. Es un día [2] y soleado. Los niños [3] y se divierten mucho.",
        blanks: [
            { id: 1, correct: 'perro', options: ['perro', 'feliz', 'correr'] },
            { id: 2, correct: 'caluroso', options: ['caluroso', 'libro', 'saltar'] },
            { id: 3, correct: 'corren', options: ['corren', 'grande', 'maestro'] }
        ]
    }
];

// Datos de los ejercicios de opción múltiple
const exercisesData = [
    {
        question: "¿Cuál de estas palabras es un sustantivo?",
        options: ["correr", "feliz", "libro", "rápido"],
        correct: 2,
        explanation: "Los sustantivos son palabras que nombran personas, animales, cosas o ideas. 'Libro' es un sustantivo."
    }
];

// ------------------------------
// Funciones para cargar los juegos
// ------------------------------

// Cargar el juego de clasificación de palabras
function loadClassificationGame() {
    const wordsContainer = document.getElementById('words-container');
    wordsContainer.innerHTML = ''; // Limpiar contenido anterior

    // Mezclar las palabras para que salgan en orden aleatorio
    const shuffledWords = [...wordsData].sort(() => Math.random() - 0.5);

    // Crear elementos visuales para cada palabra
    shuffledWords.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.textContent = word.text;
        wordElement.setAttribute('draggable', 'true'); // Permite arrastrar
        wordElement.setAttribute('id', `word-${word.text}`);
        wordElement.setAttribute('ondragstart', 'drag(event)');
        wordElement.setAttribute('data-type', word.type); // Guarda el tipo de palabra
        wordsContainer.appendChild(wordElement);
    });
}

// Cargar la actividad de completar la historia
function loadStoryActivity() {
    const story = storiesData[0];
    const storyContent = document.getElementById('story-content');
    const optionsContainer = document.getElementById('story-options');

    // Crear la estructura HTML de la historia, separando los espacios en blanco
    let storyHTML = `<h3>${story.title}</h3><p>`;
    const parts = story.content.split(/\[(\d+)\]/);

    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) { // Detectar los números de los espacios
            const blankId = parseInt(parts[i]);
            storyHTML += `<span class="blank" id="blank-${blankId}"></span>`;
        } else {
            storyHTML += parts[i];
        }
    }

    storyHTML += '</p>';
    storyContent.innerHTML = storyHTML;

    // Mostrar las opciones para completar los espacios
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

// Cargar los ejercicios de opción múltiple
function loadExercise() {
    const exercise = exercisesData[0];
    const exerciseContent = document.getElementById('exercise-content');

    let exerciseHTML = `
        <div class="exercise-question">
            <p>${exercise.question}</p>
            <div class="exercise-options">
    `;

    // Crear las opciones como botones interactivos
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

// ------------------------------
// Funciones de Drag and Drop (Arrastrar y Soltar)
// ------------------------------

// Permitir soltar elementos arrastrados
function allowDrop(ev) {
    ev.preventDefault();
}

// Comenzar a arrastrar un elemento
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

// Soltar un elemento en una categoría
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    ev.target.appendChild(draggedElement);
}

// ------------------------------
// Verificar clasificación correcta
// ------------------------------
function checkClassification() {
    const feedbackElement = document.getElementById('classification-feedback');
    let allCorrect = true;
    let message = '';

    const categories = ['sustantivos', 'adjetivos', 'verbos'];
    
    // Revisar cada categoría para ver si las palabras son correctas
    categories.forEach(category => {
        const categoryElement = document.getElementById(category);
        const wordsInCategory = categoryElement.getElementsByClassName('word');

        for (let word of wordsInCategory) {
            const wordType = word.getAttribute('data-type');
            const categoryType = category.slice(0, -1); // Quitar la 's' para comparar

            if (wordType !== categoryType) {
                allCorrect = false;
                word.style.backgroundColor = '#ff9999'; // Color rojo para errores
            } else {
                word.style.backgroundColor = '#99ff99'; // Color verde para correctos
            }
        }
    });

    if (allCorrect) {
        message = '<div class="feedback correct">¡Excelente! Todas las palabras están en la categoría correcta.</div>';
        playSound('success'); // Sonido de éxito
    } else {
        message = '<div class="feedback incorrect">Algunas palabras no están en la categoría correcta. Intenta de nuevo.</div>';
        playSound('error'); // Sonido de error
    }

    feedbackElement.innerHTML = message;
}

// ------------------------------
// Funciones para la historia interactiva
// ------------------------------

// Seleccionar una opción para llenar un espacio en blanco
function selectOption(blankId, option) {
    const blankElement = document.getElementById(`blank-${blankId}`);
    blankElement.textContent = option;
    blankElement.setAttribute('data-selected', option);

    // Verificar si la historia se ha completado correctamente
    checkStoryCompletion();
}

// Comprobar si todas las respuestas de la historia son correctas
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

// ------------------------------
// Funciones para los ejercicios
// ------------------------------

// Verificar si la respuesta seleccionada en el ejercicio es correcta
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

// ------------------------------
// Función para reproducir sonidos
// ------------------------------

// Simular la reproducción de sonidos de éxito o error
function playSound(type) {
    console.log(`Reproduciendo sonido de ${type}`);
}

// ------------------------------
// Inicializar los juegos al cargar la página
// ------------------------------
window.onload = function() {
    loadClassificationGame();
    loadStoryActivity();
    loadExercise();
};

//
