document.addEventListener('DOMContentLoaded', function() {
    // Timer variables
    let timerInterval;
    let isRunning = false;
    let totalSeconds = 5 * 60; // Default 5 minutes
    
    // DOM elements
    const toggleBtn = document.getElementById('toggle-timer');
    const resetBtn = document.getElementById('reset-timer');
    const settingsBtn = document.getElementById('open-settings');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const settingsModal = document.getElementById('settings-modal');
    const homeTeamInput = document.getElementById('home-team-name');
    const awayTeamInput = document.getElementById('away-team-name');
    const homeTeamDisplay = document.getElementById('home-team-name-display');
    const awayTeamDisplay = document.getElementById('away-team-name-display');
    const minutesInput = document.getElementById('modal-minutes-input');
    const secondsInput = document.getElementById('modal-seconds-input');
    const saveSettingsBtn = document.getElementById('save-settings');

    // Update single digit display
    function updateDigit(id, digit) {
        const element = document.getElementById(id);
        if (element.textContent !== digit.toString()) {
            element.textContent = digit;
        }
    }

    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        updateDigit('minutes-tens', Math.floor(minutes / 10));
        updateDigit('minutes-units', minutes % 10);
        updateDigit('seconds-tens', Math.floor(seconds / 10));
        updateDigit('seconds-units', seconds % 10);
    }

    // Toggle timer
    function toggleTimer() {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    // Start timer
    function startTimer() {
        isRunning = true;
        toggleBtn.textContent = 'Pause';
        toggleBtn.style.backgroundColor = '#f39c12'; // 设置为淡黄色
        timerInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimerDisplay();
            } else {
                pauseTimer();
            }
        }, 1000);
    }

    // Pause timer
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            toggleBtn.textContent = 'Start';
            toggleBtn.style.backgroundColor = ''; // 恢复默认样式
        }
    }

    // Reset timer
    function resetTimer() {
        pauseTimer();
        totalSeconds = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
        updateTimerDisplay();
    }

    // Toggle fullscreen using F11 behavior
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Score variables
    let team1Score = 0;
    let team2Score = 0;

    // Update team score display
    function updateTeamScore(team, score) {
        const hundreds = Math.floor(score / 100) % 10;
        const tens = Math.floor(score / 10) % 10;
        const units = score % 10;

        if (team === 1) {
            updateDigit('team1-hundreds', hundreds);
            updateDigit('team1-tens', tens);
            updateDigit('team1-units', units);
            team1Score = score;
        } else {
            updateDigit('team2-hundreds', hundreds);
            updateDigit('team2-tens', tens);
            updateDigit('team2-units', units);
            team2Score = score;
        }
    }

    // Event listeners
    toggleBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Score controls
    document.getElementById('team1-add').addEventListener('click', () => {
        updateTeamScore(1, team1Score + 1);
    });
    
    document.getElementById('team1-subtract').addEventListener('click', () => {
        updateTeamScore(1, Math.max(0, team1Score - 1));
    });
    
    document.getElementById('team2-add').addEventListener('click', () => {
        updateTeamScore(2, team2Score + 1);
    });
    
    document.getElementById('team2-subtract').addEventListener('click', () => {
        updateTeamScore(2, Math.max(0, team2Score - 1));
    });
    
    // Settings modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            if (settingsModal) {
                settingsModal.style.display = 'flex';
            } else {
                console.error("settingsModal is null. Ensure the element exists in the DOM.");
            }
        });
    } else {
        console.error("settingsBtn is null. Ensure the element exists in the DOM.");
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            if (homeTeamDisplay && awayTeamDisplay && settingsModal) {
                homeTeamDisplay.textContent = homeTeamInput.value;
                awayTeamDisplay.textContent = awayTeamInput.value;
                resetTimer();
                settingsModal.style.display = 'none';
            } else {
                console.error("One or more required elements (homeTeamDisplay, awayTeamDisplay, settingsModal) are null.");
            }
        });
    } else {
        console.error("saveSettingsBtn is null. Ensure the element exists in the DOM.");
    }

    // Close modal when clicking outside
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });
    } else {
        console.error("settingsModal is null. Ensure the element exists in the DOM.");
    }

    // Show settings modal on page load
    if (settingsModal) {
        settingsModal.style.display = 'flex';
    } else {
        console.error("settingsModal is null. Ensure the element exists in the DOM.");
    }

});
