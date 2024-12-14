import AbstractView from "./AbstractView.js";
import ButtonService from "../modules/ButtonService.js";
import SessionService from "../modules/SessionService.js";
import apiCaller from "../modules/ApiCaller.js";

const buttonService = new ButtonService();
const sessionService = new SessionService();

export default class AdminPanelBanners extends AbstractView{
    constructor(params) {
        super(params);
        this.setTitle("Ad banners");
        this.params = params;
      }

      async getHtml(){
        buttonService.filterBtn.style.display = "none";
        buttonService.loadMoreBtn.style.display = "none";
        const url = `https://localhost:7073/api/Image/userimages/114`;
        let fetchedImages = await apiCaller.fetchFromDB(url, "GET");
        if(fetchedImages && fetchedImages.length > 0){
            fetchedImages.forEach(element => {
              const temporaryDataHolder = element.data;
              element.data = `data:image/png;base64,${temporaryDataHolder}`;
            });
        }
        let imageCards = '';
        fetchedImages.forEach(image =>{
          imageCards += `
           <div class="card" style="width: 25vw" id="${image.id}">
                    <img class="card-img-top img-fluid imgLink" src="${image.data}" style="object-fit: fill; height: 20vw;" alt="Image should be here">
                    <div class="card-body icons">
                        <button class="btn btn-outline-danger deleteBannerBtn">DELETE</button>
                    </div>
                </div>
          `
        })

        const found = sessionService.Get();
        let result ="";
        if(found){
            result = `<h1>Advertisement Banners</h1>
            <br>
            <button class="btn btn-primary" id="uploadAdminBannerModalBtn">Upload banner</button>
            <div id="adBannersContainerDiv">
              <div id="adBannersContainer">
                ${imageCards ? imageCards : '<h5>No images were found!</h5>'}
              </div>
            </div>
            `;

        } else {
            result = "<h1>Not currently logged in!</h1>";
        }

        return result;
      }
}