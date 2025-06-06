// 使用立即执行函数封装代码，避免全局污染
(function() {
    // 提升变量到外层作用域
    let isRunning = false;
    let timerId = null;
    let timeLeft = 0;
    let endTime;
    let selectedSeconds = 1800; // 默认30分钟=1800秒
    let timerDisplay;
    let startBtn;
    let resetBtn;
    let timeButtons;

    // 显示通知（使用Notification API）
    function showNotification() {
        if (!('Notification' in window)) return;
        
        if (Notification.permission === 'granted') {
            new Notification('Break time!', {
                body: 'Your break timer is up. Please take a rest!',
                icon: '/images/favicon.webp',
                requireInteraction: true
            });
            // 5分钟后自动重启计时器
            setTimeout(() => {
                resetTimer();
                startTimer();
            }, 5 * 60 * 1000);
        }
    }

    // 显式请求通知权限（由用户交互触发）
    function requestNotificationPermission() {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
    
    // 防抖函数用于保存间隔
    const debouncedSaveInterval = debounce(() => {
        try {
            localStorage.setItem('breakTimerInterval', (selectedSeconds / 60).toString());
        } catch (e) {
            console.warn('Failed to save to localStorage', e);
        }
    }, 500);
    
    function startTimer() {
        if (isRunning) return;
        
        // 检查并请求通知权限
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    // 权限获取后继续启动计时器
                    startTimerAfterPermissionCheck();
                }
            });
            return;
        }
        
        startTimerAfterPermissionCheck();
    }
    
    function startTimerAfterPermissionCheck() {
        // 清除任何现有的计时器
        if (timerId) {
            cancelAnimationFrame(timerId);
        }
        
        const interval = selectedSeconds;
        timeLeft = interval;
        endTime = Date.now() + interval * 1000;
        isRunning = true;
        
        debouncedSaveInterval();
        
        // 使用requestAnimationFrame优化计时器
        function updateTimer() {
            // 检查是否被重置
            if (!isRunning) return;
            
            timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            updateDisplay();
            
            if (timeLeft <= 0) {
                isRunning = false;
                showNotification();
                // 添加计时结束的视觉反馈
                timerDisplay.classList.add('finished');
                setTimeout(() => timerDisplay.classList.remove('finished'), 2000);
            } else {
                timerId = requestAnimationFrame(updateTimer);
            }
        }
        
        timerId = requestAnimationFrame(updateTimer);
    }

    // 格式化时间为MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // 更新显示
    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
        // 添加低时间警告样式
        timerDisplay.classList.toggle('warning', timeLeft <= 60 && timeLeft > 0);
    }

    document.addEventListener('DOMContentLoaded', () => {
        timerDisplay = document.getElementById('timer');
        startBtn = document.getElementById('startBtn');
        resetBtn = document.getElementById('resetBtn');
        timeButtons = document.querySelectorAll('.time-btn');
        
        // 从localStorage加载上次选择的间隔（添加错误处理）
        try {
            const savedInterval = localStorage.getItem('breakTimerInterval');
            selectedSeconds = savedInterval ? Math.max(10, parseInt(savedInterval) * 60) : 1800;
        } catch (e) {
            console.warn('Failed to read from localStorage', e);
            selectedMinutes = 30;
        }
        
        timeLeft = selectedSeconds;
        
        // 初始化显示和按钮状态
        updateDisplay();
        timeButtons.forEach(button => {
            if (parseInt(button.dataset.minutes) === selectedSeconds / 60 ||
                parseInt(button.dataset.seconds) === selectedSeconds) {
                button.classList.add('active');
            }
        });

        // 设置按钮点击事件（使用事件委托优化）
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('time-btn')) return;
            
            selectedSeconds = parseInt(e.target.dataset.seconds || e.target.dataset.minutes * 60);
            // 更新按钮状态和显示
            timeButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            timeLeft = selectedSeconds;
            updateDisplay();
            
            // 保存选择（防抖处理）
            debouncedSaveInterval();
        });
        
        
        // 重置计时器
        function resetTimer() {
            isRunning = false;
            timeLeft = selectedSeconds;
            endTime = 0;
            updateDisplay();
            // 清除任何可能存在的动画帧请求
            if (timerId) {
                cancelAnimationFrame(timerId);
                timerId = null;
            }
            // 移除计时结束的视觉反馈
            timerDisplay.classList.remove('finished');
        }
        
        
        // 事件监听
        startBtn.addEventListener('click', startTimer);
        resetBtn.addEventListener('click', resetTimer);
        
        // 添加键盘快捷键支持
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' && e.target === document.body) {
                e.preventDefault();
                if (isRunning) resetTimer(); else startTimer();
            }
        });


        // 新增：检测页面是否处于后台状态
        function isPageVisible() {
            return document.visibilityState === 'visible';
        }

        // 新增：关闭页面二次确认
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            e.returnValue = ''; // 触发浏览器的默认确认框
        });

    });
    
    // 辅助函数
    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

})();