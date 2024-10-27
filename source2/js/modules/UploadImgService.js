export default class UploadImgService {
    constructor() {
        this.allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
        this.dropArea = document.getElementById("drop-area");
        this.dropAreaPreview = document.getElementById("drop-preview");
        
        // Initialize the event listener
        this.UploadListener();
    }

    UploadListener() {
        // Remove any existing drop listeners to prevent duplicate handlers
        this.dropArea.removeEventListener('dragenter', this.preventDefaults);
        this.dropArea.removeEventListener('dragleave', this.preventDefaults);
        this.dropArea.removeEventListener('dragover', this.preventDefaults);
        this.dropArea.removeEventListener('drop', this.handleDrop.bind(this));

        // Add listeners again
        this.dropArea.addEventListener('dragenter', this.preventDefaults);
        this.dropArea.addEventListener('dragleave', this.preventDefaults);
        this.dropArea.addEventListener('dragover', this.preventDefaults);
        this.dropArea.addEventListener('drop', this.handleDrop.bind(this));
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        this.preventDefaults(e); // Prevent default behavior

        const image = e.dataTransfer.files[0];
        if (image) {
            this.PreviewFile(image);
        }
    }

    PreviewFile(file) {
        if (!this.allowedImageTypes.includes(file.type)) {
            return;
        }

        // Clear any existing previews
        this.dropAreaPreview.innerHTML = '';

        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result;

            const imageContainer = document.createElement("div");
            imageContainer.setAttribute("class", "image-container");
            imageContainer.appendChild(image);

            const imageName = document.createElement("p");
            imageName.setAttribute("class", "info");
            imageName.innerHTML = file.name;
            imageContainer.appendChild(imageName);

            this.dropAreaPreview.appendChild(imageContainer);
        };

        reader.readAsDataURL(file);
    }
}