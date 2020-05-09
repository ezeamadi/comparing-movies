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

	dropdown.classList.add('is-active');
	// iterate through the returned movie array.
	for (movie of movies) {
		// create a div element
		const option = document.createElement('a');

		// create the inner HTML of this div
		option.innerHTML = `
            <img src="${movie.Poster}"/>
            <h1>${movie.Title}</h1>
        `;

		results.appendChild(option);
	}
};

// event listener for the html input with callback.
input.addEventListener('input', debounce(onInput, 1500));
