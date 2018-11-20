class MovieApp {

  constructor() {
    // dom objects
    this.form      = document.querySelector('form#addMovie-form');
    this.movieList = document.querySelector('.movieList');

    // binding
    this.addMovie        = this.addMovie.bind(this);
    this.deleteMovie     = this.deleteMovie.bind(this);
    this.deleteAllMovies = this.deleteAllMovies.bind(this);
    this.updateStorage   = this.updateStorage.bind(this);
    this.updateDOM       = this.updateDOM.bind(this);

    // loading & events
    this.updateDOM();
    this.form.addEventListener('submit', this.addMovie);
    this.movieList.addEventListener('click', this.deleteMovie);
    this.deleteAllButton = document.querySelector('a.deleteAll');
    this.deleteAllButton.addEventListener('click', this.deleteAllMovies);
  }

  addMovie(e) {
    let movieID = Math.floor(Math.random() * 9999);
    let [movieTitle, movieDirector, moviePoster] = this.form.elements;

    this.updateStorage('insert', {
      movieID      : movieID,
      movieTitle   : movieTitle.value,
      movieDirector: movieDirector.value,
      moviePoster  : moviePoster.value
    });
    this.updateDOM();

    movieTitle.value    = '';
    movieDirector.value = '';
    moviePoster.value   = '';

    e.preventDefault();
  }

  deleteMovie(e) {
    if(e.target.classList.contains('delete-movie')) {
      let movieID = e.target.id;
      movieID = movieID.slice(15);
      this.updateStorage('delete', movieID);
      this.updateDOM();
    }

    e.preventDefault();
  }

  deleteAllMovies(e) {
    this.updateStorage('deleteAll');
    this.updateDOM();
    
    e.preventDefault();
  }

  getLocalStorage(key) {
    let movies = localStorage.getItem(key);
    movies = JSON.parse(movies);
    return movies;
  }

  setLocalStorage(key, value) {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  }

  createDOM(movieID, movieTitle, movieDirector, moviePoster) {
    // create column
    let column = document.createElement('div');
    column.className = 'col-md-3';
    column.style = 'padding-top: 15px; padding-bottom: 15px;';

    // create card
    let card = document.createElement('div');
    card.className = 'card';

    // create card image
    let card_image = document.createElement('img');
    card_image.className = 'card-img-top';
    card_image.src = moviePoster;

    // create card body
    let card_body = document.createElement('div');
    card_body.className = 'card-body';
    card_body.innerHTML = `
      <h5 class="card-title">${movieTitle}</h5>
      <p class="card-text">Director: <span class="badge badge-warning">${movieDirector}</span></p>
      <a href="#${movieID}" id="MovieApp_movie-${movieID}" class="btn btn-danger btn-sm delete-movie">Delete</a>
    `;

    card.appendChild(card_image);
    card.appendChild(card_body);
    column.appendChild(card);

    return column;
  }

  updateStorage(type, data) {
    switch(type) {
      case 'insert':
        let moviesInsert = this.getLocalStorage('MovieApp');
  
        if(moviesInsert) {
          moviesInsert.push(data);
        } else {
          moviesInsert = [data];
        }
  
        this.setLocalStorage('MovieApp', moviesInsert);
        break;
      
      case 'delete':
        let moviesDelete = this.getLocalStorage('MovieApp');
        moviesDelete = moviesDelete.filter(value => {
          return value.movieID != data;
        });

        this.setLocalStorage('MovieApp', moviesDelete);
        break;
      
      case 'deleteAll':
        let moviesDeleteAll = [];

        this.setLocalStorage('MovieApp', moviesDeleteAll);
        break;
    }
  }

  updateDOM() {
    const movies = this.getLocalStorage('MovieApp');
  
    if(movies) {
      let countMovies = movies.length;

      if(countMovies > 0) {
        this.movieList.innerHTML = '';
        movies.forEach(value => {
          let movie = this.createDOM(value.movieID, value.movieTitle, value.movieDirector, value.moviePoster);
          this.movieList.appendChild(movie);
        });
      } else {
        this.movieList.innerHTML = '';
        let emptyContent = document.createElement('div');
        emptyContent.className = 'col-md-12 text-center';
        emptyContent.style = 'padding-top: 15px; padding-bottom: 15px;';
        emptyContent.innerHTML = `
          <div class="card">
            <div class="card-body">There's no movie.</div>
          </div>
        `;
        this.movieList.appendChild(emptyContent);
      }
    } else {
      this.movieList.innerHTML = '';
      let emptyContent = document.createElement('div');
      emptyContent.className = 'col-md-12 text-center';
      emptyContent.style = 'padding-top: 15px; padding-bottom: 15px;';
      emptyContent.innerHTML = `
        <div class="card">
          <div class="card-body">There's no movie.</div>
        </div>
      `;
      this.movieList.appendChild(emptyContent);
    }
  }

}

const app = new MovieApp();