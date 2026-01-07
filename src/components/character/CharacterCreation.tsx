import React, { useState } from 'react';
import { Button, Card, Modal } from '../ui';
import { useGameStore } from '../../store';
import {
  Gender,
  PersonalityType,
  SpeechTemplate,
  UniqueSkillType,
  CharacterAppearance,
  SpeechStyle,
  UniqueSkill,
} from '../../types';
import './CharacterCreation.css';

interface CharacterCreationProps {
  onComplete: () => void;
  onCancel: () => void;
}

const PERSONALITY_OPTIONS: { value: PersonalityType; label: string; description: string }[] = [
  { value: 'hotblooded', label: '熱血', description: 'スタミナ4以上でアピール+1' },
  { value: 'cool', label: 'クール', description: '先行時アピール+1' },
  { value: 'natural', label: '天然', description: 'トレンド一致ボーナス+1' },
  { value: 'hardworker', label: '努力家', description: '毎ターンスタミナ回復+1' },
  { value: 'competitive', label: '負けず嫌い', description: 'スコア負け時アピール+1' },
  { value: 'spoiled', label: '甘えん坊', description: '後攻時妨害1回自動無効' },
  { value: 'perfectionist', label: '完璧主義', description: '妨害を受けていない時アピール+1' },
  { value: 'moodmaker', label: 'ムードメーカー', description: 'ボルテージ獲得+1' },
];

const SPEECH_TEMPLATE_OPTIONS: { value: SpeechTemplate; label: string; gender: 'female' | 'male' | 'common' }[] = [
  { value: 'female_polite', label: '標準敬語', gender: 'female' },
  { value: 'female_casual', label: '標準タメ', gender: 'female' },
  { value: 'female_ojou', label: 'お嬢様', gender: 'female' },
  { value: 'female_gyaru', label: 'ギャル', gender: 'female' },
  { value: 'female_quiet', label: '無口', gender: 'female' },
  { value: 'female_energetic', label: '元気', gender: 'female' },
  { value: 'female_tsundere', label: 'ツンデレ', gender: 'female' },
  { value: 'female_dialect_a', label: '方言A', gender: 'female' },
  { value: 'male_polite', label: '標準敬語', gender: 'male' },
  { value: 'male_casual', label: '標準タメ', gender: 'male' },
  { value: 'male_hotblooded', label: '熱血', gender: 'male' },
  { value: 'male_cool', label: 'クール', gender: 'male' },
  { value: 'male_prince', label: '王子様', gender: 'male' },
  { value: 'male_rough', label: 'オラオラ', gender: 'male' },
  { value: 'male_quiet', label: '無口', gender: 'male' },
  { value: 'male_dialect_b', label: '方言B', gender: 'male' },
  { value: 'neutral_polite', label: '中性敬語', gender: 'common' },
  { value: 'neutral_casual', label: '中性タメ', gender: 'common' },
  { value: 'robot', label: 'ロボット', gender: 'common' },
  { value: 'custom', label: 'カスタム', gender: 'common' },
];

const UNIQUE_SKILL_OPTIONS: { value: UniqueSkillType; label: string; description: string }[] = [
  { value: 'growth_style_a', label: '特化成長', description: '特定スタイル成長率UP' },
  { value: 'growth_style_b', label: 'バランス成長', description: '全スタイル成長率微UP' },
  { value: 'condition_a', label: '疲労軽減', description: '疲労の蓄積を軽減' },
  { value: 'condition_b', label: '体調維持', description: '体調を維持しやすい' },
  { value: 'event_a', label: 'イベントマスター', description: '特定イベント発生率UP' },
  { value: 'event_b', label: '報酬アップ', description: 'イベント報酬UP' },
  { value: 'live_a', label: 'ステージ映え', description: '特定条件でアピールUP' },
  { value: 'live_b', label: '効率派', description: 'リソース効率UP' },
  { value: 'money', label: '商才', description: '収入UP' },
  { value: 'bond', label: '絆の力', description: '絆上昇率UP' },
];

