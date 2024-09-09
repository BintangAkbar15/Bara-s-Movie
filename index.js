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
function loader(to_link = pagination(), search = ''){
  const searchparam = new URLSearchParams (window.location.search).get("search");
  const genreparam = new URLSearchParams (window.location.search).get("genre");
  
  if(searchparam !== ''){
    to_link = `search/movie?api_key=dd0b318e97369a434228f9f3295faa40&query=${searchparam}&page=${page}`
  }
  
  else if(genreparam !== ''){
    to_link = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_genres=${genreparam}&page=${page}`
  }
    insert.innerHTML = `
          <div class="container mb-5 w-100 d-flex justify-content-center">
              <div class="spinner-border" style="width: 30rem; height: 30rem;margin-bottom: 100px;" role="status">
                  <span class="visually-hidden">Loading...</span>
              </div>
          </div>`
          move.style.display = 'none'
    setTimeout(() => {
      insert.innerHTML = ''
      
      data(to_link, search)
      move.style.display = 'block'
    }, 10);
}

//  fetch data
async function data(link = pagination(), search = ''){
   const BASEURL = `https://api.themoviedb.org/3/${link}`
  console.log(BASEURL)
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

    const info = document.querySelector(".info")
    if(search !== ''){
      info.innerHTML=''; 
      info.insertAdjacentHTML("beforeend",`<div class="container mb-5 w-100 d-flex justify-content-center"><h4 class="text-center"> (${data.total_results})Hasil Pencarian untuk ${search}</h4></div>`)
    }

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
else{
  insert.innerHTML = `<div class="container mb-5 w-100 d-flex justify-content-center"><h1 class="text-center">Movie Not Found</h1></div>`
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

// prev button
prev.addEventListener('click',function(){
  page--
  loader()
})
next.addEventListener('click',function(){
  page++
  loader()
})

// search button
search.addEventListener('click', function() {
  const cari = document.getElementById("inputSearch").value;
  if (!cari) {
    insert.innerHTML = '';
    data();
  } else {
    // "masuk woi"
    const url = `search/movie?api_key=dd0b318e97369a434228f9f3295faa40&query=${cari}`;
    
    // Membuat link dan mengatur parameter pencarian
    let link = new URL(window.location.href);
    let params = new URLSearchParams(link.searchParams);
    params.set('search', cari);

    // Update URL di address bar tanpa reload halaman
    window.history.pushState({}, '', `${link.pathname}?${params.toString()}`);
    
    console.log(window.location.href); // Memastikan URL telah berubah

    // Jalankan fungsi loader
    loader(url, cari);
  }
});


function Genre() {
  const sortingGenre = document.getElementById("genresmenu").value;
  let link = new URL(window.location.href);
  let params = new URLSearchParams(link.searchParams);

  if (sortingGenre === "") {
    params.delete('genre');
    window.history.pushState({}, '', `${link.pathname}?${params.toString()}`);
    
    data();
  } else {
    params.set('genre', sortingGenre);
    
    window.history.pushState({}, '', `${link.pathname}?${params.toString()}`);
    
    const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_genres=${sortingGenre}`;
    console.log(window.location.href);
    loader(url);
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

let sortby = []; // Global array untuk menyimpan urutan sorting

// Fungsi untuk meng-update urutan sorting
function updateSortOrder(key, value) {
  // Hapus item lama dari array jika sudah ada
  sortby = sortby.filter(item => item.key !== key);
  
  // Jika ada nilai, tambahkan ke urutan sortby
  if (value) {
    sortby.push({ key, value });
  }

  // Susun kembali array sortby berdasarkan urutan perubahan
  console.log("Sort order updated:", sortby);
}

// Fungsi sorting
function sorting() {
  // Ambil nilai dari elemen input
  const vco = document.getElementById("vcount").value;
  const vav = document.getElementById("vavg").value;
  const rel = document.getElementById("release").value;
  const pop = document.getElementById("popularity").value;

  // Gabungkan array sortby menjadi string berdasarkan nilai
  const sortbyStr = sortby.map(item => item.value).join(',');

  // Buat URL dengan sortby yang diurutkan berdasarkan perubahan
  const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&sort_by=${sortbyStr}`;
  
  console.log("Generated URL:", url);
  loader(url);
}

// Tambahkan event listener untuk setiap input agar terdeteksi saat ada perubahan
document.getElementById("vcount").addEventListener("change", function() {
  updateSortOrder('vco', this.value);
  sorting();
});

document.getElementById("vavg").addEventListener("change", function() {
  updateSortOrder('vav', this.value);
  sorting();
});

document.getElementById("release").addEventListener("change", function() {
  updateSortOrder('rel', this.value);
  sorting();
});

document.getElementById("popularity").addEventListener("change", function() {
  updateSortOrder('pop', this.value);
  sorting();
});

function searching(){
  if(event.key === "Enter") {
    const cari = document.getElementById("inputSearch").value
    if (!cari) {
      insert.innerHTML = '';
      data();
    } else {
      // "masuk woi"
      const url = `search/movie?api_key=dd0b318e97369a434228f9f3295faa40&query=${cari}`;
      
      // Membuat link dan mengatur parameter pencarian
      let link = new URL(window.location.href);
      let params = new URLSearchParams(link.searchParams);
      params.set('search', cari);

      // Update URL di address bar tanpa reload halaman
      window.history.pushState({}, '', `${link.pathname}?${params.toString()}`);
      
      console.log(window.location.href); // Memastikan URL telah berubah

      // Jalankan fungsi loader
      loader(url);
    }
  }
}

function idDetail(id){
  window.location = `detail.html?id=${id}`
}

data()
// data())