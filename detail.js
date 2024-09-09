const insert = document.querySelector('.film-cont')
console.log(insert)
const detaildata = document.getElementById("load");
const ids = new URLSearchParams(window.location.search).get("id");
// console.log(detaildata)
let page = 1

const auth = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDBiMzE4ZTk3MzY5YTQzNDIyOGY5ZjMyOTVmYWE0MCIsIm5iZiI6MTcyNTUwNjc4MS4zMDM1NzEsInN1YiI6IjY2ZDZlZjEyYWFjYzg4MTYxZmYwMWYzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X_lAbN0nXK_rbM38HnmIJYhvAHIPBo3WyV_RBjzyoOw'

async function detail(id=ids){
    const BASEURL = `https://api.themoviedb.org/3/movie/${id}?api_key=dd0b318e97369a434228f9f3295faa40`
   // BASEURL)
     const film = new Request(BASEURL,{
       method: 'GET',
       headers: {
         accept: 'application/json',
         Authorization: `Bearer ${auth}`
       }
     })
 
     const response = await fetch(film)
     // console.log(response)
     const data = await response.json()
     // movie)
     console.log(data)
 if(data.total_results !== 0){
       const releasedate = new Date(data.release_date).toLocaleString('id-ID',{day: 'numeric', month:'long', year:'numeric'})
       let genres = []
       data.genres.forEach(genre => {
            genres.push(genre.name)
       });
       const film = 
       `
    <img class="img-fluid" id="backdrop" src="https://image.tmdb.org/t/p/original/${data.backdrop_path}" alt="">
        <div class="container-fluid details-content mt-5 p-5" id="detail" style="height: max-content">
          <div class="row d-md-flex d-grid justify-content-center justify-content-lg-between">
            <div class="col-12 col-md-5 col-lg-4">
              <img class="img-fluid" src="https://image.tmdb.org/t/p/original/${data.poster_path}" onerror="this.src='asset/notFoundimg.png'" alt="">
            </div>
            <div class="col-12 col-md-7 col-lg-8 pe-5" id="details">
              <h1>${data.title}</h1>
              <h3>${data.original_title}</h2>
              <p>${data.production_companies[0].name}</p>
              <p>${data.overview}</p>
              <div class="row mt-5">
                <p>Release Date : ${releasedate}</p>
                <p>Popularity : ${(data.popularity).toFixed(2)}</p>
                <p>Rating : ${(data.vote_average).toFixed(2)}</p>
                <p>Voters : ${data.vote_count}</p>
                <p>Genre : ${genres}</p>
              </div>
            </div>
          </div>
        </div>
       `
       detaildata.insertAdjacentHTML('beforeend',film)
   
 }
 else{
   detaildata.innerHTML = `<div class="container mb-5 w-100 d-flex justify-content-center"><h1 class="text-center">Movie Not Found</h1></div>`
 }
} 


function pagination(paginasi = page){
    return `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=${paginasi}`
}

async function data(link = pagination()){
    const BASEURL = `https://api.themoviedb.org/3/${link}`
   // BASEURL)
     const film = new Request(BASEURL,{
       method: 'GET',
       headers: {
         accept: 'application/json',
         Authorization: `Bearer ${auth}`
       }
     })
 
     const response = await fetch(film)
     // console.log(response)
     const data = await response.json()
     // console.log(data.total_results)
     const movie = data.results
     // movie)
 
    if(data.total_results !== 0){
    for await (const film of movie) {
        const releasedate = new Date(film.release_date).toLocaleString('id-ID',{day: 'numeric', month:'long', year:'numeric'})
        const data = 
        `
    <div class="card mb-3 p-0 mx-3" style="max-width: 250px;" onclick="idDetail(${film.id})">
    <div class="row g-0">
        <div class="col-md-12">
        <img src="https://image.tmdb.org/t/p/original${film.poster_path}" class="img-fluid rounded-start" alt="" onerror="this.src='asset/notFoundimg.png'" style="min-height: 373px">
        </div>
        <div class="col-md-12 d-flex justify-content-between">
            <div class="card-body bg-dark text-light">
            <div class="row">
                <div class="col12" style="height:50px"><h6 class="card-title">${film.title}</h6></div>
                <div class="col12"><p class="card-text overview">${film.overview}</p></div>
                <div class="col12"><p class="card-text mb-1">Release : ${releasedate}</p></div>
                <div class="col12"><p class="card-text mb-1"><i class="fa-regular fa-eye"></i>&nbsp;${Math.ceil(film.popularity)}</p></div>
                <div class="col12"><p class="card-text mb-1 align-self-end"><i class="fa-solid fa-star"></i> &nbsp; ${(film.vote_average).toFixed(2)}</p></div>
            </div>
            </div>
        </div>
    </div>
    </div>
        `
        insert.insertAdjacentHTML('beforeend',data)
    }
    }
    else{
    insert.innerHTML = `<div class="container mb-5 w-100 d-flex justify-content-center"><h1 class="text-center">Movie Not Found</h1></div>`
    }
}

function idDetail(id){
    window.location = `detail.html?id=${id}`
}

detail()
data()