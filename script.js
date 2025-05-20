/**
 * Función showActivity
 * --------------------
 * Muestra la sección solicitada (clasificación, historia o ejercicios)
 * y oculta las demás. Esta función también se encarga de cargar los datos
 * correspondientes a la actividad seleccionada.
**/

function showActivity(activityId) {
  // Oculta todas las secciones con la clase .activity que estén dentro del main-wrapper
  document.querySelectorAll('#main-wrapper .activity').forEach(a => {
    a.style.display = 'none';
  });

  // Busca la sección con el ID proporcionado y la muestra
  const sección = document.getElementById(activityId);
  if (!sección) {
    // Si no se encuentra la sección, muestra error en la consola
    console.error(`showActivity: sección #${activityId} no encontrada`);
    return;
  }
  sección.style.display = 'block';

  // Dependiendo del ID de la sección, se llama a la función de carga correspondiente
  if (activityId === 'classification') loadClassificationGame(); // Cargar minijuego de clasificación
  else if (activityId === 'story') loadStoryActivity(); // Cargar historias interactivas
  else if (activityId === 'exercises') loadExercises(); // Cargar ejercicios prácticos
}

/**
 * Función startLearning
 * ---------------------
 * Se ejecuta al hacer clic en el botón "¡Comenzar Aprendizaje!"
 * Oculta la pantalla de bienvenida, guarda que ya se vio esta pantalla
 * y muestra el menú principal y los juegos, comenzando por la actividad de clasificación.
 */
function startLearning() {
  console.log('startLearning invocado');

  // Guarda en localStorage que el usuario ya vio la introducción
  localStorage.setItem('hasSeenIntro', 'true');

  // Oculta la sección de bienvenida
  document.getElementById('welcome').style.display = 'none';

  // Muestra la barra de navegación y el contenido principal
  document.getElementById('main-nav').style.display = 'flex';
  document.getElementById('main-wrapper').style.display = 'block';

  // Muestra por defecto la actividad de clasificación al iniciar
  showActivity('classification');
}

/**
 * Evento para manejar el botón "Reiniciar App"
 * --------------------------------------------
 * Elimina del localStorage la bandera de que ya se vio la introducción
 * y recarga la página para volver a mostrar la pantalla de bienvenida.
 */
document.addEventListener('DOMContentLoaded', function () {
  const resetBtn = document.getElementById('resetAppBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      // Elimina la marca de haber visto la intro
      localStorage.removeItem('hasSeenIntro');
      location.reload(); // Recarga la página para volver al inicio
    });
  }
});

