// ===== マップデータ =====
const MAPS = [
  {
    id: 0,
    name: 'フィールド・オブ・グローリー',
    shortName: '砕氷戦',
    rule: '砕氷戦',
    color: 'var(--col-saihyo)',
    icon: '❄',
    notes: {
      overview: 'フィールド上に出現する「氷」を砕いてポイントを獲得するマップです。',
      points: [
        '「アイストーム」を破壊して情報値を獲得',
        '大きい氷（大氷）は獲得量が多いので優先！',
        '敵プレイヤーを倒すとポイント獲得、自分が倒されると減少',
      ],
      tips: [
        '氷が出現するタイミングに合わせて移動を開始しよう',
        '自陣の近くの氷を守りつつ、他陣営の氷も隙があれば狙ってみて！',
      ],
    },
  },
  {
    id: 1,
    name: 'オンサル・ハカイル',
    shortName: 'オンサル',
    rule: '終節戦',
    color: 'var(--col-onsal)',
    icon: '⚔️',
    notes: {
      overview: '「無垢の土地」を占拠して継続的に情報値を獲得する、独自の「純粋な奪い合い」がメインのルールです。',
      points: [
        '「無垢の土地」を有効化（占拠）することで情報値を継続的に獲得',
        '土地にはランク（B/A/S）があり、ランクが高いほど獲得ポイントが多い！',
        '一度占拠した土地は、一定量を出し尽くすと消滅します',
      ],
      tips: [
        '次にどこで土地が出るか予兆をしっかり確認しよう',
        'Sランクの土地は争奪が激しいので、仲間としっかり協力してね！',
      ],
    },
  },
  {
    id: 2,
    name: 'シールロック',
    shortName: 'シルロ',
    rule: '争奪戦',
    color: 'var(--col-seal)',
    icon: '🏴',
    notes: {
      overview: 'ランダムに起動する「アラガントームストーン」を占拠・維持するマップです。',
      points: [
        '起動した「トームストーン」から情報値を継続的に抽出',
        '敵プレイヤーを倒すとポイント加算、倒されると減少',
      ],
      tips: [
        'トームストーンの残り残量に注意。なくなりそうなら次の場所へ移動準備！',
        '他陣営に挟まれないようにマップをこまめに見よう',
      ],
    },
  },
  {
    id: 3,
    name: '外縁遺跡群',
    shortName: '制圧戦',
    rule: '制圧戦',
    color: 'var(--col-gaien)',
    icon: '🏛',
    notes: {
      overview: '6つの拠点を占拠しつつ、中央に出現するターゲットを破壊するルールです。',
      points: [
        '拠点を占拠すると情報値を継続的に獲得（占拠数が多いほど増加）',
        '中央の高台に出現する「オートマトン・セクター」や「迎撃システム」を破壊して大量ポイント',
        '敵プレイヤーを倒すとポイント獲得',
      ],
      tips: [
        '拠点を1つは確実に維持するのが基本だよ',
        '中央のターゲット出現タイミング（一定間隔）を覚えて、逃さず攻撃しよう！',
        '他陣営の拠点を奪って妨害するのも効果的',
      ],
    },
  },
];

const INITIAL_BASE_DATE = new Date(2026, 3, 17); // 基準日: 4/17 = 砕氷戦
let BASE_DATE = new Date(INITIAL_BASE_DATE);

const savedBaseDate = localStorage.getItem('fl_base_date');
if (savedBaseDate) {
  BASE_DATE = new Date(savedBaseDate);
}

function updateRotation(selectedIdx) {
  const today = new Date();
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const newBaseDate = new Date(d);
  newBaseDate.setDate(d.getDate() - selectedIdx);
  BASE_DATE = newBaseDate;
  localStorage.setItem('fl_base_date', BASE_DATE.toISOString());
  renderBanner(today);
  renderCalendar();
  alert('ローテーションを更新したよ！✨');
}

function resetRotation() {
  BASE_DATE = new Date(INITIAL_BASE_DATE);
  localStorage.removeItem('fl_base_date');
  const today = new Date();
  renderBanner(today);
  renderCalendar();
  alert('初期設定にリセットしたよ！❄️');
}

