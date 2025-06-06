// State variables
let headsCount = 0;
let tailsCount = 0;
let totalFlips = 0;
let flipHistory = [];
let isFlipping = false;

// DOM elements
const coin = document.getElementById('coin');
const flipBtn = document.getElementById('flipBtn');
const resetBtn = document.getElementById('resetBtn');
const headsCountEl = document.getElementById('headsCount');
const tailsCountEl = document.getElementById('tailsCount');
const headsPercentEl = document.getElementById('headsPercent');
const tailsPercentEl = document.getElementById('tailsPercent');
const totalFlipsEl = document.getElementById('totalFlips');
const headsProgress = document.getElementById('headsProgress');
const tailsProgress = document.getElementById('tailsProgress');
const historyContainer = document.getElementById('historyContainer');
const resultMessage = document.getElementById('resultMessage');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    flipBtn.addEventListener('click', flipCoin);
    resetBtn.addEventListener('click', resetStats);
    updateStats(); // Initialize stats display
});

// Flip the coin
function flipCoin() {
    if (isFlipping) return;

    isFlipping = true;
    flipBtn.disabled = true;

    // Clear any previous result
    resultMessage.textContent = "";

    // Generate random result (0 = heads, 1 = tails)
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const finalRotation = (totalFlips * 360 * 5) + (result === 'heads' ? 0 : 180);

    // Update coin's transform directly for animation
    coin.style.transition = 'transform 2s cubic-bezier(0.3, 2.0, 0.7, 1.0)';
    coin.style.transform = `rotateY(${finalRotation}deg)`;

    // Update statistics after animation completes
    setTimeout(() => {
        // Update counts based on the pre-determined result
        if (result === 'heads') {
            headsCount++;
        } else {
            tailsCount++;
        }
        totalFlips++;
        flipHistory.push(result);

        // Update UI
        updateStats();
        updateHistory();

        // Show result message
        resultMessage.textContent = result === 'heads' ? "It's Heads!" : "It's Tails!";

        isFlipping = false;
        flipBtn.disabled = false;

        // Reset transition to be ready for next class-based animation if needed, or keep it for smooth resets
        // For simplicity, we can leave the transition property as is.
    }, 2000);
}


function updateStats() {
    // Update counts
    headsCountEl.textContent = headsCount;
    tailsCountEl.textContent = tailsCount;
    totalFlipsEl.textContent = totalFlips;

    // Calculate percentages
    let headsPercent = 50;
    let tailsPercent = 50;

    if (totalFlips > 0) {
        headsPercent = Math.round((headsCount / totalFlips) * 100);
        tailsPercent = 100 - headsPercent; // Ensure they sum to 100
    }
    
    // Update percentage displays
    headsPercentEl.textContent = `${totalFlips > 0 ? headsPercent : 0}%`;
    tailsPercentEl.textContent = `${totalFlips > 0 ? tailsPercent : 0}%`;

    // Update progress bars
    headsProgress.style.width = `${headsPercent}%`;
    tailsProgress.style.width = `${tailsPercent}%`;
}

function updateHistory() {
    // Prepend the new result instead of rebuilding the whole list
    const lastResult = flipHistory[flipHistory.length - 1];
    if (!lastResult) return; // Do nothing if history is empty

    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.classList.add(lastResult === 'heads' ? 'history-heads' : 'history-tails');
    historyItem.textContent = lastResult === 'heads' ? 'H' : 'T';
    
    historyContainer.prepend(historyItem);

    // Keep only the last 20 items
    if (historyContainer.children.length > 20) {
        historyContainer.lastChild.remove();
    }
}

function resetStats() {
    if (isFlipping) return;

    // Reset all counters
    headsCount = 0;
    tailsCount = 0;
    totalFlips = 0;
    flipHistory = [];

    // Reset coin to initial position smoothly
    coin.style.transition = 'transform 0.8s ease';
    coin.style.transform = 'rotateY(0)';

    // Reset result message
    resultMessage.textContent = "Ready to flip!";

    // Update UI
    updateStats();
    historyContainer.innerHTML = ''; // Clear history DOM
}