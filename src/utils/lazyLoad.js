/**
 * 统一的图片懒加载工具
 */
export function setupLazyLoading() {
  // 确保代码运行在浏览器环境中
  if (typeof document === 'undefined') return;

  // 使用 IntersectionObserver API
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          if (lazyImage.dataset.src) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.removeAttribute('data-src');
            lazyImage.classList.add('loaded');
            
            // 处理骨架屏
            const skeletonParent = lazyImage.closest('.skeleton-image');
            if (skeletonParent) {
              skeletonParent.classList.add('loaded');
            }
          }
          observer.unobserve(lazyImage);
        }
      });
    });

    // 为所有懒加载图片添加观察器
    document.querySelectorAll('img.lazy-image, img[data-src]').forEach(img => {
      lazyImageObserver.observe(img);
    });
    
  } else {
    // 回退方案：使用滚动事件
    let lazyLoadThrottleTimeout = null;
    
    function lazyLoad() {
      if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout);
      }

      lazyLoadThrottleTimeout = setTimeout(() => {
        const scrollTop = window.scrollY;
        const lazyImages = document.querySelectorAll('img.lazy-image[data-src], img[data-src]');
        
        lazyImages.forEach(img => {
          const rect = img.getBoundingClientRect();
          
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            img.src = img.dataset.src || '';
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            
            // 处理骨架屏
            const skeletonParent = img.closest('.skeleton-image');
            if (skeletonParent) {
              skeletonParent.classList.add('loaded');
            }
          }
        });
        
        if (lazyImages.length === 0) {
          document.removeEventListener('scroll', lazyLoad);
          window.removeEventListener('resize', lazyLoad);
          window.removeEventListener('orientationchange', lazyLoad);
        }
      }, 20);
    }

    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationchange', lazyLoad);
    setTimeout(lazyLoad, 0);
  }
}

// 导出一个初始化函数，可在组件中直接使用
export function initLazyLoading() {
  document.addEventListener('DOMContentLoaded', setupLazyLoading);
}