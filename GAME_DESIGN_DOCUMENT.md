# アイドル育成デッキ構築ゲーム - 設計ドキュメント

> **Version:** 0.1.0 (Prototype)
> **Tech Stack:** React 19 + TypeScript + Zustand + Vite + Electron
> **Last Updated:** 2026-01-08

---

## 目次

1. [プロジェクト概要](#1-プロジェクト概要)
2. [ディレクトリ構造](#2-ディレクトリ構造)
3. [ゲームシステム](#3-ゲームシステム)
4. [データ定義](#4-データ定義)
5. [コンポーネント構成](#5-コンポーネント構成)
6. [状態管理](#6-状態管理)
7. [ゲームフロー](#7-ゲームフロー)

---

## 1. プロジェクト概要

### 1.1 ゲームコンセプト

アイドルを育成し、デッキを構築してライブバトルで競う育成シミュレーションゲーム。

### 1.2 主要機能

| 機能 | 説明 |
|------|------|
| キャラクター作成 | 外見・性格・口調をカスタマイズ |
| 育成システム | 48週のトレーニング期間 |
| 絆システム | サポートキャラとの関係構築 |
| デッキ構築 | カード収集・編成 |
| ライブバトル | 4人対戦カードバトル |
| 設備システム | 練習場の強化 |
| イベントシステム | シナリオ・キャラ別イベント |

### 1.3 技術スタック

```
Frontend:  React 19.2.0
State:     Zustand 5.0.9
Build:     Vite 7.2.4
Language:  TypeScript 5.9.3
Desktop:   Electron
```

---

## 2. ディレクトリ構造

```
src/
├── App.tsx                    # メイン画面ルーター
├── main.tsx                   # エントリーポイント
│
├── components/                # UIコンポーネント
│   ├── ui/                    # 共通UI（Button, Card, Modal, ProgressBar）
│   ├── character/             # キャラクター作成
│   ├── training/              # 育成画面
│   ├── battle/                # バトル画面
│   ├── deck/                  # デッキ編集
│   └── event/                 # イベントダイアログ
│
├── screens/                   # 画面コンポーネント
│   ├── TitleScreen.tsx        # タイトル画面
│   └── MainMenu.tsx           # メインメニュー
│
├── store/                     # 状態管理
│   └── gameStore.ts           # Zustandストア（1753行）
│
├── types/                     # 型定義
│   └── index.ts               # 全型定義（772行）
│
└── data/                      # ゲームデータ
    ├── cards.ts               # カード定義
    ├── facilities.ts          # 設備データ
    ├── actions.ts             # アクション定義
    ├── events.ts              # イベントデータ
    ├── scenarios.ts           # シナリオイベント
    ├── fixedCharacters.ts     # 固定キャラクター
    └── rareSkills.ts          # レアスキル（金特）
```

---

## 3. ゲームシステム

### 3.1 育成システム

#### 3.1.1 基本情報

- **育成期間**: 48週（ターン）
- **ステータス**: 5種類（Cool, Elegant, Cute, Clever, Passion）
- **コンディション**: 4種類（体力, 疲労, やる気, メンタル）
- **ランク**: E → D → C → B → A → S → SS → SSS

#### 3.1.2 ランク閾値

| ランク | 必要合計ステータス |
|--------|-------------------|
| E | 0 |
| D | 50 |
| C | 150 |
| B | 350 |
| A | 700 |
| S | 1,200 |
| SS | 1,900 |
| SSS | 2,800 |

#### 3.1.3 週間アクション

**レッスン（練習）**
| 種類 | 対象スタイル | 効果値 | 疲労 | 怪我率 |
|------|-------------|--------|------|--------|
| ダンス | Cool | 20-40 | 10 | 3% |
| ボーカル | Elegant | 20-40 | 10 | 2% |
| 表現 | Cute | 20-40 | 10 | 1% |
| 座学 | Clever | 20-40 | 10 | 0% |
| 体力 | Passion | 20-40 | 10 | 5% |
| 総合 | 全5種 | 15-30 | 15 | 2% |

**上級レッスン**（設備レベル10で解禁）
- 効果値: 40-70、疲労: 15、怪我率: 高め

**特訓**（設備レベル20で解禁）
- 効果値: 70-120、疲労: 25、怪我率: さらに高め

**限界突破**（設備レベル30で解禁）
- 効果値: 120-200、疲労: 40、怪我率: 最大

#### 3.1.4 効果計算式

```
最終効果 = 基礎効果 × 設備ボーナス × サポートボーナス × タッグボーナス
         × やる気ボーナス × 疲労効率 × 怪我ペナルティ
```

| 要素 | 計算 |
|------|------|
| 設備ボーナス | 1.0 + (レベル × 0.1) |
| やる気ボーナス | やる気≥80で +0.5 |
| 疲労効率 | 疲労>50: -20%, >60: -40%, >80: -60% |
| 怪我ペナルティ | 軽傷: なし, 中傷: -30%, 重傷: -50% |

#### 3.1.5 怪我システム

| 種類 | 回復週 | 疲労増加 | 効果減少 |
|------|--------|----------|----------|
| 軽傷 | 1週 | +20 | なし |
| 中傷 | 2週 | +30 | -30% |
| 重傷 | 3週 | +50 | -50% |

---

### 3.2 絆システム（キズナ）

#### 3.2.1 基本仕様

- **範囲**: 0〜100
- **上昇**: 通常練習+2、絆練習+10、イベント+5〜25

#### 3.2.2 絆イベント閾値

| 絆レベル | イベント |
|----------|----------|
| 20 | イベント1（自己紹介） |
| 50 | イベント2（関係深化） |
| 80 | イベント3（特別カード獲得） |
| 100 | レアスキル（金特）解禁 |

#### 3.2.3 絆練習

- **解禁条件**: 絆レベル40以上（キャラ別に変更可能）
- **効果倍率**: 1.5〜2.0倍
- **絆上昇**: +8〜10
- **条件**: 練習参加サポートのみ利用可能

---

### 3.3 カードシステム

#### 3.3.1 カードゲージ

- **最大値**: 100
- **上昇**: 通常練習+5、絆練習+10
- **満タン時**: 3枚から1枚選択

#### 3.3.2 カードカテゴリ

| カテゴリ | 効果 |
|----------|------|
| アピール | スター獲得（メイン火力） |
| ディフェンス | 無効化・スタミナ回復 |
| 操作 | ドロー・相手のカード破棄 |
| 妨害 | 相手スター減少・スタミナ奪取 |
| 条件付き | 条件達成で追加効果 |

#### 3.3.3 カードレアリティ

| レアリティ | 説明 |
|------------|------|
| Common | 基本カード |
| Uncommon | やや強い |
| Rare | 希少 |
| Epic | 非常に希少 |
| Legendary | 最高レア |

#### 3.3.4 初期デッキ

10枚構成：各スタイル2枚ずつの基本カード

---

### 3.4 バトルシステム（4人対戦）

#### 3.4.1 基本ルール

- **参加者**: プレイヤー + AI 3人
- **ターン数**: 5ターン
- **勝敗**: 獲得スター数で順位決定

#### 3.4.2 バトルフロー

```
1. カード選択フェーズ
   - 手札から使用カード選択
   - スタミナコスト制限あり

2. カード解決フェーズ
   - 行動速度順に処理
   - スター獲得・効果適用

3. ターン終了
   - 2枚ドロー（手札上限7枚）
   - スタミナ+1回復（上限6）
   - トレンド変更（ランダム）

4. 結果発表（5ターン終了後）
   - 順位確定
   - 報酬獲得
```

#### 3.4.3 報酬

| 順位 | ゴールド | 名声 | ゲージ |
|------|----------|------|--------|
| 1位 | 800 | 80 | 30 |
| 2位 | 500 | 50 | 20 |
| 3位 | 200 | 20 | 10 |
| 4位 | 100 | 10 | 5 |

#### 3.4.4 トレンドボーナス

- 毎ターン、ランダムなスタイルがトレンドに
- トレンド一致カード使用で+1スター

---

### 3.5 設備システム

#### 3.5.1 練習設備（6種）

| 設備 | 効果 | 基本コスト | 最大Lv |
|------|------|-----------|--------|
| ダンススタジオ | Cool練習+10%/Lv | 500 | 5 |
| ボーカルルーム | Elegant練習+10%/Lv | 500 | 5 |
| 表現力ルーム | Cute練習+10%/Lv | 500 | 5 |
| 自習室 | Clever練習+10%/Lv | 500 | 5 |
| トレーニングジム | Passion練習+10%/Lv | 500 | 5 |
| 総合スタジオ | 全練習+5%/Lv | 1000 | 5 |

#### 3.5.2 サポート設備（6種）

| 設備 | 効果 | 基本コスト | 最大Lv |
|------|------|-----------|--------|
| 休憩室 | 休息効果+20%/Lv | 300 | 3 |
| 医務室 | 怪我率減少・体力回復 | 500 | 3 |
| 食堂 | 自動疲労回復-5〜15/週 | 400 | 3 |
| マネージャー室 | 名声ボーナス+%/Lv | 600 | 3 |
| 放送室 | イベント効果UP | 500 | 3 |
| トレーニングホール | 体力回復ボーナス | 800 | 3 |

#### 3.5.3 アップグレードコスト

| レベル | 倍率 |
|--------|------|
| 1→2 | ×1.0 |
| 2→3 | ×1.5 |
| 3→4 | ×2.5 |
| 4→5 | ×4.0 |

---

### 3.6 イベントシステム

#### 3.6.1 イベント種類

| 種類 | 説明 |
|------|------|
| シナリオ | 週固定のストーリーイベント（10個） |
| 絆イベント | サポートキャラ別（各3個） |
| 汎用イベント | ランダム発生（10個） |
| キャラ別 | 固定キャラ専用イベント |

#### 3.6.2 シナリオイベント配分

| 週 | イベント |
|----|----------|
| 1 | プロローグ - アイドルへの第一歩 |
| 5 | 初めてのレッスン |
| 10 | 最初の壁 |
| 15 | ライバルとの出会い |
| 24 | 中間審査 |
| 29 | 新たな可能性 |
| 34 | 挫折 |
| 39 | 覚醒 |
| 44 | 最終試練 |
| 48 | グランドフィナーレ |

#### 3.6.3 イベント発生優先順位

1. シナリオイベント（週固定）
2. 絆イベント（閾値達成順）
3. 汎用イベント（100%発生）

---

## 4. データ定義

### 4.1 キャラクタータイプ

```typescript
// 基本キャラクター
interface BaseCharacter {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  agency: string;
  appearance: CharacterAppearance;
  personality: PersonalityType;
  speechStyle: SpeechStyle;
  uniqueSkill: UniqueSkill;
}

// 育成中キャラクター
interface TrainingCharacter extends BaseCharacter {
  type: 'training';
  stats: CharacterStats;      // 5種ステータス
  condition: CharacterCondition; // 4種コンディション
  rank: Rank;
  cards: Card[];
  actionSpeed: number;
}

// 育成完了キャラクター
interface TrainedCharacter extends BaseCharacter {
  type: 'trained';
  finalStats: CharacterStats;
  finalRank: Rank;
  acquiredCards: Card[];
  trainedAt: string;
  bestStyle: Style;
}
```

### 4.2 サポートキャラクター

```typescript
interface SupportCharacter {
  character: TrainedCharacter | FixedCharacter;
  bondLevel: number;           // 0-100
  bonus: SupportBonus;
  bondEvents: BondEventSet;
  bondProgress: {
    event1Cleared: boolean;
    event2Cleared: boolean;
    event3Cleared: boolean;
  };
  isInTraining: boolean;
}

interface SupportBonus {
  lessonBonus: Partial<Record<Style, number>>;
  initialStats: Partial<CharacterStats>;
  specialtyStyle: Style;
  specialtyRate: number;
  trainingEffectUp: number;
  friendshipBonus: number;
  friendshipThreshold: number;
  motivationEffectUp: number;
  fatigueReduction: number;
  conditionUp: number;
  cardGaugeBonus: number;
  hintRate: number;
  goldBonus: number;
  fameBonus: number;
  contestBonus: number;
  initialBond: number;
}
```

### 4.3 カード

```typescript
interface Card {
  id: string;
  name: string;
  description: string;
  category: CardCategory;
  style: Style;
  cost: number;              // スタミナコスト 1-3
  rarity?: CardRarity;
  requiredRank: Rank;
  effects: CardEffect[];
  flavorText?: string;
  isSpecial?: boolean;
  sourceCharacterId?: string;
}

interface CardEffect {
  type: 'appeal' | 'stamina' | 'voltage' | 'draw' | 'discard' |
        'nullify' | 'trend_change' | 'action_speed';
  value: number;
  target: 'self' | 'opponent' | 'both';
  condition?: EffectCondition;
}
```

### 4.4 イベント

```typescript
interface GameEvent {
  id: string;
  name: string;
  description: string;
  eventType: 'scenario' | 'bond' | 'random' | 'story' | 'generic';
  category?: 'scenario' | 'generic' | 'character';
  dialogue: string[];
  dialogues?: EventDialogue[];
  triggerCondition?: EventTrigger;
  choices: EventChoice[];
  isRepeatable: boolean;
  priority: number;
}

interface EventDialogue {
  speaker: 'player' | 'producer' | 'narrator' | string;
  speakerName?: string;
  text: string;
  emotion?: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'shy';
}

interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  nextEventId?: string;
}
```

---

## 5. コンポーネント構成

### 5.1 画面階層

```
App.tsx
├── TitleScreen
│   └── スタートボタン
│
├── MainMenu
│   ├── キャラクター一覧
│   ├── 育成済みキャラ表示
│   └── 統計情報
│
├── CharacterCreation（5ステップ）
│   ├── Step1: 基本情報（名前・性別・年齢）
│   ├── Step2: 性格・スキル選択
│   ├── Step3: 外見設定
│   ├── Step4: 口調設定
│   └── Step5: 確認
│
├── DeckSelection
│   ├── サポートキャラ選択（2-4人）
│   ├── ボーナス表示
│   └── 開始ボタン
│
├── TrainingScreen
│   ├── ステータスパネル
│   ├── コンディションバー
│   ├── リソース表示（ゴールド・名声・週）
│   ├── アクションタブ
│   │   ├── レッスン
│   │   ├── キズナ練習
│   │   ├── 休息
│   │   ├── 営業
│   │   └── 設備
│   ├── サポートデッキ表示
│   ├── イベントダイアログ
│   ├── カード選択モーダル
│   └── 絆練習エフェクト
│
└── BattleScreen
    ├── バトルヘッダー
    ├── 参加者パネル（4人）
    ├── カード選択UI
    ├── 解決アニメーション
    └── 結果表示
```

### 5.2 主要コンポーネント

| ファイル | 行数 | 説明 |
|----------|------|------|
| TrainingScreen.tsx | 882 | メイン育成画面 |
| BattleScreen.tsx | 439 | バトル画面 |
| CharacterCreation.tsx | 346 | キャラ作成ウィザード |
| DeckSelection.tsx | 312 | サポート選択 |
| DeckEditor.tsx | 300 | デッキ管理 |
| BondTrainingEffect.tsx | 158 | 絆練習エフェクト |
| EventDialog.tsx | 135 | イベント表示 |

---

## 6. 状態管理

### 6.1 Zustandストア構造

```typescript
interface GameState {
  // キャラクター管理
  editCharacters: EditCharacter[];
  trainedCharacters: TrainedCharacter[];
  unlockedFixedCharacters: string[];

  // 現在のセッション
  currentSession: TrainingSession | null;
  currentBattle: BattleState | null;

  // 統計
  totalTrainingCount: number;

  // 設定
  settings: GameSettings;
}
```

### 6.2 永続化

```typescript
// localStorage保存対象
persist: {
  editCharacters,
  trainedCharacters,
  unlockedFixedCharacters,
  totalTrainingCount,
  settings
}

// 保存キー
'idol-training-game'      // メインデータ
'idol-game-decks'         // デッキデータ
```

### 6.3 主要アクション

| カテゴリ | アクション |
|----------|-----------|
| キャラクター | createEditCharacter, deleteEditCharacter, updateEditCharacter |
| 育成 | startTraining, endTraining, abandonTraining |
| 週間 | performLesson, performBondLesson, performRest, performBusiness, advanceWeek |
| 絆 | addBond, triggerBondEvent, completeBondEvent |
| カード | addCardGauge, claimCardFromGauge, addCard |
| 設備 | purchaseFacility, upgradeFacility |
| バトル | startBattle, selectCards, resolveNextParticipant, nextTurn, endBattle |
| イベント | setCurrentEvent, processEventChoice, checkScenarioEvent |

---

## 7. ゲームフロー

### 7.1 全体フロー

```
タイトル画面
    ↓
メインメニュー
    ↓
キャラクター作成 or 既存キャラ選択
    ↓
サポートデッキ選択（2-4人）
    ↓
育成開始（48週）
    │
    ├─→ 週間アクション選択
    │   ├── レッスン（ステータスUP）
    │   ├── 絆練習（絆UP + ステータスUP）
    │   ├── 休息（疲労回復）
    │   ├── 営業（ゴールド・名声獲得）
    │   └── 設備購入・強化
    │
    ├─→ イベント発生
    │   ├── シナリオイベント
    │   ├── 絆イベント
    │   └── ランダムイベント
    │
    ├─→ オーディション（定期開催）
    │   └── 4人対戦バトル
    │
    └─→ 週進行 → 48週終了まで繰り返し
    ↓
育成完了 → 育成済みキャラとして保存
    ↓
メインメニューに戻る
```

### 7.2 バトルフロー

```
バトル開始
    ↓
初期化（デッキシャッフル・手札配布・トレンド決定）
    ↓
┌─→ ターン開始
│   ↓
│   カード選択フェーズ
│   ├── プレイヤー: 手札からカード選択
│   └── AI: 自動選択
│   ↓
│   カード解決フェーズ
│   ├── 行動速度順に処理
│   ├── スター獲得計算
│   └── エフェクト適用
│   ↓
│   ターン終了
│   ├── カードドロー（2枚）
│   ├── スタミナ回復（+1）
│   └── トレンド変更
│   ↓
└── 5ターン終了まで繰り返し
    ↓
結果発表
├── 順位確定（スター数）
├── 報酬獲得
└── 育成画面に戻る
```

---

## 付録

### A. 固定サポートキャラクター

| 名前 | 性格 | 専門 | 特徴 |
|------|------|------|------|
| 火姫（ヒカリ） | 熱血 | Passion | やる気ボーナス+30% |
| 零（レイ） | クール | Cool | 怪我率-20% |
| 澪（ミオ） | 天然 | Cute | カードゲージ+20% |
| 由紀（ユキ） | 完璧主義 | Clever | ヒント率+15% |
| 奏（カナデ） | 優雅 | Elegant | 名声+25% |

### B. 性格タイプ

| タイプ | 日本語 | 特徴 |
|--------|--------|------|
| hotblooded | 熱血 | 情熱的でエネルギッシュ |
| cool | クール | 冷静沈着 |
| natural | 天然 | マイペースで癒し系 |
| hardworker | 努力家 | コツコツ真面目 |
| competitive | 負けず嫌い | 闘争心が強い |
| spoiled | 甘えん坊 | 人懐っこい |
| perfectionist | 完璧主義 | 細部までこだわる |
| moodmaker | ムードメーカー | 場を明るくする |

### C. 口調テンプレート

**女性用**: 丁寧語、カジュアル、お嬢様、ギャル、静か、元気、ツンデレ、方言
**男性用**: 丁寧語、カジュアル、熱血、クール、王子様、荒っぽい、静か、方言
**中性**: 丁寧語、カジュアル、ロボット、カスタム

### D. コード統計

| カテゴリ | 行数 |
|----------|------|
| 型定義 | 772 |
| ストア | 1,753 |
| コンポーネント | 2,500+ |
| データ | 1,500+ |
| CSS | 1,500+ |
| **合計** | **約7,000行** |

---

*このドキュメントはゲーム開発の参照用として作成されました。*
