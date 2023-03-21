const API_KEY = '775becf1bf630a2760f2f6a2628932c0';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

searchButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Evita la acción por defecto de enviar el formulario
    const query = searchInput.value;
    if (query) {
        const searchResults = await searchMovies(query);
        const movieGenres = await getMovieGenres(); // Obtén los géneros de las películas
        displayResults(searchResults, movieGenres); // Pasa los géneros a la función displayResults
    }
});

// Además de ejecutar la función con el botón buscar, se agrega la misma función a la tecla ENTER una vez haya un texto escrito
searchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        const query = searchInput.value;
        if (query) {
            const searchResults = await searchMovies(query);
            const movieGenres = await getMovieGenres();
            displayResults(searchResults, movieGenres);
        }
    }
});

async function searchMovies(query) {
    const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
    console.log(API_URL)
    try {
        const response = await axios.get(API_URL);
        console.log(response)
        return response.data.results;

    } catch (error) {
        console.error('No se ha encontrado la película', error);
        return [];
    }

}

// EXTRA Muestra el género
async function getMovieGenres() {
    const API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
    try {
        const response = await axios.get(API_URL);
        return response.data.genres;
    } catch (error) {
        console.error('No se pueden obtener los géneros', error);
        return [];
    }
}


// A la función principal añadimos los géneros
function displayResults(movies, movieGenres) {
    resultsDiv.innerHTML = '';

    const cardDeck = document.createElement('div');
    cardDeck.classList.add('card-deck', 'd-flex', 'flex-wrap', 'justify-content-center');
    resultsDiv.appendChild(cardDeck);

    const genreMap = new Map(movieGenres.map(genre => [genre.id, genre.name])); // Crea un mapa de géneros

    for (const movie of movies) {
        if (!movie.poster_path) {
            continue;
        }

        const movieCard = document.createElement('div');
        movieCard.classList.add('card', 'm-1');
        movieCard.style.maxWidth = "540px";

        const row = document.createElement('div');
        row.classList.add('row', 'g-0');
        movieCard.appendChild(row);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('col-md-4');
        row.appendChild(imageContainer);

        const movieImage = document.createElement('img');
        movieImage.src = `${IMAGE_URL}${movie.poster_path}`;
        movieImage.classList.add('img-fluid', 'rounded-start');
        movieImage.style.margin = "10px";
        imageContainer.appendChild(movieImage);

        const cardBodyContainer = document.createElement('div');
        cardBodyContainer.classList.add('col-md-8');
        row.appendChild(cardBodyContainer);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBodyContainer.appendChild(cardBody);

        const movieTitle = document.createElement('h5');
        movieTitle.textContent = movie.title;
        movieTitle.classList.add('card-title');
        movieTitle.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
        movieTitle.style.padding = "10px";
        cardBody.appendChild(movieTitle);

        const movieGenre = document.createElement('p');
        movieGenre.textContent = movie.genre_ids.map(id => genreMap.get(id)).join(', '); // Muestra todos los géneros de la película
        movieGenre.classList.add('card-text', 'text-muted');
        cardBody.appendChild(movieGenre);

        const movieDescription = document.createElement('p');
        movieDescription.textContent = movie.overview;
        movieDescription.classList.add('card-text');
        cardBody.appendChild(movieDescription);

        cardDeck.appendChild(movieCard);
    }
}


