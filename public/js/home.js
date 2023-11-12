
const maxImages = 4; //Number of images that will be generated

const userImagesForLength = JSON.parse(localStorage.getItem('userImages')) || [];
const nbUserImages = userImagesForLength.length;

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

// Function to generate images
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid("home");

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    let imagesError = false;

    for(let i = 0; i < maxImages; i++){
        const randomNumber = getRandomNumber(1, 1000);
        // Random number is added to the prompt to create different results each time
        const prompt = `${input} ${randomNumber}`;

        const response = await fetch(
            API_URL+API_MODEL_2,
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
            const imageData = await blobToBase64(blob);
            const imageID = nbUserImages + i;
            // Creating image divs
            const div = document.createElement("div");
            div.className = "image-div";
            // Adding icons buttons to images
            const iconButton = createLikeButton(imageData, imageID);
            div.appendChild(iconButton);
            // Adding images to the screen
            const img = createImage(imageData, imageID);
            div.appendChild(img);

            document.getElementById("image-grid-home").appendChild(div);
        }
    }

    if(imagesError){
        showSnackbar("error",3000);
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
        showSnackbar("prompt",3000);
    }
});

document.getElementById("user-prompt").addEventListener("keypress", function(event) {
    if (event.key === "Enter"){
        event.preventDefault();
        document.getElementById("generate").click();
    }
});