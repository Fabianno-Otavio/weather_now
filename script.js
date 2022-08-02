place.addEventListener('focusout',search);

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
    console.log(place)
    fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${place}`,options)
        .then(response => response.json())
        .then(response => show_results(response))

}

const show_results = (response) => {
    results = document.querySelector('.results');
    img = document.querySelector('.icon');
    results.innerHTML='';
    console.log(response);
    results.innerHTML+=response.current.temp_c;
    results.innerHTML+=response.current.condition.text;
    img.setAttribute('src',response.current.condition.icon)
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