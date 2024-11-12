class UploadImgService {
    constructor() {
        this.uploadedImage;
        this.allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
        this.dropArea = document.getElementById("drop-area");
        this.dropAreaPreview = document.getElementById("drop-preview");
        
        this.UploadListener();
    }

    UploadListener() {
        this.dropArea.removeEventListener('dragenter', this.preventDefaults);
        this.dropArea.removeEventListener('dragleave', this.preventDefaults);
        this.dropArea.removeEventListener('dragover', this.preventDefaults);
        this.dropArea.removeEventListener('drop', this.handleDrop.bind(this));

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
        this.preventDefaults(e);

        const image = e.dataTransfer.files[0];
        if (image) {
            this.PreviewFile(image);
        }
    }

    PreviewFile(file) {
        if (!this.allowedImageTypes.includes(file.type)) {
            return;
        }
        this.dropAreaPreview.innerHTML = '';
    
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
    
            let base64String = result.split(',')[1];
            base64String = base64String.replace(/[^A-Za-z0-9+/=]/g, '');
    
            const image = new Image();
            image.src = "data:image/png;base64," + base64String;
            image.classList.add("preview-image");
    
            const imageContainer = document.createElement("div");
            imageContainer.setAttribute("class", "image-container");
            imageContainer.appendChild(image);
    
            const imageName = document.createElement("p");
            imageName.setAttribute("class", "info");
            imageName.innerHTML = file.name;
            imageContainer.appendChild(imageName);
    
            this.uploadedImage = base64String; 
            this.dropAreaPreview.appendChild(imageContainer);
        };
    
        reader.readAsDataURL(file);
    }
}

const uploadImageService = new UploadImgService();
export default uploadImageService;