export default class NavbarService {
    defaultNavbar (){
        document.getElementById('navbar').innerHTML =
        `
        <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse " id="navbarTogglerDemo01">
                    <div class="d-flex justify-content-between w-100">
                        <a href="/" data-link><img src="/data/logoImg/logo.png" width="65px" height="50px" id="logoImg"></a> 
                        <ul class="navbar-nav mb-2 mb-lg-0 d-flex flex-row">
                            <li class="nav-item">
                                <div class="text-container">
                                    <form id="searchDiv">
                                        <input type="search" id="searchInput" list="suggestionWords" placeholder="Search" required>
                                        <datalist id="suggestionWords">
                                            <option value="Objective C">Objective C</option>
                                        </datalist>
                                        <button class="btn" type="submit"><img src="/data/icons/search.svg" id="srcIcon" alt="Search Icon"
                                            style="width: 20px; height: 20px;"></button>
                                    </form>
                                </div>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" id="homeBtn">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" id="newsletterBtn"><img src="/data/icons/envelope.svg" height="20px" width="20px" id="newsletterImg"></a>
                            </li>
                            <li class="nav-item">
                                <a href ="/aboutus"class="nav-link active" aria-disabled="true" id="aboutBtn" data-link>About</a>
                            </li>
                            <li class="nav-item">
                                <button class="btn" type="submit"><img src="/data/icons/brightness-high-fill.svg" id = "lightDarkToggle"
                                        alt="Brightness" style="width: 20px; height: 20px;"></button>
                            </li>
                            <li class="nav-item">
                                <button type="button" class="btn btn-dark" id="loginBtn">Log in</button>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    loggedInNavbar () {
        document.getElementById('navbar').innerHTML = 
        `
        <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse " id="navbarTogglerDemo01">
                    <div class="d-flex justify-content-between w-100">
                        <a href="/" data-link><img src="/data/logoImg/logo.png" width="65px" height="50px" id="logoImg"></a> 
                        <ul class="navbar-nav mb-2 mb-lg-0 d-flex flex-row">
                            <li class="nav-item">
                                <div class="text-container">
                                    <form id="searchDiv">
                                        <input type="search" id="searchInput" list="suggestionWords" placeholder="Search" required>
                                        <datalist id="suggestionWords">
                                            <option value="Objective C">Objective C</option>
                                        </datalist>
                                        <button class="btn" type="submit"><img src="/data/icons/search.svg" id="srcIcon" alt="Search Icon"
                                            style="width: 20px; height: 20px;"></button>
                                    </form>
                                </div>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" id="homeBtn">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" id="newsletterBtn"><img src="/data/icons/envelope.svg" height="20px" width="20px" id="newsletterImg"></a>
                            </li>
                            <li class="nav-item">
                                <a href ="/aboutus"class="nav-link active" aria-disabled="true" id="aboutBtn" data-link>About</a>
                            </li>
                            <li class="nav-item">
                                <button class="btn" type="submit"><img src="/data/icons/brightness-high-fill.svg" id = "lightDarkToggle"
                                        alt="Brightness" style="width: 20px; height: 20px;"></button>
                            </li>
                            <li class="nav-item">
                                <button type="button" class="btn btn-success" data-toggle="modal" data-target="#createPostModal" id="createPostBtn">Create Post</button>
                            </li>
                            <li class="nav-item">
                                <button type="button" class="btn btn-danger" id="logoutBtn">Log Out</button>
                            </li>                            
                        </ul>
                    </div>
                </div>
            </div>
        `
    }
}