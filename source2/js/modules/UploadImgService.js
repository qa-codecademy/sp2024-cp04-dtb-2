class UploadImgService {
    constructor(dropAreaId, previewAreaId, inputId) {
        this.uploadedImage = null;
        this.allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
        this.dropArea = document.getElementById(dropAreaId);
        this.dropAreaPreview = document.getElementById(previewAreaId);
        this.fileInput = document.getElementById(inputId);

        this.initialize();
    }

    initialize() {
        this.addDragListeners();
        this.fileInput.addEventListener('change', this.handleFileInput.bind(this));
    }

    addDragListeners() {
        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            this.dropArea.addEventListener(eventName, this.preventDefaults, false);
        });

        this.dropArea.addEventListener('dragenter', () => this.dropArea.classList.add('drag-over'));
        this.dropArea.addEventListener('dragleave', () => this.dropArea.classList.remove('drag-over'));
        this.dropArea.addEventListener('drop', (e) => {
            this.dropArea.classList.remove('drag-over');
            this.handleDrop(e);
        });
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleFileInput(e) {
        const file = e.target.files[0];
        if (file) this.PreviewFile(file);
    }

    handleDrop(e) {
        const file = e.dataTransfer.files[0];
        if (file) this.PreviewFile(file);
    }

    PreviewFile(file) {
        if (!this.allowedImageTypes.includes(file.type)) {
            alert("Unsupported file type. Please upload a JPEG, PNG, or WebP image.");
            return;
        }

        this.dropAreaPreview.innerHTML = ''; // Clear previous previews
        this.fileInput.value = ''; // Reset the input value in case of previous selections
        
        // Update the input value with the file name
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        this.fileInput.files = dataTransfer.files; // Set the file programmatically

        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            const base64String = result.split(',')[1].replace(/[^A-Za-z0-9+/=]/g, '');

            const image = new Image();
            image.src = result; // Use the full data URL
            image.classList.add("preview-image");

            const imageContainer = document.createElement("div");
            imageContainer.className = "image-container";
            imageContainer.appendChild(image);

            const imageName = document.createElement("p");
            imageName.className = "info";
            imageName.textContent = file.name;
            imageContainer.appendChild(imageName);

            this.uploadedImage = base64String;
            this.dropAreaPreview.appendChild(imageContainer);
        };

        reader.readAsDataURL(file);
    }
}

export default UploadImgService;


// class UploadImgService {
//     constructor() {
//         this.uploadedImage = null;
//         this.allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
//         this.dropArea = document.getElementById("drop-area");
//         this.dropAreaPreview = document.getElementById("drop-preview");
//         this.fileInput = document.getElementById("uploadImage");

//         this.initialize();
//     }

//     initialize() {
//         this.addDragListeners();
//         this.fileInput.addEventListener('change', this.handleFileInput.bind(this));
//     }

//     addDragListeners() {
//         ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
//             this.dropArea.addEventListener(eventName, this.preventDefaults, false);
//         });

//         this.dropArea.addEventListener('dragenter', () => this.dropArea.classList.add('drag-over'));
//         this.dropArea.addEventListener('dragleave', () => this.dropArea.classList.remove('drag-over'));
//         this.dropArea.addEventListener('drop', (e) => {
//             this.dropArea.classList.remove('drag-over');
//             this.handleDrop(e);
//         });
//     }

//     preventDefaults(e) {
//         e.preventDefault();
//         e.stopPropagation();
//     }

//     handleFileInput(e) {
//         const file = e.target.files[0];
//         if (file) this.PreviewFile(file);
//     }

//     handleDrop(e) {
//         const file = e.dataTransfer.files[0];
//         if (file) this.PreviewFile(file);
//     }

//     PreviewFile(file) {
//         if (!this.allowedImageTypes.includes(file.type)) {
//             alert("Unsupported file type. Please upload a JPEG, PNG, or WebP image.");
//             return;
//         }
    
//         this.dropAreaPreview.innerHTML = ''; 
//         this.fileInput.value = ''; 
//         const dataTransfer = new DataTransfer();
//         dataTransfer.items.add(file);
//         this.fileInput.files = dataTransfer.files; 
    
//         const reader = new FileReader();
//         reader.onload = () => {
//             const result = reader.result;
//             const base64String = result.split(',')[1].replace(/[^A-Za-z0-9+/=]/g, '');
    
//             const image = new Image();
//             image.src = result; 
//             image.classList.add("preview-image");
    
//             const imageContainer = document.createElement("div");
//             imageContainer.className = "image-container";
//             imageContainer.appendChild(image);
    
//             const imageName = document.createElement("p");
//             imageName.className = "info";
//             imageName.textContent = file.name;
//             imageContainer.appendChild(imageName);
    
//             this.uploadedImage = base64String;
//             this.dropAreaPreview.appendChild(imageContainer);
//         };
    
//         reader.readAsDataURL(file);
//     }
// }

// const uploadImageService = new UploadImgService();
// export default uploadImageService;