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

const TAG = 'v1.5';
const REPO = 'https://github.com/Ote65/OltraFlim';
const RELEASE = `${REPO}/releases/download/${TAG}`;
const RELAY = 'https://ote.asia/dl';
const MIRROR = 'https://gh-proxy.com';

/* Windows 测试版走独立仓库与独立 tag，与 macOS 正式版不是一条发布线 */
const WIN_TAG = 'v0.1.0-win';
const WIN_REPO = 'https://github.com/Ote65/spektraFilmOltra';
const WIN_RELEASE = `${WIN_REPO}/releases/download/${WIN_TAG}`;

/* iOS 内测版与 Windows 版共用发布仓库，tag 用 -ios 后缀区分 */
const IOS_TAG = 'v0.7.0-ios';
const IOS_RELEASE = `${WIN_REPO}/releases/download/${IOS_TAG}`;

export const OLTRAFILM_RELEASE = {
  name: '欧胶片 OltraFilm',
  en: 'OLTRAFILM',
  version: '1.5',
  build: '6',
  date: '2026-11-18',
  channel: '正式版',
  system: 'macOS 14.0 或更新',
  arch: 'Apple Silicon（M1 / M2 / M3 / M4）',
  repo: REPO,
  releasePage: `${REPO}/releases/tag/${TAG}`,
  requirements: [
    ['SYSTEM', 'macOS 14.0 或更新'],
    ['CHIP', 'Apple Silicon（M1 / M2 / M3 / M4）'],
    ['INPUT', 'RAW · DNG · JPEG · HEIC · 视频 MOV / MP4'],
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
    /* 复制给可执行命令的 AI Agent 的自动安装提示词（Windows 测试版） */
    agentPrompt: [
      '帮我在当前电脑上下载并安装 OltraFilm Windows 测试版 0.1.0（Windows 10 / 11 x64）。请真实执行每条命令，不要臆造结果；需要用户本人操作的地方，停下来交给用户。',
      '',
      '1. 探测线路：对下面三个地址各发一次 HTTP Range 请求（只取 1 字节，超时 5 秒），记录可用性与耗时，选最快的一条：',
      '   A 直连 GitHub：https://github.com/Ote65/spektraFilmOltra/releases/download/v0.1.0-win/SpektraOltra-Setup-0.1.0.exe',
      '   B 站内中转：https://ote.asia/dl/SpektraOltra-Setup-0.1.0.exe',
      '   C 加速镜像：https://gh-proxy.com/https://github.com/Ote65/spektraFilmOltra/releases/download/v0.1.0-win/SpektraOltra-Setup-0.1.0.exe',
      '2. 下载 EXE 安装包到本地，校验 SHA-256 必须等于 c8332f8f18f6789f4bb23bc8ee775bcbb0af4a763ca3c0adc197846e01b6ce51；不一致换线路重下，三次仍不一致向用户报告。',
      '3. 安装：优先以静默参数运行安装程序（NSIS：`SpektraOltra-Setup-0.1.0.exe /S`）；静默失败时引导用户手动走完安装向导。安装包未做数字签名，遇到 Windows SmartScreen 蓝框时，指导用户点「更多信息」→「仍要运行」。',
      '4. 启动验证：从开始菜单启动 SpektraOltra，确认窗口正常出现；首次启动会做一次 Python 引擎预热（约 20–40 秒），前几十秒渲染偏慢属正常。',
      '5. 汇报：所用线路、文件路径、SHA-256 校验结果、安装与启动状态；失败时贴出安装器或引擎日志关键行。',
    ].join('\n'),
  },
  /* 并列的 iOS 内测入口（0.7.0，原生 SwiftUI 暗房 + 视频显影 + 光谱显影引擎） */
  ios: {
    name: '欧胶片 OltraFilm（iOS 版）',
    version: '0.7.0',
    build: '28',
    date: '2026-11-18',
    channel: '内测版',
    system: 'iOS 17.0 或更新',
    arch: 'iPhone（arm64）',
    repo: WIN_REPO,
    releasePage: `${WIN_REPO}/releases/tag/${IOS_TAG}`,
    requirements: [
      ['SYSTEM', 'iOS 17.0 或更新'],
      ['DEVICE', 'iPhone（arm64）'],
      ['INPUT', 'RAW · DNG · JPEG · HEIC · 视频 MOV / MP4'],
      ['STATUS', '内测版 · 开发签名'],
    ],
    notices: [
      '① 点上方按钮下载 IPA（16.9 MB），也可以在 iPhone 的「文件」App 里直接保存。',
      '② 这个包是 Apple 开发签名：只有已登记在开发者设备列表里的 iPhone 能直接安装，其他手机需要用 Sideloadly / AltStore 等工具重签。',
      '③ 重签：电脑装 Sideloadly，数据线连上 iPhone，把 IPA 拖进窗口，输入自己的 Apple ID 后开始安装。',
      '④ 装完在手机「设置 → 通用 → VPN 与设备管理」里信任对应的开发者证书，才能打开 App。',
      '⑤ 首次启动允许访问相册，就可以导入照片与视频；首页点顶部「照片库」切到视频库，选中视频进入显影台，调完点「渲染视频」导出到相册。',
      '⑥ 开发签名的描述文件有效期较短（本包到 2026-11-24），过期后用同样步骤重签即可，照片与编辑记录不会丢。',
    ],
    whatsNew: [
      {
        en: 'VIDEO DEVELOP',
        t: '视频显影上台',
        d: '首页点顶部「照片库」即可切到视频库，映射系统相册里的全部视频。点视频进入显影台：上方胶片与相纸轨道，下方显影强度、对比度、色彩浓度、印相冷暖、颗粒等十余条参数。',
        foot: 'PHOTO LIBRARY · FILM STOCK',
      },
      {
        en: 'STILL PREVIEW',
        t: '暂停即显影当前帧',
        d: '播放时看原片，暂停或拖动进度条停下后，只对当前这一帧做单帧显影并叠上去；参数改动只重显影这一帧，不碰全片。播放胶囊左侧播放/暂停、中间进度可拖动。',
        foot: 'FRAME ACCURATE',
      },
      {
        en: 'FULL RENDER',
        t: '全片逐帧渲染',
        d: '点「渲染视频」选编码档位：HEVC 标准/高码率，或 ProRes 422 LT 母版。逐帧过同一条 Metal 管线，带手感反馈的跳动百分比，完成后成片直接写回相册。',
        foot: 'HEVC · PRORES LT',
      },
      {
        en: 'FILM PIPELINE',
        t: '照片显影同源',
        d: '视频与照片共用四段 65³ LUT 与密度域颗粒模型：显影强度、动态范围走实时参数，色彩浓度/画面对比度/印相冷暖映射到显示域，颗粒逐帧独立重随机。',
        foot: '65³ LUT · DENSITY GRAIN',
      },
      {
        en: 'STABLE EXPORT',
        t: '竖拍与母版不再黑屏',
        d: '竖拍改用传感器方向解码 + 输出轨道 transform，绕开 CPU 合成器对 10-bit HEVC 产出黑帧；导出统一声明 Rec.709 色彩属性，ProRes 母版在相册里也有画面。',
        foot: 'NO BLACK FRAMES',
      },
      {
        en: 'CRASH FREE',
        t: '高分辨率不再闪退',
        d: '显影纹理复用、物理颗粒精度降到 16F，峰值显存显著下降：高分辨率照片与视频显影不再被系统杀后台。',
        foot: '16F · TEXTURE REUSE',
      },
    ],
    downloads: {
      ipa: {
        file: 'Spektrafilm-0.7.0-ios.ipa',
        label: 'IPA 安装包',
        size: '16.9 MB',
        sha256: '0d97a5d7ae0a194cdceef5d5f14b78956e0c6dd67701564b7a0e2d1bbaa9486e',
        github: `${IOS_RELEASE}/Spektrafilm-0.7.0-ios.ipa`,
        relay: `${RELAY}/Spektrafilm-0.7.0-ios.ipa`,
        mirror: `${MIRROR}/${IOS_RELEASE}/Spektrafilm-0.7.0-ios.ipa`,
      } satisfies FlimDownload,
    },
    /* 复制给可执行命令的 AI Agent 的自动安装提示词：测速选线路、下载 IPA 与
       签名工具、引导用户登录 Apple ID 完成签名安装。URL 与上方 downloads
       同源，改版本时一起改。 */
    agentPrompt: [
      '帮我在当前电脑上下载并安装 OltraFilm iOS 内测版 v0.7.0。请真实执行每条命令，不要臆造结果；需要用户本人操作或输入的地方，停下来问用户。',
      '',
      '1. 探测线路：对下面三个地址各发一次 HTTP Range 请求（只取 1 字节，超时 5 秒），记录可用性与耗时，选最快的一条：',
      '   A 直连 GitHub：https://github.com/Ote65/spektraFilmOltra/releases/download/v0.7.0-ios/Spektrafilm-0.7.0-ios.ipa',
      '   B 站内中转：https://ote.asia/dl/Spektrafilm-0.7.0-ios.ipa',
      '   C 加速镜像：https://gh-proxy.com/https://github.com/Ote65/spektraFilmOltra/releases/download/v0.7.0-ios/Spektrafilm-0.7.0-ios.ipa',
      '2. 下载 IPA：用最快线路下载到本地，校验 SHA-256 必须等于 0d97a5d7ae0a194cdceef5d5f14b78956e0c6dd67701564b7a0e2d1bbaa9486e；不一致就换线路重下，三次仍不一致向用户报告。',
      '3. 选择安装方式：',
      '   - 若本机是 macOS 且装有 Xcode、这台 iPhone 已登记在开发者设备列表：直接用 `xcrun devicectl device install app --device <UDID> <IPA路径>` 安装（手机需解锁并保持前台），跳过第 4 步。',
      '   - 否则：打开 https://sideloadly.io 下载对应系统（macOS / Windows）的 Sideloadly 安装包并安装。',
      '4. 用 Sideloadly 签名安装：启动 Sideloadly，把 IPA 拖进界面；请用户输入自己的 Apple ID 完成登录——密码与双重验证码必须由用户本人输入，你不要代填、不要记录；用数据线连接 iPhone 并保持解锁亮屏，点 Start，跟踪进度直到 100%。',
      '5. 信任证书：指导用户在 iPhone「设置 → 通用 → VPN 与设备管理」里信任对应开发者证书，然后打开 App。',
      '6. 汇报：输出所用线路、IPA 路径、SHA-256 校验结果、安装状态；失败时贴出 Sideloadly 日志关键行（macOS 在 ~/Library/Logs/sideloadly.log）。',
    ].join('\n'),
  },
  downloads: {
    dmg: {
      file: 'OltraFlim-1.5.dmg',
      label: 'DMG 安装包',
      size: '12.7 MB',
      sha256: 'f058d8c021f6eb7b9cf30ba31cc4fff039ba0901e99971d9bf5f2aac2b5f2f61',
      github: `${RELEASE}/OltraFlim-1.5.dmg`,
      relay: `${RELAY}/OltraFlim-1.5.dmg`,
      mirror: `${MIRROR}/${RELEASE}/OltraFlim-1.5.dmg`,
    } satisfies FlimDownload,
    zip: {
      file: 'OltraFlim-1.5.zip',
      label: 'ZIP 免挂载',
      size: '12.8 MB',
      sha256: '0952d862467bca9df603fc88b1e912afa262b3a52d923b0fd77a18e65f026585',
      github: `${RELEASE}/OltraFlim-1.5.zip`,
      relay: `${RELAY}/OltraFlim-1.5.zip`,
      mirror: `${MIRROR}/${RELEASE}/OltraFlim-1.5.zip`,
    } satisfies FlimDownload,
  } satisfies Record<'dmg' | 'zip', FlimDownload>,
  /* 复制给可执行命令的 AI Agent 的自动安装提示词（macOS 正式版） */
  agentPrompt: [
    '帮我在当前电脑上下载并安装 OltraFilm macOS 正式版 1.5（Apple Silicon，macOS 14+）。请真实执行每条命令，不要臆造结果；需要用户本人操作的地方，停下来交给用户。',
    '',
    '1. 探测线路：对下面三个地址各发一次 HTTP Range 请求（只取 1 字节，超时 5 秒），记录可用性与耗时，选最快的一条：',
    '   A 直连 GitHub：https://github.com/Ote65/OltraFlim/releases/download/v1.5/OltraFlim-1.5.dmg',
    '   B 站内中转：https://ote.asia/dl/OltraFlim-1.5.dmg',
    '   C 加速镜像：https://gh-proxy.com/https://github.com/Ote65/OltraFlim/releases/download/v1.5/OltraFlim-1.5.dmg',
    '2. 下载 DMG 到本地，校验 SHA-256 必须等于 f058d8c021f6eb7b9cf30ba31cc4fff039ba0901e99971d9bf5f2aac2b5f2f61；不一致换线路重下，三次仍不一致向用户报告。',
    '3. 安装：`hdiutil attach` 挂载 DMG，把 Spektrafilm.app 复制到 /Applications，再 `hdiutil detach` 卸载；如被 Gatekeeper 拦截，用 `xattr -dr com.apple.quarantine /Applications/Spektrafilm.app` 清除隔离属性后重试。',
    '4. 启动验证：`open -a Spektrafilm` 确认窗口正常出现；首次启动会做一次引擎预热，前几十秒渲染偏慢属正常。',
    '5. 汇报：所用线路、文件路径、SHA-256 校验结果、安装与启动状态；失败时贴出关键错误行。',
  ].join('\n'),
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
    a: '不可以直接商用。项目采用分层许可：引擎是上游 spektrafilm 的移植衍生，沿用 GPLv3；自研前端（iOS / Windows / 桌面界面层）按 CC BY-NC-SA 4.0 授权——禁止商用，且任何使用或改动前端代码的分发都必须以同许可开源完整源代码并署名；胶片 LUT 与 profile 数据按上游 CC BY-SA 4.0。商业使用需与作者单独协商，详见各仓库 LICENSE 与 LICENSE.FRONTEND。',
  },
  {
    q: '为什么下载有多条线路？',
    a: '主线路走 GitHub Releases；站内中转由 ote.asia 边缘节点取包转发，给打不开 GitHub 的网络兜底；加速镜像是第三方 GitHub 加速站。三条线路内容完全一致，下载后请核对 SHA-256。',
  },
];
