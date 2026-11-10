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

createRoot(document.getElementById('root')!).render(
  <>
    <SwarmIntro />
    {isOltraFlim ? <OltraFlimPage /> : <App />}
  </>
);
