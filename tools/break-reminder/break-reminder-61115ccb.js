// 使用立即执行函数封装代码，避免全局污染
(function() {
    // 提前请求通知权限（优化为异步非阻塞方式）
    const requestNotificationPermission = () => {
        if (Notification.permission === 'default') {
            // 延迟请求以避免阻塞页面加载
            setTimeout(() => Notification.requestPermission(), 1000);
        }
    };
    requestNotificationPermission();

    document.addEventListener('DOMContentLoaded', () => {
        const timerDisplay = document.getElementById('timer');
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const timeButtons = document.querySelectorAll('.time-btn');
        
        let timer;
        let timeLeft = 0;
        let endTime;
        let isRunning = false;
        let selectedMinutes = 30;
        let timerId = null; // 用于跟踪当前活动的计时器
        
        // 从localStorage加载上次选择的间隔（添加错误处理）
        try {
            const savedInterval = localStorage.getItem('breakTimerInterval');
            if (savedInterval) {
                selectedMinutes = Math.max(1, parseInt(savedInterval) || 30); // 确保最小1分钟
            }
        } catch (e) {
            console.warn('Failed to read from localStorage', e);
        }
        
        timeLeft = selectedMinutes * 60;
        updateDisplay();
        
        // 设置按钮点击事件（使用事件委托优化）
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('time-btn')) return;
            
            selectedMinutes = parseInt(e.target.dataset.minutes);
            // 更新按钮状态和显示
            timeButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            timeLeft = selectedMinutes * 60;
            updateDisplay();
            
            // 保存选择（防抖处理）
            debouncedSaveInterval();
        });
        
        // 初始化选中状态
        timeButtons.forEach(button => {
            if (parseInt(button.dataset.minutes) === selectedMinutes) {
                button.classList.add('active');
            }
        });
        
        // 防抖函数用于保存间隔
        const debouncedSaveInterval = debounce(() => {
            try {
                localStorage.setItem('breakTimerInterval', selectedMinutes.toString());
            } catch (e) {
                console.warn('Failed to save to localStorage', e);
            }
        }, 500);
        
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
        
        // 开始计时
        function startTimer() {
            if (isRunning) return;
            
            // 清除任何现有的计时器
            if (timerId) {
                cancelAnimationFrame(timerId);
            }
            
            const interval = selectedMinutes * 60;
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
        
        // 重置计时器
        function resetTimer() {
            isRunning = false;
            timeLeft = selectedMinutes * 60;
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
        
        // 显示通知（使用Service Worker确保后台通知）
        function showNotification() {
            if (!('Notification' in window)) return;
            
            // 注册Service Worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        registration.showNotification('Break time!', {
                            body: 'Your break timer is up. Please take a rest!',
                            icon: '/images/favicon.webp',
                            vibrate: [200, 100, 200],
                            requireInteraction: true
                        });
                    })
                    .catch(err => {
                        console.error('Service Worker registration failed:', err);
                        // 回退到普通通知
                        if (Notification.permission === 'granted') {
                            new Notification('Break time!', {
                                body: 'Your break timer is up. Please take a rest!',
                                icon: '/images/favicon.webp',
                                requireInteraction: true
                            });
                        }
                    });
            } else {
                // 不支持Service Worker时的回退方案
                if (Notification.permission === 'granted') {
                    new Notification('Break time!', {
                        body: 'Your break timer is up. Please take a rest!',
                        icon: '/images/favicon.webp',
                        requireInteraction: true
                    });
                }
            }
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

        // 调用自动开始计时的逻辑
        setupAutoStart();

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

    // 优化后的自动开始计时逻辑
    function setupAutoStart() {
        let inactivityTimer;
        const startDelay = 5 * 60 * 1000; // 5分钟
        
        const startIfInactive = () => {
            if (!isRunning) {
                startTimer();
                // 启动后移除监听
                document.removeEventListener('mousemove', resetInactivityTimer);
                document.removeEventListener('keydown', resetInactivityTimer);
            }
        };

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(startIfInactive, startDelay);
        };

        // 监听用户交互
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keydown', resetInactivityTimer);
        document.addEventListener('click', resetInactivityTimer);

        // 页面加载后立即设置计时器
        inactivityTimer = setTimeout(startIfInactive, startDelay);
        
        // 如果页面从后台恢复，重置计时器
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                resetInactivityTimer();
            }
        });
    }
})();