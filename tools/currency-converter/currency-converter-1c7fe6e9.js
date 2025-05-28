document.addEventListener('DOMContentLoaded', function() {
    const fromAmountInput = document.getElementById('from-amount');
    const toAmountInput = document.getElementById('to-amount');
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const convertedAmount = document.getElementById('converted-amount');
    const copyWithCommasBtn = document.getElementById('copy-with-commas');
    const copyWithoutCommasBtn = document.getElementById('copy-without-commas');
    const copyWithoutDecimalsBtn = document.getElementById('copy-without-decimals');
    const lastUpdated = document.getElementById('last-updated');
    
    let currencies = {};
    let exchangeRates = {};
    let lastUpdateDate = '';
    
    // Default currencies (USD to CNY)
    const DEFAULT_FROM = 'USD';
    const DEFAULT_TO = 'CNY';
    
    // Fetch currencies list
    fetch('https://api.frankfurter.dev/v1/currencies')
        .then(response => response.json())
        .then(data => {
            currencies = data;
            populateCurrencySelects();
            setDefaultCurrencies();
            fetchLatestRates();
        })
        .catch(error => {
            console.error('Error fetching currencies:', error);
            convertedAmount.textContent = 'Error loading currencies';
        });
    
    function populateCurrencySelects() {
        const sortedCurrencies = Object.keys(currencies).sort();
        
        sortedCurrencies.forEach(currencyCode => {
            const option1 = document.createElement('option');
            option1.value = currencyCode;
            option1.textContent = `${currencyCode} - ${currencies[currencyCode]}`;
            
            const option2 = document.createElement('option');
            option2.value = currencyCode;
            option2.textContent = `${currencyCode} - ${currencies[currencyCode]}`;
            
            fromSelect.appendChild(option1);
            toSelect.appendChild(option2);
        });
    }
    
    function setDefaultCurrencies() {
        // Try to load from localStorage first
        const savedFrom = localStorage.getItem('currencyConverterFrom');
        const savedTo = localStorage.getItem('currencyConverterTo');
        
        if (savedFrom && currencies[savedFrom]) {
            fromSelect.value = savedFrom;
        } else if (currencies[DEFAULT_FROM]) {
            fromSelect.value = DEFAULT_FROM;
        }
        
        if (savedTo && currencies[savedTo]) {
            toSelect.value = savedTo;
        } else if (currencies[DEFAULT_TO]) {
            toSelect.value = DEFAULT_TO;
        }
    }
    
    function fetchLatestRates() {
        const baseCurrency = fromSelect.value;
        fetch(`https://api.frankfurter.dev/v1/latest?base=${baseCurrency}`)
            .then(response => response.json())
            .then(data => {
                exchangeRates = data.rates;
                lastUpdateDate = data.date;
                updateLastUpdated();
                calculateConversion();
            })
            .catch(error => {
                console.error('Error fetching exchange rates:', error);
                convertedAmount.textContent = 'Error loading exchange rates';
            });
    }
    
    function cleanNumberInput(value) {
        // Remove any non-numeric characters except decimal point
        return value.replace(/[^0-9.]/g, '');
    }
    
    function calculateConversion() {
        // Handle input from either from-amount or to-amount
        let amount = 0;
        let isFromInput = true;
        
        if (fromAmountInput.value) {
            const cleanFromValue = cleanNumberInput(fromAmountInput.value);
            amount = parseFloat(cleanFromValue) || 0;
            isFromInput = true;
        } else if (toAmountInput.value) {
            const cleanToValue = cleanNumberInput(toAmountInput.value);
            amount = parseFloat(cleanToValue) || 0;
            isFromInput = false;
        }
        
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;
        const rate = exchangeRates[toCurrency];
        
        if (isFromInput) {
            if (rate && amount > 0) {
                const result = amount * rate;
                convertedAmount.textContent = result.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                });
                toAmountInput.value = result;
            } else if (toCurrency === fromCurrency) {
                convertedAmount.textContent = amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                });
                toAmountInput.value = amount;
            } else {
                convertedAmount.textContent = '0.00';
                toAmountInput.value = '';
            }
        } else {
            if (rate && amount > 0) {
                const result = amount / rate;
                convertedAmount.textContent = amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                });
                fromAmountInput.value = result;
            } else if (toCurrency === fromCurrency) {
                convertedAmount.textContent = amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4
                });
                fromAmountInput.value = amount;
            } else {
                convertedAmount.textContent = '0.00';
                fromAmountInput.value = '';
            }
        }
    }
    
    function updateLastUpdated() {
        if (lastUpdateDate) {
            lastUpdated.textContent = `Last updated: ${lastUpdateDate}`;
        }
    }
    
    function copyToClipboard(withCommas, withoutDecimals) {
        const text = convertedAmount.textContent;
        let textToCopy = text;
        
        if (!withCommas) {
            textToCopy = parseFloat(text.replace(/,/g, '')).toFixed(4);
        }
        
        if (withoutDecimals) {
            textToCopy = Math.floor(parseFloat(text.replace(/,/g, ''))).toString();
        }
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                const btn = withoutDecimals ? copyWithoutDecimalsBtn : (withCommas ? copyWithCommasBtn : copyWithoutCommasBtn);
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
    
    // Format input on blur
    function formatInput(input) {
        const value = parseFloat(cleanNumberInput(input.value));
        if (!isNaN(value)) {
            input.value = value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            });
        }
    }

    // Event listeners
    fromAmountInput.addEventListener('input', () => {
        toAmountInput.value = ''; // Clear to-amount when from-amount changes
        calculateConversion();
    });
    toAmountInput.addEventListener('input', () => {
        fromAmountInput.value = ''; // Clear from-amount when to-amount changes
        calculateConversion();
    });
    fromAmountInput.addEventListener('blur', () => formatInput(fromAmountInput));
    toAmountInput.addEventListener('blur', () => formatInput(toAmountInput));
    fromSelect.addEventListener('change', () => {
        localStorage.setItem('currencyConverterFrom', fromSelect.value);
        fetchLatestRates();
    });
    toSelect.addEventListener('change', () => {
        localStorage.setItem('currencyConverterTo', toSelect.value);
        calculateConversion();
    });
    copyWithCommasBtn.addEventListener('click', () => copyToClipboard(true, false));
    copyWithoutCommasBtn.addEventListener('click', () => copyToClipboard(false, false));
    copyWithoutDecimalsBtn.addEventListener('click', () => copyToClipboard(false, true));
});