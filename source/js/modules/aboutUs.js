import {postService} from "../app.js";

export function aboutUsPageLoader() {
    postService.lastPageLoaded.push("about");
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
            <li><h4>Daniel Petrov - Developer</h4></li>
            <li><h4>Boris Krstovski - Developer</h4></li>
            <li><h4>Sasho Popovski - Developer</h4></li>
            <li><h4>Petar Dimiskovski - Developer</h4></li>
            <li><h4>Elena Josifovska - QA engineer</h4></li>
            <li><h4>Marina Nikolovska - QA engineer</h4></li>
        </ul>
    </div>
    </div>
    
    `}