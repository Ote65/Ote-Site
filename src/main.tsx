import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import OltraFlimPage from './OltraFlimPage.tsx';
import SwarmIntro from './SwarmIntro.tsx';
import './index.css';

// 独立产品站 oltraflim.ote.asia 渲染产品页；主站保留 /oltraflim 路径兼容旧链接
const isOltraFlim =
  window.location.hostname === 'oltraflim.ote.asia' ||
  /^\/oltraflim\/?$/.test(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <>
    <SwarmIntro />
    {isOltraFlim ? <OltraFlimPage /> : <App />}
  </>
);
