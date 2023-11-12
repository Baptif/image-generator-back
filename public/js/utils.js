// Function to clear image grid
function clearImageGrid(page){
    document.getElementById("image-grid-"+page).innerHTML = "";
}

// Function to show the snackbars
function showSnackbar(type,time) {
    let snackbar = document.getElementById("snackbar-"+type);
    snackbar.className += " show";
    setTimeout(function(){ snackbar.className = snackbar.className.replace(" show", ""); }, time);
}

// Function to download generated images
function downloadImage(imageData, imageNumber){
    const today = new Date().toLocaleString('en-GB').replace(", ","-");

    const link = document.createElement("a");
    link.href = imageData;
    // Set filename based on the selected image
    link.download = `image${imageNumber}-${today}.jpg`;
    link.click();
}

// Function to save the images
function likeImage(imageData, imageNumber, isFavNext){
    const likeButton = document.getElementById(`like-${imageNumber}`);
    likeButton.innerHTML = "favorite";

    const userImages = JSON.parse(localStorage.getItem('userImages')) || [];
    userImages.push({imageNumber:imageNumber,imageData:imageData});
    localStorage.setItem('userImages', JSON.stringify(userImages));

    showSnackbar("saved", 2900);

    likeButton.onclick = () => unlikeImage(imageData, imageNumber, isFavNext);
}

// Function to unsave the images
function unlikeImage(imageData, imageNumber, isFavNext){
    // Delete image from userImages (splice IndexOfImage for 1 image)
    const userImages = JSON.parse(localStorage.getItem('userImages')) || [];
    userImages.splice(userImages.findIndex(image => image.imageNumber === imageNumber), 1);
    localStorage.setItem('userImages', JSON.stringify(userImages));

    if(isFavNext){
        const likeButton = document.getElementById(`like-${imageNumber}`);
        likeButton.innerHTML = "favorite_border";
        likeButton.onclick = () => likeImage(imageData, imageNumber, isFavNext);
    }
    else{
        onLoadGenerateSavedImagesGrid();
    }

    showSnackbar("unsaved", 2900);
}

// Function to create an image in the dom
function createImage(imageData, imageNumber){
    const img = document.createElement("img");
    img.src = imageData;
    img.alt = `art-${imageNumber + 1}`;
    img.title = "Download the image";
    img.onclick = () => downloadImage(imageData, imageNumber);

    return img;
}

// Function to create like button for the images
function createLikeButton(imageData, imageNumber){
    const icon = document.createElement("i");
    icon.className = "material-icons btn-icon";
    icon.id = `like-${imageNumber}`;
    icon.innerHTML = "favorite_border";
    icon.onclick = () => likeImage(imageData, imageNumber, true);

    return icon;
}

// Function to create delete button for the images
function createDeleteButton(imageData, imageNumber){
    const icon = document.createElement("i");
    icon.className = "material-icons btn-icon";
    icon.id = `delete-${imageNumber}`;
    icon.innerHTML = "delete_forever";
    icon.title = "Remove the image from your favorites";
    icon.onclick = () => unlikeImage(imageData, imageNumber, false);

    return icon;
}

// Function to transform blolb to base64 data
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}