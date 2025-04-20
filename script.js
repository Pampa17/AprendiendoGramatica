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
