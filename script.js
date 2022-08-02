function search(pos){

    let place;
    let inputPlace = document.querySelector('.input').value;
    inputPlace == '' ?  place = pos :
                        place = inputPlace;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '68d65f336cmsh3d5ad9a9068b10fp178838jsn854471979028',
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${place}`,options)
        .then(response => response.json())
        .then(response => show_results(response))

}

const show_results = (response) => {


    let img = document.querySelector('.icon');
    let temp = document.querySelector('.temp');
    let status = document.querySelector('.status');
    let time = document.querySelector('.time');
    let local = document.querySelector('.local');
    
    let localTime = response.location.localtime;
    
    console.log(response);
    console.log(localTime);
    console.log(localTime.length);

   
    let hourMinutes = localTime[11]+localTime[12]+':'+localTime[14]+localTime[15];
    let date = localTime[5]+localTime[6]+'-'+localTime[8]+localTime[9]+'-'+localTime[0]+localTime[1]+localTime[2]+localTime[3];
    console.log(hourMinutes);
    console.log(date);

    temp.innerHTML=`${response.current.temp_c}<span class="celsius">ºC</span>`;
    status.innerHTML=response.current.condition.text;
    img.setAttribute('src', response.current.condition.icon);
    local.innerHTML=`${response.location.name}, ${response.location.country}`;
    time.innerHTML = `${date}<br>${hourMinutes}`
}

const local_weather = () => {

    navigator.geolocation.getCurrentPosition(success,error);
    
    function success(pos){
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        res = `${lat},${lng}`;
      //  console.log(res);
        search(res)
    };

    function error(){
        console.log(error);
    };
}

window.addEventListener('load',local_weather())
place.addEventListener('focusout',search);
