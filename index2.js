async function loadPage() {
            
  const films = await fetchData();

  let search = document.getElementById('searchcontent').value; 
  let info = document.getElementById('result');
  let containerpagination = document.getElementById('conatiner-link')

  document.getElementById('film-container').innerHTML = '';

  films.forEach(film => {
      const filmCard = createFilmCard(film); 
      document.getElementById('film-container').insertAdjacentHTML("beforeend", filmCard);
  });
  
  if (search !== '') {
      info.innerHTML = '';
      info.insertAdjacentHTML("beforeend", `${films.length} hasil pencarian untuk "${search}"`);
  } else {
      info.innerHTML = ''; 
  }

  let totalpage = films.total_pages
  for(let i = 1; i <= totalpage; i++){
      if (i <= 5) {
          containerpagination.insertAdjacentHTML("beforeend", <li class="page-item page-link">${i}</li>);
      }
      if (totalpage > 5) {
          containerpagination.insertAdjacentHTML("beforeend", <li class="page-item page-link">...</li>);
          containerpagination.insertAdjacentHTML("beforeend", <li class="page-item page-link">${totalpage}</li>);
          break;
      }
  }

}