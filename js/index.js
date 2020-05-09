// function to fetch data from the movie api through axios which also format our search strings.

const fetchData = async (searchTerm) => {
	const response = await axios.get('https://omdbapi.com/', {
		params: {
			apikey: '7efb4270',
			s: searchTerm
		}
	});

	// if the response has an error, return an empty array.

	if (response.data.Error) {
		return [];
	}
	// if no error, return the Search response.
	return response.data.Search;
};

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector('input');
const results = document.querySelector('.results');
const dropdown = document.querySelector('.dropdown');

// callback for event listener whichuses a setTimeout and clearTimeout to make sure that the requests aren't made at every keypress in the input field.

/*
let timeoutId;
const onInput = (event) => {
	// if the id that the setTimeout returns is truthy, we stop the setTimeout till after the delay.

	if (timeoutId) {
		clearTimeout(timeoutId);
	}
	// setTimeout returns a timeout id whenever it is called. we save it
	timeoutId = setTimeout(() => {
		fetchData(event.target.value);
	}, 1000);
};
*/

const onInput = async (event) => {
	const movies = await fetchData(event.target.value);

	// if there is no movie, dropdown wo't be active and return early.
	if (!movies.length) {
		dropdown.classList.remove('is-active');
		return;
	}

	//
	results.innerHTML = '';
	//make dropdown to be active when data is fetched.
	dropdown.classList.add('is-active');
	// iterate through the returned movie array.
	for (let movie of movies) {
		// create a div element
		const option = document.createElement('a');
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;

		// create the inner HTML of this div
		option.classList.add('dropdown-item');
		option.innerHTML = `
            <img src="${imgSrc}"/>
            ${movie.Title}
        `;

		option.addEventListener('click', () => {
			dropdown.classList.remove('is-active');
			// closure scope of the function
			input.value = movie.Title;
			onMovieSelect(movie);
		});

		results.appendChild(option);
	}
};

// event listener for the html input with callback.
input.addEventListener('input', debounce(onInput, 1500));

// function to handle the closing of the widget when a click occurs outside the widget

document.addEventListener('click', (event) => {
	if (!root.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});

// function to get a particular movie.

const onMovieSelect = async (movie) => {
	const response = await axios.get('https://omdbapi.com/', {
		params: {
			apikey: '7efb4270',
			i: movie.imdbID
		}
	});

	document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
	return `
        <article class="media">
            <figure class=""media-left>
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Title}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
    `;
};
