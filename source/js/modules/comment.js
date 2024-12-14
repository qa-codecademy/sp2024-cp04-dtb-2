export class Comment{
    constructor(text, name){
        name.length < 2 ? this.username = "Anonymous" 
                        : this.username = name;
        this.text = text;
        this.date = new Date();
    }
}