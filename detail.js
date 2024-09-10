const insert = document.querySelector('.film-cont')
// console.log(insert)
const detaildata = document.getElementById("load");
const ids = new URLSearchParams(window.location.search).get("id");
// console.log(detaildata)
let page = 1
if(ids){
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
    //  console.log(data)
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

const wgenre = [];

async function pagination(paginasi = page) {
  // Tunggu hasil dari genreFilter()
  const container = await genreFilter();

  // Simpan hasil genre ke dalam array wgenre
  wgenre.push(...container);  // Menambahkan elemen dari container ke wgenre

  // Konversi genre menjadi string ID genre
  const genreIds = container.map(genre => genre.id).join(',');

  // Buat URL dengan genre IDs dan page
  const url = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_genres=${genreIds}&page=${paginasi}`;
  console.log(url);
  return url;  // Kembalikan URL untuk digunakan di fungsi data
}

async function genreFilter() {
  const url = `https://api.themoviedb.org/3/movie/${ids}?api_key=dd0b318e97369a434228f9f3295faa40`;
  
  const genre = new Request(url, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${auth}`
    }
  });

  // Fetch data dan parse ke JSON
  const response = await fetch(genre);
  const data = await response.json();
  
  return data.genres; // Mengembalikan genres dari data
}

// Fungsi untuk memanggil data dari API berdasarkan link yang dibuat oleh pagination
async function data(link = null) {
    // Jika link tidak diberikan, jalankan pagination() untuk mendapatkan URL
    const paginasi = link ? link : await pagination();
    const BASEURL = `https://api.themoviedb.org/3/${paginasi}`;

    const film = new Request(BASEURL, {
       method: 'GET',
       headers: {
         accept: 'application/json',
         Authorization: `Bearer ${auth}`
       }
    });

    // Fetch data dan parse ke JSON
    const response = await fetch(film);
    const data = await response.json();
    const movie = data.results;

    const totalPages = data.total_pages
    console.log(totalPages)
    const visiblePages = 10

    // console.log(Math.min(totalPages, visiblePages))
    
    function updatePagination() {
      const numpages = document.getElementById("numberpages");
      numpages.innerHTML = '';
    
      let startPage, endPage;
      
      if (totalPages <= visiblePages) {
        startPage = 1;
        endPage = totalPages;
      } else {
        if (page <= Math.floor(visiblePages / 2)) {
          startPage = 1;
          endPage = visiblePages;
        }
        else if (page + Math.floor(visiblePages / 2) >= totalPages) {
          startPage = totalPages - visiblePages + 1;
          endPage = totalPages;
        }
        else {
          startPage = page - Math.floor(visiblePages / 2);
          endPage = page + Math.floor(visiblePages / 2);
          console.log(startPage,endPage,"masuk sini")
        }
      }
    
      // Add pages to the pagination
      for (let i = startPage; i <= endPage; i++) {
        numpages.innerHTML += `<span class="page-item"><button class="page-link" style="background:black;" onclick="page=${i}; loader();">${i}</button></span>`;
      }
    
      // const pagesMin = (page-100 <= 1) ? page =1 : page-=100
      // const pagesPlus = (page+100 >= 500) ? page = 500 : page+=100
      // Add dots if there are more pages before or after the displayed range
      if (startPage > 1) {
        numpages.innerHTML = `<span class="page-item"><button class="page-link" style="background:black;" onclick="page=${1}; loader();" >1</button></span>` + 
                             `<span class="page-item"><button class="page-link" style="background:black;" onclick="page=${1}; loader();">...</button></span>` + 
                             numpages.innerHTML;
      }
    
      if (endPage < totalPages) {
        numpages.innerHTML += `<span class="page-item"><button class="page-link" style="background:black;" onclick="page=${1}; loader();" >...</button></span>` + 
                              `<span class="page-item"><button class="page-link" style="background:black;" onclick="page=${totalPages}; loader();">${totalPages}</button></span>`;
      }
    
      // Set active class
      const pageItems = numpages.getElementsByClassName('page-item');
      for (let i = 0; i < pageItems.length; i++) {
        const pageNumber = parseInt(pageItems[i].innerText, 10);
        if (pageNumber === page) {
          pageItems[i].classList.add('active');
        } else {
          pageItems[i].classList.remove('active');
        }
      }
    }
    
    updatePagination();

    if (data.total_results !== 0) {
        for await (const film of movie) {
            const releasedate = new Date(film.release_date).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            const data = `
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
            `;
            insert.insertAdjacentHTML('beforeend', data);
        }
    } else {
        insert.innerHTML = `<div class="container mb-5 w-100 d-flex justify-content-center"><h1 class="text-center">Movie Not Found</h1></div>`;
    }
}


function loader(to_link) {
  //console.log(to_link)
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
  }, 1000);
}

prev.addEventListener('click',function(){
    page--
    
    insert.innerHTML=''
    pagination(page)
    data()
})
next.addEventListener('click',function(){
    page++
    insert.innerHTML=''
    pagination(page)
    data()
  })

function idDetail(id){
    window.location = `detail.html?id=${id}`
}

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
    loader(url);
  }
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
      params.delete('id')

      // Update URL di address bar tanpa reload halaman
      window.history.pushState({}, '', `${link.pathname}?${params.toString()}`);
      
      console.log(window.location.href); // Memastikan URL telah berubah
      window.location.href = `index.html?${params.toString()}`;
      // Jalankan fungsi loader
    }
  }
}

detail()
data()   
}
else{
    detaildata.innerHTML = `<div class="container mb-5 w-100 d-flex justify-content-center"><h1 class="text-center">Movie Not Found</h1></div>`
    document.getElementById('container').innerHTML=''
}

