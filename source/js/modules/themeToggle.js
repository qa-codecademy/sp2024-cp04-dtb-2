console.log("CONNECTED");
document.getElementById("lightDarkToggle").addEventListener("click", function(){ // ligth Theme 
    if (document.documentElement.getAttribute("data-bs-theme") == "dark") {
        document.documentElement.setAttribute("data-bs-theme", "light");
        document.getElementById("newsletterImg").setAttribute("src","./source/data/icons/envelope.svg");
        document.getElementById("srcIcon").setAttribute("src","./source/data/icons/search.svg");
        document.getElementById("filterIcon").setAttribute("src","./source/data/icons/filter.svg");
        document.getElementById("lightDarkToggle").setAttribute("src","./source/data/icons/brightness-high-fill.svg");
        document.getElementById("loginBtn").setAttribute("class", "btn btn-dark");
        document.getElementById("dropdownMenuClickableInside").setAttribute("style","color: black;");
        document.querySelectorAll(".form-check-label").forEach(function(element) {
            element.style.color = "black";
        });
        document.querySelectorAll('.card, .card-title').forEach(function(card) {
            card.style.backgroundColor = '#f0efef'; 
            card.style.color = "black";
        });



    } else if(document.documentElement.getAttribute("data-bs-theme") == "light") {
        document.documentElement.setAttribute("data-bs-theme", "dark"); //dark Theme 
        document.getElementById("newsletterImg").setAttribute("src","./source/data/icons/envelopeWhite.svg");
        document.getElementById("srcIcon").setAttribute("src","./source/data/icons/searchWhite.svg");
        document.getElementById("filterIcon").setAttribute("src","./source/data/icons/filterWhite.svg");
        document.getElementById("lightDarkToggle").setAttribute("src","./source/data/icons/moon.svg");
        document.getElementById("loginBtn").setAttribute("class", "btn btn-light");
        document.getElementById("dropdownMenuClickableInside").setAttribute("style", "color: white;");
        document.querySelectorAll(".form-check-label").forEach(function(element) {
            element.style.color = "white";
        });
        document.querySelectorAll('.card, .card-title').forEach(function(card) {
            card.style.backgroundColor = 'lightblue'; 
            card.style.color = "white";
        });

        
    }
})  
