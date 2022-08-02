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

    console.log(response);

    temp.innerHTML=`${response.current.temp_c}<span class="celsius">ºC</span>`;
    status.innerHTML=response.current.condition.text;
    img.setAttribute('src', response.current.condition.icon);
    local.innerHTML=`${response.location.name}, ${response.location.country}`;
    time.innerHTML=response.location.localtime;
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
