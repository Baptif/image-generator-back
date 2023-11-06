const API_TOKEN = "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";
const API_URL = "https://api-inference.huggingface.co/models/";
const MODEL = "stabilityai/stable-diffusion-xl-base-1.0";

const maxImages = 4; //Number of images that will be generated

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

// Function to show the snackbars
function showSnackbar(type) {
    let snackbar = document.getElementById("snackbar-"+type);
    snackbar.className += " show";
    setTimeout(function(){ snackbar.className = snackbar.className.replace(" show", ""); }, 3000);
}

// Function to download generated images
function downloadImage(imgUrl, imageNumber){
    const today = new Date().toLocaleString('en-GB').replace(", ","-");

    const link = document.createElement("a");
    link.href = imgUrl;
    // Set filename based on the selected image
    link.download = `image${imageNumber + 1}-${today}.jpg`;
    link.click();
}

// Function to generate images
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    const imageUrls = [];
    let imagesError = false;

    for(let i = 0; i < maxImages; i++){
        const randomNumber = getRandomNumber(1, 10000);
        // Random number is added to the prompt to create different results each time
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            API_URL+MODEL,
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
            imagesError = true;
        }else{
            // Creating the url to download the images from
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            imageUrls.push(imageUrl);
            // Adding images to the screen
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = `art-${i + 1}`;
            img.onclick = () => downloadImage(imageUrl, i);
            document.getElementById("image-grid").appendChild(img);
        }
    }

    if(imagesError){
        showSnackbar("danger");
    }

    loading.style.display = "none";
    enableGenerateButton();
}

document.getElementById("generate").addEventListener("click", () => {
    const input = document.getElementById("user-prompt").value;
    if(input){
        generateImages(input);
    }
    else{
        showSnackbar("warning");
    }
});

document.getElementById("user-prompt").addEventListener("keypress", function(event) {
    if (event.key === "Enter"){
        event.preventDefault();
        document.getElementById("generate").click();
    }
});