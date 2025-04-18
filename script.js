// Función para mostrar diferentes actividades
function showActivity(activityId) {
    // Ocultar todas las actividades
    const activities = document.getElementsByClassName('activity');
    for (let activity of activities) {
        activity.style.display = 'none';
    }
    
    // Mostrar la actividad seleccionada
    document.getElementById(activityId).style.display = 'block';
    
    // Recargar la actividad si es necesario
    switch(activityId) {
        case 'classification':
            loadClassificationGame();
            break;
        case 'story':
            loadStoryActivity();
            break;
        case 'exercises':
            loadExercise();
            break;
    }
}

// Variables para controlar el progreso
let currentStoryIndex = 0;
let currentExerciseIndex = 0;

// Función para cargar la historia actual
function loadCurrentStory() {
    const story = storiesData[currentStoryIndex];
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
        // Mezclar las opciones para que aparezcan en orden aleatorio
        const shuffledOptions = [...blank.options].sort(() => Math.random() - 0.5);
        
        shuffledOptions.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.setAttribute('onclick', `selectOption(${blank.id}, '${option}')`);
            optionsContainer.appendChild(optionElement);
        });
    });
    
    // Mostrar número de historia
    document.getElementById('story-counter').textContent = 
        `Historia ${currentStoryIndex + 1} de ${storiesData.length}`;
}

// Función para cargar el ejercicio actual
function loadCurrentExercise() {
    const exercise = exercisesData[currentExerciseIndex];
    const exerciseContent = document.getElementById('exercise-content');
    
    let exerciseHTML = `
        <h3>Ejercicio ${currentExerciseIndex + 1} de ${exercisesData.length}</h3>
        <div class="exercise-question">
            <p>${exercise.question}</p>
            <div class="exercise-options">
    `;
    
    if (exercise.type === "multiple-choice") {
        exercise.options.forEach((option, index) => {
            exerciseHTML += `
                <div class="option" onclick="checkExerciseAnswer(${index}, ${exercise.correct})">
                    ${option}
                </div>
            `;
        });
    } 
    else if (exercise.type === "true-false") {
        exercise.options.forEach((option, index) => {
            exerciseHTML += `
                <div class="option" onclick="checkExerciseAnswer(${index}, ${exercise.correct})">
                    ${option}
                </div>
            `;
        });
    }
    else if (exercise.type === "fill-blank") {
        exerciseHTML += `
            <input type="text" id="fill-blank-answer" placeholder="Escribe aquí...">
            <button onclick="checkFillBlankAnswer('${exercise.correct}')">Comprobar</button>
            <p class="hint">Pista: ${exercise.hint}</p>
        `;
    }
    
    exerciseHTML += `
            </div>
        </div>
    `;
    
    exerciseContent.innerHTML = exerciseHTML;
}

// Función para cambiar a la siguiente historia
function nextStory() {
    if (currentStoryIndex < storiesData.length - 1) {
        currentStoryIndex++;
        loadCurrentStory();
    } else {
        alert("¡Felicidades! Has completado todas las historias.");
    }
}

// Función para cambiar al ejercicio anterior
function prevExercise() {
    if (currentExerciseIndex > 0) {
        currentExerciseIndex--;
        loadCurrentExercise();
    }
}

// Función para cambiar al siguiente ejercicio
function nextExercise() {
    if (currentExerciseIndex < exercisesData.length - 1) {
        currentExerciseIndex++;
        loadCurrentExercise();
    } else {
        alert("¡Excelente trabajo! Has completado todos los ejercicios.");
    }
}

// Función para verificar respuesta en ejercicio de completar
function checkFillBlankAnswer(correctAnswer) {
    const userAnswer = document.getElementById('fill-blank-answer').value.toLowerCase();
    const exercise = exercisesData[currentExerciseIndex];
    const feedbackElement = document.getElementById('exercise-feedback');
    
    if (userAnswer === correctAnswer.toLowerCase()) {
        feedbackElement.innerHTML = `
            <div class="feedback correct">
                ¡Correcto! ${exercise.explanation}
            </div>
            <button onclick="nextExercise()">Siguiente ejercicio</button>
        `;
    } else {
        feedbackElement.innerHTML = `
            <div class="feedback incorrect">
                Intenta de nuevo. Pista: ${exercise.hint}
            </div>
        `;
    }
}