export{getDataFromJson}

async function getDataFromJson(jsonPath){
    let response = await fetch(jsonPath);
    let result = await response.json();
    return result;

}

