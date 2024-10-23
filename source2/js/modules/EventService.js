export class EventService {
    isScrollActive;

    scrollEvent = window.addEventListener('scroll', function (){
        if (isScrollActive) {
            if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 0.9) {
                if (!this.firstScrollReached) {
                    // First scroll to the bottom
                    this.firstScrollReached = true;
                } else {
                    // Second scroll to the bottom
                    this.firstScrollReached = false;
                    
                }
            }
        }
    });

    toggleScroll () {
        this.isScrollActive = !this.isScrollActive;
    };
}