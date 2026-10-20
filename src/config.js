// 調整用の数字は、すべてここに集める（DESIGN.md §8.6 ＋ 実装で必要になったもの）
// 共有するものは window.KP ひとつに置く
window.KP = window.KP || {};
KP.models = KP.models || [];   // 題材（src/models/*.js が push する）

export const CFG = {
  // ===== DESIGN.md §8.6 =====
  SNAP_PX: 70,            // 吸い付く距離（画面のピクセル）
  GHOST_ON_GRAB: false,   // 部品を持ったら置き場所を光らせるか
  PICK_MOVE_PX: 12,       // これ以上動いたら「つまむ」か「送る」かを決める
  RETURN_SEC: 0.35,       // 外れた部品がランナーに戻る時間（秒）
  SNAP_SEC: 0.18,         // 吸い付く時間（秒）
  HINT_GLOW_SEC: 2,       // ヒントで置き場所が光る時間（秒）
  HINT_NUDGE_SEC: 20,     // ヒントボタンが揺れて知らせるまでの秒数
  FORGOT_DELAY_SEC: 0.8,  // ふたがはまってから、入れ忘れの吹き出しが出るまでの秒数
  UNDO_SEC: 0.35,         // 「はずす」で部品がランナーへ戻る時間（秒）
  VIEW_YAW_MAX: 60,       // 部屋を左右に回せる角度（度）
  ROOM_RATIO: 0.55,       // 縦向きで上の部屋が占める割合
  RUNNER_ROWS: 2,         // ランナーの段の数
  MAX_SHAPES: 100,        // 1つの題材の図形の上限

  // ===== 題材のきまり（DESIGN.md §5.2・§6.2・§6.5。tools/check.html が使う）=====
  MIN_PARTS: 10,          // 部品の数の下限
  MAX_PARTS: 20,          // 部品の数の上限
  MAX_SHAPES_PER_PART: 8, // 1つの部品の図形の上限
  STAR_LIMITS: [12, 15],  // 部品がこの数以下なら ★1、★2、それより多ければ ★3
  FIRST_PARTS_MIN: 1,     // 最初に付けられる部品の最小数
  FIRST_PARTS_MAX: 3,     // 最初に付けられる部品の最大数
  TRAP_MIN: [1, 2, 3],    // 入れ忘れのわな（closes）の最小数。★1・★2・★3の順（§5.3）
  CHECK_UNDO_RATE: 0.2,   // 「どの順でも完成できる」のランダムな試しで、「はずす」を混ぜる割合
  CHECK_RUN_STEP_LIMIT: 2000, // 1回の試しで動かす回数の上限（これを超えたら詰まったとみなす）
  CHECK_RANDOM_RUNS: 1000,// 「どの順でも詰まらない」を確かめる回数
  OVERLAP_BAD_RATIO: 0.85,// これ以上めり込んだ図形（小さいほうに対する割合）は不合格
  HIDDEN_RATIO: 0.98,     // これ以上ほかの部品の中に隠れた図形は「見えない」とみなす

  // ===== 画面のわけかた =====
  MAX_DPR: 2,             // 画面の細かさの上限（devicePixelRatio をここで止める）
  RUNNER_GAP_TOP_PX: 40,  // 名前の札の下から、ランナーの絵が始まるまでの余白（px）
  RUNNER_GAP_BOTTOM_PX: 40,// ランナーの絵の下の余白（バーが入る。px）
  SCROLLBAR_GAP_PX: 14,   // ランナーの絵の下端から、バーまでのすき間（px）

  // ===== ランナー =====
  CELL: 1.25,             // ランナーの1マスの大きさ（ランナー内の単位）
  RUNNER_FILL: 0.68,      // 題材の部品の大きさの中央値が、マスの中で占める割合（ぜんぶの部品に同じ倍率をかける基準）
  RUNNER_MIN_FILL: 0.28,  // 小さい部品をこれより小さく見せない（マスに対する割合。ボタンや目が見えるように）
  RUNNER_MAX_FILL: 0.84,  // 部品が区画（1マス・横2マス・縦2段・2×2）に収まる上限（区画に対する割合。超えたら大きい区画へ）
  RUNNER_PART_DROP: 0.08, // 番号の札と重ならないよう、部品をマスの中で下げる量（ランナー内の単位）
  RUNNER_TILT: [0.42, -0.55, 0], // ランナーの部品を傾ける角度（ラジアン x,y,z）
  RUNNER_VIEW_PAD: 0.5,   // ランナーの上下に足す余白（ランナー内の単位）
  RUNNER_SCROLL_PAD: 0.3, // ランナーの横に足す余白
  RUNNER_FRAME_COLOR: '#b9bfc6', // ランナーの枠の色
  RUNNER_GATE_COLOR: '#c4c9cf',  // ゲート（枠と部品をつなぐ棒）の色
  GATE_STUB_RATIO: 0.3,   // 部品を外したあとに残るゲートの切り口の長さ（元の何割か）
  LABEL_COLOR: '#6b737c', // マスの番号（A1、A2…）の色
  LABEL_SIZE: 0.5,        // マスの番号の札の横幅（ランナー内の単位）
  GLOW_COLOR: '#ffe14d',  // ヒントでランナーのマスが光る色
  HINT_SCROLL_SEC: 0.4,   // ヒントでランナーがその部品まで動く時間（秒）
  HINT_GLOW_DELAY_SEC: 0.15, // ランナーが止まってから置き場所が光るまでの間（秒）
  HINT_PULSE_SEC: 0.6,    // ランナーのマスが光ってふくらむ周期（秒）
  HINT_PULSE_SCALE: 0.12, // ふくらむ大きさ（1 に足す割合）

  // ===== 操作 =====
  DRAG_LIFT_PX: 40,       // 引っぱっている部品を、指より上に見せる量（指で隠れないように。px）
  DRAG_DEPTH_RATIO: 0.5,  // 部屋の中で引っぱる部品の奥行き（題材の半径の何割だけ手前か）
  YAW_PER_PX: 0.008,      // 部屋をスワイプしたときの回る量（ラジアン/px）
  YAW_EASE: 10,           // 部屋が回るなめらかさ（大きいほど速く追いつく）
  TAP_HOP_SEC: 0.5,       // 部品を押しただけのときの、ぴょんの時間（秒）
  TAP_HOP_HEIGHT: 0.15,   // ぴょんの高さ（ランナー内の単位）
  GHOST_TAP_SEC: 1.6,     // GHOST_ON_GRAB のとき、押しただけで置き場所が光る時間（秒）
  CARD_NAME_FULL: 8,      // ずかんのカードで、この文字数までは名前を小さくしない
  CARD_NAME_FIT: 7.5,     // それより長い名前は、文字の大きさを（この数 ÷ 文字数）にする
  NAME_MIN_PX: 11,        // 名前の札の文字を、長い名前のときに小さくする下限（px）
  TOAST_SEC: 1.3,         // 「うえへ ひっぱってね」の札が出ている時間（秒）
  SETTLE_SEC: 0.22,       // はまったあとの、ぷるっの時間（秒）
  SETTLE_SCALE: 0.08,     // ぷるっの大きさ（1 に足す割合）
  FINISH_DELAY_SEC: 0.35, // 最後の1個がはまってから「できた！」までの間（秒）
  VIBRATE_GRAB_MS: 15,    // 外れたときの振動（ミリ秒）
  VIBRATE_SNAP_MS: 25,    // はまったときの振動（ミリ秒）
  VIBRATE_FINISH: [40, 60, 40, 60, 80], // できたときの振動

  // ===== 部屋のカメラ =====
  CAM_FOV_PORTRAIT: 40,   // 縦長の画面のときの画角（度）
  CAM_FOV_LANDSCAPE: 30,  // 横長の画面のときの画角（度）
  CAM_ASPECT_SWITCH: 0.9, // 部屋の縦横比がこれより小さければ縦長の画角
  CAM_ELEV: 0.52,         // 見下ろす角度（ラジアン）
  CAM_BASE_YAW: 0.62,     // はじめの横の向き（ラジアン）
  CAM_FIT_FOOTPRINT: 0.85,// 題材の足もとの広がり（対角線の半分）に、どれだけ余裕を見るか（1=外接円。回したときの見切れ対策）
  CAM_SAFE_PORTRAIT: { l: 0.05, r: 0.05, t: 0.26, b: 0.14 }, // 縦長の画面で、題材を収める範囲（部屋の矩形に対する余白の割合。上は「できた！」の文字、下はボタンの分）
  CAM_SAFE_LANDSCAPE: { l: 0.06, r: 0.06, t: 0.17, b: 0.17 },// 横長の画面（タブレット）で、同じもの
  CAM_FIT_ITER: 14,       // 題材の大きさからカメラの距離を決めるときの繰り返し回数
  PAD_SIZE: [4.2, 0.25, 3.6], // 白い置き台の大きさ
  PAD_POS: [0.2, -0.12, 0.2], // 白い置き台の位置

  // ===== 置き場所のゴースト（ヒントで光る）=====
  GHOST_COLOR: 0x7ff0ff,  // ゴーストの色
  GHOST_OPACITY: 0.25,    // ゴーストのうすさ（真ん中）
  GHOST_PULSE_AMP: 0.2,   // ゴーストの点滅の振れ幅
  GHOST_PULSE_MS: 180,    // ゴーストの点滅の速さ（小さいほど速い）

  // ===== 入れ忘れの吹き出しと「はずす」（DESIGN.md §5.3）=====
  FORGOT_SHAKE_SEC: 2.4,  // 吹き出しが小さく揺れる周期（秒）
  FORGOT_SHAKE_DEG: 2.5,  // 吹き出しの揺れる角度（度）
  FORGOT_BUBBLE_SCALE: 0.9, // 吹き出しの大きさ（文字・絵・余白・角丸ぜんぶ。1 が元の大きさ）
  UNDO_GLOW_SEC: 1.8,     // 「はずす」ボタンがゆっくり光る周期（秒）
  UNDO_HINT_GLOW_SEC: 2,  // ヒントで「はずす」ボタンを強く光らせる時間（秒）
  VIBRATE_UNDO_MS: 15,    // 「はずす」で外れたときの振動（ミリ秒）

  // ===== できた！ =====
  CONFETTI_COUNT: 140,    // 紙吹雪の数
  CONFETTI_COLORS: [0xf25c54, 0xf7b32b, 0x4fc3e8, 0x5fd27a, 0xb48ef0, 0xffffff], // 紙吹雪の色
  SPIN_SPEED: 9,          // spin の回る速さ（ラジアン/秒）
  BOUNCE_HEIGHT_RATIO: 0.14,  // bounce：跳ねる高さ（題材の高さに対する割合）
  BOUNCE_PERIOD_SEC: 1.1,     // bounce：1回跳ねる周期（秒）
  BOUNCE_AIR_RATIO: 0.68,     // bounce：周期のうち空中にいる割合（残りは着地のつぶれ）
  BOUNCE_SQUASH: 0.12,        // bounce：着地でつぶれる大きさ（縦が縮む割合）
  LAUNCH_RISE_RATIO: 0.32,    // launch：浮き上がる高さ（動く部分の高さに対する割合）
  LAUNCH_SHAKE_SEC: 0.6,      // launch：飛ぶ前にぶるぶるする時間（秒）
  LAUNCH_SHAKE_AMP: 0.04,     // launch：ぶるぶるの大きさ
  LAUNCH_UP_SEC: 1.1,         // launch：浮き上がる時間（秒）
  LAUNCH_HOVER_SEC: 0.5,      // launch：上でとどまる時間（秒）
  LAUNCH_DOWN_SEC: 1.5,       // launch：おりてくる時間（秒）
  LAUNCH_REST_SEC: 1.2,       // launch：おりてから次に飛ぶまでの休み（秒）
  SMOKE_COLOR: 0xf4f4f4,      // 煙の玉の色
  SMOKE_LIFE_SEC: 1.1,        // 煙の玉が消えるまでの時間（秒）
  SMOKE_RATE: 38,             // 煙の玉が出る数（個/秒。飛んでいる間）
  SMOKE_SIZE_RATIO: 0.16,     // 煙の玉の大きさ（動く部分の幅に対する割合）
  SMOKE_GROW: 2.6,            // 煙の玉が消えるまでにふくらむ倍率
  SMOKE_OPACITY: 0.85,        // 煙の玉のはじめの濃さ
  SMOKE_MAX: 90,              // 煙の玉の数の上限（スマホを軽くするため）
  LIGHT_PERIOD_SEC: 1.3,      // light：点滅の周期（秒）
  LIGHT_MIN: 0.12,            // light：暗いときの光の強さ
  LIGHT_MAX: 1.25,            // light：明るいときの光の強さ
  LIGHT_PHASE_STEP: 0.9,      // light：部品ごとに点滅をずらす量（ラジアン）
  LIGHT_WHITEN: 0.35,         // light：光る色を白に近づける割合
  LIGHT_SEQ_STEP_SEC: 0.8,    // light の seq：1つが光っている時間（秒）
  LIGHT_SEQ_FADE_SEC: 0.15,   // light の seq：点く・消えるときにかける時間（秒）
  LIGHT_SEQ_REST_SEC: 0.5,    // light の seq：ぜんぶ光ったあと、全部消えて休む時間（秒）
  LIGHT_SEQ_OFF: 0.05,        // light の seq：番でないときの光の強さ
  DRIVE_DIST_RATIO: 0.3,      // drive：走る距離（進む向きの長さに対する割合）。カメラは走るぶんも入るように引く（assemble.js）
  DRIVE_GO_SEC: 1.9,          // drive：走って行く時間（秒）
  DRIVE_PAUSE_SEC: 0.5,       // drive：止まっている時間（秒）
  DRIVE_BACK_SEC: 1.9,        // drive：もどる時間（秒）
  STEAM_COLOR: 0xffffff,      // steam：湯気の玉の色
  STEAM_OPACITY: 0.8,         // steam：湯気の玉のいちばん濃いときの濃さ
  STEAM_RATE: 6,              // steam：湯気の玉が出る数（個/秒。出る場所ごと）
  STEAM_LIFE_SEC: 2.2,        // steam：湯気の玉が消えるまでの時間（秒）
  STEAM_SIZE_RATIO: 0.075,    // steam：湯気の玉の大きさ（題材の高さに対する割合）
  STEAM_RISE_RATIO: 0.22,     // steam：上へ立ちのぼる速さ（1秒に、題材の高さの何割か）
  STEAM_GROW: 2,              // steam：消えるまでにふくらむ倍率
  STEAM_SWAY_RATIO: 0.18,     // steam：横にゆれる速さ（1秒に、題材の高さの何割か）
  STEAM_MAX: 40,              // steam：湯気の玉の数の上限（スマホを軽くするため）
  POP_HEIGHT_RATIO: 0.3,      // pop：飛び出す高さ（その部品の高さに対する割合）
  POP_UP_SEC: 0.16,           // pop：飛び出す時間（秒）
  POP_HOLD_SEC: 0.9,          // pop：上で止まっている時間（秒）
  POP_DOWN_SEC: 0.4,          // pop：もどる時間（秒）
  POP_REST_SEC: 1.1,          // pop：もどってから次に飛び出すまでの休み（秒）
  POP_WOBBLE: 0.04,           // pop：上でゆれる大きさ（飛び出す高さに対する割合）
  POP_STAGGER_SEC: 0.12,      // pop：部品が2つ以上のとき、飛び出しをずらす時間（秒）
  SHAKE_ON_SEC: 1.0,          // shake：ゆれている時間（秒。ベルが鳴っているあいだ）
  SHAKE_REST_SEC: 0.7,        // shake：ゆれがとまっている時間（秒）
  SHAKE_FREQ: 62,             // shake：ゆれる速さ（ラジアン/秒。大きいほど細かくゆれる）
  SHAKE_AMP_RATIO: 0.016,     // shake：横にゆれる大きさ（題材の高さに対する割合）
  SHAKE_TILT_DEG: 1.2,        // shake：かたむく大きさ（度）
  SWING_DEG: 22,              // swing：振れ幅の角度（度。oneway のときは、付けた形から上がる最大の角度）
  SWING_PERIOD_SEC: 2.6,      // swing：1往復の秒数
  FINALE_TURN_DELAY_SEC: 2,  // できたあと、全体をゆっくり回し始めるまでの秒数
  FINALE_TURN_AMP: 0.5,   // ゆっくり回すときの振れ幅（ラジアン）
  FINALE_TURN_PERIOD_SEC: 11, // ゆっくり回すときの1往復の秒数
  FINALE_TURN_RESUME_SEC: 3,  // 指で回したあと、ゆっくり回すのを再開するまでの秒数

  // ===== ずかん（はじめの画面）=====
  ALBUM_ART_PX: 320,      // 題材のカードの絵の大きさ（px。実際の表示より大きめに描いておく）
  ALBUM_ART_FOV: 28,      // カードの絵の画角（度）
  ALBUM_ART_ELEV: 0.45,   // カードの絵を見下ろす角度（ラジアン）
  ALBUM_ART_YAW: 0.62,    // カードの絵の横の向き（ラジアン）
  ALBUM_ART_SAFE: 0.08,   // カードの絵の余白（絵の大きさに対する割合）
  ALBUM_SILHOUETTE: 0x232830, // まだ作っていない題材のシルエットの色
  ALBUM_HOLD_MS: 1200,    // ⚙を長押しして「きろくを けす」が出るまでの時間（ミリ秒）
  ALBUM_STORAGE_KEY: 'kumitate.done', // 作った回数をしまう localStorage の名前

  // ===== 音 =====
  SOUND_VOLUME: 1,        // 効果音全体の大きさにかける数
};

KP.CFG = CFG;
