// -------------------------------------------------------------- const -------------------------------------------------------------------
const displayResults = document.getElementById("movie");
const errorDiv = document.getElementById("error");
const searchBtn = document.getElementById("searchBtn");
let apiKey = "";

// ------------------------------------------------------------ functions -----------------------------------------------------------------

// to get ApiKey
const getApi = () => {
  apiKey = prompt("Please enter your API Key");
  console.log(apiKey);
};

// check if movie is in API
const checkMovie = (data) => {
  if (data.Response === "False") {
    errorDiv.innerHTML += `
    <div class="text-left text-danger m-3">
      <p>Sorry, movie not found.</p>
    </div>`;
  } else {
    errorDiv.innerHTML = "";
  }
};

// displayMovie
const displayMovie = (data) => {
  console.log(data);
  let date = data.Year;
  let title = data.Title;
  let picture = data.Poster;
  let id = data.imdbID;
  displayResults.innerHTML += `
    <div class="row my-3 my-rounded d-flex justify-content-between border my-width-medium p-4">
      <div class="col-3 d-flex">  
        <img class="img-fluid" src="${picture}" alt="movie-poster">
      </div>
      <div class="col-9 d-flex flex-column justify-content-center">
        <h2>${title.toUpperCase()}</h2>
        <p><strong>${date}</strong></p>
        <div>
          <input class="btn btn-lg btn-primary my-rounded my-text my-3 my-width-medium" type="submit" value="Read more" id="${id}" onclick="readMore(id)"/>
        </div>
      </div>
    </div>
  `;

  let observer = new IntersectionObserver(
    function (observables) {
      observables.forEach(function (observable) {
        if (observable.intersectionRatio > 0.5) {
          observable.target.classList.remove("not-visible");
          observer.unobserve(observable.target);
        }
      });
    },
    {
      threshold: [0.5],
    }
  );

  let items = document.querySelectorAll(".row");
  items.forEach(function (item) {
    item.classList.add("not-visible");
    observer.observe(item);
  });
};

// to open readMore
const readMore = (data) => {
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${data}`)
    .then((response) => response.json())
    .then((response) => {
      let displayContent = document.getElementById("popup-content");
      let displaypopup = document.getElementById("popup");
      displayContent.innerHTML = `
        <div class="row">
          <div class="col-3 d-flex justify-content-center align-items-center">  
            <img src="${response.Poster}" alt="image-movie" class="img-fluid">
          </div>
          <div class="col-9 d-flex flex-column justify-content-center">
            <h2>${response.Title.toUpperCase()}</h2>
            <p><strong>${response.Released}</p></strong>
            <p>${response.Plot}</p>
          </div>
        </div>
      `;
      displaypopup.style.display = "block";
      document
        .getElementById("closePopup")
        .addEventListener("click", closePopup);
    });
};

// to close readMore
const closePopup = () => {
  document.getElementById("popup").style.display = "none";
};

// fetching
const fetching = () => {
  let searchInput = document.getElementById("searchInput").value;
  fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchInput}`)
    .then((response) => response.json())
    .then((response) => {
      checkMovie(response);
      return response;
    })
    .then((response) => {
      displayResults.innerHTML = "";
      response.Search.forEach((element) => {
        displayMovie(element);
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

// -------------------------------------------------------------- listenner ---------------------------------------------------------------
searchBtn.addEventListener("click", fetching);
