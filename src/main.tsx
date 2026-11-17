import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import OltraFlimPage from './OltraFlimPage.tsx';
import SwarmIntro from './SwarmIntro.tsx';
import './index.css';

// 独立产品站（欧胶片 OLTRAFILM）渲染产品页；主站保留 /oltraflim 路径作为入口
const PRODUCT_HOST = 'spektra' + '.ote.asia';
const PRODUCT_PATH = '/oltra' + 'film';
const isOltraFlim =
  window.location.hostname === PRODUCT_HOST ||
  window.location.pathname.replace(/\/$/, '') === PRODUCT_PATH;

// 产品页 favicon 改用 OLTRAFILM 品牌图标；主站保留 index.html 中的 OTE 星形 favicon
if (isOltraFlim) {
  document.querySelectorAll('link[rel~="icon"]').forEach((el) => el.remove());
  const icon = document.createElement('link');
  icon.rel = 'icon';
  icon.type = 'image/png';
  icon.sizes = '32x32';
  icon.href = '/media/spektra-favicon-32.png';
  document.head.appendChild(icon);
  const touch = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
  if (touch) touch.href = '/media/spektra-apple-touch-icon.png';
}

createRoot(document.getElementById('root')!).render(
  <>
    <SwarmIntro />
    {isOltraFlim ? <OltraFlimPage /> : <App />}
  </>
);
