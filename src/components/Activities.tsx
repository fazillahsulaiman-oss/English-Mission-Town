import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { joinSentenceTiles } from '../engine/grading';
import { hashString, seededShuffle } from '../engine/random';
import type {
  ChoiceBasedQuestion,
  Choice,
  DragDropQuestion,
  FillBlankQuestion,
  MatchingQuestion,
  OrderingQuestion,
  Question,
  Response,
} from '../engine/types';
import { Picture } from './Picture';
import { Bank, Slot, SlotBoard, Tile, useOccupant, useOccupants, type BoardState } from './SlotBoard';

export interface ActivityProps<Q extends Question> {
  question: Q;
  seed: number;
  disabled: boolean;
  onResponse: (r: Response | null) => void;
  /** Option ids tried and found wrong (choice questions). */
  tried: string[];
  /** Option ids removed as a scaffold after two wrong attempts. */
  eliminated: string[];
}

const DRAG_HELP = 'Drag the words, or tap a word and then tap its place.';

function useShuffled<T extends { id: string }>(items: T[], seed: number, salt: string): T[] {
  return useMemo(() => seededShuffle(items, (seed ^ hashString(salt)) >>> 0), [items, seed, salt]);
}

function ChoiceContent({ c, showLabel, big }: { c: Choice; showLabel: boolean; big: boolean }) {
  return (
    <>
      {c.picture && <Picture picture={c.picture} label={showLabel ? undefined : (c.text ?? undefined)} className={big ? 'w-28 h-28 sm:w-32 sm:h-32' : 'w-16 h-16'} />}
      {(showLabel || !c.picture) && c.text && <span className="font-extrabold text-lg sm:text-xl leading-snug">{c.text}</span>}
    </>
  );
}

