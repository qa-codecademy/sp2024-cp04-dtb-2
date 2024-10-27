export default class UploadImgService {
    /**
     *
     */
    constructor() {
        
        
        allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
        this.dropArea = document.getElementById("drop-area");
    }

    UploadListener (){
        this.dropArea.addEventListener('dragenter',e =>{
            e.preventDefault();
        });
        this.dropArea.addEventListener('dragleave',e =>{
            e.preventDefault();
        });
        this.dropArea.addEventListener('dragover',e =>{
            e.preventDefault();
        });
        this.dropArea.addEventListener('drop',e =>{
            console.log(e.dataTransfer.files);
             
            e.preventDefault();
        });
    }
}