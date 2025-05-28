// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 拖放功能实现
  const dropZone = document.getElementById('dropZone');
  const imageInput = document.getElementById('imageInput');

  // 处理文件选择
  imageInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      const status = document.getElementById('status');
      status.textContent = `Selected: ${this.files[0].name}`;
      status.classList.remove('error');
    }
  });

  // 点击触发文件选择
  dropZone.addEventListener('click', () => imageInput.click());

  // 拖放事件处理
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
      dropZone.classList.add('border-blue-500', 'bg-blue-50');
  }

  function unhighlight() {
      dropZone.classList.remove('border-blue-500', 'bg-blue-50');
  }

  // 处理拖放文件
  dropZone.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      
      if (files.length) {
          imageInput.files = files;
          // 触发change事件让现有逻辑处理
          const event = new Event('change');
          imageInput.dispatchEvent(event);
      }
  }
  // 设置默认选中状态
  document.querySelector('.format-btn[data-format="image/png"]').classList.add('bg-blue-100', 'border-blue-500');
  document.querySelector('.quality-btn[data-quality="0.8"]').classList.add('bg-blue-100', 'border-blue-500');

  // 格式选择按钮点击事件
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('bg-blue-100', 'border-blue-500'));
      this.classList.add('bg-blue-100', 'border-blue-500');
    });
  });

  // 质量选择按钮点击事件
  document.querySelectorAll('.quality-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.quality-btn').forEach(b => b.classList.remove('bg-blue-100', 'border-blue-500'));
      this.classList.add('bg-blue-100', 'border-blue-500');
    });
  });

  document.getElementById('convertBtn').addEventListener('click', function() {
    const imageInput = document.getElementById('imageInput');
    const status = document.getElementById('status');
    const format = document.querySelector('.format-btn.bg-blue-100').dataset.format;
    const quality = parseFloat(document.querySelector('.quality-btn.bg-blue-100').dataset.quality);

    if (!imageInput.files[0]) {
      status.textContent = 'Please upload an image.';
      status.classList.add('error');
      return;
    }

    status.textContent = 'Processing...';
    status.classList.remove('error');
    this.disabled = true;

    const file = imageInput.files[0];
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function(e) {
      img.src = e.target.result;
    };

    img.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const format = document.querySelector('.format-btn.bg-blue-100').dataset.format;
      const quality = parseFloat(document.querySelector('.quality-btn.bg-blue-100').dataset.quality);
      
      canvas.toBlob(function(blob) {
        try {
          const dataUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `converted_image.${format.split('/')[1]}`;
          link.click();
          
          // 释放URL对象内存
          setTimeout(() => URL.revokeObjectURL(dataUrl), 100);
          
          status.textContent = 'Image converted and downloaded!';
          document.getElementById('convertBtn').disabled = false;
        } catch (error) {
          status.textContent = 'Error converting image: ' + error.message;
          status.classList.add('error');
          document.getElementById('convertBtn').disabled = false;
        }
      }, format, format === 'image/png' ? undefined : quality);

      status.textContent = 'Image converted and downloaded!';
      document.getElementById('convertBtn').disabled = false;
    };

    img.onerror = function() {
      status.textContent = 'Error loading image.';
      status.classList.add('error');
      document.getElementById('convertBtn').disabled = false;
    };

    reader.readAsDataURL(file);
  });
});