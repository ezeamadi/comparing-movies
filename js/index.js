const autocompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
	},

	inputValue(movie) {
		return `${movie.Title} ${movie.Year}`;
	},

	// function to fetch data from the movie api through axios which also format our search strings.

	async fetchData(searchTerm) {
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
	}
};

createAutoComplete({
	root: document.querySelector('#left-autocomplete'),
	...autocompleteConfig,
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});

createAutoComplete({
	root: document.querySelector('#right-autocomplete'),
	...autocompleteConfig,
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});

let leftMovie, rightMovie;
// function to get a particular movie.
const onMovieSelect = async (movie, elementForSummary, side) => {
	const response = await axios.get('https://omdbapi.com/', {
		params: {
			apikey: '7efb4270',
			i: movie.imdbID
		}
	});

	elementForSummary.innerHTML = movieTemplate(response.data);

	// which side are they searching? and store in the appropriate variable.
	side === 'left' ? (leftMovie = response.data) : (rightMovie = response.data);

	// if we have left movie and right movie adequately filled, run the comparison.
	if (leftMovie && rightMovie) {
		runComparison();
	}
};

// function to compare the stats of both sides.
const runComparison = () => {
	console.log('time for comparison');
};

const movieTemplate = (movieDetail) => {
	// remove the $ signs, periods and commas from the values to make them easy for comparison.

	const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

	// function to add the integers in the award sentences.
	let count = 0;
	movieDetail.Awards.split(' ').forEach((word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return;
		} else {
			return (count = count + value);
		}
	});

	const awards = parseInt(count);

	//     reduce(
	// 	(prev,
	// 	(word) => {
	// 		const value = parseInt(word);

	// 		if (isNaN(value)) {
	// 			return prev;
	// 		} else {
	// 			return (prev += value);
	// 		}
	// 	}),
	// 	0
	// );

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

        <article data-value=${awards} class ="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class ="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class ="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class ="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class ="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
