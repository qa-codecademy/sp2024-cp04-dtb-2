export class ApiCaller {
    async fetchFromDB(url, method, body ) {
      

     // Optional: Logging filter before sending

        try {
            let response = null;
            if (body !== null ) {
                
                response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    
                    body: JSON.stringify(body), // Removed unnecessary wrapping object
                });
            } else {
                response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
            let result = await response.json();
            console.log(result);
            return result;

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

}