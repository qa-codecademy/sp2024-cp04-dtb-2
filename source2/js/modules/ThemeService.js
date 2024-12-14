class ThemeService {
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
    themeCheck(){
        if (this.isDarkTheme) {
            this.darkMode();
        } else {
            this.lightMode();
        }
    }

    darkMode() {
        document.documentElement.setAttribute("data-bs-theme", "dark"); // Dark theme
        document.getElementById("newsletterImg").setAttribute("src", "/data/icons/envelopeWhite.svg");
        document.getElementById("srcIcon").setAttribute("src", "/data/icons/searchWhite.svg");
        document.getElementById("filterIcon").setAttribute("src", "/data/icons/filterWhite.svg");
        document.getElementById("lightDarkToggle").setAttribute("src", "/data/icons/moon.svg");
    
        let loginBtn = document.getElementById("loginBtn");
        if (loginBtn) loginBtn.setAttribute("class", "btn btn-light");
    
        document.getElementById("dropdownMenuClickableInside").setAttribute("style", "color: white;");
        document.getElementById('backBtn').innerHTML = `<img src='/data/icons/arrow-left-dark.svg'>`;
    
        document.querySelectorAll(".starsIcon").forEach(element => {
            element.setAttribute("src", "/data/icons/starWhite.svg");
        });
        document.querySelectorAll(".commentsIcon").forEach(element => {
            element.setAttribute("src", "/data/icons/chat-rightWhite.svg");
        });
        document.querySelectorAll(".form-check-label").forEach(element => {
            element.style.color = "white";
        });
        document.querySelectorAll('.card, .card-title').forEach(card => {
            card.style.backgroundColor = '#2e3136';
            card.style.color = "white";
        });
    
        document.querySelectorAll('.modal-content').forEach(modal => {
            modal.style.backgroundColor = '#333';
            modal.style.color = '#f0f0f0';
            modal.style.border = '1px solid #444';
    
            modal.querySelectorAll('label').forEach(label => {
                label.style.color = '#f0f0f0';
            });
    
            modal.querySelectorAll('input').forEach(input => {
                input.style.backgroundColor = '#222';
                input.style.color = '#f0f0f0';
                input.style.border = '1px solid #555';
                input.style.caretColor = '#f0f0f0';
            });
    
            modal.querySelectorAll('button').forEach(button => {
                button.style.backgroundColor = '#444';
                button.style.color = '#f0f0f0';
                button.style.border = '1px solid #666';
            });
    
            modal.querySelectorAll('a').forEach(link => {
                link.style.color = '#add8e6';
            });
        });
    }
    
    lightMode() {
        document.documentElement.setAttribute("data-bs-theme", "light");
        document.getElementById("newsletterImg").setAttribute("src", "/data/icons/envelope.svg");
        document.getElementById("srcIcon").setAttribute("src", "/data/icons/search.svg");
        document.getElementById("filterIcon").setAttribute("src", "/data/icons/filter.svg");
        document.getElementById("lightDarkToggle").setAttribute("src", "/data/icons/brightness-high-fill.svg");
    
        let loginBtn = document.getElementById("loginBtn");
        if (loginBtn) loginBtn.setAttribute("class", "btn btn-dark");
    
        document.getElementById("dropdownMenuClickableInside").setAttribute("style", "color: black;");
        document.getElementById('backBtn').innerHTML = `<img src='/data/icons/arrow-left.svg'>`;
    
        document.querySelectorAll(".starsIcon").forEach(element => {
            element.setAttribute("src", "/data/icons/star.svg");
        });
        document.querySelectorAll(".commentsIcon").forEach(element => {
            element.setAttribute("src", "/data/icons/chat-right.svg");
        });
        document.querySelectorAll(".form-check-label").forEach(element => {
            element.style.color = "black";
        });
        document.querySelectorAll('.card, .card-title').forEach(card => {
            card.style.backgroundColor = '#f0efef';
            card.style.color = "black";
        });
    
        document.querySelectorAll('.modal-content').forEach(modal => {
            modal.style.backgroundColor = '';
            modal.style.color = '';
            modal.style.border = '';
    
            modal.querySelectorAll('label').forEach(label => {
                label.style.color = 'black';
            });
    
            modal.querySelectorAll('input').forEach(input => {
                input.style.backgroundColor = '';
                input.style.color = 'black';
                input.style.border = '1px solid #ccc';
                input.style.caretColor = 'black';
            });
    
            modal.querySelectorAll('button').forEach(button => {
                button.style.backgroundColor = '';
                button.style.color = 'black';
                button.style.border = '1px solid #ccc';
            });
    
            modal.querySelectorAll('a').forEach(link => {
                link.style.color = '#007bff';
            });
        });
    }
    

    // lightMode() {
    //     document.documentElement.setAttribute("data-bs-theme", "light");
    //     document.getElementById("newsletterImg").setAttribute("src", "/data/icons/envelope.svg");
    //     document.getElementById("srcIcon").setAttribute("src", "/data/icons/search.svg");
    //     document.getElementById("filterIcon").setAttribute("src", "/data/icons/filter.svg");
    //     document.getElementById("lightDarkToggle").setAttribute("src", "/data/icons/brightness-high-fill.svg");
        
    //     let loginBtn = document.getElementById("loginBtn");
    //     if(loginBtn) loginBtn.setAttribute("class", "btn btn-dark");
        
    //     document.getElementById("dropdownMenuClickableInside").setAttribute("style", "color: black;");
    //     document.getElementById('backBtn').innerHTML = `<img src='/data/icons/arrow-left.svg'>`;
        
    //     document.querySelectorAll(".starsIcon").forEach(element => {
    //         element.setAttribute("src", "/data/icons/star.svg");
    //     });
    //     document.querySelectorAll(".commentsIcon").forEach(element => {
    //         element.setAttribute("src", "/data/icons/chat-right.svg");
    //     });
    //     document.querySelectorAll(".form-check-label").forEach(element => {
    //         element.style.color = "black";
    //     });
    //     document.querySelectorAll('.card, .card-title').forEach(card => {
    //         card.style.backgroundColor = '#f0efef';
    //         card.style.color = "black";
    //     });
        
    //     document.querySelectorAll('.modal-content').forEach(modal => {
    //         modal.style.backgroundColor = '';
    //         modal.style.color = '';
    //         modal.style.border = '';
    //     });
    // }

    // darkMode() {
    //     document.documentElement.setAttribute("data-bs-theme", "dark"); // Dark theme
    //     document.getElementById("newsletterImg").setAttribute("src", "/data/icons/envelopeWhite.svg");
    //     document.getElementById("srcIcon").setAttribute("src", "/data/icons/searchWhite.svg");
    //     document.getElementById("filterIcon").setAttribute("src", "/data/icons/filterWhite.svg");
    //     document.getElementById("lightDarkToggle").setAttribute("src", "/data/icons/moon.svg");
    
    //     let loginBtn = document.getElementById("loginBtn");
    //     if (loginBtn) loginBtn.setAttribute("class", "btn btn-light");
    
    //     document.getElementById("dropdownMenuClickableInside").setAttribute("style", "color: white;");
    //     document.getElementById('backBtn').innerHTML = `<img src='/data/icons/arrow-left-dark.svg'>`;
    
    //     document.querySelectorAll(".starsIcon").forEach(element => {
    //         element.setAttribute("src", "/data/icons/starWhite.svg");
    //     });
    //     document.querySelectorAll(".commentsIcon").forEach(element => {
    //         element.setAttribute("src", "/data/icons/chat-rightWhite.svg");
    //     });
    //     document.querySelectorAll(".form-check-label").forEach(element => {
    //         element.style.color = "white";
    //     });
    //     document.querySelectorAll('.card, .card-title').forEach(card => {
    //         card.style.backgroundColor = '#2e3136';
    //         card.style.color = "white";
    //     });
    
    //     document.querySelectorAll('.modal-content').forEach(modal => {
    //         modal.style.backgroundColor = '#333';
    //         modal.style.color = '#f0f0f0';
    //         modal.style.border = '1px solid #444';
    
    //         modal.querySelectorAll('label').forEach(label => {
    //             label.style.color = '#f0f0f0';
    //         });
    
    //         modal.querySelectorAll('input').forEach(input => {
    //             input.style.backgroundColor = '#222';
    //             input.style.color = '#f0f0f0';
    //             input.style.border = '1px solid #555';
    
    //             input.style.caretColor = '#f0f0f0';
    //         });
    
    //         modal.querySelectorAll('button').forEach(button => {
    //             button.style.backgroundColor = '#444';
    //             button.style.color = '#f0f0f0';
    //             button.style.border = '1px solid #666';
    //         });
    
    //         modal.querySelectorAll('a').forEach(link => {
    //             link.style.color = '#add8e6';
    //         });
    //     });
    // }
}

const themeService = new ThemeService();
export default themeService;