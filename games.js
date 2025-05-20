// Datos para los juegos
const wordsData = [
    { text: 'perro', type: 'sustantivo'},
    { text: 'feliz', type: 'adjetivo'},
    { text: 'correr', type: 'verbo'},
    { text: 'libro', type: 'sustantivo'},
    { text: 'grande', type: 'adjetivo'},
    { text: 'saltar', type: 'verbo'},
    { text: 'maestro', type: 'sustantivo'},
    { text: 'rápido', type: 'adjetivo'},
    { text: 'leer', type: 'verbo'},
    { text: 'hombre', type: 'sustantivo'},
    { text: 'estudiar', type: 'verbo'},
    { text: 'increíble', type: 'adjetivo'},
    { text: 'espada', type: 'sustantivo'},
    { text: 'exclamar', type: 'verbo'},
    { text: 'blanco', type: 'adjetivo'}
];

const storiesData = [
    {
        id: 1,
        title: "El Día en el Parque",
        content: "El [1] juega en el parque. Es un día [2] y soleado. Los niños [3] y se divierten mucho.",
        blanks: [
            { id: 1, correct: 'perro', options: ['perro', 'feliz', 'correr']},
            { id: 2, correct: 'caluroso', options: ['caluroso', 'libro', 'saltar']},
            { id: 3, correct: 'corren', options: ['corren', 'grande', 'maestro']}
        ]
    },
        {
        id: 2,
        title: "La Aventura en la Escuela",
        content: "La [1] explica la lección con su voz [2]. Los estudiantes [3] atentamente y toman notas en sus [4].",
        blanks: [
            { id: 1, correct: 'maestra', options: ['maestra', 'rápido', 'leer']},
            { id: 2, correct: 'clara', options: ['clara', 'ciudad', 'escribir']},
            { id: 3, correct: 'escuchan', options: ['escuchan', 'pequeño', 'libro']},
            { id: 4, correct: 'cuadernos', options: ['cuadernos', 'feliz', 'saltar']}
        ]
    },
    {
        id: 3,
        title: "El Cumpleaños Sorpresa",
        content: "Hoy es mi [1] y mis amigos me prepararon una [2] sorpresa. El pastel es [3] y [4]. Todos [5] y [6] juntos.",
        blanks: [
            { id: 1, correct: 'cumpleaños', options: ['cumpleaños', 'alegre', 'celebran']},
            { id: 2, correct: 'fiesta', options: ['fiesta', 'grande', 'feliz']},
            { id: 3, correct: 'delicioso', options: ['delicioso', 'regalo', 'soplar']},
            { id: 4, correct: 'colorido', options: ['colorido', 'velas', 'reír']},
            { id: 5, correct: 'ríen', options: ['ríen', 'amigos', 'globos']},
            { id: 6, correct: 'juegan', options: ['juegan', 'festejo', 'dulce']}
        ]
    }
];

const exercisesData = [
    {
        type: "multiple-choice",
        question: "¿Cuál de estas palabras es un sustantivo?",
        options: ["correr", "feliz", "libro", "rápido"],
        correct: 2,
        explanation: "Los sustantivos son palabras que nombran personas, animales, cosas o ideas. 'Libro' es un sustantivo."
    },
    {
        type: "multiple-choice",
        question: "¿Cuál palabra es un adjetivo en la frase: 'El gato negro duerme'?",
        options: ["gato", "negro", "duerme", "el"],
        correct: 1,
        explanation: "'Negro' es un adjetivo porque describe al sustantivo 'gato'."
    },
    {
        type: "true-false",
        question: "En la frase 'La casa grande', 'grande' es un sustantivo.",
        options: ["Verdadero", "Falso"],
        correct: 1,
        explanation: "'Grande' es un adjetivo que describe al sustantivo 'casa'."
    },
    {
        type: "fill-blank",
        question: "Completa con un verbo: Los niños ___ en el parque.",
        correct: "juegan",
        hint: "Acción divertida",
        explanation: "Necesitamos un verbo que describa lo que hacen los niños."
    }
];
