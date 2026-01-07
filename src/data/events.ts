import { GameEvent, PersonalityType } from '../types';

// ===========================
// イベントデータ
// ===========================

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

  const allEvents = [...availablePersonalityEvents, ...availableCommonEvents];

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