function getMapIndex(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.round((d - BASE_DATE) / (1000 * 60 * 60 * 24));
  return ((diff % 4) + 4) % 4;
}

function getFullName(map) {
  return `${map.name} (${map.rule})`;
}

let currentYear, currentMonth;

function init() {
  const now = new Date();
  currentYear  = now.getFullYear();
  currentMonth = now.getMonth();
  renderBanner(now);
  renderCalendar();
}

function renderBanner(date) {
  const idx = getMapIndex(date);
  const map = MAPS[idx];
  const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
  document.getElementById('banner-name').textContent = getFullName(map);
  document.getElementById('banner-name').style.color = map.color;
  const bannerDate = document.getElementById('banner-date');
  bannerDate.textContent = date.toLocaleDateString('ja-JP', opts);
  bannerDate.style.backgroundColor = map.color;
  bannerDate.style.color = '#fff'; // 背景色に合わせて白文字に
  
  document.getElementById('today-banner').style.borderColor = map.color;
  
  // ルールの色に応じてヘッダーの背景を変更
  const colorMap = {
    'var(--col-saihyo)': { rgb: '100, 181, 246', name: '砕氷戦' }, // 青
    'var(--col-onsal)': { rgb: '255, 183, 77', name: 'オンサル' }, // 橙
    'var(--col-seal)': { rgb: '129, 199, 132', name: 'シルロ' }, // 緑
    'var(--col-gaien)': { rgb: '186, 104, 200', name: '制圧戦' } // 紫
  };
  
  const colorInfo = colorMap[map.color];
  if (colorInfo) {
    const rgb = colorInfo.rgb;
    document.querySelector('header').style.background = `linear-gradient(135deg, rgba(${rgb}, 0.8), rgba(${rgb}, 0.6))`;
    // モーダルオーバーレイの背景もテーマカラーに変更
    document.getElementById('modal-overlay').style.background = `rgba(${rgb}, 0.25)`;
  }
}

function renderCalendar() {
  document.getElementById('cal-title').textContent = `${currentYear}年 ${currentMonth + 1}月`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay  = new Date(currentYear, currentMonth + 1, 0);
  const startDow = firstDay.getDay();
  for (let i = 0; i < startDow; i++) {
    const d = new Date(currentYear, currentMonth, 1 - (startDow - i));
    grid.appendChild(makeCell(d, true));
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    grid.appendChild(makeCell(new Date(currentYear, currentMonth, d), false));
  }
  const total = startDow + lastDay.getDate();
  const rem = total % 7;
  if (rem !== 0) {
    for (let i = 1; i <= (7 - rem); i++) {
      grid.appendChild(makeCell(new Date(currentYear, currentMonth + 1, i), true));
    }
  }
}

function makeCell(date, otherMonth) {
  const idx = getMapIndex(date);
  const map = MAPS[idx];
  const isToday = date.toDateString() === new Date().toDateString();
  const dow = date.getDay();
  const cell = document.createElement('div');
  cell.className = `cal-cell ${otherMonth ? 'other-month' : ''} ${isToday ? 'is-today' : ''} ${dow === 0 ? 'sun' : dow === 6 ? 'sat' : ''}`;
  cell.innerHTML = `
    <span class="day-num">${date.getDate()}</span>
    <div class="map-content">
      <span class="map-badge map-name-label" style="background:${otherMonth ? '' : map.color}22; color:${otherMonth ? '' : map.color}">
        ${map.icon}<br>${map.shortName}
      </span>
    </div>
  `;
  cell.onclick = () => openModal(date);
  return cell;
}

