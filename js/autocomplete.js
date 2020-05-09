const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

	const input = root.querySelector('input');
	const results = root.querySelector('.results');
	const dropdown = root.querySelector('.dropdown');

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
		const items = await fetchData(event.target.value);

		// if there is no item, dropdown wo't be active and return early.
		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		//
		results.innerHTML = '';
		//make dropdown to be active when data is fetched.
		dropdown.classList.add('is-active');
		// iterate through the returned item array.
		for (let item of items) {
			// create a div element
			const option = document.createElement('a');

			// create the inner HTML of this div
			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);

			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				// closure scope of the function
				input.value = inputValue(item);
				onOptionSelect(item);
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
};
