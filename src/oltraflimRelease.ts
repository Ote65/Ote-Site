export type FlimPlatform = 'mac' | 'win' | 'ios';
export type FlimDownloadFormat = 'dmg' | 'zip' | 'exe' | 'ipa';

export type FlimDownload = {
  file: string;
  label: string;
  size: string;
  sha256: string;
  github: string;
  relay: string;
  mirror: string;
};

const TAG = 'v1.4';
const REPO = 'https://github.com/Ote65/OltraFlim';
const RELEASE = `${REPO}/releases/download/${TAG}`;
const RELAY = 'https://ote.asia/dl';
const MIRROR = 'https://gh-proxy.com';

/* Windows 测试版走独立仓库与独立 tag，与 macOS 正式版不是一条发布线 */
const WIN_TAG = 'v0.1.0-win';
const WIN_REPO = 'https://github.com/Ote65/spektraFilmOltra';
const WIN_RELEASE = `${WIN_REPO}/releases/download/${WIN_TAG}`;

/* iOS 内测版与 Windows 版共用发布仓库，tag 用 -ios 后缀区分 */
const IOS_TAG = 'v0.4.4-ios';
const IOS_RELEASE = `${WIN_REPO}/releases/download/${IOS_TAG}`;

export const OLTRAFILM_RELEASE = {
  name: '欧胶片 OltraFilm',
  en: 'OLTRAFILM',
  version: '1.4',
  build: '1',
  date: '2026-11-10',
  channel: '正式版',
  system: 'macOS 14.0 或更新',
  arch: 'Apple Silicon（M1 / M2 / M3 / M4）',
  repo: REPO,
  releasePage: `${REPO}/releases/tag/${TAG}`,
  requirements: [
    ['SYSTEM', 'macOS 14.0 或更新'],
    ['CHIP', 'Apple Silicon（M1 / M2 / M3 / M4）'],
    ['INPUT', 'JPEG · PNG · TIFF · HEIC · RAW · DNG'],
    ['PRICE', '非商业用途免费'],
  ],
  /* 并列的 Windows 测试版入口（0.1.0，Electron 界面 + 本地 Python 引擎） */
  windows: {
    name: '欧胶片 OltraFilm（Windows 版）',
    version: '0.1.0',
    build: '1',
    date: '2026-11-05',
    channel: '测试版',
    system: 'Windows 10 / 11（64 位）',
    arch: 'x64',
    repo: WIN_REPO,
    releasePage: `${WIN_REPO}/releases/tag/${WIN_TAG}`,
    requirements: [
      ['SYSTEM', 'Windows 10 / 11（64 位）'],
      ['ARCH', 'x64'],
      ['ENGINE', 'Electron 界面 · 本地 Python 显影引擎'],
      ['STATUS', '测试版 · 未签名'],
    ],
    notices: [
      '安装包未做数字签名，首次运行会被 Windows SmartScreen 拦一下，点「更多信息」再点「仍要运行」即可。',
      '首次启动会做一次显影引擎预热，约 20–40 秒，之后恢复正常速度。',
      '测试版暂缺：旋转、Polaroid 显影动画、边框预设、调色台 HSL 八色带与四分区面板；窗口暂时使用系统标题栏。',
    ],
    downloads: {
      exe: {
        file: 'SpektraOltra-Setup-0.1.0.exe',
        label: 'EXE 安装包',
        size: '228.8 MB',
        sha256: 'c8332f8f18f6789f4bb23bc8ee775bcbb0af4a763ca3c0adc197846e01b6ce51',
        github: `${WIN_RELEASE}/SpektraOltra-Setup-0.1.0.exe`,
        relay: `${RELAY}/SpektraOltra-Setup-0.1.0.exe`,
        mirror: `${MIRROR}/${WIN_RELEASE}/SpektraOltra-Setup-0.1.0.exe`,
      } satisfies FlimDownload,
    },
  },
  /* 并列的 iOS 内测入口（0.4.4，原生 SwiftUI 暗房 + 光谱显影引擎） */
  ios: {
    name: '欧胶片 OltraFilm（iOS 版）',
    version: '0.4.4',
    build: '7',
    date: '2026-11-16',
    channel: '内测版',
    system: 'iOS 17.0 或更新',
    arch: 'iPhone（arm64）',
    repo: WIN_REPO,
    releasePage: `${WIN_REPO}/releases/tag/${IOS_TAG}`,
    requirements: [
      ['SYSTEM', 'iOS 17.0 或更新'],
      ['DEVICE', 'iPhone（arm64）'],
      ['INPUT', 'RAW · DNG · JPEG · HEIC'],
      ['STATUS', '内测版 · 开发签名'],
    ],
    notices: [
      '① 点上方按钮下载 IPA（17.4 MB），也可以在 iPhone 的「文件」App 里直接保存。',
      '② 这个包是 Apple 开发签名：只有已登记在开发者设备列表里的 iPhone 能直接安装，其他手机需要用 Sideloadly / AltStore 等工具重签。',
      '③ 重签：电脑装 Sideloadly，数据线连上 iPhone，把 IPA 拖进窗口，输入自己的 Apple ID 后开始安装。',
      '④ 装完在手机「设置 → 通用 → VPN 与设备管理」里信任对应的开发者证书，才能打开 App。',
      '⑤ 首次启动允许访问相册，就可以导入 RAW / DNG / JPEG / HEIC；导出时成片直接写回相册。',
      '⑥ 开发签名的描述文件有效期较短（本包到 2026-11-20），过期后用同样步骤重签即可，照片与编辑记录不会丢。',
    ],
    whatsNew: [
      {
        en: 'CAMERA UI',
        t: '取景页与水平仪重做',
        d: '水平仪改成三杠：中间横杠跟着机身倾斜转，左右两根参考杠固定跟设备方向，横屏时整组一起转；顶栏与取景图标重新排布，预设面板从按钮位置弹出。',
        foot: 'LEVEL · CAMERA UI',
      },
      {
        en: 'CAPTURE META',
        t: '拍摄曝光与色温进入显影',
        d: '按下快门时记下曝光补偿与锁定色温，入库直接写进显影参数。直出以拍摄曝光为基线再叠加预设，不再出现「相机里压了曝光、出片却没变化」。',
        foot: 'SHUTTER · DEVELOP LINK',
      },
      {
        en: 'BORDER',
        t: '直出成片可换片边',
        d: '显影完成后仍可改片边：底部面板不压暗预览，预览自动上移完整露出；保存时按同一份参数把片边合进成片，预览与成品一致。',
        foot: 'BORDER · NO RE-DEVELOP',
      },
      {
        en: 'HANDOFF CACHE',
        t: '调色台秒开',
        d: '每张照片保留最近一次显影的 1600 长边交接图：参数没变直接复用，参数一变自动失效并覆盖，不累积。主页长按进调色台同样命中，不再重复显影。',
        foot: 'CACHE · INSTANT GRADE',
      },
      {
        en: 'PRESETS',
        t: '用户预设按组保存',
        d: '显影与调色都能存自己的预设：调色可按光影 / 色调 / 质感 / 细节 / LUT 勾选保存，套用时只覆盖选中的组；支持左滑删除与撤销。',
        foot: 'PRESET · BY GROUP',
      },
      {
        en: 'SETTINGS',
        t: '相机设置与缓存清理',
        d: '设置新增相机分区：水平仪、镜像前置、拍摄后进入显影台、音量键快门、直出保存原图；另加缓存统计与一键清理，清完不影响原片与编辑记录。',
        foot: 'SETTINGS · CACHE',
      },
    ],
    downloads: {
      ipa: {
        file: 'Spektrafilm-0.4.4-ios.ipa',
        label: 'IPA 安装包',
        size: '17.4 MB',
        sha256: '119e6cdbded035d338941f118db54912ec6638a68aee6d0c7b55dbcbe930918b',
        github: `${IOS_RELEASE}/Spektrafilm-0.4.4-ios.ipa`,
        relay: `${RELAY}/Spektrafilm-0.4.4-ios.ipa`,
        mirror: `${MIRROR}/${IOS_RELEASE}/Spektrafilm-0.4.4-ios.ipa`,
      } satisfies FlimDownload,
    },
  },
  downloads: {
    dmg: {
      file: 'OltraFlim-1.4.dmg',
      label: 'DMG 安装包',
      size: '27.5 MB',
      sha256: '216bdb32bc6377fd921d8fbdc215fb3e13c515163a043b9db4f531c54cf3ee5b',
      github: `${RELEASE}/OltraFlim-1.4.dmg`,
      relay: `${RELAY}/OltraFlim-1.4.dmg`,
      mirror: `${MIRROR}/${RELEASE}/OltraFlim-1.4.dmg`,
    } satisfies FlimDownload,
    zip: {
      file: 'OltraFlim-1.4.zip',
      label: 'ZIP 免挂载',
      size: '12.6 MB',
      sha256: 'f4baf4cf50f9130719fb00ea614382bb3ba591341f63e670ec1824da9d76c147',
      github: `${RELEASE}/OltraFlim-1.4.zip`,
      relay: `${RELAY}/OltraFlim-1.4.zip`,
      mirror: `${MIRROR}/${RELEASE}/OltraFlim-1.4.zip`,
    } satisfies FlimDownload,
  } satisfies Record<'dmg' | 'zip', FlimDownload>,
};