/*
 * Evento que se ejecuta al cargar el DOM
 * --------------------------------------
 * Verifica si el usuario ya ha visto la introducción mediante localStorage.
 * En función de esto, muestra la pantalla de bienvenida o los juegos directamente.
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM cargado');

  // Verifica si el usuario ya ha visto la introducción
  const sawIntro = localStorage.getItem('hasSeenIntro') === 'true';

  if (!sawIntro) {
    // Si es la primera visita, muestra la bienvenida
    document.getElementById('welcome').style.display = 'block';
    document.getElementById('main-nav').style.display = 'none';
    document.getElementById('main-wrapper').style.display = 'none';
  } else {
    // Si ya la vio, salta directamente a los juegos
    document.getElementById('welcome').style.display = 'none';
    document.getElementById('main-nav').style.display = 'flex';
    document.getElementById('main-wrapper').style.display = 'block';

    // Muestra por defecto la actividad de clasificación
    showActivity('classification');
  }
});

// Función: loadClassificationGame()
// Propósito: Carga dinámicamente las palabras para el juego de clasificación.
// Lógica: Mezcla las palabras aleatoriamente y las muestra en el contenedor principal.
// Cada palabra se hace arrastrable para que el usuario pueda clasificarla.
function loadClassificationGame() {
    const wordsContainer = document.getElementById('words-container'); // Contenedor principal donde se mostrarán las palabras
    wordsContainer.innerHTML = ''; // Limpia cualquier contenido previo

    // Mezcla las palabras usando un sort aleatorio
    // Se usa el spread operator para crear una copia del arreglo original (no modificar el original)
    const shuffledWords = [...wordsData].sort(() => Math.random() - 0.5);

    // Se crean elementos HTML individuales para cada palabra y se agregan al DOM
    shuffledWords.forEach(word => {
        const wordElement = document.createElement('div'); // Crea un nuevo <div> para la palabra
        wordElement.className = 'word'; // Clase CSS que define el estilo del elemento
        wordElement.textContent = word.text; // El texto visible de la palabra
        wordElement.setAttribute('draggable', 'true'); // Hace que el elemento sea arrastrable (drag & drop)
        wordElement.setAttribute('id', `word-${word.text}`); // Asigna un ID único para identificar la palabra
        wordElement.setAttribute('ondragstart', 'drag(event)'); // Llama a la función drag cuando se empieza a arrastrar
        wordElement.setAttribute('data-type', word.type); // Guarda el tipo de palabra (sustantivo, adjetivo, verbo)
        wordsContainer.appendChild(wordElement); // Inserta la palabra en el contenedor
    });
}

// Función: allowDrop(ev)
// Propósito: Permite que un elemento sea un área de destino válida para soltar elementos arrastrables.
// Necesaria para permitir el "drop" en los contenedores.
function allowDrop(ev) {
    ev.preventDefault(); // Previene el comportamiento por defecto del navegador (que no permite soltar)
}

// Función: drag(ev)
// Propósito: Guarda el ID del elemento arrastrado para recuperarlo durante el evento "drop".
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); // Almacena el ID del elemento que está siendo arrastrado
}

// Función: drop(ev)
// Propósito: Inserta el elemento arrastrado en el nuevo contenedor donde se suelta.
// Lógica: Recupera el ID almacenado en drag() y lo añade al destino.
function drop(ev) {
    ev.preventDefault(); // Previene el comportamiento por defecto
    const data = ev.dataTransfer.getData("text"); // Recupera el ID del elemento arrastrado
    const draggedElement = document.getElementById(data); // Obtiene el elemento arrastrado
    ev.target.appendChild(draggedElement); // Lo agrega al contenedor donde se soltó
}

// Función: checkClassification()
// Propósito: Verifica si el usuario clasificó correctamente las palabras según su tipo.
// Lógica: Recorre cada categoría y comprueba si el tipo de palabra coincide con la categoría contenedora.
// Proporciona retroalimentación visual y textual.
function checkClassification() {
    const feedbackElement = document.getElementById('classification-feedback'); // Contenedor donde se muestra el mensaje de retroalimentación
    let allCorrect = true; // Bandera para saber si todas las palabras están correctamente clasificadas
    let message = ''; // Mensaje HTML que se mostrará al final

    // Lista de IDs de los contenedores por categoría
    const categories = ['sustantivos', 'adjetivos', 'verbos'];

    categories.forEach(category => {
        const categoryElement = document.getElementById(category); // Contenedor actual
        const wordsInCategory = categoryElement.getElementsByClassName('word'); // Palabras que están dentro de este contenedor

        // Recorre cada palabra dentro de la categoría
        for (let word of wordsInCategory) {
            const wordType = word.getAttribute('data-type'); // Tipo real de la palabra
            const categoryType = category.slice(0, -1); // El tipo que representa la categoría (eliminando la 's')

            // Comparación: ¿la palabra está en su categoría correcta?
            if (wordType !== categoryType) {
                allCorrect = false; // Hay al menos una incorrecta
                word.style.backgroundColor = '#ff9999'; // Color rojo claro para indicar error
            } else {
                word.style.backgroundColor = '#99ff99'; // Verde claro para indicar acierto
            }
        }
    });

    // Construcción del mensaje de retroalimentación según el resultado
    if (allCorrect) {
        message = '<div class="feedback correct">¡Excelente! Todas las palabras están en la categoría correcta.</div>';
    } else {
        message = '<div class="feedback incorrect">Algunas palabras no están en la categoría correcta. Intenta de nuevo.</div>';
    }

    // Muestra el mensaje final en el contenedor de feedback
    feedbackElement.innerHTML = message;
}


// Variables para controlar el progreso
let currentStoryIndex = 0;
let currentExerciseIndex = 0;
let currentSelectedOption = null;

// Función: loadStoryActivity()
// Propósito: Carga la historia actual en pantalla, genera los espacios en blanco 
// para completar y las opciones arrastrables para que el niño las use.
function loadStoryActivity() {
    const story = storiesData[currentStoryIndex]; // Obtiene la historia actual del arreglo
    const storyContent = document.getElementById('story-content'); // Contenedor donde se mostrará la historia
    const optionsContainer = document.getElementById('story-options'); // Contenedor para las palabras opcionales

    // Limpia cualquier retroalimentación previa del intento anterior
    const feedbackElement = document.getElementById('story-feedback');
    if (feedbackElement) {
        feedbackElement.innerHTML = ''; // Vacía el contenedor
    }

    // Construye el contenido de la historia con espacios en blanco
    let storyHTML = `<h3>${story.title}</h3><p>`;
    
    // Divide el texto de la historia donde hay corchetes numerados [1], [2], etc.
    const parts = story.content.split(/\[(\d+)\]/); // Separa texto y los identificadores de espacios

    // Recorre las partes del texto
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
            // Parte impar: es el número de espacio (blank)
            const blankId = parseInt(parts[i]);

            // Crea un contenedor donde el niño podrá soltar una palabra
            storyHTML += `
                <div class="blank-dropzone" 
                     id="blank-${blankId}" 
                     ondrop="dropStoryWord(event)" 
                     ondragover="allowDrop(event)"
                     data-correct="${story.blanks.find(b => b.id === blankId).correct}">
                    <span class="blank-text" id="blank-text-${blankId}"></span>
                </div>
            `;
        } else {
            // Parte par: es texto normal
            storyHTML += parts[i];
        }
    }

    storyHTML += '</p>'; // Cierra el párrafo de la historia
    storyContent.innerHTML = storyHTML; // Inserta el contenido generado en el DOM

    // Generación de opciones
    optionsContainer.innerHTML = ''; // Limpia las opciones anteriores

    // Reúne todas las opciones de todos los espacios de la historia
    const allOptions = [];
    story.blanks.forEach(blank => {
        blank.options.forEach(option => {
            allOptions.push({
                text: option,
                blankId: blank.id // Guarda a qué espacio pertenece esta opción
            });
        });
    });

    // Mezcla aleatoriamente las opciones
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    // Crea un <div> arrastrable para cada opción
    shuffledOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'word story-word'; // Clase para estilos
        optionElement.textContent = option.text; // Muestra el texto de la opción
        optionElement.setAttribute('draggable', 'true'); // Se puede arrastrar
        optionElement.setAttribute('id', `word-${option.text}-${option.blankId}`); // ID único
        optionElement.setAttribute('ondragstart', 'drag(event)'); // Se activa la función drag al iniciar arrastre
        optionElement.setAttribute('data-word', option.text); // Guarda el texto como atributo
        optionsContainer.appendChild(optionElement); // Se agrega al DOM
    });

    // Muestra cuántas historias hay y cuál se está mostrando
    document.getElementById('story-counter').textContent = 
        `Historia ${currentStoryIndex + 1} de ${storiesData.length}`;
}

// Función: dropStoryWord(ev)
// Propósito: Coloca la palabra arrastrada en el espacio en blanco correspondiente.
// También verifica si la palabra es correcta y muestra retroalimentación visual.
function dropStoryWord(ev) {
    ev.preventDefault(); // Evita el comportamiento por defecto del navegador

    const data = ev.dataTransfer.getData("text"); // Obtiene el ID del elemento arrastrado
    const draggedElement = document.getElementById(data); // Recupera el elemento DOM

    const word = draggedElement.getAttribute('data-word'); // Obtiene el texto de la palabra
    const blankId = ev.target.id.replace('blank-', ''); // Extrae el ID numérico del espacio

    // Encuentra el elemento interno donde se debe colocar el texto
    const blankText = document.getElementById(`blank-text-${blankId}`);
    blankText.textContent = word; // Inserta la palabra en el espacio en blanco

    // Recupera la palabra correcta desde el atributo del contenedor
    const correctAnswer = ev.target.getAttribute('data-correct');

    // Verifica si la palabra es correcta y aplica estilos visuales
    if (word === correctAnswer) {
        ev.target.classList.add('correct'); // Estilo verde, por ejemplo
        ev.target.classList.remove('incorrect'); // Elimina estilo rojo si existía
    } else {
        ev.target.classList.add('incorrect'); // Estilo rojo
        ev.target.classList.remove('correct');
    }

    // Oculta la palabra arrastrada para que no se use otra vez
    draggedElement.style.visibility = 'hidden';
}

// Función: loadExercises()
// Propósito: Carga y muestra en pantalla el ejercicio actual, junto con sus opciones,
// una pista si es necesario y un botón para comprobar la respuesta.
function loadExercises() {
    // Obtiene el ejercicio actual desde la lista de datos
    const exercise = exercisesData[currentExerciseIndex];
    const exerciseContent = document.getElementById('exercise-content'); // Contenedor principal

    // Limpia el contenido anterior del contenedor
    exerciseContent.innerHTML = '';

    // Mostrar el número del ejercicio actual
    const counter = document.createElement('div');
    counter.className = 'exercise-counter'; // Clase CSS para estilos
    counter.textContent = `Ejercicio ${currentExerciseIndex + 1} de ${exercisesData.length}`;
    exerciseContent.appendChild(counter); // Se añade al DOM

    // Mostrar la pregunta del ejercicio
    const question = document.createElement('h3');
    question.textContent = exercise.question; // Se extrae el texto de la pregunta
    exerciseContent.appendChild(question);

    // Contenedor para las opciones o el campo de respuesta
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'exercise-options'; // Clase para el grupo de opciones

    // Crear las opciones según el tipo de ejercicio
    // Tipo: Opción múltiple o Verdadero/Falso 
    if (exercise.type === "multiple-choice" || exercise.type === "true-false") {
        // Recorre todas las opciones disponibles
        exercise.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option'; // Clase para estilos
            optionElement.textContent = option; // Muestra el texto de la opción
            optionElement.dataset.index = index; // Guarda el índice como dato

            // Evento al hacer clic sobre una opción
            optionElement.addEventListener('click', function() {
                // Quita la selección previa (si la hay)
                document.querySelectorAll('.exercise-options .option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                // Marca la opción actual como seleccionada
                this.classList.add('selected');
                currentSelectedOption = index; // Guarda la selección actual
            });

            // Agrega la opción al contenedor
            optionsContainer.appendChild(optionElement);
        });
    }

    //Tipo: Completar espacio en blanco 
    else if (exercise.type === "fill-blank") {
        // Grupo que contiene el input y la pista
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        // Campo de texto donde el usuario escribirá su respuesta
        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'fill-blank-answer'; // ID necesario para comprobar la respuesta
        input.className = 'fill-blank-input'; // Clase para estilos
        input.placeholder = 'Escribe aquí...'; // Texto sugerido

        // Pista para ayudar al usuario a responder
        const hint = document.createElement('p');
        hint.className = 'exercise-hint';
        hint.innerHTML = `<strong>Pista:</strong> ${exercise.hint}`;

        // Añadir el input y la pista al contenedor
        inputGroup.appendChild(input);
        optionsContainer.appendChild(inputGroup);
        optionsContainer.appendChild(hint);
    }

    // Se añade el contenedor de opciones (o input + pista) al DOM
    exerciseContent.appendChild(optionsContainer);

    // Botón para comprobar la respuesta
    const checkButton = document.createElement('button');
    checkButton.className = 'check-button'; // Clase para estilos
    checkButton.textContent = 'Comprobar'; // Texto del botón

    // Evento: al hacer clic se llama a la función de verificación
    checkButton.addEventListener('click', checkCurrentExercise);
    exerciseContent.appendChild(checkButton);

    // Contenedor para mostrar retroalimentación (correcto/incorrecto)
    const feedbackContainer = document.createElement('div');
    feedbackContainer.id = 'exercise-feedback'; // ID usado para llenar feedback luego
    exerciseContent.appendChild(feedbackContainer);
}

// Función: checkCurrentExercise()
// Propósito: Verifica si la respuesta del usuario en el ejercicio actual es correcta,
// y muestra retroalimentación visual según el resultado.
function checkCurrentExercise() {
    const exercise = exercisesData[currentExerciseIndex]; // Obtiene el ejercicio actual
    const feedbackElement = document.getElementById('exercise-feedback'); // Elemento donde se mostrará el resultado
    feedbackElement.innerHTML = ''; // Limpia la retroalimentación anterior

    let isCorrect = false; // Variable que indica si la respuesta es correcta

    // Evaluación para ejercicios de opción múltiple o verdadero/falso
    if (exercise.type === "multiple-choice" || exercise.type === "true-false") {
        // Si el usuario no ha seleccionado ninguna opción
        if (currentSelectedOption === null) {
            feedbackElement.innerHTML = '<div class="feedback warning">Por favor selecciona una opción</div>';
            return; // Sale de la función sin evaluar
        }

        // Compara el índice de la opción seleccionada con la opción correcta
        isCorrect = currentSelectedOption === exercise.correct;
    }

    // Evaluación para ejercicios de llenar el espacio en blanco
    else if (exercise.type === "fill-blank") {
        const userAnswer = document.getElementById('fill-blank-answer').value.trim().toLowerCase(); // Respuesta del usuario
        isCorrect = userAnswer === exercise.correct.toLowerCase(); // Compara con la respuesta correcta (ignorando mayúsculas)
    }

    // Mostrar retroalimentación según el resultado
    if (isCorrect) {
        feedbackElement.innerHTML = `
            <div class="feedback correct">
                ¡Correcto! ${exercise.explanation}
            </div>
        `;
    } else {
        feedbackElement.innerHTML = `
            <div class="feedback incorrect">
                Respuesta incorrecta. ${exercise.explanation}
            </div>
        `;
    }
}

// Función: checkStoryCompletion()
// Propósito: Verifica si todas las palabras arrastradas en la historia interactiva
// son correctas, y muestra un mensaje de retroalimentación.
function checkStoryCompletion() {
    const story = storiesData[currentStoryIndex]; // Historia actual a evaluar
    let allCorrect = true; // Variable para verificar si todas las palabras son correctas

    // Revisión de cada espacio en blanco en la historia
    story.blanks.forEach(blank => {
        const blankElement = document.getElementById(`blank-${blank.id}`); // Zona de drop correspondiente
        const blankText = document.getElementById(`blank-text-${blank.id}`).textContent; // Texto actual en el espacio

        // Si el texto arrastrado no coincide con el correcto
        if (blankText !== blank.correct) {
            allCorrect = false; // Marca que hay al menos un error
            blankElement.classList.add('incorrect'); // Resalta el error visualmente
        }
    });

    // Mostrar retroalimentación final
    const feedbackElement = document.getElementById('story-feedback'); // Contenedor para el mensaje
    if (allCorrect) {
        feedbackElement.innerHTML = '<div class="feedback correct">¡Perfecto! Has completado la historia correctamente.</div>';
    } else {
        feedbackElement.innerHTML = '<div class="feedback incorrect">Algunas palabras no son correctas. ¡Sigue intentando!</div>';
    }
}

// Función: selectOption(blankId, option)
// Propósito: Inserta una palabra seleccionada en el espacio correspondiente
// dentro de la historia interactiva y luego verifica si la historia está completa.
function selectOption(blankId, option) {
    const blankElement = document.getElementById(`blank-${blankId}`); // Obtiene el elemento del espacio en blanco
    blankElement.textContent = option; // Asigna el texto de la opción al espacio
    blankElement.setAttribute('data-selected', option); // Guarda la palabra seleccionada como atributo

    // Verifica si todos los espacios están correctamente completados
    checkStoryCompletion();
}

// Función: nextStory()
// Propósito: Avanza a la siguiente historia interactiva,
// o muestra un mensaje cuando ya no hay más historias.
function nextStory() {
    if (currentStoryIndex < storiesData.length - 1) {
        currentStoryIndex++; // Avanza al índice de la siguiente historia
        loadStoryActivity(); // Carga esa nueva historia
    } else {
        alert("¡Felicidades! Has completado todas las historias."); // Mensaje final
    }
}

// Función: prevStory()
// Propósito: Retrocede a la historia anterior si no está en la primera.
function prevStory() {
    if (currentStoryIndex > 0) {
        currentStoryIndex--; // Retrocede al índice anterior
        loadStoryActivity(); // Carga esa historia
    }
}

// Función: prevExercise()
// Propósito: Retrocede al ejercicio anterior si no está en el primero.
// También limpia la selección actual.
function prevExercise() {
    if (currentExerciseIndex > 0) {
        currentExerciseIndex--; // Retrocede al ejercicio anterior
        currentSelectedOption = null; // Limpia la opción seleccionada
        loadExercises(); // Carga el ejercicio
    }
}

// Función: nextExercise()
// Propósito: Avanza al siguiente ejercicio, o muestra un mensaje final.
// También limpia la selección actual.
function nextExercise() {
    if (currentExerciseIndex < exercisesData.length - 1) {
        currentExerciseIndex++; // Avanza al siguiente ejercicio
        currentSelectedOption = null; // Limpia la opción seleccionada
        loadExercises(); // Carga el ejercicio
    } else {
        alert("¡Excelente trabajo! Has completado todos los ejercicios."); // Mensaje final
    }
}

// Evento: DOMContentLoaded
// Propósito: Ejecuta funciones iniciales cuando el DOM está completamente cargado.
window.addEventListener('DOMContentLoaded', () => {
    // Muestra la actividad por defecto (por ejemplo, clasificación de palabras)
    showActivity('classification');

    // Si la sección de ejercicios está visible, carga los ejercicios
    if (document.getElementById('exercises').style.display === 'block') {
        loadExercises();
    }
});


