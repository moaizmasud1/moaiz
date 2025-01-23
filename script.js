document.addEventListener('DOMContentLoaded', () => {
    const stockInput = document.getElementById('stockInput');
    const stockDetails = document.getElementById('stockDetails');
    const cryptoDropdown = document.getElementById('cryptoDropdown');

    // Add Litecoin and other cryptocurrencies to track
    const defaultCryptos = ['bitcoin', 'ethereum', 'dogecoin', 'litecoin', 'ripple'];
    const availableCryptos = loadFromLocalStorage('availableCryptos', defaultCryptos);

    // Populate cryptocurrency dropdown
    cryptoDropdown.innerHTML = '<option value="">Select a cryptocurrency</option>'; // Add placeholder
    availableCryptos.forEach(crypto => {
        const option = document.createElement('option');
        option.value = crypto;
        option.textContent = crypto.charAt(0).toUpperCase() + crypto.slice(1); // Capitalize first letter
        cryptoDropdown.appendChild(option);
    });

    // Load last searched cryptocurrency from local storage
    const lastSearched = loadFromLocalStorage('lastSearchedCrypto', null);
    if (lastSearched) {
        stockDetails.textContent = `Last searched cryptocurrency: ${lastSearched}`;
    }

    // Search button click event
    document.getElementById('searchButton').addEventListener('click', function () {
        const cryptoSymbol = cryptoDropdown.value || stockInput.value.trim().toLowerCase();

        if (!cryptoSymbol) {
            stockDetails.textContent = 'Please enter a cryptocurrency name or symbol.';
            return;
        }

        // Fetch cryptocurrency data from CoinGecko API
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoSymbol}&vs_currencies=usd`)
            .then(response => response.json())
            .then(data => {
                const cryptoData = data[cryptoSymbol];

                if (cryptoData) {
                    // Display the cryptocurrency price
                    stockDetails.textContent = `${cryptoSymbol.toUpperCase()} Price: $${cryptoData.usd}`;

                    // Save the last searched cryptocurrency to localStorage
                    saveToLocalStorage('lastSearchedCrypto', `${cryptoSymbol.toUpperCase()} Price: $${cryptoData.usd}`);
                } else {
                    stockDetails.textContent = 'Cryptocurrency not found. Please try another symbol.';
                }
            })
            .catch(error => {
                console.error('Error fetching cryptocurrency data:', error);
                stockDetails.textContent = 'Error fetching data. Please try again later.';
            });
    });

    // Save available cryptocurrencies to local storage
    saveToLocalStorage('availableCryptos', availableCryptos);
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
