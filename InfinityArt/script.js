const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

const HF_API_KEY = ""; 
const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

let isImageGenerating = false;

const generateImage = async (prompt) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs: prompt }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate AI image. Please check your API key and try again.");
        }

        const imageBlob = await response.blob();
        return URL.createObjectURL(imageBlob);
    } catch (error) {
        console.error(error);
        alert(error.message);
        return null;
    }
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
    imageGallery.innerHTML = ""; // Clear existing images

    for (let i = 0; i < userImgQuantity; i++) {
        const imgCard = document.createElement("div");
        imgCard.classList.add("img-card", "loading");

        const imgElement = document.createElement("img");
        imgElement.src = "images/loader.svg"; // Placeholder loader

        const downloadBtn = document.createElement("a");
        downloadBtn.classList.add("download-btn");
        downloadBtn.innerHTML = `<img src="images/download.svg" alt="download icon">`;

        imgCard.appendChild(imgElement);
        imgCard.appendChild(downloadBtn);
        imageGallery.appendChild(imgCard);

        // Generate and update image
        const imageUrl = await generateImage(userPrompt);
        if (imageUrl) {
            imgElement.src = imageUrl;
            imgElement.onload = () => imgCard.classList.remove("loading");
            downloadBtn.href = imageUrl;
            downloadBtn.setAttribute("download", `ai-image-${i + 1}.png`);
        }
    }

    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
};

const handleImageGeneration = (e) => {
    e.preventDefault();
    if (isImageGenerating) return;

    const userPrompt = e.target[0].value;
    const userImgQuantity = parseInt(e.target[1].value);

    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating...";
    isImageGenerating = true;

    generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleImageGeneration);
