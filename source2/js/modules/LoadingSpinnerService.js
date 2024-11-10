class LoadingSpinnerService{

    constructor() 
    {
        this.spinner = document.getElementById("loadIndicator");
    }
    

    displaySpinner = () => this.spinner.style.visibility = "visible";
    hideSpinner = () => this.spinner.style.visibility = "hidden"; 
}

const loadingSpinnerService = new LoadingSpinnerService();
export default loadingSpinnerService;