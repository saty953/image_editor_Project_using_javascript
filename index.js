const chooseImgBtn = document.querySelector(".choose-img"),
    filterOptions = document.querySelectorAll(".filter button"),
    rotateOptions = document.querySelectorAll(".rotate button"),
    filterName = document.querySelector(".filter-info .name"),
    slider = document.querySelector(".slider input"),
    sliderValue = document.querySelector(".slider .value"),
    imagePreview = document.querySelector(".preview-img img"),
    inputFile = document.querySelector(".file-input"),
    resetFilterBtn = document.querySelector(".reset-filter"),
    saveImgBtn = document.querySelector(".save-img");


let Brightness = 100, Saturation = 100, Contrast = 100, Inversion = 0, Grayscale = 0;
let rotation = 0, horizontalFlip = 1, verticalFlip = 1;

const applyFilter = () => {
    imagePreview.style.transform = `rotate(${rotation}deg) scale(${verticalFlip}, ${horizontalFlip})`;
    imagePreview.style.filter = `brightness(${Brightness}%) saturate(${Saturation}%) contrast(${Contrast}%) invert(${Inversion}%) grayscale(${Grayscale}%)`;
}

const loadImage = () => {
    let file = inputFile.files[0];   // getting user selected file
    if (!file) return;   // return if user has not selected the file 
    imagePreview.src = URL.createObjectURL(file);    // passing file url as preview img src
    imagePreview.addEventListener("load", () => {
        document.querySelector(".container").classList.remove("disable");
    })
}

filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active")
        option.classList.add("active");
        filterName.textContent = option.textContent;

        if (option.id == "brightness") {
            slider.max = '200';
            slider.value = Brightness;
            sliderValue.textContent = `${Brightness}%`
        }
        else if (option.id == "saturation") {
            slider.max = '200';
            slider.value = Saturation;
            sliderValue.textContent = `${Saturation}%`
        }
        else if (option.id == "contrast") {
            slider.max = '200';
            slider.value = Contrast;
            sliderValue.textContent = `${Contrast}%`
        }
        else if (option.id == "inversion") {
            slider.max = '100';
            slider.value = Inversion;
            sliderValue.textContent = `${Inversion}%`
        }
        else {
            slider.max = '100';
            slider.value = Grayscale;
            sliderValue.textContent = `${Grayscale}%`
        }
    })
});

slider.addEventListener('input', () => {
    sliderValue.textContent = `${slider.value}%`;
    const selectedFilter = document.querySelector(".options .active");
    if (selectedFilter.id == "brightness") {
        Brightness = slider.value;
    }
    else if (selectedFilter.id == "saturation") {
        Saturation = slider.value;
    }
    else if (selectedFilter.id == "inversion") {
        Inversion = slider.value;
    }
    else if (selectedFilter.id = "contrast") {
        Contrast = slider.value;
    }
    else {
        Grayscale = slider.value;
    }
    applyFilter();
})

rotateOptions.forEach((option) => {
    option.addEventListener("click", () => { // adding click event listener to all rotate/flip buttons
        if (option.id == "left") {
            rotation -= 90;
        }
        else if (option.id == "right") {
            rotation += 90
        }
        else if (option.id == "vertical") {
            verticalFlip = verticalFlip === 1 ? -1 : 1;
        }
        else {
            horizontalFlip = horizontalFlip === 1 ? -1 : 1;
        }
        applyFilter();
    })
})


const resetFilters = () => { // reseting all the values to default
    Brightness = 100, Saturation = 100, Contrast = 100, Inversion = 0, Grayscale = 0;
    rotation = 0, horizontalFlip = 1, verticalFlip = 1;
    filterOptions[0].click(); // clicking brightness so that it remains selected by default 
    applyFilter();
}

const downloadImage = () => {
    const canvas = document.createElement("canvas"); // creating canvas element
    const ctx = canvas.getContext("2d"); // canvas.getContext returns a drawing context on the canvas
    canvas.width = imagePreview.naturalWidth; // setting canvas width to actual width of image
    canvas.height = imagePreview.naturalHeight; // setting canvas height to actual height of image

    // applying user selected filters to canvas filter
    ctx.filter = `brightness(${Brightness}%) saturate(${Saturation}%) contrast(${Contrast}%) invert(${Inversion}%) grayscale(${Grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2) //translate canvas from center
    ctx.rotate(rotation * Math.PI / 180);
    ctx.scale(verticalFlip, horizontalFlip) // flip canvas horizontally / vertically
    ctx.drawImage(imagePreview, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

    // for downloading the image
    const link = document.createElement("a") // create <a> element
    link.download = "image.jpg"; // passing a tag download value to image.jpg
    link.href = canvas.toDataURL() // Passing a tag href value to canvas data url
    link.click();
}

resetFilterBtn.addEventListener("click", resetFilters);
saveImgBtn.addEventListener("click", downloadImage);
inputFile.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => { inputFile.click() });
