export class ApiCaller {
    async fetchFromDB(url, method, body, token) {
        try {
            let response = null;
            // if(token !== undefined || token !== ""){

            // }
            if (body !== undefined ) {
                
                response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${token}`
                    },
                    
                    body: JSON.stringify(body),
                });
            } else {
                response = await fetch(url, {
                    method: method,
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `bearer ${token}`
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