export const FLIM_FEATURES = [
  {
    id: 'film',
    n: '01',
    en: 'FILM LOOKS',
    title: '113 种胶片外观',
    body: '45 个经典胶片 stock，从 Portra、Gold 到 Ektachrome、Vision3。每一支都有多套打印/渲染变体，选中即出片。',
    foot: '113 LUT · 45 STOCKS',
  },
  {
    id: 'light',
    n: '02',
    en: 'LIGHT & COLOR',
    title: '光线与色彩',
    body: '曝光、对比、高光、阴影、黑白场；色温、色调、肤色/绿色/蓝色饱和度、分离色调。不是简单滤镜，是完整的显影控制。',
    foot: 'LIGHT / COLOR / CURVES',
  },
  {
    id: 'texture',
    n: '03',
    en: 'FILM TEXTURE',
    title: '颗粒与光晕',
    body: '颗粒尺寸、彩噪、阴影颗粒；光晕阈值、半径、暖度。再加上暗角与褪色，把数码的干净变成胶片的呼吸。',
    foot: 'GRAIN · HALATION · FADE',
  },
  {
    id: 'library',
    n: '04',
    en: 'LOCAL LIBRARY',
    title: '像访达一样的照片库',
    body: '导入照片或整个文件夹，网格/列表、按胶片分组、收藏与颜色标签、搜索。原文件留在原位置，编辑按路径记住。',
    foot: 'FOLDERS · FAVORITES · TAGS',
  },
];