export const CharacterCreation: React.FC<CharacterCreationProps> = ({
  onComplete,
  onCancel,
}) => {
  const createEditCharacter = useGameStore((state) => state.createEditCharacter);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [age, setAge] = useState(16);
  const [agency, setAgency] = useState('');
  const [personality, setPersonality] = useState<PersonalityType>('hardworker');
  const [firstPerson, setFirstPerson] = useState('私');
  const [secondPerson, setSecondPerson] = useState('あなた');
  const [speechTemplate, setSpeechTemplate] = useState<SpeechTemplate>('female_polite');
  const [uniqueSkillType, setUniqueSkillType] = useState<UniqueSkillType>('growth_style_b');

  const [appearance] = useState<CharacterAppearance>({
    hairStyle: 1,
    hairColor: '#333333',
    eyeStyle: 1,
    eyeColor: '#8B4513',
    outfit: 1,
    accessory: 0,
  });

  const handleCreate = () => {
    const speechStyle: SpeechStyle = {
      firstPerson,
      secondPerson,
      template: speechTemplate,
    };

    const uniqueSkill: UniqueSkill = {
      type: uniqueSkillType,
      name: UNIQUE_SKILL_OPTIONS.find((s) => s.value === uniqueSkillType)?.label || '',
      description: UNIQUE_SKILL_OPTIONS.find((s) => s.value === uniqueSkillType)?.description || '',
    };

    createEditCharacter({
      name,
      gender,
      age,
      agency,
      appearance,
      personality,
      speechStyle,
      uniqueSkill,
    });

    onComplete();
  };

  const renderStep1 = () => (
    <div className="character-creation__step">
      <h3>基本情報</h3>
      <div className="character-creation__field">
        <label>名前</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="キャラクター名を入力"
        />
      </div>
      <div className="character-creation__field">
        <label>性別</label>
        <div className="character-creation__radio-group">
          {(['female', 'male', 'other'] as Gender[]).map((g) => (
            <label key={g} className="character-creation__radio">
              <input
                type="radio"
                name="gender"
                value={g}
                checked={gender === g}
                onChange={() => setGender(g)}
              />
              {g === 'female' ? '女性' : g === 'male' ? '男性' : 'その他'}
            </label>
          ))}
        </div>
      </div>
      <div className="character-creation__field">
        <label>年齢: {age}歳</label>
        <input
          type="range"
          min={13}
          max={25}
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
      </div>
      <div className="character-creation__field">
        <label>所属事務所</label>
        <input
          type="text"
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
          placeholder="事務所名を入力"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="character-creation__step">
      <h3>性格設定</h3>
      <div className="character-creation__grid">
        {PERSONALITY_OPTIONS.map((p) => (
          <Card
            key={p.value}
            onClick={() => setPersonality(p.value)}
            selected={personality === p.value}
          >
            <div className="character-creation__personality">
              <strong>{p.label}</strong>
              <span>{p.description}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => {
    const filteredTemplates = SPEECH_TEMPLATE_OPTIONS.filter(
      (t) =>
        t.gender === 'common' ||
        (gender === 'female' && t.gender === 'female') ||
        (gender === 'male' && t.gender === 'male') ||
        gender === 'other'
    );

    return (
      <div className="character-creation__step">
        <h3>口調設定</h3>
        <div className="character-creation__field">
          <label>一人称</label>
          <input
            type="text"
            value={firstPerson}
            onChange={(e) => setFirstPerson(e.target.value)}
            placeholder="私、僕、俺など"
          />
        </div>
        <div className="character-creation__field">
          <label>二人称</label>
          <input
            type="text"
            value={secondPerson}
            onChange={(e) => setSecondPerson(e.target.value)}
            placeholder="あなた、君、お前など"
          />
        </div>
        <div className="character-creation__field">
          <label>語尾テンプレート</label>
          <select
            value={speechTemplate}
            onChange={(e) => setSpeechTemplate(e.target.value as SpeechTemplate)}
          >
            {filteredTemplates.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="character-creation__step">
      <h3>固有スキル</h3>
      <div className="character-creation__grid">
        {UNIQUE_SKILL_OPTIONS.map((s) => (
          <Card
            key={s.value}
            onClick={() => setUniqueSkillType(s.value)}
            selected={uniqueSkillType === s.value}
          >
            <div className="character-creation__skill">
              <strong>{s.label}</strong>
              <span>{s.description}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="character-creation__step">
      <h3>確認</h3>
      <div className="character-creation__summary">
        <div className="character-creation__summary-item">
          <span>名前:</span> <strong>{name || '(未入力)'}</strong>
        </div>
        <div className="character-creation__summary-item">
          <span>性別:</span>{' '}
          <strong>
            {gender === 'female' ? '女性' : gender === 'male' ? '男性' : 'その他'}
          </strong>
        </div>
        <div className="character-creation__summary-item">
          <span>年齢:</span> <strong>{age}歳</strong>
        </div>
        <div className="character-creation__summary-item">
          <span>事務所:</span> <strong>{agency || '(未入力)'}</strong>
        </div>
        <div className="character-creation__summary-item">
          <span>性格:</span>{' '}
          <strong>
            {PERSONALITY_OPTIONS.find((p) => p.value === personality)?.label}
          </strong>
        </div>
        <div className="character-creation__summary-item">
          <span>一人称/二人称:</span>{' '}
          <strong>
            {firstPerson} / {secondPerson}
          </strong>
        </div>
        <div className="character-creation__summary-item">
          <span>固有スキル:</span>{' '}
          <strong>
            {UNIQUE_SKILL_OPTIONS.find((s) => s.value === uniqueSkillType)?.label}
          </strong>
        </div>
      </div>
    </div>
  );

  return (
    <div className="character-creation">
      <div className="character-creation__header">
        <h2>キャラクター作成</h2>
        <div className="character-creation__steps">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`character-creation__step-indicator ${
                step === s ? 'active' : step > s ? 'completed' : ''
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="character-creation__content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>

      <div className="character-creation__actions">
        {step > 1 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)}>
            戻る
          </Button>
        )}
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        {step < 5 ? (
          <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !name}>
            次へ
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={!name}>
            作成する
          </Button>
        )}
      </div>
    </div>
  );
};
