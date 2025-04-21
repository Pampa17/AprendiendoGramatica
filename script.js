// Función principal para mostrar diferentes actividades en la página
function showActivity(activityId) {
    // Obtener todas las secciones de actividades mediante su clase 'activity'
    const activities = document.getElementsByClassName('activity');
    
    // Recorrer cada actividad y ocultarla (asegura que solo una esté visible a la vez)
    for (let activity of activities) {
        activity.style.display = 'none';
    }
    
    // Mostrar la sección correspondiente al botón que se haya presionado
    document.getElementById(activityId).style.display = 'block';
    
    // Según la actividad seleccionada, llamar a la función que prepara su contenido
    switch(activityId) {
        case 'classification':
            // Carga el juego de clasificar palabras
            loadClassificationGame();
            break;
        case 'story':
            // Carga la actividad de completar una historia
            loadStoryActivity();
            break;
        case 'exercises':
            // Carga los ejercicios de práctica
            loadExercise();
            break;
    }
}

