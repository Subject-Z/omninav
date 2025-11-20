// 立即检测并设置语言,避免闪烁
(function () {
	const lang = (navigator.language || navigator.userLanguage).startsWith('zh') ? 'zh' : 'en';
	const texts = {
		zh: {
			'currency-tool': '货币转换',
			'currency-description': '快速汇率换算',
			'punctuation-tool': '标点转换',
			'punctuation-description': '中英标点互转工具',
			'vpn-tool': 'VPN 推荐',
			'vpn-description': '收集与比较常见 VPN 服务'
		},
		en: {
			'currency-tool': 'Currency Converter',
			'currency-description': 'Quick currency exchange calculator',
			'punctuation-tool': 'Punctuation Converter',
			'punctuation-description': 'Chinese-English punctuation conversion tool',
			'vpn-tool': 'VPN Recommendation',
			'vpn-description': 'Collection and comparison of common VPN services'
		}
	};
	window.__OMNINAV_LANG__ = lang;
	window.__OMNINAV_TEXTS__ = texts[lang];
})();

// 应用语言设置(使用预加载的语言数据)
document.addEventListener('DOMContentLoaded', function () {
	const texts = window.__OMNINAV_TEXTS__;
	for (const key in texts) {
		const element = document.getElementById(key);
		if (element) {
			element.textContent = texts[key];
		}
	}
	document.getElementById('year').textContent = new Date().getFullYear();
});