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
    let minmax = document.querySelector('.minmax');

    let localTime = response.location.localtime;

    let hourString;
    let hourMinutes;    
    
    if(localTime[12]==":"){
        hourString = '0'+localTime[11];
        hourMinutes = hourString+localTime[12]+localTime[13]+localTime[14];
    } else {
        hourString = localTime[11]+localTime[12];
        hourMinutes = hourString+localTime[13]+localTime[14]+localTime[15];
    }

    let hour = parseInt(`${hourString}`);
    let dayInfo = response.forecast.forecastday[0].day;
    let hourInfo = response.forecast.forecastday[0].hour[0];

    let date=checkDate(hour,response);

    temp.innerHTML=`${hourInfo.temp_c}<span class="celsius">ºC</span>`;
    status.innerHTML=dayInfo.condition.text;
    img.setAttribute('src', dayInfo.condition.icon);
    local.innerHTML=`${response.location.name}, ${response.location.country}`;
    time.innerHTML = `${date}<br>${hourMinutes}`;
    minmax.innerHTML=`${dayInfo.maxtemp_c}ºC/${dayInfo.mintemp_c}ºC`;

    let t;
    window.innerWidth<=414 ? t=1 :  t = 2;

    function checkDate(i,response){

        let daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

        let localTime = response.location.localtime;

        let dateDay = Number(localTime[8]+localTime[9]);
        let dateMonth = Number(localTime[5]+localTime[6]);
        let dateYear = Number(localTime[0]+localTime[1]+localTime[2]+localTime[3]);

        if(dateYear%4==0){
            daysInMonth[1]=29;
        };
    
        if (i>=24){
            if(dateDay==daysInMonth[dateMonth-1]){
                if(dateMonth == 12){
                    dateYear++;
                    dateMonth = 1;
                    dateDay = 1;
                } else {
                    dateMonth++;
                }
            } else {
                dateDay++;
            }
        };

        if(i<0){
            if(dateDay-1==0){
                if(dateMonth-1==0){
                    dateYear--;
                    dateMonth=12;
                    dateDay=daysInMonth[11];
                } else {
                    dateMonth--;
                    dateDay=daysInMonth[dateMonth-2];
                } 
            }else{
                dateDay--;
            }
        }

        dateYear.toString();
        dateMonth.toString();
        dateDay.toString();

        if(dateMonth<10){
            dateMonth='0'+dateMonth;
        }

        if(dateDay<10){
            dateDay='0'+dateDay;
        }

        return `${dateYear}-${dateMonth}-${dateDay}`;
    }

    for(i=hour-t;i<=hour+t;i++){

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '68d65f336cmsh3d5ad9a9068b10fp178838jsn854471979028',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }
        };

        let hourRel;

        if (i >= 24){
            hourRel = i-24;
        } else if(i<0){
            hourRel = i+24;
        } else {
            hourRel=i;
        }

        date = checkDate(i, response);
        
        console.log(date)
        
        await fetch(`https://weatherapi-com.p.rapidapi.com/history.json?q=${place}&dt=${date}&hour=${hourRel}`, options)
        .then(response => response.json())
        .then(response => addInfoHours(response, hourRel, hour));
    
    };   
}

function addInfoHours(response, i, hour){
    let today = document.querySelector('.today');
    let hourInfo = response.forecast.forecastday[0].hour[0];
    let hourString = `${i}:00`
    if(i==hour){
        hourString='Now';
    }

    today.innerHTML += `<div class="wrapper-hour">
                            <h1 class="hours">${hourString}</h1>
                            <img class="iconHour" src="${hourInfo.condition.icon}">
                            <div class="wrapper-text">
                                <p class="tempHour">${hourInfo.temp_c}<span> ºC </span></p>
                                <p class="statusHour">${hourInfo.condition.text}</p>
                            </div>
                        </div>`;
    
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
            <p class="maxmintxt">Max&nbsp&nbsp&nbspMin</p>
            <p class="minmax"></p>
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
    document.querySelector('.wrapper-all').innerHTML='';
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

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '68d65f336cmsh3d5ad9a9068b10fp178838jsn854471979028',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
};
