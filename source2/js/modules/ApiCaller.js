export class ApiCaller {
    async fetchFromDB(url, method, body ) {
        try {
            let response = null;
            if (body !== undefined ) {
                
                response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    
                    body: JSON.stringify(body),
                });
            } else {
                response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }
            if (response !== null) {
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")){
                    let result = await response.json();
                    console.log(result);
                    return result;
                } else {
                    console.log(response);
                    return response;
                }
                
            }

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    }

}