// ---------- Choice (multiple choice, picture, listening, story, dialogue) ----------
export function ChoiceActivity({ question, seed, disabled, onResponse, tried, eliminated }: ActivityProps<ChoiceBasedQuestion>) {
  const options = useShuffled(question.options, seed, question.id);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  useEffect(() => {
    // After a wrong attempt, clear the wrong selection so the child chooses again.
    // Tried options stay selectable (marked "Not this one").
    if (selectedRef.current && tried.includes(selectedRef.current)) {
      setSelected(null);
      onResponse(null);
    }
  }, [tried, onResponse]);
  const hasPictures = options.some((o) => o.picture);
  const grid = hasPictures ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2';
  return (
    <div role="radiogroup" aria-label="Answer choices" className={`grid ${grid} gap-3 sm:gap-4`}>
      {options.map((o) => {
        const isTried = tried.includes(o.id);
        const isGone = eliminated.includes(o.id);
        const isSel = selected === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={isSel}
            data-option-id={o.id}
            disabled={disabled || isGone}
            onClick={() => {
              setSelected(o.id);
              onResponse({ kind: 'choice', optionId: o.id });
            }}
            className={`relative card !rounded-3xl flex ${hasPictures ? 'flex-col' : 'flex-row text-left'} items-center justify-center gap-2 p-3 min-h-[64px] transition ${
              isSel ? '!bg-amber-100 ring-4 ring-amber-400 -translate-y-1' : 'hover:-translate-y-0.5'
            } ${isGone ? 'opacity-30 line-through' : ''} ${isTried && !isSel ? 'opacity-70' : ''}`}
          >
            {isSel && (
              <span className="absolute top-1.5 right-1.5 bg-amber-400 border-2 border-ink rounded-full w-7 h-7 grid place-items-center text-sm font-black" aria-hidden="true">
                ✓
              </span>
            )}
            <ChoiceContent c={o} showLabel={question.showOptionLabels || !o.picture} big={hasPictures} />
            {isTried && !isSel && <span className="text-sm font-bold text-slate-500">Not this one</span>}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Shared helpers for board activities ----------
function useBoardState(onChange: (s: BoardState) => void) {
  const [state, setState] = useState<BoardState>({ placements: {}, selected: null });
  const update = useCallback(
    (s: BoardState) => {
      setState(s);
      onChange(s);
    },
    [onChange],
  );
  return [state, update, setState] as const;
}

function itemRenderer(list: Choice[], showPicture = true) {
  const byId = Object.fromEntries(list.map((c) => [c.id, c]));
  const render = (id: string): ReactNode => {
    const c = byId[id];
    if (!c) return null;
    return (
      <span className="inline-flex items-center gap-2">
        {showPicture && c.picture && <Picture picture={c.picture} className="w-10 h-10 shrink-0" />}
        {c.text && <span>{c.text}</span>}
      </span>
    );
  };
  const label = (id: string) => byId[id]?.text ?? id;
  return { render, label };
}

function BoardHelp({ onReset, canReset }: { onReset: () => void; canReset: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-base text-ink-soft font-bold">
      <p>{DRAG_HELP}</p>
      <button type="button" className="btn btn-sm" onClick={onReset} disabled={!canReset}>
        Start over
      </button>
    </div>
  );
}

// ---------- Ordering ----------
function OrderSlot({ index, total, kind, textOf }: { index: number; total: number; kind: 'sentence' | 'sequence'; textOf: (id: string) => string }) {
  const occupant = useOccupant(`slot-${index}`);
  const display = occupant && kind === 'sentence' && index === 0 ? joinSentenceTiles([textOf(occupant)]) : undefined;
  return (
    <div className={kind === 'sequence' ? 'flex items-center gap-3 w-full' : ''}>
      {kind === 'sequence' && <span className="font-display font-extrabold text-2xl w-9 h-9 shrink-0 rounded-full bg-sun border-3 border-ink grid place-items-center">{index + 1}</span>}
      <Slot id={`slot-${index}`} label={`Place ${index + 1} of ${total}${occupant ? `, holds ${textOf(occupant)}` : ', empty'}`} className={kind === 'sequence' ? 'flex-1' : 'min-w-[72px]'}>
        {occupant && <Tile id={occupant} display={display} />}
      </Slot>
    </div>
  );
}

export function OrderingActivity({ question, seed, disabled, onResponse }: ActivityProps<OrderingQuestion>) {
  const tiles = useShuffled(question.tiles, seed, question.id);
  const n = tiles.length;
  const capacity = useMemo(() => Object.fromEntries(tiles.map((_, i) => [`slot-${i}`, 1])), [tiles]);
  const { render, label } = useMemo(() => itemRenderer(question.tiles), [question.tiles]);
  const textOf = useCallback((id: string) => question.tiles.find((t) => t.id === id)?.text ?? '', [question.tiles]);
  const toResponse = useCallback(
    (s: BoardState) => {
      const ids: string[] = [];
      for (let i = 0; i < n; i++) {
        const id = Object.keys(s.placements).find((k) => s.placements[k] === `slot-${i}`);
        if (!id) return onResponse(null);
        ids.push(id);
      }
      onResponse({ kind: 'order', tileIds: ids });
    },
    [n, onResponse],
  );
  const [state, update] = useBoardState(toResponse);
  const placedTexts = Array.from({ length: n }, (_, i) => Object.keys(state.placements).find((k) => state.placements[k] === `slot-${i}`))
    .filter((x): x is string => !!x)
    .map(textOf);
  return (
    <SlotBoard state={state} onChange={update} capacity={capacity} disabled={disabled} renderItem={render} labelOf={label}>
      <div className="space-y-4">
        <BoardHelp onReset={() => update({ placements: {}, selected: null })} canReset={!disabled && Object.keys(state.placements).length > 0} />
        <div className={question.orderingKind === 'sequence' ? 'flex flex-col gap-3' : 'flex flex-wrap gap-2 sm:gap-3 justify-center'}>
          {tiles.map((_, i) => (
            <OrderSlot key={i} index={i} total={n} kind={question.orderingKind} textOf={textOf} />
          ))}
        </div>
        {question.orderingKind === 'sentence' && placedTexts.length > 0 && (
          <p className="text-center text-2xl font-display font-bold bg-white/80 rounded-2xl p-2" aria-live="polite">
            {joinSentenceTiles(placedTexts)}
          </p>
        )}
        <Bank items={tiles.map((t) => t.id)} label={question.orderingKind === 'sentence' ? 'Word tiles' : 'Cards to put in order'} />
      </div>
    </SlotBoard>
  );
}

// ---------- Drag into groups ----------
function GroupBox({ group }: { group: Choice }) {
  const occupants = useOccupants(group.id);
  return (
    <div className="card !rounded-3xl p-3 flex flex-col gap-2 bg-white">
      <h3 className="font-display font-extrabold text-xl text-center flex items-center justify-center gap-2">
        {group.picture && <Picture picture={group.picture} className="w-10 h-10" />}
        {group.text}
      </h3>
      <Slot id={group.id} label={`Group: ${group.text}`} className="min-h-[96px] flex-1 content-start">
        {occupants.map((id) => (
          <Tile key={id} id={id} />
        ))}
      </Slot>
    </div>
  );
}

export function DragDropActivity({ question, seed, disabled, onResponse }: ActivityProps<DragDropQuestion>) {
  const items = useShuffled(question.items, seed, question.id);
  const capacity = useMemo(() => Object.fromEntries(question.groups.map((g) => [g.id, 99])), [question.groups]);
  const { render, label } = useMemo(() => itemRenderer(question.items), [question.items]);
  const toResponse = useCallback(
    (s: BoardState) => onResponse(question.items.every((it) => s.placements[it.id]) ? { kind: 'placement', placements: { ...s.placements } } : null),
    [question.items, onResponse],
  );
  const [state, update] = useBoardState(toResponse);
  return (
    <SlotBoard state={state} onChange={update} capacity={capacity} disabled={disabled} renderItem={render} labelOf={label}>
      <div className="space-y-4">
        <BoardHelp onReset={() => update({ placements: {}, selected: null })} canReset={!disabled && Object.keys(state.placements).length > 0} />
        <div className={`grid gap-3 ${question.groups.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
          {question.groups.map((g) => (
            <GroupBox key={g.id} group={g} />
          ))}
        </div>
        <Bank items={items.map((i) => i.id)} label="Things to sort" />
      </div>
    </SlotBoard>
  );
}

// ---------- Matching board ----------
function MatchRow({ left }: { left: Choice }) {
  const occupant = useOccupant(left.id);
  return (
    <div className="flex items-stretch gap-2 sm:gap-3">
      <div className="card !rounded-2xl flex items-center gap-2 p-2 sm:p-3 flex-1 min-h-[64px] !bg-sky-50">
        {left.picture && <Picture picture={left.picture} className="w-12 h-12 shrink-0" label={left.text ?? undefined} />}
        {left.text && <span className="font-extrabold text-lg leading-snug">{left.text}</span>}
      </div>
      <span className="self-center font-black text-2xl" aria-hidden="true">
        →
      </span>
      <Slot id={left.id} label={`Match for ${left.text ?? 'picture'}${occupant ? ', filled' : ', empty'}`} className="flex-1">
        {occupant && <Tile id={occupant} />}
      </Slot>
    </div>
  );
}

export function MatchingActivity({ question, seed, disabled, onResponse }: ActivityProps<MatchingQuestion>) {
  const right = useShuffled(question.right, seed, question.id);
  const left = useShuffled(question.left, seed + 7, question.id);
  const capacity = useMemo(() => Object.fromEntries(question.left.map((l) => [l.id, 1])), [question.left]);
  const { render, label } = useMemo(() => itemRenderer(question.right), [question.right]);
  const toResponse = useCallback(
    (s: BoardState) => onResponse(Object.keys(s.placements).length === question.left.length ? { kind: 'placement', placements: { ...s.placements } } : null),
    [question.left.length, onResponse],
  );
  const [state, update] = useBoardState(toResponse);
  return (
    <SlotBoard state={state} onChange={update} capacity={capacity} disabled={disabled} renderItem={render} labelOf={label}>
      <div className="space-y-4">
        <BoardHelp onReset={() => update({ placements: {}, selected: null })} canReset={!disabled && Object.keys(state.placements).length > 0} />
        <div className="flex flex-col gap-3">
          {left.map((l) => (
            <MatchRow key={l.id} left={l} />
          ))}
        </div>
        <Bank items={right.map((r) => r.id)} label="Answers to match" />
      </div>
    </SlotBoard>
  );
}

// ---------- Fill blanks ----------
function BlankSlot({ index }: { index: number }) {
  const occupant = useOccupant(`blank-${index}`);
  return (
    <Slot id={`blank-${index}`} label={`Blank ${index + 1}${occupant ? ', filled' : ', empty'}`} className="inline-flex align-middle mx-1 min-w-[88px]">
      {occupant && <Tile id={occupant} />}
    </Slot>
  );
}

function BlankSentence({ text, renderBlank }: { text: string; renderBlank: (i: number) => ReactNode }) {
  const parts = text.split('___');
  return (
    <p className="text-2xl sm:text-3xl font-display font-bold leading-[2.6] text-center">
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 && renderBlank(i)}
        </span>
      ))}
    </p>
  );
}

export function FillBlankActivity({ question, seed, disabled, onResponse }: ActivityProps<FillBlankQuestion>) {
  const blanks = question.acceptedAnswers.length;
  const bank = useShuffled(question.wordBank, seed, question.id);
  const capacity = useMemo(() => Object.fromEntries(Array.from({ length: blanks }, (_, i) => [`blank-${i}`, 1])), [blanks]);
  const { render, label } = useMemo(() => itemRenderer(question.wordBank, false), [question.wordBank]);
  const toResponse = useCallback(
    (s: BoardState) => onResponse(Object.keys(s.placements).length === blanks ? { kind: 'placement', placements: { ...s.placements } } : null),
    [blanks, onResponse],
  );
  const [state, update] = useBoardState(toResponse);
  const [values, setValues] = useState<string[]>(() => Array.from({ length: blanks }, () => ''));

  if (question.inputMode === 'typed') {
    return (
      <div className="space-y-4">
        <BlankSentence
          text={question.text}
          renderBlank={(i) => (
            <input
              key={i}
              aria-label={`Type the missing word for blank ${i + 1}`}
              className="mx-1 w-40 sm:w-48 text-center rounded-2xl border-3 border-ink px-3 py-1 text-2xl bg-white"
              value={values[i]}
              disabled={disabled}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              data-typed-blank={i}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                setValues(next);
                onResponse(next.every((v) => v.trim()) ? { kind: 'typed', values: next } : null);
              }}
            />
          )}
        />
        <p className="text-center text-base font-bold text-ink-soft">Type your answer, then press Check Answer.</p>
      </div>
    );
  }
  return (
    <SlotBoard state={state} onChange={update} capacity={capacity} disabled={disabled} renderItem={render} labelOf={label}>
      <div className="space-y-4">
        <BoardHelp onReset={() => update({ placements: {}, selected: null })} canReset={!disabled && Object.keys(state.placements).length > 0} />
        <BlankSentence text={question.text} renderBlank={(i) => <BlankSlot key={i} index={i} />} />
        <Bank items={bank.map((b) => b.id)} />
      </div>
    </SlotBoard>
  );
}

export function ActivityView(props: ActivityProps<Question>) {
  const q = props.question;
  switch (q.activityType) {
    case 'multipleChoice':
    case 'pictureChoice':
    case 'listeningChoice':
    case 'storyQuestion':
    case 'dialogue':
      return <ChoiceActivity {...props} question={q} />;
    case 'ordering':
      return <OrderingActivity {...props} question={q} />;
    case 'dragDrop':
      return <DragDropActivity {...props} question={q} />;
    case 'matching':
      return <MatchingActivity {...props} question={q} />;
    case 'fillBlank':
      return <FillBlankActivity {...props} question={q} />;
  }
}
