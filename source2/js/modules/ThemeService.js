export default class ThemeService {
    /**
     *
     */
    constructor() {
        this.isDarkTheme = false;        
    }
    lightDarkChek() {
        if (this.isDarkTheme) {
            this.lightMode();
            this.isDarkTheme = false;
        } else {
            this.darkMode();
            this.isDarkTheme = true;
        }
    }


    lightMode() {
        document.documentElement.setAttribute("data-bs-theme", "light");
        document.getElementById("newsletterImg").setAttribute("src", "/data/icons/envelope.svg");
        document.getElementById("srcIcon").setAttribute("src", "/data/icons/search.svg");
        document.getElementById("filterIcon").setAttribute("src", "/data/icons/filter.svg");
        document.getElementById("lightDarkToggle").setAttribute("src", "/data/icons/brightness-high-fill.svg");
        document.getElementById("loginBtn").setAttribute("class", "btn btn-dark");
        document.getElementById("dropdownMenuClickableInside").setAttribute("style", "color: black;");
        document.getElementById('backBtn').innerHTML = `<img src='/data/icons/arrow-left.svg'>`
        document.querySelectorAll(".starsIcon").forEach(function (element) {
            element.setAttribute("src", "/data/icons/star.svg");
        });
        document.querySelectorAll(".commentsIcon").forEach(function (element) {
            element.setAttribute("src", "/data/icons/chat-right.svg");
        });
        document.querySelectorAll(".form-check-label").forEach(function (element) {
            element.style.color = "black";
        });
        document.querySelectorAll('.card, .card-title').forEach(function (card) {
            card.style.backgroundColor = '#f0efef';
            card.style.color = "black";
        });
    }
    darkMode() {
        document.documentElement.setAttribute("data-bs-theme", "dark"); //dark Theme 
        document.getElementById("newsletterImg").setAttribute("src", "/data/icons/envelopeWhite.svg");
        document.getElementById("srcIcon").setAttribute("src", "/data/icons/searchWhite.svg");
        document.getElementById("filterIcon").setAttribute("src", "/data/icons/filterWhite.svg");
        document.getElementById("lightDarkToggle").setAttribute("src", "/data/icons/moon.svg");
        document.getElementById("loginBtn").setAttribute("class", "btn btn-light");
        document.getElementById("dropdownMenuClickableInside").setAttribute("style", "color: white;");
        document.getElementById('backBtn').innerHTML = `<img src='/data/icons/arrow-left-dark.svg'>`
        document.querySelectorAll(".starsIcon").forEach(function (element) {
            element.setAttribute("src", "/data/icons/starWhite.svg");
        });
        document.querySelectorAll(".commentsIcon").forEach(function (element) {
            element.setAttribute("src", "/data/icons/chat-rightWhite.svg");
        });
        document.querySelectorAll(".form-check-label").forEach(function (element) {
            element.style.color = "white";
        });
        document.querySelectorAll('.card, .card-title').forEach(function (card) {
            card.style.backgroundColor = '#2e3136';
            card.style.color = "white";
        });
    }
}