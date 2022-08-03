function activate(){
    const checkbox = document.querySelector('.use-location');
    const inputPlace = document.querySelector('.input').value;
    if(checkbox.checked) {
        local_weather();
    } else {
        search(inputPlace);
    }
}

function search(place){

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '68d65f336cmsh3d5ad9a9068b10fp178838jsn854471979028',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };
    
    fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${place}`,options)
        .then(response => response.json())
        .then(response => show_results(response));
}

function show_results (response) {

    addContent();

    let img = document.querySelector('.icon');
    let temp = document.querySelector('.temp');
    let status = document.querySelector('.status');
    let time = document.querySelector('.time');
    let local = document.querySelector('.local');
    let localTime = response.location.localtime;
    let hourMinutes ='';
    let date='';
    for(i in localTime){
        i<10 ? date += localTime[i] :
        hourMinutes += localTime[i];   
    }

    temp.innerHTML=`${response.current.temp_c}<span class="celsius">ºC</span>`;
    status.innerHTML=response.current.condition.text;
    img.setAttribute('src', response.current.condition.icon);
    local.innerHTML=`${response.location.name}, ${response.location.country}`;
    time.innerHTML = `${date}<br>${hourMinutes}`
}

function addContent(){
    document.querySelector('.wrapper-all').innerHTML=`
        <div class="wrapper-local-time">
            <h1 class="local"></h1>
            <p class="time"></p>
        </div>
        <div class="results">
            <img alt="weather icon" class="icon">
            <div class="wrapper-temp">
                <h1 class="temp"></h1>
                <p class="status"></p>
            </div>
        </div>
`;
}

function local_weather(){

    navigator.geolocation.getCurrentPosition(success,error);
    
    function success(pos){
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        res = `${lat},${lng}`;
        search(res);
    };

    function error(){
        console.log(error);
    };
}

function clear(){
    document.querySelector('.wrapper-all').innerHTML=''
}


document.querySelector('.input').addEventListener('input',()=>{
    checkbox.checked = false;
});

document.querySelector('.use-location').addEventListener('change',()=>{
    document.querySelector('.input').value='';    
})

