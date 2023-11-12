// Fonction
function onLoadGenerateSavedImagesGrid() {
    clearImageGrid("profil");

    const userImages = JSON.parse(localStorage.getItem('userImages')) || [];
    const imageGrid = document.getElementById("image-grid-profil");

    userImages.forEach((image) => {
        const imageData = image.imageData;
        const imageID = image.imageNumber;
        const div = document.createElement("div");
        div.className = "image-div";
        // Adding icons buttons to images
        const iconButton = createDeleteButton(imageData, imageID);
        div.appendChild(iconButton);
        // Adding images to the screen
        const img = createImage(imageData, imageID);
        div.appendChild(img);
        
        imageGrid.appendChild(div);
    });
}