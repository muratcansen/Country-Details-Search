// xml, json

document.querySelector("#btnSearch").addEventListener("click", () => {
    let text = document.querySelector("#natSearch").value;
    document.querySelector("#details").style.opacity = 0;
    document.querySelector("#loading").style.display= "block";
    getCountry(text);
});
document.querySelector("#btnLocation").addEventListener("click",()=>{
    if(navigator.geolocation){
        document.querySelector("#loading").style.display= "block";
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
});

function onError(err){
    console.log(err)
    document.querySelector("#loading").style.display= "none";
}
async function onSuccess(position){
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;

    //api, google, opencagedata
    const api_key = "3843afa9c17643bc976fc9e45007996b";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

    const response = await fetch(url);
    const data = await response.json();

    const country = data.results[0].components.country;
    console.log(data)

    document.querySelector("#natSearch").value = country;
    document.querySelector("#btnSearch").click();
}

async function getCountry(country) {
    try{
        const response = await fetch("https://restcountries.com/v3.1/name/" + country);
        if(!response.ok)
                throw new Error("Ülke Bulunamadı");

        const data = await response.json();
        renderCountry(data[0])
    
        const countries = data[0].borders;
        if(!countries){
            throw new Error("Komşu ülke bulunamadı");
        }
        const response2 = await fetch("https://restcountries.com/v3.1/alpha?codes=" + countries.toString());
        const neighbors = await response2.json();
    
        renderNeighbors(neighbors);
    }
    catch(err){
        renderError(err);
    }
}
function renderCountry(data) {
    document.querySelector("#loading").style.display= "none";
    document.querySelector("#country-details").innerHTML = "";
    document.querySelector("#neighbors").innerHTML = "";

    let html = `
        <div class="col-4">
            <img src="${
                data.flags.png
            }" alt="" class="img-fluid">
        </div>
        <div class="col-5">
            <h3 class="card-title">${data.name.common}</h3>
            <hr>
            <div class="row">
                <div class="col-4">Cumhuriyet Adı: </div>
                <div class="col-8">${(data.name.official)}</div>
            </div>
            <div class="row">
                <div class="col-4">Nufüs: </div>
                <div class="col-8">${(data.population / 1000000).toFixed(1)}</div>
            </div>
            <div class="row">
                <div class="col-4">Resmi Dil: </div>
                <div class="col-8">${Object.values(data.languages)}</div>
            </div>
            <div class="row">
                <div class="col-4">Başkent: </div>
                <div class="col-8">${data.capital[0]}</div>
            </div>
            <div class="row">
                <div class="col-4">Para Birimi: </div>
                <div class="col-8">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
            </div>
            
        </div>
        <div class="col-3">
            <h3 class="card-title mt-5"></h3>
            <hr>
            <div class="row">
                <div class="col-4">Bölge: </div>
                <div class="col-8">${data.region}</div>
            </div>
            <div class="row">
                <div class="col-4">Alt Bölge: </div>
                <div class="col-8">${(data.subregion)}</div>
            </div>
        </div>
        
        `;

        document.querySelector("#details").style.opacity = 1;
        document.querySelector("#country-details").innerHTML = html;
}
function renderNeighbors(data) {
    let html = "";
    for (let country of data) {
    html += `
            <div class="col-2 mt-2">
                <div class="card text-white" style="border: 1px solid whitesmoke;background-color: rgb(27, 155, 240);">
                    <img src="${country.flags.png}" class="card-img-top">
                    <div class="card-body">
                        <h6 class="card-title">${country.name.common}</h6>
                    </div>
                </div>
            </div>
        `;
}
    document.querySelector("#neighbors").innerHTML = html;
}
function renderError (err){
    document.querySelector("#loading").style.display= "none";
    const html =`
        <div class="alert alert-danger">
            ${err.message}
        </div>
    `;
    setTimeout(() => {
        document.querySelector("#errors").innerHTML = ""
    }, 3000);
    document.querySelector("#errors").innerHTML = html;
}