export const FLIM_FLOW = [
  {
    n: '01',
    en: 'INGEST',
    title: '导入',
    body: '照片或整个文件夹，拖进窗口即可。文件夹只建索引，不复制、不移动。',
  },
  {
    n: '02',
    en: 'DEVELOP',
    title: '显影',
    body: '选胶片，调光线/色彩/曲线。胶片 LUT 在调色之后叠加，保留高光与阴影层次。',
  },
  {
    n: '03',
    en: 'TEXTURE',
    title: '做质感',
    body: '加颗粒、光晕、暗角与褪色；用原图分割杆随时对比，直到质感刚好。',
  },
  {
    n: '04',
    en: 'EXPORT',
    title: '导出',
    body: '全分辨率 JPEG / PNG / TIFF / HEIC。预览与导出走同一条 Metal 管线。',
  },
];

export const FLIM_FAQS = [
  {
    q: '支持哪些 Mac？',
    a: '需要 macOS 14.0 或更新，当前发布包为 Apple Silicon（M1 / M2 / M3 / M4）原生 arm64。Intel 机器暂未提供单独安装包。',
  },
  {
    q: '需要联网吗？',
    a: '不需要。胶片 LUT、显影引擎、照片库和编辑记录都在本机。下载安装后可以完全离线使用。',
  },
  {
    q: '支持 RAW 吗？',
    a: '通过 macOS ImageIO / Core Image 解码 RAW、DNG、JPEG、PNG、TIFF、HEIC。RAW 会先转成 sRGB，再进入胶片显影管线，不提供相机厂商的 RAW 调参面板。',
  },
  {
    q: '和普通滤镜有什么区别？',
    a: '不是把一张 LUT 贴在照片上。OltraFilm 先做白平衡、曝光、对数域明暗和局部对比，再叠加 ACES 2.0 / Rec.709 显示 LUT，最后做曲线、色彩分级、通透、颗粒与光晕。每一步都可单独调。',
  },
  {
    q: '可以商用吗？',
    a: '应用代码采用 PolyForm Noncommercial 1.0.0，个人与非商业用途免费；商业使用需要单独授权。内置胶片 LUT 数据来自 spektrafilm，按上游 CC BY-SA 4.0 授权，详见仓库 THIRD_PARTY_NOTICES.md。',
  },
  {
    q: '为什么下载有多条线路？',
    a: '主线路走 GitHub Releases；站内中转由 ote.asia 边缘节点取包转发，给打不开 GitHub 的网络兜底；加速镜像是第三方 GitHub 加速站。三条线路内容完全一致，下载后请核对 SHA-256。',
  },
];
