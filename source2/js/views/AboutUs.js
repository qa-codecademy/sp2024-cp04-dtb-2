import AbstractView from "./AbstractView.js";
import { ButtonService } from "../modules/ButtonService.js";

const btnService = new ButtonService();

export default class AboutUs extends AbstractView {

  constructor(params) {
    super(params);
    this.setTitle("About Us");
  }

  async getHtml() {
    
    btnService.loadMoreBtn.style.display = "none";
    // <li><h4>Petar Dimiskovski - Developer</h4></li>  Not anymore
    return `
      <div id='aboutMainDiv'>
        <div id='aboutHeadDiv'>
          <img src="/data/logoImg/logo.png" width="150px""> 
          <span><h1>About us</h1></span>
        </div>
        <hr>
        <div>
          <h3>Our team consists of 3 developers and 2 QA engineers:</h3>
          <ul>
            <li><h4>Daniel Petrov - Developer</h4></li>
            <li><h4>Boris Krstovski - Developer</h4></li>
            <li><h4>Sasho Popovski - Developer</h4></li>
            <li><h4>Elena Josifovska - QA engineer</h4></li>
            <li><h4>Marina Nikolovska - QA engineer</h4></li>
          </ul>
        </div>
      </div>
    `;
  }
}
