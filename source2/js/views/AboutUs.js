import AbstractView from "./AbstractView.js";

export default class AboutUs extends AbstractView {
  constructor() {
    super();
    this.setTitle("About Us");
  }

  async getHtml() {
    return `
      <div id='aboutMainDiv'>
        <div id='aboutHeadDiv'>
          <img src="../../data/logoImg/logo.png" width="150px""> 
          <span><h1>About us</h1></span>
        </div>
        <hr>
        <div>
          <h3>Our team consists of 4 developers and 2 QA engineers:</h3>
          <ul>
            <li><h4>Daniel Petrov - Developer</h4></li>
            <li><h4>Boris Krstovski - Developer</h4></li>
            <li><h4>Sasho Popovski - Developer</h4></li>
            <li><h4>Petar Dimiskovski - Developer</h4></li>
            <li><h4>Elena Josifovska - QA engineer</h4></li>
            <li><h4>Marina Nikolovska - QA engineer</h4></li>
          </ul>
        </div>
      </div>
    `;
  }
}
