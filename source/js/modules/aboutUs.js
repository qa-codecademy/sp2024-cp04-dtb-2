import {postService} from "../app.js";

export function aboutUsPageLoader() {
    postService.selectedFilter = null;
    postService.loadMoreBtn.style.display = "none";
    postService.filterDiv.style.display = "none";
    postService.backBtn.style.display = "block";
    // postService.contentDiv.setAttribute("style"," ");
    // postService.contentDiv.setAttribute("class","row");
    // postService.result.setAttribute("style","max-width: none; max height: none; display: block ");
    // postService.result.setAttribute("class"," ");
    postService.result.innerHTML = `
    <div id='aboutMainDiv'>
    <div id='aboutHeadDiv'>
        <img src="./source/data/logoImg/logo.png" width="150px""> <span><h1>About us</h1></span>
    </div>
    <hr>
    <div>
        <h3>Our team consists of 4 developers and 2 QA engineers:</h3>
        <ul>
            <li><h4>Daniel - Developer</h4></li>
            <li><h4>Boris - Developer</h4></li>
            <li><h4>Sasho - Developer</h4></li>
            <li><h4>Petar - Developer</h4></li>
            <li><h4>Elena - QA engineer</h4></li>
            <li><h4>Marina - QA engineer</h4></li>
        </ul>
    </div>
    </div>
    
    `}