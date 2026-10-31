// Game screens drawn as SVG, using the game's real content, art and tokens.
import { Avatar, Mascot } from '../../../src/art/characters';
import { Building, StickerArt } from '../../../src/art/town';
import { Picture } from '../../../src/components/Picture';
import { CATEGORIES } from '../../../src/content/categories';
import { STICKERS } from '../../../src/content/stickers';
import { Embed, GAME, GameButton, GameSlot, GameTile, Star, Trail, useSvgId } from './kit';

const sticker = (name: string) => STICKERS.find((s) => s.name === name)!;

function Lines({ x, y, lines, size, lh = 1.3, weight = 700, fill = GAME.ink, anchor = 'start', font = GAME.body }: { x: number; y: number; lines: string[]; size: number; lh?: number; weight?: number; fill?: string; anchor?: 'start' | 'middle'; font?: string }) {
  return (
    <text x={x} y={y} fontFamily={font} fontWeight={weight} fontSize={size} fill={fill} textAnchor={anchor}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : size * lh}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

function Header({ w, title, sub, trail, current = 0, done = [] }: { w: number; title: string; sub: string; trail?: boolean; current?: number; done?: number[] }) {
  const compact = w < 260;
  return (
    <g>
      <rect x={0} y={0} width={w} height={compact ? 66 : 46} fill="#e0f2fe" />
      <rect x={0} y={compact ? 64 : 44} width={w} height={2.5} fill={GAME.ink} />
      <circle cx={18} cy={20} r={11} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <rect x={14} y={15} width={3} height={10} rx={1} fill={GAME.ink} />
      <rect x={19} y={15} width={3} height={10} rx={1} fill={GAME.ink} />
      <text x={36} y={18} fontFamily={GAME.font} fontWeight={800} fontSize={compact ? 12 : 13} fill={GAME.ink}>
        {title}
      </text>
      <text x={36} y={32} fontFamily={GAME.body} fontWeight={700} fontSize={compact ? 9.5 : 10} fill={GAME.inkSoft}>
        {sub}
      </text>
      {trail && (compact ? <Trail x={22} y={52} current={current} done={done} r={6.5} gap={3} /> : <Trail x={w - 8 * 18 - 10} y={22} current={current} done={done} r={7} gap={4} />)}
    </g>
  );
}

/** Town map dashboard with the six places. */
export function TownScreen() {
  const id = useSvgId('town');
  const W = 640;
  const cols = 3;
  const cellW = 192;
  const cellH = 142;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-map`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfeaff" />
          <stop offset="0.4" stopColor="#dff7d9" />
          <stop offset="1" stopColor="#bbf7a8" />
        </linearGradient>
      </defs>
      <rect width={W} height={380} fill="#e9f8ff" />
      <g>
        <rect x={10} y={8} width={98} height={36} rx={18} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
        <Embed x={12} y={10} w={32} h={32}>
          <Avatar avatarId="a1" size={32} />
        </Embed>
        <text x={50} y={31} fontFamily={GAME.font} fontWeight={800} fontSize={14} fill={GAME.ink}>
          Star
        </text>
        <rect x={116} y={12} width={60} height={28} rx={14} fill={GAME.purple} stroke={GAME.ink} strokeWidth={2} />
        <text x={146} y={30} textAnchor="middle" fontFamily={GAME.font} fontWeight={800} fontSize={12} fill={GAME.ink}>
          Year 2
        </text>
        <text x={190} y={31} fontFamily={GAME.font} fontWeight={800} fontSize={17} fill={GAME.ink}>
          Welcome to Mission Town!
        </text>
        <GameButton x={482} y={9} w={148} h={32} label="Start Mission" size={14} />
      </g>
      <rect x={10} y={54} width={620} height={318} rx={22} fill={`url(#${id}-map)`} stroke={GAME.ink} strokeWidth={2.4} />
      <path d="M10 270 Q180 210 320 268 Q470 320 630 250" fill="none" stroke="#fde68a" strokeWidth={22} strokeLinecap="round" opacity={0.85} />
      {CATEGORIES.map((c, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 22 + col * (cellW + 10);
        const y = 62 + row * (cellH + 10);
        const labelW = c.place.length * 7.3 + 24;
        return (
          <g key={c.id}>
            <rect x={x} y={y} width={cellW} height={cellH} rx={16} fill="#ffffff" opacity={0.55} />
            <Embed x={x + 26} y={y + 2} w={140} h={102}>
              <Building categoryId={c.id} />
            </Embed>
            <rect x={x + cellW / 2 - labelW / 2} y={y + 104} width={labelW} height={20} rx={10} fill={c.colour} stroke={GAME.ink} strokeWidth={1.8} />
            <text x={x + cellW / 2} y={y + 118} textAnchor="middle" fontFamily={GAME.font} fontWeight={800} fontSize={12} fill="#ffffff">
              {c.place}
            </text>
            <text x={x + cellW / 2} y={y + 136} textAnchor="middle" fontFamily={GAME.body} fontWeight={800} fontSize={10.5} fill={GAME.ink}>
              {c.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Scorecard after a mission. */
export function ScoreScreen({ score = 7, stickerName = 'Super Tapir' }: { score?: number; stickerName?: string }) {
  const id = useSvgId('score');
  const def = sticker(stickerName);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.6" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <rect width={300} height={400} fill={`url(#${id}-bg)`} />
      <Embed x={110} y={8} w={80} h={80}>
        <Mascot mood="cheer" size={80} animate={false} />
      </Embed>
      <text x={150} y={110} textAnchor="middle" fontFamily={GAME.font} fontWeight={800} fontSize={29} fill="#d97706">
        Congratulations!
      </text>
      <text x={150} y={130} textAnchor="middle" fontFamily={GAME.body} fontWeight={700} fontSize={11.5} fill={GAME.ink}>
        Star, you finished “Simple Sentences”!
      </text>
      <Star cx={100} cy={162} r={20} />
      <Star cx={150} cy={158} r={24} />
      <Star cx={200} cy={162} r={20} />
      <rect x={30} y={192} width={240} height={46} rx={14} fill="#fef9c3" stroke={GAME.ink} strokeWidth={2.2} />
      <text x={46} y={220} fontFamily={GAME.body} fontWeight={800} fontSize={12} fill={GAME.ink}>
        First-try score
      </text>
      <text x={256} y={224} textAnchor="end" fontFamily={GAME.font} fontWeight={800} fontSize={24} fill={GAME.ink}>
        {score} / 8
      </text>
      <rect x={30} y={248} width={240} height={86} rx={16} fill="#fdf2f8" stroke={GAME.ink} strokeWidth={2.2} />
      <Embed x={42} y={256} w={70} h={70}>
        <StickerArt def={def} />
      </Embed>
      <text x={124} y={286} fontFamily={GAME.font} fontWeight={800} fontSize={15} fill={GAME.ink}>
        New sticker!
      </text>
      <text x={124} y={306} fontFamily={GAME.body} fontWeight={800} fontSize={12} fill={GAME.inkSoft}>
        {def.name}
      </text>
      <GameButton x={60} y={348} w={180} h={34} label="Next Mission" size={15} />
    </g>
  );
}

/** Sentence Builder question on a phone. */
export function PhoneSentenceScreen() {
  return (
    <g>
      <rect width={190} height={390} fill="#e9f8ff" />
      <Header w={190} title="Sentence Builder" sub="Question 3 of 8" trail current={2} done={[0, 1]} />
      <rect x={10} y={78} width={170} height={44} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <text x={20} y={105} fontFamily={GAME.body} fontWeight={800} fontSize={14} fill={GAME.ink}>
        Build the sentence.
      </text>
      <rect x={55} y={130} width={80} height={80} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <Embed x={60} y={135} w={70} h={70}>
        <Picture picture="act:badminton" />
      </Embed>
      {[0, 1, 2, 3].map((i) => (
        <GameSlot key={i} x={12 + i * 42} y={222} w={38} />
      ))}
      <rect x={8} y={268} width={174} height={66} rx={14} fill="rgba(255,255,255,.6)" stroke="#cbd5e1" strokeWidth={1.6} strokeDasharray="5 4" />
      <GameTile x={16} y={278} label="Aina" size={12} h={24} />
      <GameTile x={68} y={278} label="plays" size={12} h={24} />
      <GameTile x={124} y={278} label="." size={12} h={24} />
      <GameTile x={50} y={304} label="badminton" size={12} h={24} />
      <GameButton x={22} y={344} w={146} h={32} label="Check Answer" fill={GAME.go} size={13} />
    </g>
  );
}

// ---------------- World mockups ----------------

export function WordExplorerScreen() {
  const rows: [string, string, boolean][] = [
    ['cat', 'cat', true],
    ['dog', 'dog', false],
    ['rabbit', 'rabbit', false],
  ];
  return (
    <g>
      <rect width={420} height={300} fill="#e9f8ff" />
      <Header w={420} title="Animals in the Park" sub="Question 7 of 8 · Town Park" trail current={6} done={[0, 1, 2, 3, 4, 5]} />
      <text x={16} y={70} fontFamily={GAME.body} fontWeight={800} fontSize={14} fill={GAME.ink}>
        Match each word to its picture.
      </text>
      {rows.map(([word, pic, matched], i) => {
        const y = 82 + i * 54;
        return (
          <g key={word}>
            <rect x={16} y={y} width={120} height={44} rx={12} fill="#f0f9ff" stroke={GAME.ink} strokeWidth={2} />
            <text x={76} y={y + 28} textAnchor="middle" fontFamily={GAME.body} fontWeight={800} fontSize={16} fill={GAME.ink}>
              {word}
            </text>
            <text x={152} y={y + 29} fontFamily={GAME.body} fontWeight={900} fontSize={18} fill={GAME.ink}>
              →
            </text>
            {matched ? (
              <g>
                <rect x={176} y={y} width={92} height={44} rx={12} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
                <Embed x={202} y={y + 2} w={40} h={40}>
                  <Picture picture={pic} />
                </Embed>
              </g>
            ) : (
              <GameSlot x={176} y={y} w={92} h={44} />
            )}
          </g>
        );
      })}
      <rect x={290} y={82} width={116} height={152} rx={14} fill="rgba(255,255,255,.6)" stroke="#cbd5e1" strokeWidth={1.6} strokeDasharray="5 4" />
      {['rabbit', 'monkey', 'dog'].map((p, i) => (
        <g key={p}>
          <rect x={312} y={90 + i * 47} width={72} height={40} rx={10} fill={i === 2 ? '#fef08a' : GAME.white} stroke={GAME.ink} strokeWidth={2} />
          <Embed x={330} y={92 + i * 47} w={36} h={36}>
            <Picture picture={p} />
          </Embed>
        </g>
      ))}
      <GameButton x={140} y={252} w={140} h={32} label="Check Answer" fill={GAME.go} size={13} disabled />
    </g>
  );
}

export function ListenScreen() {
  const scenes = [
    { item: 'bag:red', relation: 'under' as const },
    { item: 'bag:red', relation: 'on' as const },
    { item: 'bag:blue', relation: 'under' as const },
    { item: 'bag:red', relation: 'next to' as const },
  ];
  return (
    <g>
      <rect width={190} height={390} fill="#e9f8ff" />
      <Header w={190} title="Where Is It?" sub="Question 1 of 8" trail current={0} />
      <rect x={10} y={76} width={170} height={44} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <Lines x={20} y={94} lines={['Listen. Choose the', 'matching picture.']} size={11.5} weight={800} />
      <rect x={10} y={128} width={170} height={42} rx={14} fill="#f0f9ff" stroke={GAME.ink} strokeWidth={2} />
      <circle cx={32} cy={149} r={14} fill={GAME.blue} stroke={GAME.ink} strokeWidth={2} />
      <path d="M25 145 L29 145 L34 141 L34 157 L29 153 L25 153 Z" fill={GAME.ink} />
      <rect x={56} y={136} width={116} height={26} rx={13} fill={GAME.blue} stroke={GAME.ink} strokeWidth={2} />
      <text x={114} y={153} textAnchor="middle" fontFamily={GAME.font} fontWeight={800} fontSize={12} fill={GAME.ink}>
        Listen again
      </text>
      {scenes.map((s, i) => {
        const x = 10 + (i % 2) * 88;
        const y = 180 + Math.floor(i / 2) * 92;
        return (
          <g key={i}>
            <rect x={x} y={y} width={82} height={84} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
            <Embed x={x + 6} y={y + 4} w={70} h={76}>
              <Picture picture={{ kind: 'scene', item: s.item, relation: s.relation, anchor: 'chair' }} />
            </Embed>
          </g>
        );
      })}
    </g>
  );
}

export function SentenceTabletScreen() {
  return (
    <g>
      <rect width={420} height={300} fill="#e9f8ff" />
      <Header w={420} title="Simple Sentences" sub="Question 3 of 8 · School Clubhouse" trail current={2} done={[0, 1]} />
      <text x={16} y={70} fontFamily={GAME.body} fontWeight={800} fontSize={14} fill={GAME.ink}>
        Build the sentence.
      </text>
      <rect x={344} y={54} width={60} height={60} rx={12} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <Embed x={348} y={58} w={52} h={52}>
        <Picture picture="cat" />
      </Embed>
      <GameTile x={40} y={128} label="The" w={70} h={36} size={15} />
      <GameTile x={120} y={128} label="cat" w={70} h={36} size={15} />
      <GameSlot x={200} y={128} w={70} h={36} />
      <GameSlot x={280} y={128} w={70} h={36} />
      <text x={210} y={190} textAnchor="middle" fontFamily={GAME.font} fontWeight={700} fontSize={18} fill={GAME.ink}>
        The cat
      </text>
      <rect x={60} y={204} width={300} height={44} rx={14} fill="rgba(255,255,255,.6)" stroke="#cbd5e1" strokeWidth={1.6} strokeDasharray="5 4" />
      <GameTile x={96} y={210} label="sleeping" size={14} h={30} />
      <GameTile x={204} y={210} label="is" w={46} size={14} h={30} selected />
      <GameTile x={262} y={210} label="." w={40} size={14} h={30} />
      <GameButton x={140} y={258} w={140} h={32} label="Check Answer" fill={GAME.go} size={13} disabled />
    </g>
  );
}

export function GrammarPhoneScreen() {
  return (
    <g>
      <rect width={190} height={390} fill="#e9f8ff" />
      <Header w={190} title="A or An?" sub="Question 1 of 8" trail current={0} />
      <rect x={10} y={76} width={170} height={40} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <text x={20} y={101} fontFamily={GAME.body} fontWeight={800} fontSize={12.5} fill={GAME.ink}>
        Choose the word that fits.
      </text>
      <rect x={55} y={126} width={80} height={80} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <Embed x={62} y={133} w={66} h={66}>
        <Picture picture="apple" />
      </Embed>
      <text x={14} y={248} fontFamily={GAME.font} fontWeight={700} fontSize={19} fill={GAME.ink}>
        I have
      </text>
      <GameSlot x={78} y={226} w={48} h={32} />
      <text x={132} y={248} fontFamily={GAME.font} fontWeight={700} fontSize={19} fill={GAME.ink}>
        apple.
      </text>
      <rect x={20} y={274} width={150} height={50} rx={14} fill="rgba(255,255,255,.6)" stroke="#cbd5e1" strokeWidth={1.6} strokeDasharray="5 4" />
      <GameTile x={48} y={284} label="a" w={40} size={15} />
      <GameTile x={102} y={284} label="an" w={40} size={15} />
      <GameButton x={22} y={340} w={146} h={32} label="Check Answer" fill={GAME.go} size={13} disabled />
    </g>
  );
}

export function DialoguePhoneScreen() {
  const opts = [['Yes, I would like a', 'pencil, please.'], ['Yes, you are a', 'pencil.'], ['No, it is Monday.']];
  return (
    <g>
      <rect width={190} height={390} fill="#e9f8ff" />
      <Header w={190} title="Please and Thank You" sub="Question 1 of 8" trail current={0} />
      <text x={12} y={90} fontFamily={GAME.body} fontWeight={800} fontSize={12.5} fill={GAME.ink}>
        Choose the best reply.
      </text>
      <circle cx={24} cy={120} r={13} fill="#fbcfe8" stroke={GAME.ink} strokeWidth={2} />
      <text x={24} y={125} textAnchor="middle" fontFamily={GAME.font} fontWeight={800} fontSize={13} fill={GAME.ink}>
        S
      </text>
      <rect x={42} y={100} width={136} height={40} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <text x={52} y={114} fontFamily={GAME.body} fontWeight={800} fontSize={8.5} fill={GAME.inkSoft}>
        Shopkeeper
      </text>
      <text x={52} y={130} fontFamily={GAME.body} fontWeight={800} fontSize={11.5} fill={GAME.ink}>
        Can I help you?
      </text>
      <rect x={12} y={150} width={134} height={34} rx={14} fill="#fef3c7" stroke={GAME.ink} strokeWidth={2} strokeDasharray="5 3" />
      <text x={24} y={172} fontFamily={GAME.body} fontWeight={800} fontSize={12} fill="#94a3b8">
        ? ? ?
      </text>
      <Embed x={150} y={148} w={36} h={36}>
        <Avatar avatarId="a2" size={36} />
      </Embed>
      {opts.map((lines, i) => (
        <g key={i}>
          <rect x={12} y={196 + i * 54} width={166} height={46} rx={14} fill={i === 0 ? '#fef3c7' : GAME.white} stroke={GAME.ink} strokeWidth={2} />
          <Lines x={22} y={lines.length > 1 ? 215 + i * 54 : 223 + i * 54} lines={lines} size={11} weight={800} />
        </g>
      ))}
      <GameButton x={22} y={354} w={146} h={28} label="Check Answer" fill={GAME.go} size={12} />
    </g>
  );
}

export function StoryTabletScreen() {
  const opts = ['Oyen', 'Aina', 'Ravi', 'Tom'];
  return (
    <g>
      <rect width={420} height={300} fill="#e9f8ff" />
      <Header w={420} title="Oyen and the Park" sub="Question 1 of 8 · Story Treehouse" trail current={0} />
      <rect x={10} y={56} width={200} height={234} rx={16} fill="#fffbeb" stroke={GAME.ink} strokeWidth={2} />
      <text x={22} y={80} fontFamily={GAME.font} fontWeight={800} fontSize={16} fill={GAME.ink}>
        Aina's Cat
      </text>
      {['cat', 'fish', 'table'].map((p, i) => (
        <g key={p}>
          <rect x={26 + i * 58} y={90} width={50} height={50} rx={10} fill={GAME.white} stroke={GAME.ink} strokeWidth={1.8} />
          <Embed x={30 + i * 58} y={94} w={42} h={42}>
            <Picture picture={p} />
          </Embed>
        </g>
      ))}
      <Lines x={22} y={164} lines={['Aina has a cat. The cat is', 'orange. Its name is Oyen.', 'Oyen likes fish. Oyen', 'sleeps under the table.', 'Aina loves Oyen.']} size={12} lh={1.45} weight={600} />
      <rect x={222} y={56} width={188} height={44} rx={14} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <text x={232} y={83} fontFamily={GAME.body} fontWeight={800} fontSize={12.5} fill={GAME.ink}>
        What is the cat's name?
      </text>
      {opts.map((o, i) => (
        <g key={o}>
          <rect x={222 + (i % 2) * 96} y={112 + Math.floor(i / 2) * 50} width={88} height={40} rx={12} fill={i === 0 ? '#fef3c7' : GAME.white} stroke={GAME.ink} strokeWidth={2} />
          <text x={266 + (i % 2) * 96} y={137 + Math.floor(i / 2) * 50} textAnchor="middle" fontFamily={GAME.body} fontWeight={800} fontSize={14} fill={GAME.ink}>
            {o}
          </text>
        </g>
      ))}
      <GameButton x={246} y={226} w={140} h={32} label="Check Answer" fill={GAME.go} size={13} />
    </g>
  );
}

/** Correct-answer moment with celebration (CSS-animated when visible). */
export function CelebrationScreen() {
  const bursts = [
    { x: 90, y: 70, c: '#f472b6' },
    { x: 320, y: 60, c: '#38bdf8' },
    { x: 220, y: 40, c: '#facc15' },
  ];
  return (
    <g>
      <rect width={420} height={300} fill="#e9f8ff" />
      <Header w={420} title="Animals in the Park" sub="Question 1 of 8 · Town Park" trail current={0} done={[0]} />
      <g className="cele-bursts">
        {bursts.map((b, i) => (
          <g key={i} className="burst" style={{ animationDelay: `${i * 0.45}s`, transformOrigin: `${b.x}px ${b.y + 40}px` }}>
            {Array.from({ length: 12 }, (_, k) => {
              const a = (Math.PI * 2 * k) / 12;
              return <line key={k} x1={b.x + Math.cos(a) * 8} y1={b.y + 40 + Math.sin(a) * 8} x2={b.x + Math.cos(a) * 26} y2={b.y + 40 + Math.sin(a) * 26} stroke={k % 3 === 0 ? '#facc15' : b.c} strokeWidth={3.2} strokeLinecap="round" />;
            })}
          </g>
        ))}
        <path className="ribbon" d="M20 290 C 60 220, 0 200, 50 150 S 70 90, 40 60" fill="none" stroke="#f97316" strokeWidth={5} strokeLinecap="round" />
        <path className="ribbon r2" d="M400 290 C 360 230, 420 200, 370 160 S 350 100, 385 70" fill="none" stroke="#8b5cf6" strokeWidth={5} strokeLinecap="round" />
        {Array.from({ length: 16 }, (_, k) => (
          <rect key={k} className="confetti" x={30 + k * 24} y={56} width={6} height={10} rx={1.5} fill={['#ef4444', '#facc15', '#22c55e', '#3b82f6', '#ec4899', '#a855f7'][k % 6]} style={{ animationDelay: `${(k % 5) * 0.25}s` }} />
        ))}
      </g>
      <rect x={90} y={80} width={240} height={120} rx={18} fill={GAME.white} stroke={GAME.ink} strokeWidth={2.2} />
      <rect x={100} y={90} width={100} height={100} rx={14} fill="#fef3c7" stroke={GAME.ink} strokeWidth={2} />
      <Embed x={108} y={98} w={84} h={84}>
        <Picture picture="elephant" />
      </Embed>
      <Lines x={212} y={118} lines={['Which animal', 'has a long', 'trunk?']} size={13} weight={800} />
      <rect x={20} y={212} width={380} height={76} rx={18} fill="#dcfce7" stroke={GAME.ink} strokeWidth={2.2} />
      <Embed x={26} y={214} w={70} h={70}>
        <Mascot mood="cheer" size={70} animate={false} />
      </Embed>
      <text x={104} y={244} fontFamily={GAME.font} fontWeight={800} fontSize={24} fill="#15803d">
        Brilliant!
      </text>
      <text x={104} y={266} fontFamily={GAME.body} fontWeight={700} fontSize={11.5} fill={GAME.ink}>
        An elephant has a long trunk.
      </text>
      <GameButton x={300} y={246} w={86} h={30} label="Next" size={14} />
    </g>
  );
}

export function StickerAlbumScreen({ names }: { names: string[] }) {
  return (
    <g>
      <rect width={420} height={300} fill="#fdf2f8" />
      <text x={20} y={36} fontFamily={GAME.font} fontWeight={800} fontSize={20} fill={GAME.ink}>
        Sticker Album
      </text>
      <rect x={250} y={20} width={150} height={16} rx={8} fill={GAME.white} stroke={GAME.ink} strokeWidth={2} />
      <rect x={252} y={22} width={60} height={12} rx={6} fill="#f472b6" />
      {names.map((n, i) => {
        const x = 20 + (i % 3) * 132;
        const y = 54 + Math.floor(i / 3) * 120;
        return (
          <g key={n}>
            <Embed x={x + 22} y={y} w={84} h={84}>
              <StickerArt def={sticker(n)} />
            </Embed>
            <text x={x + 64} y={y + 102} textAnchor="middle" fontFamily={GAME.body} fontWeight={800} fontSize={12} fill={GAME.ink}>
              {n}
            </text>
          </g>
        );
      })}
    </g>
  );
}