function openModal(date) {
  const idx = getMapIndex(date);
  const map = MAPS[idx];
  const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  document.getElementById('modal-date').textContent = date.toLocaleDateString('ja-JP', opts);
  document.getElementById('modal-map-name').innerHTML = `${map.icon} ${getFullName(map)}`;
  document.getElementById('modal-map-name').style.color = map.color;
  document.getElementById('modal-body').innerHTML = `
    <div class="modal-section">
      <h3>ルール概要</h3>
      <p>${map.notes.overview}</p>
    </div>
    <div class="modal-section">
      <h3>ポイント獲得</h3>
      <ul>${map.notes.points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>
    <div class="modal-section">
      <h3>戦意高揚システム</h3>
      <p>敵を倒したりアシストすると「戦意」が上がり、最大100（高揚V）まで蓄積します。攻撃力と回復量が最大1.5倍になるので、死なずに高揚を維持するのが勝利への近道です！</p>
    </div>
    <div class="modal-section">
      <h3>攻略のヒント</h3>
      <ul>${map.notes.tips.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>
  `;
  // カレンダーセルに選択中のスタイルを適用
  const selectedCells = document.querySelectorAll('.cal-cell.selected');
  selectedCells.forEach(cell => cell.classList.remove('selected'));
  // 選択された日付のセルを特定してスタイルを適用
  const today = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const currentCell = document.querySelector(`.cal-cell:not(.other-month) .day-num:contains("${day}")`).closest('.cal-cell');
  if (currentCell) {
    currentCell.classList.add('selected');
    // CSS変数で選択されたマップの色を設定
    document.documentElement.style.setProperty('--selected-map-color', map.color);
    // RGB値をCSS変数に設定
    const colorMap = {
      'var(--col-saihyo)': '100, 181, 246',
      'var(--col-onsal)': '255, 183, 77',
      'var(--col-seal)': '129, 199, 132',
      'var(--col-gaien)': '186, 104, 200',
    };
    document.documentElement.style.setProperty('--selected-map-rgb', colorMap[map.color]);
  }

  document.getElementById('modal-overlay').classList.add('open');
}

document.getElementById('modal-close').onclick = () => document.getElementById('modal-overlay').classList.remove('open');
document.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') document.getElementById('modal-overlay').classList.remove('open'); };
document.getElementById('btn-prev').onclick = () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); };
document.getElementById('btn-next').onclick = () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); };

// ===== 高揚ゲージ & 運勢占い =====
function generateFortune() {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  // 日付をシードに使用して疑似乱数を生成
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  
  const seedRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  const moraleValue = Math.floor(seedRandom(hash) * 101);
  
  let moralStatus = '';
  let statusIcon = '';
  
  if (moraleValue === 100) {
    moralStatus = '戦意高揚V';
    statusIcon = '⭐';
  } else if (moraleValue >= 80) {
    moralStatus = '戦意高揚IV';
    statusIcon = '✨';
  } else if (moraleValue >= 60) {
    moralStatus = '戦意高揚III';
    statusIcon = '🔥';
  } else if (moraleValue >= 40) {
    moralStatus = '戦意高揚II';
    statusIcon = '💪';
  } else if (moraleValue >= 20) {
    moralStatus = '戦意高揚I';
    statusIcon = '👊';
  } else {
    moralStatus = '戦意高揚なし';
    statusIcon = '😴';
  }
  
  const fortuneMessages = [
    `${statusIcon}\n${moralStatus}\n本日のあなたの\n戦場での活躍度です`,
    `${statusIcon}\n${moralStatus}\n高揚をキープして\n勝利に貢献しよう！`,
    `${statusIcon}\n${moralStatus}\nこの高揚で\nチームをサポートしよう`,
  ];
  
  const fortuneIndex = Math.floor(seedRandom(hash + 1) * fortuneMessages.length);
  const fortune = {
    icon: statusIcon,
    text: fortuneMessages[fortuneIndex],
  };
  
  return { moraleValue, fortune };
}

function renderFortune() {
  const { moraleValue } = generateFortune();
  
  const moralBar = document.getElementById('morale-bar');
  const moraleText = document.getElementById('morale-text');
  
  if (moralBar) {
    moralBar.style.setProperty('--morale-value', `${moraleValue}%`);
  }
  if (moraleText) {
    moraleText.textContent = `高揚ゲージ: ${moraleValue}%`;
  }
}

init();
renderFortune();
