let page = 1

const insert = document.querySelector('.film-cont')
const prev = document.getElementById("prev")
const next = document.getElementById("next")
const move = document.getElementById("move")
const search = document.getElementById("search")
const gmenu = document.getElementById("genresmenu")
const language = document.getElementById("Language")

const genreurl = 'https://api.themoviedb.org/3/genre/movie/list?api_key=dd0b318e97369a434228f9f3295faa40'

const languages = 'https://api.themoviedb.org/3/configuration/languages'

const auth = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDBiMzE4ZTk3MzY5YTQzNDIyOGY5ZjMyOTVmYWE0MCIsIm5iZiI6MTcyNTUwNjc4MS4zMDM1NzEsInN1YiI6IjY2ZDZlZjEyYWFjYzg4MTYxZmYwMWYzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X_lAbN0nXK_rbM38HnmIJYhvAHIPBo3WyV_RBjzyoOw'

const genres = new Request(genreurl,{
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZDBiMzE4ZTk3MzY5YTQzNDIyOGY5ZjMyOTVmYWE0MCIsIm5iZiI6MTcyNTUwNjc4MS4zMDM1NzEsInN1YiI6IjY2ZDZlZjEyYWFjYzg4MTYxZmYwMWYzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.X_lAbN0nXK_rbM38HnmIJYhvAHIPBo3WyV_RBjzyoOw'
  }
})

const langu = new Request(languages ,{
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${auth}`
  }
});

function onload(pages){
  if(pages <= 1){
    prev.style.display = 'none'
  }
  else{
    prev.style.display = 'block'
  }
}
function pagination(paginasi = page){
  return `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=${paginasi}`
}

//link paginasi
function loader(to_link = pagination()){
  insert.innerHTML = `
          <div class="container mb-5 w-100 d-flex justify-content-center">
              <div class="spinner-border" style="width: 30rem; height: 30rem;margin-bottom: 100px;" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>
          </div>`
          move.style.display = 'none'
    setTimeout(() => {
      insert.innerHTML = ''
      data(to_link)
      move.style.display = 'block'
    }, 10);
}

//  fetch data
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
    // response)
    const data = await response.json()
    // data)
    const movie = data.results
    // movie)

    for await (const film of movie) {
        const releasedate = new Date(film.release_date).toLocaleString('id-ID',{day: 'numeric', month:'long', year:'numeric'})
        const data = 
        `
<div class="card mb-3 p-0 mx-3" style="max-width: 250px;">
  <div class="row g-0">
      <div class="col-md-12">
        <img src="https://image.tmdb.org/t/p/original${film.poster_path}" class="img-fluid rounded-start" alt="..." style="min-height: 373px">
      </div>
      <div class="col-md-12 d-flex justify-content-between">
          <div class="card-body">
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

// fetch bahasa
async function lang(){
  const response = await fetch(langu)
  const data = await response.json()
  // data)
    for await (const bahasa of data) {
      const genrelist = `
        <option value= "${bahasa.iso_639_1}" id="idGenre" style="width: 10px">${bahasa.english_name}</option>   
      `
      language.insertAdjacentHTML('beforeend',genrelist)
    }
}
lang()


// fetch genre
async function genre(){
  const response = await fetch(genres)
  const data = await response.json()

    for await (const genre of data.genres) {
      const genrelist = `
        <option value= "${genre.id}" id="idGenre" style="width: 10px">${genre.name}</option>   
      `
      gmenu.insertAdjacentHTML('beforeend',genrelist)
    }
}
genre()

// function next() {
//   page++
//   loader()
// }

// prev button
prev.addEventListener('click',function(){
  page--
  loader()
})
next.addEventListener('click',function(){
  page++
  insert.innerHTML = `
        <div class="container mb-5 w-100 d-flex justify-content-center">
            <div class="spinner-border" style="width: 30rem; height: 30rem;margin-bottom: 100px;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`
        move.style.display = 'none'
    loader()
})

// search button
search.addEventListener('click',function(){
  const cari = document.getElementById("inputSearch").value
  if(!cari){
    insert.innerHTML=''
    data()
  }else{
    // "masuk woi")
    const url = `search/movie?api_key=dd0b318e97369a434228f9f3295faa40&query=${cari}`
    loader(url)
  }
})


function Genre(){
  const sortingGenre = document.getElementById("genresmenu").value
  if(sortingGenre === ""){
    
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_genres=${sortingGenre}`
    // url)
    loader(url)
  }
}

function popular(){
  const popular = document.getElementById("popularity").value;
  
  // popular.value)
  if(popular === ""){
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&sort_by=${popular}`
    // url)
    loader(url)
  }
}
function rilis(){
  const release = document.getElementById("release").value;
  
  // release)
  if(release === ""){
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&sort_by=${release}`
    // url)
    loader(url)
  }
}
function average(){
  const vavg = document.getElementById("vavg").value;
  
  // vavg)
  if(vavg === ""){
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&sort_by=${vavg}`
    // url)
    loader(url)
  }
}
function votecount(){
  const vcount = document.getElementById("vcount").value;
  
  // vcount)
  if(vcount === ""){
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&sort_by=${vcount}`
    // url)
    loader(url)
  }
}
function year(){
  const vcount = document.getElementById("vcount").value;
  
  // vcount)
  if(vcount === ""){
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&sort_by=${vcount}`
    // url)
    loader(url)
  }
}
function votecount(){
  const year = document.getElementById("year").value;
  
  // year)
  if(year === ""){
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&sort_by=${year}`
    // url)
    loader(url)
  }
}
function Languages(){
  const filterlang = document.getElementById("Language").value;
  
  // filterlang)
  if(language.value === ""){
    data()
  }
  else{
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_original_language=${filterlang}`
    // url)
    loader(url)
  }
}

data()
// data())