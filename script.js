function activate(){
    const checkbox = document.querySelector('.use-location');
    const inputPlace = document.querySelector('.input');

    if(inputPlace.value == '' && !checkbox.checked){
        clear();
        inputPlace.setAttribute('placeholder','Type a location here');
    } else if(checkbox.checked) {
        local_weather();
    } else {
        search(inputPlace.value);
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
    
    let err = document.createElement('div','');
    err.setAttribute('class','error');

    fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${place}`,options)
        .then(response => response.json())
        .then(response => getInfo(response,place))
        .catch(()=>{
            clear();
            document.querySelector('.wrapper-all').appendChild(err);
            err.innerHTML="INVALID LOCATION!<br> Please, be sure your input is in english<br> and it's a valid location.";
        });
}

function getInfo(response,place){

    let info = getDateHour(response);



    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '68d65f336cmsh3d5ad9a9068b10fp178838jsn854471979028',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    fetch(`https://weatherapi-com.p.rapidapi.com/history.json?q=${place}&dt=${info[0]}&hour=${info[1]}`, options)
        .then(response => response.json())
        .then(response => show_results(response,place));

}

function getDateHour(response){

    let date = '';
    let hour = '';
    
    
    for (i in response.location.localtime){
        if(i<10){
            date += response.location.localtime[i];
        } else if (i<13) {
            if (hour == 'now'){
                hour += response.location.localtime[i] 
            } else {
                hour = 1;
            }
        }  
    }
    
    return[date,hour];

}

async function show_results (response,place) {

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

    let dayInfo = response.forecast.forecastday[0].day;
    let hourInfo = response.forecast.forecastday[0].hour[0];

    temp.innerHTML=`${hourInfo.temp_c}<span class="celsius">ºC</span>`;
    status.innerHTML=dayInfo.condition.text;
    img.setAttribute('src', dayInfo.condition.icon);
    local.innerHTML=`${response.location.name}, ${response.location.country}`;
    time.innerHTML = `${date}<br>${hourMinutes}`


    for(i=0;i<5;i++){
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '68d65f336cmsh3d5ad9a9068b10fp178838jsn854471979028',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        await fetch(`https://weatherapi-com.p.rapidapi.com/history.json?q=${place}&dt=2022-08-03&hour=${[i]}`, options)
        .then(response => response.json())
        .then(response => addInfoHours(response, i))
}
        
}

function addInfoHours(response, i){

    let today = document.querySelector('.today');
    let hourInfo = response.forecast.forecastday[0].hour[0];
    let dayInfo = response.forecast.forecastday[0].day;

    today.innerHTML += `<div class="wrapper-hour">
                            <img class="iconHour -${i}" src="${hourInfo.condition.icon}">
                            <div class="wrapper-text">
                                <p class="tempHour -${i}">${hourInfo.temp_c}<span> ºC </span></p>
                                <p class="statusHour -${i}">${hourInfo.condition.text}</p>
                            </div>
                        </div>`

    
    //let statusHour = document.querySelector(`.statusHour .-${i}`);
    //let iconHour = document.querySelector(`.iconHour .-${i}`);
    //let tempHour = document.querySelector(`.tempHour .-${i}`);

    
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
                <p class="min"></p>
                <p class="max"></p>
            </div>
            <div class="today"></div>
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


let content = document.querySelector('.wrapper-content');
let divWrapper = document.createElement('div','');
divWrapper.classList.add("wrapper-all")
window.addEventListener('load',()=>{
    content.appendChild(divWrapper);
});