place.addEventListener('focusout',()=>{

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '68d65f336cmsh3d5ad9a9068b10fp178838jsn854471979028',
                'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
            }

        };

        let place = document.querySelector('.input').value;

        fetch(`https://weatherapi-com.p.rapidapi.com/current.json?q=${place}`,options)
            .then(response => response.json())
            .then(response => show_results(response.current.temp_c))
            .catch(err=>console.log(err));

})

const show_results = (response) => {
    results = document.querySelector('.results');
    results.innerHTML=response;

}