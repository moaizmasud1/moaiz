document.addEventListener('DOMContentLoaded', () => {
    const dogDetails = document.getElementById('dogDetails');
    const dogFactsDropdown = document.getElementById('dogFactsDropdown');

    // Load dog facts from localStorage or fetch new ones
    const availableDogFacts = loadFromLocalStorage('availableDogFacts', []);

    if (availableDogFacts.length === 0) {
        fetchDogFacts(); // Fetch dog facts from the API if nothing is stored in localStorage
    } else {
        populateDropdown(availableDogFacts); // Populate the dropdown with stored dog facts
    }

    // Search button click event
    document.getElementById('searchButton').addEventListener('click', function () {
        const selectedFact = dogFactsDropdown.value;

        if (!selectedFact) {
            dogDetails.textContent = 'Please select a dog fact from the dropdown.';
            return;
        }

        // Display the selected dog fact
        dogDetails.textContent = selectedFact;

        // Save the selected dog fact in localStorage (so we can display it on next load)
        saveToLocalStorage('lastSearchedDogFact', selectedFact);
    });

    // Function to fetch dog facts from the API
    function fetchDogFacts() {
        fetch('https://dog-api.kinduff.com/api/facts?number=6')
            .then(response => response.json())
            .then(data => {
                const dogFacts = data.facts;

                // Store the fetched dog facts in localStorage
                saveToLocalStorage('availableDogFacts', dogFacts);
                
                // Populate the dropdown with dog facts
                populateDropdown(dogFacts);
            })
            .catch(error => {
                console.error('Error fetching dog facts:', error);
                dogDetails.textContent = 'Error fetching data. Please try again later.';
            });
    }

    // Function to populate the dropdown with dog facts
    function populateDropdown(facts) {
        dogFactsDropdown.innerHTML = '<option value="">Select a dog fact</option>'; // Add placeholder
        facts.forEach(fact => {
            const option = document.createElement('option');
            option.value = fact;
            option.textContent = fact.charAt(0).toUpperCase() + fact.slice(1); // Capitalize first letter
            dogFactsDropdown.appendChild(option);
        });
    }

    // Check and display the last searched dog fact from localStorage
    const lastSearched = loadFromLocalStorage('lastSearchedDogFact', null);
    if (lastSearched) {
        dogDetails.textContent = `Last searched dog fact: ${lastSearched}`;
    }
});

// Helper function to load data from local storage
function loadFromLocalStorage(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

// Helper function to save data to local storage
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
