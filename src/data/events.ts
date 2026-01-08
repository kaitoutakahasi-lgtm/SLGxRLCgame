import { GameEvent, PersonalityType, EventDialogue, CharacterEventSet } from '../types';

// ===========================
// イベントデータ
// ===========================

// ===========================
// シナリオイベント（10個）- ストーリー進行
// ===========================

export const SCENARIO_EVENTS: GameEvent[] = [
  {
    id: 'scenario_01_prologue',
    name: 'アイドルへの第一歩',
    description: 'トレーニング開始',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: ['今日からアイドル育成が始まる。'],
    dialogues: [
      { speaker: 'narrator', text: '今日からアイドル育成が始まる。' },
      { speaker: 'producer', text: '準備はいいかな？今日から本格的なトレーニングが始まるよ。' },
      { speaker: 'player', text: 'はい！頑張ります！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'week', week: 1 },
    choices: [
      { id: 'prologue_a', text: '全力で頑張ります！', effects: [{ type: 'condition', target: 'motivation', value: 20 }, { type: 'stats', target: 'passion', value: 10 }] },
      { id: 'prologue_b', text: '着実に成長したい', effects: [{ type: 'stats', target: 'clever', value: 15 }, { type: 'condition', target: 'mental', value: 10 }] },
    ],
    isRepeatable: false,
    priority: 1000,
  },
  {
    id: 'scenario_02_first_lesson',
    name: '初めてのレッスン',
    description: '基礎を学ぶ',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'player', text: 'えっと...こうですか？', emotion: 'shy' },
      { speaker: 'producer', text: 'うん、いい感じだよ。基礎が一番大事だからね。' },
      { speaker: 'player', text: '難しいけど...楽しいです！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'week', week: 5 },
    choices: [
      { id: 'lesson_a', text: 'もっと練習したい！', effects: [{ type: 'stats', target: 'passion', value: 15 }, { type: 'condition', target: 'fatigue', value: 10 }] },
      { id: 'lesson_b', text: '復習をしっかり', effects: [{ type: 'stats', target: 'clever', value: 15 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_03_first_wall',
    name: '最初の壁',
    description: 'スランプの兆候',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'player', text: '最近、成長してる実感がなくて...', emotion: 'sad' },
      { speaker: 'producer', text: '壁にぶつかってるんだね。でも、それは成長の証だよ。' },
      { speaker: 'player', text: 'そう...なんですか？' },
    ],
    triggerCondition: { type: 'week', week: 10 },
    choices: [
      { id: 'wall_a', text: '今こそ追い込み時！', effects: [{ type: 'stats', target: 'passion', value: 25 }, { type: 'condition', target: 'fatigue', value: 15 }] },
      { id: 'wall_b', text: '少し休もう', effects: [{ type: 'condition', target: 'fatigue', value: -20 }, { type: 'condition', target: 'mental', value: 15 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_04_rival',
    name: 'ライバルとの出会い',
    description: '刺激的な存在',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '練習中、同年代のアイドル候補生と出会った。' },
      { speaker: 'player', text: 'あの子、すごく上手い...', emotion: 'surprised' },
      { speaker: 'player', text: '負けたくない...！', emotion: 'angry' },
    ],
    triggerCondition: { type: 'week', week: 15 },
    choices: [
      { id: 'rival_a', text: '絶対に負けない！', effects: [{ type: 'condition', target: 'motivation', value: 25 }, { type: 'stats', target: 'passion', value: 15 }] },
      { id: 'rival_b', text: 'いいところを学ぼう', effects: [{ type: 'stats', target: 'clever', value: 20 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_05_midterm',
    name: '中間審査',
    description: '実力を試される',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '育成期間の折り返し、中間審査の日。' },
      { speaker: 'player', text: '緊張する...', emotion: 'shy' },
      { speaker: 'producer', text: '今まで頑張ってきたことを、そのまま出せばいい。' },
    ],
    triggerCondition: { type: 'week', week: 24 },
    choices: [
      { id: 'mid_a', text: '全力でアピール！', effects: [{ type: 'stats', target: 'passion', value: 20 }, { type: 'stats', target: 'cute', value: 15 }] },
      { id: 'mid_b', text: '冷静に実力を出す', effects: [{ type: 'stats', target: 'cool', value: 20 }, { type: 'stats', target: 'clever', value: 15 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_06_possibility',
    name: '新たな可能性',
    description: '才能の開花',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'producer', text: '最近、表現の幅が広がってきたね。' },
      { speaker: 'player', text: 'そうですか？', emotion: 'shy' },
      { speaker: 'producer', text: '新しいことに挑戦してみないか？' },
    ],
    triggerCondition: { type: 'week', week: 29 },
    choices: [
      { id: 'poss_a', text: 'ダンスを極めたい', effects: [{ type: 'stats', target: 'passion', value: 25 }, { type: 'stats', target: 'cool', value: 15 }] },
      { id: 'poss_b', text: '表現力を磨きたい', effects: [{ type: 'stats', target: 'elegant', value: 25 }, { type: 'stats', target: 'cute', value: 15 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_07_setback',
    name: '挫折',
    description: '大きな失敗',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'player', text: '...ごめんなさい', emotion: 'sad' },
      { speaker: 'producer', text: '失敗は誰にでもある。大事なのはここからだ。' },
      { speaker: 'player', text: 'でも...みんなに迷惑を...', emotion: 'sad' },
    ],
    triggerCondition: { type: 'week', week: 34 },
    choices: [
      { id: 'set_a', text: 'もう一度やり直す', effects: [{ type: 'condition', target: 'motivation', value: 20 }, { type: 'stats', target: 'passion', value: 20 }] },
      { id: 'set_b', text: '原因を分析する', effects: [{ type: 'stats', target: 'clever', value: 25 }, { type: 'condition', target: 'mental', value: 15 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_08_comeback',
    name: '再起',
    description: '立ち上がる時',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'player', text: 'プロデューサーさん、私...決めました。' },
      { speaker: 'producer', text: 'うん、聞かせてくれ。' },
      { speaker: 'player', text: '絶対に諦めない！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'week', week: 39 },
    choices: [
      { id: 'come_a', text: '強い自分になる', effects: [{ type: 'stats', target: 'passion', value: 30 }, { type: 'condition', target: 'motivation', value: 30 }] },
      { id: 'come_b', text: '自分らしさを大切に', effects: [{ type: 'stats', target: 'elegant', value: 20 }, { type: 'stats', target: 'cute', value: 20 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_09_final_prep',
    name: '最終調整',
    description: '集大成へ',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '最終審査まであと僅か。' },
      { speaker: 'producer', text: '最後の仕上げだ。どこを重点的にやる？' },
      { speaker: 'player', text: '全部出し切りたいです。' },
    ],
    triggerCondition: { type: 'week', week: 44 },
    choices: [
      { id: 'prep_a', text: 'バランス良く', effects: [{ type: 'stats', target: 'cool', value: 15 }, { type: 'stats', target: 'elegant', value: 15 }, { type: 'stats', target: 'cute', value: 15 }] },
      { id: 'prep_b', text: '得意分野を伸ばす', effects: [{ type: 'stats', target: 'passion', value: 30 }, { type: 'stats', target: 'clever', value: 20 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'scenario_10_final_night',
    name: '最終審査前夜',
    description: '決戦の前に',
    eventType: 'scenario',
    category: 'scenario',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '明日で全てが決まる。最後の夜。' },
      { speaker: 'player', text: 'プロデューサーさん...緊張します', emotion: 'shy' },
      { speaker: 'producer', text: 'ここまでよく頑張った。明日は思い切り楽しんでこい。' },
      { speaker: 'player', text: 'はい！最高のステージにします！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'week', week: 48 },
    choices: [
      { id: 'final_a', text: 'ゆっくり休む', effects: [{ type: 'condition', target: 'fatigue', value: -30 }, { type: 'condition', target: 'mental', value: 30 }] },
      { id: 'final_b', text: '最後の確認', effects: [{ type: 'condition', target: 'motivation', value: 40 }] },
    ],
    isRepeatable: false,
    priority: 100,
  },
];

// ===========================
// 汎用イベント（10個）- ランダム発生
// ===========================

export const GENERIC_EVENTS: GameEvent[] = [
  {
    id: 'generic_01_weather',
    name: '晴れた日の練習',
    description: '気持ちのいい天気',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '今日は絶好の練習日和だ。' },
      { speaker: 'player', text: '気持ちいい！練習も捗りますね', emotion: 'happy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'weather_a', text: '外で練習！', effects: [{ type: 'condition', target: 'motivation', value: 15 }, { type: 'stats', target: 'passion', value: 10 }] },
      { id: 'weather_b', text: '集中して室内練習', effects: [{ type: 'stats', target: 'clever', value: 15 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_02_gift',
    name: 'ファンからの差し入れ',
    description: '応援の気持ち',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'producer', text: 'これ、ファンからの差し入れだよ。' },
      { speaker: 'player', text: 'えっ、私にですか！？', emotion: 'surprised' },
      { speaker: 'player', text: '嬉しい...もっと頑張らなきゃ！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'gift_a', text: 'みんなで分けよう', effects: [{ type: 'condition', target: 'mental', value: 15 }, { type: 'stats', target: 'cute', value: 10 }] },
      { id: 'gift_b', text: 'ありがたくいただく', effects: [{ type: 'condition', target: 'motivation', value: 20 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_03_health',
    name: '体調管理',
    description: '健康第一',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'producer', text: '最近、無理してないか？' },
      { speaker: 'player', text: '大丈夫です！...たぶん', emotion: 'shy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'health_a', text: 'しっかり休む', effects: [{ type: 'condition', target: 'fatigue', value: -25 }] },
      { id: 'health_b', text: 'まだ大丈夫！', effects: [{ type: 'stats', target: 'passion', value: 15 }, { type: 'condition', target: 'fatigue', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_04_advice',
    name: '先輩からのアドバイス',
    description: '経験者の言葉',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '事務所の先輩アイドルと話す機会があった。' },
      { speaker: 'player', text: '参考になります！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'advice_a', text: 'メモを取る', effects: [{ type: 'stats', target: 'clever', value: 20 }] },
      { id: 'advice_b', text: '今すぐ実践', effects: [{ type: 'stats', target: 'passion', value: 15 }, { type: 'stats', target: 'cool', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_05_peers',
    name: '同期との交流',
    description: '仲間との時間',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '同期のアイドル候補生と話す機会があった。' },
      { speaker: 'player', text: '私も負けてられない！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'peers_a', text: 'いいライバルだ', effects: [{ type: 'condition', target: 'motivation', value: 20 }, { type: 'stats', target: 'passion', value: 10 }] },
      { id: 'peers_b', text: 'いい仲間だ', effects: [{ type: 'condition', target: 'mental', value: 20 }, { type: 'stats', target: 'cute', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_06_new_song',
    name: '新曲の練習',
    description: '新しい課題',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'producer', text: '新しい曲を用意したよ。' },
      { speaker: 'player', text: 'わぁ、素敵な曲！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'song_a', text: '歌を重点的に', effects: [{ type: 'stats', target: 'elegant', value: 20 }] },
      { id: 'song_b', text: '振り付けから', effects: [{ type: 'stats', target: 'cool', value: 15 }, { type: 'stats', target: 'passion', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_07_rainy',
    name: '雨の日',
    description: '室内で何をする？',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'narrator', text: '外は雨。今日は室内での活動になりそうだ。' },
      { speaker: 'player', text: 'やれることはたくさんある！' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'rainy_a', text: '座学で知識を', effects: [{ type: 'stats', target: 'clever', value: 20 }] },
      { id: 'rainy_b', text: '表情練習', effects: [{ type: 'stats', target: 'cute', value: 15 }, { type: 'stats', target: 'elegant', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_08_sns',
    name: 'SNSでの反響',
    description: 'ネットの声',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'producer', text: 'SNSで君のことが話題になってるよ。' },
      { speaker: 'player', text: '嬉しい...期待に応えたい！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'sns_a', text: 'ファンに返信', effects: [{ type: 'stats', target: 'cute', value: 15 }, { type: 'condition', target: 'motivation', value: 15 }] },
      { id: 'sns_b', text: '練習に集中', effects: [{ type: 'stats', target: 'cool', value: 15 }, { type: 'stats', target: 'passion', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_09_costume',
    name: '衣装合わせ',
    description: '新しい衣装',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'producer', text: '新しい衣装ができたよ。試着してみて。' },
      { speaker: 'player', text: 'わぁ...素敵！', emotion: 'happy' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'costume_a', text: 'キュートに着こなす', effects: [{ type: 'stats', target: 'cute', value: 20 }] },
      { id: 'costume_b', text: 'クールに決める', effects: [{ type: 'stats', target: 'cool', value: 15 }, { type: 'stats', target: 'elegant', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
  {
    id: 'generic_10_dayoff',
    name: '久しぶりの休日',
    description: 'オフの過ごし方',
    eventType: 'generic',
    category: 'generic',
    dialogue: [],
    dialogues: [
      { speaker: 'producer', text: '今日は休みだ。ゆっくり過ごしてくれ。' },
      { speaker: 'player', text: 'えっ、いいんですか？' },
    ],
    triggerCondition: { type: 'random', probability: 100 },
    choices: [
      { id: 'dayoff_a', text: 'のんびり過ごす', effects: [{ type: 'condition', target: 'fatigue', value: -30 }, { type: 'condition', target: 'mental', value: 20 }] },
      { id: 'dayoff_b', text: '自主練習', effects: [{ type: 'stats', target: 'passion', value: 20 }, { type: 'condition', target: 'motivation', value: 10 }] },
    ],
    isRepeatable: true,
    priority: 10,
  },
];

// ===========================
// キャラクター別イベントヘルパー
// ===========================

/**
 * キャラクター別イベントセットを生成
 * - 自己紹介: 1個（最優先 priority: 1000）
 * - 絆イベント: 3個（絆レベル20/50/80で発生）
 * - 独立イベント: 1-2個（ランダム発生）
 */
export const createCharacterEventSet = (
  characterId: string,
  characterName: string,
  selfIntroDialogues: EventDialogue[],
  bondDialogues: [EventDialogue[], EventDialogue[], EventDialogue[]],
  independentDialogues: EventDialogue[][]
): CharacterEventSet => {
  const selfIntroEvent: GameEvent = {
    id: `${characterId}_self_intro`,
    name: `${characterName}との出会い`,
    description: '自己紹介',
    eventType: 'self_intro',
    category: 'character',
    dialogue: [],
    dialogues: selfIntroDialogues,
    participantCharacterIds: [characterId],
    triggerCondition: { type: 'bond', characterId, bondLevel: 0 },
    choices: [
      { id: `${characterId}_intro_a`, text: 'よろしくお願いします！', effects: [{ type: 'bond', characterId, value: 10 }, { type: 'condition', target: 'motivation', value: 10 }] },
    ],
    isRepeatable: false,
    priority: 1000, // 自己紹介は最優先
  };

  const bondEvents = bondDialogues.map((dialogues, index): GameEvent => ({
    id: `${characterId}_bond_${index + 1}`,
    name: `${characterName}との絆${index + 1}`,
    description: `絆が深まった`,
    eventType: 'bond',
    category: 'character',
    dialogue: [],
    dialogues,
    participantCharacterIds: [characterId],
    triggerCondition: { type: 'bond', characterId, bondLevel: [20, 50, 80][index] },
    choices: [
      { id: `${characterId}_bond_${index + 1}_a`, text: 'もっと仲良くなりたい', effects: [{ type: 'bond', characterId, value: 15 }, { type: 'condition', target: 'mental', value: 10 }] },
    ],
    isRepeatable: false,
    priority: 50,
  }));

  const independentEvents = independentDialogues.map((dialogues, index): GameEvent => ({
    id: `${characterId}_independent_${index + 1}`,
    name: `${characterName}の日常`,
    description: '何気ない一コマ',
    eventType: 'random',
    category: 'character',
    dialogue: [],
    dialogues,
    participantCharacterIds: [characterId],
    triggerCondition: { type: 'random', characterId, probability: 100 },
    choices: [
      { id: `${characterId}_ind_${index + 1}_a`, text: '一緒に過ごす', effects: [{ type: 'bond', characterId, value: 5 }, { type: 'condition', target: 'mental', value: 5 }] },
    ],
    isRepeatable: true,
    priority: 10,
  }));

  return { characterId, selfIntroEvent, bondEvents, independentEvents };
};

// ===========================
// イベント数取得
// ===========================

export const getScenarioEventCount = (): number => SCENARIO_EVENTS.length;
export const getGenericEventCount = (): number => GENERIC_EVENTS.length;

// 性格別イベントプール
export const PERSONALITY_EVENTS: Record<PersonalityType, GameEvent[]> = {
  hotblooded: [
    {
      id: 'hotblooded_training_1',
      name: '燃える特訓',
      description: '{name}が自主練を始めた',
      eventType: 'random',
      dialogue: [
        '「{一人称}、もっと強くなりたい{語尾}！」',
        '{name}は自主練習を始めようとしている。',
      ],
      triggerCondition: { type: 'random', probability: 0.1 },
      choices: [
        {
          id: 'hotblooded_training_1_a',
          text: '応援する',
          effects: [
            { type: 'stats', target: 'passion', value: 20 },
            { type: 'condition', target: 'fatigue', value: 15 },
            { type: 'condition', target: 'motivation', value: 10 },
          ],
        },
        {
          id: 'hotblooded_training_1_b',
          text: '休むよう促す',
          effects: [
            { type: 'condition', target: 'fatigue', value: -10 },
            { type: 'condition', target: 'health', value: 5 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
    {
      id: 'hotblooded_rival_1',
      name: 'ライバル宣言',
      description: '{name}がライバルに宣言をした',
      eventType: 'random',
      dialogue: [
        '「{rival}！{一人称}は絶対{二人称}に負けない{語尾}！」',
        '{name}はライバルに熱い視線を向けている。',
      ],
      triggerCondition: { type: 'random', probability: 0.08 },
      choices: [
        {
          id: 'hotblooded_rival_1_a',
          text: '気合を入れる',
          effects: [
            { type: 'condition', target: 'motivation', value: 20 },
            { type: 'stats', target: 'passion', value: 10 },
          ],
        },
        {
          id: 'hotblooded_rival_1_b',
          text: '冷静になるよう諭す',
          effects: [
            { type: 'stats', target: 'clever', value: 10 },
            { type: 'condition', target: 'mental', value: 5 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 40,
    },
  ],
  cool: [
    {
      id: 'cool_solo_1',
      name: '孤高の練習',
      description: '{name}が一人で練習している',
      eventType: 'random',
      dialogue: [
        '「…集中{語尾}」',
        '{name}は静かに、しかし真剣に練習に取り組んでいる。',
      ],
      triggerCondition: { type: 'random', probability: 0.1 },
      choices: [
        {
          id: 'cool_solo_1_a',
          text: '見守る',
          effects: [
            { type: 'stats', target: 'cool', value: 20 },
            { type: 'condition', target: 'mental', value: 5 },
          ],
        },
        {
          id: 'cool_solo_1_b',
          text: 'アドバイスする',
          effects: [
            { type: 'stats', target: 'cool', value: 10 },
            { type: 'stats', target: 'clever', value: 10 },
            { type: 'bond', value: 5 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
  ],
  natural: [
    {
      id: 'natural_accident_1',
      name: '天然ハプニング',
      description: '{name}がちょっとしたハプニングを起こした',
      eventType: 'random',
      dialogue: [
        '「あれ？{一人称}、何かおかしいことした{語尾}？」',
        '{name}は全く気づいていないようだ…',
      ],
      triggerCondition: { type: 'random', probability: 0.12 },
      choices: [
        {
          id: 'natural_accident_1_a',
          text: '笑って許す',
          effects: [
            { type: 'stats', target: 'cute', value: 15 },
            { type: 'condition', target: 'motivation', value: 10 },
          ],
        },
        {
          id: 'natural_accident_1_b',
          text: '優しく指摘する',
          effects: [
            { type: 'stats', target: 'clever', value: 10 },
            { type: 'bond', value: 5 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
  ],
  hardworker: [
    {
      id: 'hardworker_growth_1',
      name: '努力の成果',
      description: '{name}の努力が実を結んだ',
      eventType: 'random',
      dialogue: [
        '「{producer}、見て{語尾}！前よりうまくできるようになった{語尾}！」',
        '{name}は嬉しそうに成果を見せてくれる。',
      ],
      triggerCondition: { type: 'random', probability: 0.1 },
      choices: [
        {
          id: 'hardworker_growth_1_a',
          text: '褒める',
          effects: [
            { type: 'stats', target: 'elegant', value: 20 },
            { type: 'condition', target: 'motivation', value: 15 },
            { type: 'bond', value: 10 },
          ],
        },
        {
          id: 'hardworker_growth_1_b',
          text: 'さらなる高みを目指す',
          effects: [
            { type: 'stats', target: 'passion', value: 15 },
            { type: 'stats', target: 'elegant', value: 10 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
  ],
  competitive: [
    {
      id: 'competitive_challenge_1',
      name: '挑戦状',
      description: '{name}がライバルに勝負を挑んだ',
      eventType: 'random',
      dialogue: [
        '「{rival}！次のライブ、絶対{一人称}が勝つ{語尾}！」',
        '{name}の目には強い闘志が燃えている。',
      ],
      triggerCondition: { type: 'random', probability: 0.1 },
      choices: [
        {
          id: 'competitive_challenge_1_a',
          text: '特訓に付き合う',
          effects: [
            { type: 'stats', target: 'passion', value: 20 },
            { type: 'condition', target: 'fatigue', value: 10 },
          ],
        },
        {
          id: 'competitive_challenge_1_b',
          text: '戦略を考える',
          effects: [
            { type: 'stats', target: 'clever', value: 20 },
            { type: 'condition', target: 'motivation', value: 10 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
  ],
  spoiled: [
    {
      id: 'spoiled_pamper_1',
      name: '甘えタイム',
      description: '{name}が甘えてきた',
      eventType: 'random',
      dialogue: [
        '「{producer}〜、{一人称}のこと褒めて{語尾}？」',
        '{name}はこちらを期待の目で見ている。',
      ],
      triggerCondition: { type: 'random', probability: 0.1 },
      choices: [
        {
          id: 'spoiled_pamper_1_a',
          text: '褒める',
          effects: [
            { type: 'condition', target: 'motivation', value: 20 },
            { type: 'stats', target: 'cute', value: 15 },
            { type: 'bond', value: 10 },
          ],
        },
        {
          id: 'spoiled_pamper_1_b',
          text: '励ます',
          effects: [
            { type: 'condition', target: 'mental', value: 10 },
            { type: 'stats', target: 'passion', value: 10 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
  ],
  perfectionist: [
    {
      id: 'perfectionist_pressure_1',
      name: '完璧への重圧',
      description: '{name}がプレッシャーを感じている',
      eventType: 'random',
      dialogue: [
        '「…もっと完璧にしないと{語尾}」',
        '{name}は自分に厳しい目を向けている。',
      ],
      triggerCondition: { type: 'random', probability: 0.1 },
      choices: [
        {
          id: 'perfectionist_pressure_1_a',
          text: '一緒に練習する',
          effects: [
            { type: 'stats', target: 'elegant', value: 20 },
            { type: 'condition', target: 'mental', value: -5 },
          ],
        },
        {
          id: 'perfectionist_pressure_1_b',
          text: '息抜きを勧める',
          effects: [
            { type: 'condition', target: 'mental', value: 15 },
            { type: 'condition', target: 'motivation', value: 5 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
  ],
  moodmaker: [
    {
      id: 'moodmaker_cheer_1',
      name: 'みんなを元気に',
      description: '{name}が周りを盛り上げている',
      eventType: 'random',
      dialogue: [
        '「みんな〜！{一人称}たち最高{語尾}！」',
        '{name}の周りには笑顔があふれている。',
      ],
      triggerCondition: { type: 'random', probability: 0.1 },
      choices: [
        {
          id: 'moodmaker_cheer_1_a',
          text: '一緒に盛り上がる',
          effects: [
            { type: 'stats', target: 'cute', value: 15 },
            { type: 'condition', target: 'motivation', value: 15 },
            { type: 'bond', value: 10 },
          ],
        },
        {
          id: 'moodmaker_cheer_1_b',
          text: 'その調子で頑張ろう',
          effects: [
            { type: 'stats', target: 'passion', value: 15 },
            { type: 'condition', target: 'mental', value: 10 },
          ],
        },
      ],
      isRepeatable: false,
      priority: 50,
    },
  ],
};

// 共通イベント
export const COMMON_EVENTS: GameEvent[] = [
  {
    id: 'common_fan_letter_1',
    name: 'ファンレター',
    description: 'ファンからの手紙が届いた',
    eventType: 'random',
    dialogue: [
      'ファンからの手紙が届いた。',
      '「{name}さんの笑顔にいつも元気をもらっています」',
      '{name}は嬉しそうに手紙を読んでいる。',
    ],
    triggerCondition: { type: 'random', probability: 0.08 },
    choices: [
      {
        id: 'common_fan_letter_1_a',
        text: '返事を書くよう提案する',
        effects: [
          { type: 'condition', target: 'motivation', value: 15 },
          { type: 'fame', value: 10 },
          { type: 'bond', value: 5 },
        ],
      },
      {
        id: 'common_fan_letter_1_b',
        text: '大切に保管するよう伝える',
        effects: [
          { type: 'condition', target: 'mental', value: 10 },
          { type: 'condition', target: 'motivation', value: 10 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 30,
  },
  {
    id: 'common_media_coverage_1',
    name: 'メディア取材',
    description: 'メディアから取材の依頼が来た',
    eventType: 'random',
    dialogue: [
      '雑誌からインタビューの依頼が来た。',
      '「{producer}、どうする{語尾}？」',
    ],
    triggerCondition: { type: 'random', probability: 0.05 },
    choices: [
      {
        id: 'common_media_coverage_1_a',
        text: '受ける',
        effects: [
          { type: 'fame', value: 30 },
          { type: 'gold', value: 200 },
          { type: 'condition', target: 'fatigue', value: 10 },
        ],
      },
      {
        id: 'common_media_coverage_1_b',
        text: '今回は断る',
        effects: [
          { type: 'condition', target: 'motivation', value: -5 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 40,
  },
  {
    id: 'common_sick_1',
    name: '体調不良',
    description: '{name}の体調が悪そうだ',
    eventType: 'random',
    dialogue: [
      '「う…ちょっと頭が痛い{語尾}…」',
      '{name}の顔色が悪い。',
    ],
    triggerCondition: { type: 'random', probability: 0.03 },
    choices: [
      {
        id: 'common_sick_1_a',
        text: '休ませる',
        effects: [
          { type: 'condition', target: 'health', value: 20 },
          { type: 'condition', target: 'fatigue', value: -30 },
        ],
      },
      {
        id: 'common_sick_1_b',
        text: '病院に連れていく',
        effects: [
          { type: 'condition', target: 'health', value: 30 },
          { type: 'gold', value: -100 },
        ],
      },
    ],
    isRepeatable: true,
    priority: 80,
  },
  {
    id: 'common_gift_1',
    name: 'プレゼント',
    description: '{name}にプレゼントを渡す機会があった',
    eventType: 'random',
    dialogue: [
      '今日は{name}の誕生日だ。',
      'プレゼントを用意するチャンスだ。',
    ],
    triggerCondition: { type: 'random', probability: 0.02 },
    choices: [
      {
        id: 'common_gift_1_a',
        text: '高価なプレゼントを渡す',
        effects: [
          { type: 'bond', value: 20 },
          { type: 'condition', target: 'motivation', value: 20 },
          { type: 'gold', value: -500 },
        ],
      },
      {
        id: 'common_gift_1_b',
        text: '手作りのプレゼントを渡す',
        effects: [
          { type: 'bond', value: 15 },
          { type: 'condition', target: 'motivation', value: 15 },
        ],
      },
      {
        id: 'common_gift_1_c',
        text: '言葉だけで祝う',
        effects: [
          { type: 'bond', value: 5 },
          { type: 'condition', target: 'motivation', value: 5 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 60,
  },
];

// 絆レベルイベント
export const BOND_EVENTS: GameEvent[] = [
  {
    id: 'bond_20_1',
    name: '信頼の芽生え',
    description: '{name}との絆が深まった',
    eventType: 'bond',
    dialogue: [
      '「{producer}、{一人称}…{二人称}のこと信頼してる{語尾}」',
      '{name}は少し照れくさそうに言った。',
    ],
    triggerCondition: { type: 'bond', bondLevel: 20 },
    choices: [
      {
        id: 'bond_20_1_a',
        text: '期待に応える',
        effects: [
          { type: 'condition', target: 'motivation', value: 15 },
          { type: 'bond', value: 10 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 90,
  },
  {
    id: 'bond_50_1',
    name: '本音',
    description: '{name}が本音を打ち明けてくれた',
    eventType: 'bond',
    dialogue: [
      '「{producer}には話しておきたいことがある{語尾}」',
      '{name}は真剣な表情で話し始めた。',
      '「{一人称}がアイドルを目指した理由…」',
    ],
    triggerCondition: { type: 'bond', bondLevel: 50 },
    choices: [
      {
        id: 'bond_50_1_a',
        text: '最後まで聞く',
        effects: [
          { type: 'bond', value: 20 },
          { type: 'condition', target: 'mental', value: 10 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 90,
  },
  {
    id: 'bond_80_1',
    name: '絆の証',
    description: '{name}との絆が最高潮に達した',
    eventType: 'bond',
    dialogue: [
      '「{producer}、{一人称}…ずっと{二人称}と一緒にいたい{語尾}」',
      '{name}の目には強い決意が宿っている。',
    ],
    triggerCondition: { type: 'bond', bondLevel: 80 },
    choices: [
      {
        id: 'bond_80_1_a',
        text: '約束する',
        effects: [
          { type: 'bond', value: 20 },
          { type: 'condition', target: 'motivation', value: 30 },
          { type: 'stats', target: 'passion', value: 30 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 100,
  },
];

// 週間イベント（特定の週に発生）
export const WEEKLY_EVENTS: GameEvent[] = [
  {
    id: 'weekly_start_1',
    name: '初めての一歩',
    description: '育成が始まった',
    eventType: 'weekly',
    dialogue: [
      '「よろしくお願いします、プロデューサーさん！」',
      'アイドルとしての第一歩が始まった。',
      '期待と不安が入り混じる表情をしている。',
    ],
    triggerCondition: { type: 'week', week: 1 },
    choices: [
      {
        id: 'weekly_start_1_a',
        text: '一緒に頑張ろう',
        effects: [
          { type: 'condition', target: 'motivation', value: 20 },
          { type: 'condition', target: 'mental', value: 10 },
        ],
      },
      {
        id: 'weekly_start_1_b',
        text: '厳しくいくよ',
        effects: [
          { type: 'stats', target: 'passion', value: 10 },
          { type: 'condition', target: 'motivation', value: 10 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 100,
  },
  {
    id: 'weekly_mid_1',
    name: '折り返し地点',
    description: '育成の折り返し地点に来た',
    eventType: 'weekly',
    dialogue: [
      '「もう半分まで来たんですね…」',
      '振り返ると、成長を実感できる。',
      '「後半も頑張りましょう！」',
    ],
    triggerCondition: { type: 'week', week: 24 },
    choices: [
      {
        id: 'weekly_mid_1_a',
        text: 'ここからが本番だ',
        effects: [
          { type: 'condition', target: 'motivation', value: 25 },
          { type: 'stats', target: 'passion', value: 10 },
        ],
      },
      {
        id: 'weekly_mid_1_b',
        text: '今までの成果を確認しよう',
        effects: [
          { type: 'condition', target: 'mental', value: 15 },
          { type: 'stats', target: 'clever', value: 10 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 80,
  },
  {
    id: 'weekly_final_1',
    name: '最後の週',
    description: '育成最終週',
    eventType: 'weekly',
    dialogue: [
      '「いよいよ最後の週ですね…」',
      '今までの全てをぶつける時が来た。',
      '「プロデューサーさん、最後まで見届けてください！」',
    ],
    triggerCondition: { type: 'week', week: 48 },
    choices: [
      {
        id: 'weekly_final_1_a',
        text: '最高のパフォーマンスを',
        effects: [
          { type: 'condition', target: 'motivation', value: 30 },
          { type: 'stats', target: 'passion', value: 15 },
          { type: 'stats', target: 'cool', value: 15 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 100,
  },
];

// ラッキーイベント（良い効果のみ）
export const LUCKY_EVENTS: GameEvent[] = [
  {
    id: 'lucky_sponsor_1',
    name: 'スポンサー獲得',
    description: 'スポンサーがついた',
    eventType: 'random',
    dialogue: [
      '大手企業からスポンサーの申し出があった！',
      '「ぜひ{name}さんをサポートさせてください」',
      'これは大きなチャンスだ。',
    ],
    triggerCondition: { type: 'random', probability: 0.03 },
    choices: [
      {
        id: 'lucky_sponsor_1_a',
        text: '喜んで受ける',
        effects: [
          { type: 'gold', value: 500 },
          { type: 'fame', value: 30 },
          { type: 'condition', target: 'motivation', value: 20 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 70,
  },
  {
    id: 'lucky_viral_1',
    name: 'バズり',
    description: 'SNSで話題になった',
    eventType: 'random',
    dialogue: [
      '{name}の動画がSNSでバズった！',
      '再生数がどんどん伸びている。',
      '「えっ、すごい！見てくださいプロデューサーさん！」',
    ],
    triggerCondition: { type: 'random', probability: 0.04 },
    choices: [
      {
        id: 'lucky_viral_1_a',
        text: 'この調子で頑張ろう',
        effects: [
          { type: 'fame', value: 50 },
          { type: 'condition', target: 'motivation', value: 25 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 60,
  },
  {
    id: 'lucky_talent_1',
    name: '才能開花',
    description: '隠れた才能が開花した',
    eventType: 'random',
    dialogue: [
      '「あれ？なんかすごく調子がいい！」',
      '{name}の動きが見違えるように良くなった。',
      '秘めた才能が開花したようだ。',
    ],
    triggerCondition: { type: 'random', probability: 0.02 },
    choices: [
      {
        id: 'lucky_talent_1_a',
        text: 'この感覚を忘れないで',
        effects: [
          { type: 'stats', target: 'cool', value: 15 },
          { type: 'stats', target: 'elegant', value: 15 },
          { type: 'stats', target: 'cute', value: 15 },
          { type: 'stats', target: 'clever', value: 15 },
          { type: 'stats', target: 'passion', value: 15 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 90,
  },
];

// トラブルイベント（対処が必要）
export const TROUBLE_EVENTS: GameEvent[] = [
  {
    id: 'trouble_rumor_1',
    name: '噂',
    description: '良くない噂が流れている',
    eventType: 'random',
    dialogue: [
      'ネット上で{name}についての良くない噂が流れている。',
      '「プロデューサーさん、これ…」',
      '不安そうな表情をしている。',
    ],
    triggerCondition: { type: 'random', probability: 0.03 },
    choices: [
      {
        id: 'trouble_rumor_1_a',
        text: '気にするな',
        effects: [
          { type: 'condition', target: 'mental', value: 10 },
          { type: 'condition', target: 'motivation', value: -5 },
        ],
      },
      {
        id: 'trouble_rumor_1_b',
        text: '対策を講じる',
        effects: [
          { type: 'gold', value: -200 },
          { type: 'fame', value: -10 },
          { type: 'condition', target: 'mental', value: 15 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 70,
  },
  {
    id: 'trouble_injury_1',
    name: '怪我',
    description: '練習中に怪我をした',
    eventType: 'random',
    dialogue: [
      '「いたっ…！」',
      '{name}が練習中に足を捻ってしまった。',
      '大事には至らなさそうだが…',
    ],
    triggerCondition: { type: 'random', probability: 0.02 },
    choices: [
      {
        id: 'trouble_injury_1_a',
        text: 'しっかり休ませる',
        effects: [
          { type: 'condition', target: 'health', value: 20 },
          { type: 'condition', target: 'fatigue', value: -20 },
        ],
      },
      {
        id: 'trouble_injury_1_b',
        text: '軽く練習を続ける',
        effects: [
          { type: 'condition', target: 'health', value: -10 },
          { type: 'stats', target: 'passion', value: 10 },
        ],
      },
    ],
    isRepeatable: true,
    priority: 85,
  },
];

// ===========================
// ヘルパー関数
// ===========================

export const getRandomEvent = (
  personality: PersonalityType,
  bondLevel: number,
  completedEvents: string[]
): GameEvent | null => {
  // 絆イベントチェック
  const availableBondEvents = BOND_EVENTS.filter(
    (e) =>
      !completedEvents.includes(e.id) &&
      e.triggerCondition.type === 'bond' &&
      e.triggerCondition.bondLevel! <= bondLevel
  );
  if (availableBondEvents.length > 0) {
    const bondEvent = availableBondEvents.sort(
      (a, b) => (b.triggerCondition.bondLevel || 0) - (a.triggerCondition.bondLevel || 0)
    )[0];
    if (Math.random() < 0.5) return bondEvent;
  }

  // 性格イベントチェック
  const personalityEvents = PERSONALITY_EVENTS[personality] || [];
  const availablePersonalityEvents = personalityEvents.filter(
    (e) => !completedEvents.includes(e.id)
  );

  // 共通イベントチェック
  const availableCommonEvents = COMMON_EVENTS.filter(
    (e) => !completedEvents.includes(e.id)
  );

  // ラッキーイベントチェック
  const availableLuckyEvents = LUCKY_EVENTS.filter(
    (e) => !completedEvents.includes(e.id)
  );

  // トラブルイベントチェック
  const availableTroubleEvents = TROUBLE_EVENTS.filter(
    (e) => e.isRepeatable || !completedEvents.includes(e.id)
  );

  const allEvents = [
    ...availablePersonalityEvents,
    ...availableCommonEvents,
    ...availableLuckyEvents,
    ...availableTroubleEvents,
  ];

  for (const event of allEvents) {
    if (
      event.triggerCondition.type === 'random' &&
      Math.random() < (event.triggerCondition.probability || 0.1)
    ) {
      return event;
    }
  }

  return null;
};

/** 週固定イベントを取得 */
export const getWeeklyEvent = (
  week: number,
  completedEvents: string[]
): GameEvent | null => {
  const event = WEEKLY_EVENTS.find(
    (e) =>
      e.triggerCondition.type === 'week' &&
      e.triggerCondition.week === week &&
      !completedEvents.includes(e.id)
  );
  return event || null;
};

export const processDialogue = (
  dialogue: string[],
  variables: Record<string, string>
): string[] => {
  return dialogue.map((line) => {
    let processed = line;
    for (const [key, value] of Object.entries(variables)) {
      processed = processed.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return processed;
  });
};

// ===========================
// 新イベント発生システム（均等確率・自己紹介優先）
// ===========================

export interface EventSelectionContext {
  currentWeek: number;
  completedEventIds: string[];
  supportCharacterIds: string[];
  characterBonds: Record<string, number>;
  characterEventSets: CharacterEventSet[];
}

/**
 * イベントを選択（均等確率・自己紹介優先）
 * - 利用可能なイベントがあれば必ず発生（100%）
 * - 自己紹介 > シナリオ > 絆 > ランダム の優先順
 * - ランダムイベントは均等確率で選択
 */
export const selectEventWithEqualProbability = (
  context: EventSelectionContext
): GameEvent | null => {
  const { currentWeek, completedEventIds, characterEventSets, characterBonds } = context;

  // 1. 自己紹介イベントを優先チェック（未完了のもの）
  for (const charEvents of characterEventSets) {
    const introEvent = charEvents.selfIntroEvent;
    if (!completedEventIds.includes(introEvent.id)) {
      // 自己紹介は必ず発生
      return introEvent;
    }
  }

  // 2. シナリオイベントチェック（週固定）
  const scenarioEvent = SCENARIO_EVENTS.find(
    e => e.triggerCondition.week === currentWeek && !completedEventIds.includes(e.id)
  );
  if (scenarioEvent) {
    return scenarioEvent;
  }

  // 3. 絆イベントチェック（条件達成時）
  for (const charEvents of characterEventSets) {
    const bond = characterBonds[charEvents.characterId] || 0;
    for (const bondEvent of charEvents.bondEvents) {
      if (!completedEventIds.includes(bondEvent.id)) {
        const requiredBond = bondEvent.triggerCondition.bondLevel || 0;
        if (bond >= requiredBond) {
          // 絆条件達成
          return bondEvent;
        }
      }
    }
  }

  // 4. ランダムイベント選択（均等確率・100%発生）
  // 利用可能なイベントを収集
  const availableEvents: GameEvent[] = [];

  // 汎用イベント
  availableEvents.push(...GENERIC_EVENTS.filter(
    e => e.isRepeatable || !completedEventIds.includes(e.id)
  ));

  // キャラクター独立イベント
  for (const charEvents of characterEventSets) {
    availableEvents.push(...charEvents.independentEvents.filter(
      e => e.isRepeatable || !completedEventIds.includes(e.id)
    ));
  }

  // 性格イベント・共通イベント・ラッキー・トラブルイベント
  const legacyEvents = [
    ...COMMON_EVENTS,
    ...LUCKY_EVENTS,
    ...TROUBLE_EVENTS,
  ].filter(e => e.isRepeatable || !completedEventIds.includes(e.id));
  availableEvents.push(...legacyEvents);

  if (availableEvents.length === 0) {
    return null;
  }

  // 均等確率で選択
  const randomIndex = Math.floor(Math.random() * availableEvents.length);
  return availableEvents[randomIndex];
};

/**
 * シナリオイベントを週で取得
 */
export const getScenarioEventByWeek = (
  week: number,
  completedEventIds: string[]
): GameEvent | null => {
  return SCENARIO_EVENTS.find(
    e => e.triggerCondition.week === week && !completedEventIds.includes(e.id)
  ) || null;
};

/**
 * 全イベント数のサマリーを取得
 */
export const getEventSummary = (characterCount: number): {
  scenario: number;
  generic: number;
  characterTotal: number;
  perCharacter: { selfIntro: number; bond: number; independent: string };
} => ({
  scenario: SCENARIO_EVENTS.length,
  generic: GENERIC_EVENTS.length,
  characterTotal: characterCount * (1 + 3 + 2), // 自己紹介1 + 絆3 + 独立2
  perCharacter: { selfIntro: 1, bond: 3, independent: '1-2' },
});
