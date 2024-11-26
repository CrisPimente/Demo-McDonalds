// Variables de configuración de Azure
const ENDPOINT_URL = "https://identificardordeanucios-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/43fee3b9-e938-40a5-bae4-90c7424158ce/detect/iterations/Iteration17/image";
const PREDICTION_KEY = "6AECdWtXTE5BZBoHYd7NRSD3Vz4iapRhRKFdLzN7CUIroBMHQnnrJQQJ99AKACYeBjFXJ3w3AAAIACOGxWa5";

// Evento cuando se selecciona un archivo
document.getElementById("imageFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        // Previsualizar la imagen seleccionada
        const imagePreview = document.getElementById("imagePreview");
        imagePreview.src = URL.createObjectURL(file);
    }
});

// Función para realizar la predicción
document.getElementById("predict").addEventListener("click", async () => {
    const file = document.getElementById("imageFile").files[0];

    if (!file) {
        alert("Por favor, selecciona un archivo de imagen.");
        return;
    }

    const formData = await file.arrayBuffer();

    const response = await fetch(ENDPOINT_URL, {
        method: "POST",
        headers: {
            "Prediction-Key": PREDICTION_KEY,
            "Content-Type": "application/octet-stream",
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
    }

    const result = await response.json();
    const predictions = result.predictions || [];

    // Filtrar las predicciones para solo mostrar una por cada categoría
    const categories = ['TACO BELL', 'BURGER KING', 'KFC', 'SUBWAY', 'PIZZA HUT'];
    const filteredPredictions = {};

    predictions.forEach(prediction => {
        if (categories.includes(prediction.tagName)) {
            filteredPredictions[prediction.tagName] = Math.round(prediction.probability * 100);
        }
    });

    // Mostrar las predicciones filtradas con probabilidad redondeada
    let output = "";
    categories.forEach(category => {
        if (filteredPredictions[category]) {
            output += `${category}: ${filteredPredictions[category]}%\n`;
        } else {
            output += `${category}: 0%\n`;  // Si no hay predicción, mostrar 0%
        }
    });

    document.getElementById("output").textContent = output;
});
