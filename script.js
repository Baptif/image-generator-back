const API_TOKEN = "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";

const maxImages = 4; //Number of images that will be generated
let selectedImageNumber = null;

// Function to generate a random number between min and max (include)
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1))  + min;
}

// Function to disable the generate button during processing
function disableGenerateButton(){
    document.getElementById("generate").disabled = true;
}

// Function to enable the generate button after processing
function enableGenerateButton(){
    document.getElementById("generate").disabled = false;
}

// Function to clear image grid
function clearImageGrid(){
    document.getElementById("image-grid").innerHTML = "";
}

// Function to download generated images
function downloadImage(imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    // Set filename based on the selected image
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();
}

// Function to generate images
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];

    for(let i = 0; i < maxImages; i++){
        const randomNumber = getRandomNumber(1, 100);
        // Random number is added to the prompt to create different results each time
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/prompthero/openjourney",
            {
                headers: { 
                    "Content-Type": "application\json",
                    "Authorization": `Bearer ${API_TOKEN}` 
                },
                method: "POST",
                body: JSON.stringify({inputs:prompt}),
            }
        );

        if(!response.ok){
            alert("Failed to generate images 🚫");
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        imageUrls.push(imageUrl);

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imageUrl, i);
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none";
    enableGenerateButton();

    selectedImageNumber = null; // Reset selected image number
}

document.getElementById("generate").addEventListener("click", () => {
    const input = document.getElementById("user-prompt").value;
    generateImages(input);
});