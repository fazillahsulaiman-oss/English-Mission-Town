// Shared drag-and-drop board used by ordering, sorting, matching and word-tile blanks.
// Every action works three ways: drag (mouse/touch), tap item then tap place, or keyboard
// (Tab to an item, Enter/Space to pick it, Tab to a place, Enter/Space to put it there).
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { DndContext, DragOverlay, PointerSensor, pointerWithin, rectIntersection, type CollisionDetection, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { sfx } from '../audio/sfx';

export const BANK = 'bank';

/** Drop where the pointer/finger is; fall back to overlap when the pointer is between targets. */
const collision: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length > 0 ? hits : rectIntersection(args);
};

export interface BoardState {
  /** itemId -> targetId */
  placements: Record<string, string>;
  selected: string | null;
}

interface Ctx {
  state: BoardState;
  disabled: boolean;
  capacity: Record<string, number>;
  select(id: string | null): void;
  place(itemId: string, target: string | null): void;
  renderItem(id: string): ReactNode;
  labelOf(id: string): string;
}

const BoardCtx = createContext<Ctx | null>(null);
const useBoard = () => {
  const c = useContext(BoardCtx);
  if (!c) throw new Error('SlotBoard context missing');
  return c;
};

/** Pure placement rule: capacity-1 targets swap their occupant back to where the moving item came from. */
export function placeItem(placements: Record<string, string>, capacity: Record<string, number>, itemId: string, target: string | null): Record<string, string> {
  const next = { ...placements };
  const from = next[itemId] ?? null;
  if (target === null || target === BANK) {
    delete next[itemId];
    return next;
  }
  if (from === target) return next;
  const cap = capacity[target] ?? 1;
  if (cap === 1) {
    const occupant = Object.keys(next).find((k) => next[k] === target && k !== itemId);
    if (occupant) {
      if (from) next[occupant] = from;
      else delete next[occupant];
    }
  }
  next[itemId] = target;
  return next;
}

export function SlotBoard({
  state,
  onChange,
  capacity,
  disabled,
  renderItem,
  labelOf,
  children,
}: {
  state: BoardState;
  onChange: (s: BoardState) => void;
  capacity: Record<string, number>;
  disabled: boolean;
  renderItem: (id: string) => ReactNode;
  labelOf: (id: string) => string;
  children: ReactNode;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [dragging, setDragging] = useState<string | null>(null);
  const ctx = useMemo<Ctx>(
    () => ({
      state,
      disabled,
      capacity,
      renderItem,
      labelOf,
      select: (id) => {
        if (disabled) return;
        if (id) sfx.tap();
        onChange({ ...state, selected: id });
      },
      place: (itemId, target) => {
        if (disabled) return;
        sfx.place();
        onChange({ placements: placeItem(state.placements, capacity, itemId, target), selected: null });
      },
    }),
    [state, disabled, capacity, renderItem, labelOf, onChange],
  );
  const onDragStart = (e: DragStartEvent) => setDragging(String(e.active.id));
  const onDragEnd = (e: DragEndEvent) => {
    setDragging(null);
    if (!e.over) return;
    ctx.place(String(e.active.id), String(e.over.id));
  };
  return (
    <BoardCtx.Provider value={ctx}>
      <DndContext sensors={sensors} collisionDetection={collision} autoScroll={{ threshold: { x: 0, y: 0.08 } }} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragging(null)}>
        {children}
        <DragOverlay dropAnimation={null}>{dragging ? <div className="tile shadow-xl rotate-2">{renderItem(dragging)}</div> : null}</DragOverlay>
      </DndContext>
    </BoardCtx.Provider>
  );
}

export function Tile({ id, display }: { id: string; display?: ReactNode }) {
  const { state, select, place, disabled, renderItem, labelOf } = useBoard();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, disabled });
  const isSelected = state.selected === id;
  const where = state.placements[id];
  const onClick = () => {
    if (disabled) return;
    // Tapping a placed tile while another is selected puts the selected one in its place.
    if (state.selected && state.selected !== id && where) {
      place(state.selected, where);
      return;
    }
    select(isSelected ? null : id);
  };
  return (
    <button
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      type="button"
      className={`tile ${isDragging ? 'opacity-30' : ''}`}
      aria-pressed={isSelected}
      aria-label={`${labelOf(id)}${where ? ' (placed)' : ''}${isSelected ? ', picked up' : ''}`}
      data-tile-id={id}
      disabled={disabled}
      onClick={onClick}
    >
      {display ?? renderItem(id)}
    </button>
  );
}

export function Slot({ id, label, children, className = '', emptyContent }: { id: string; label: string; children?: ReactNode; className?: string; emptyContent?: ReactNode }) {
  const { state, place, disabled, capacity } = useBoard();
  const { isOver, setNodeRef } = useDroppable({ id, disabled });
  const occupants = Object.keys(state.placements).filter((k) => state.placements[k] === id);
  const cap = capacity[id] ?? 1;
  const canTap = !!state.selected && !disabled;
  const showButton = cap > 1 || occupants.length === 0;
  return (
    <div ref={setNodeRef} className={`slot ${isOver ? 'slot-over' : ''} ${canTap ? 'slot-ready' : ''} ${className}`} data-target-id={id}>
      {children}
      {showButton && (
        <button
          type="button"
          className={`min-h-[48px] min-w-[48px] rounded-xl px-2 text-base font-bold text-slate-500 ${cap > 1 ? 'w-full' : 'flex-1'}`}
          onClick={() => state.selected && place(state.selected, id)}
          disabled={disabled}
          aria-label={`${label}${canTap ? ': put the picked item here' : ''}`}
          data-slot-button={id}
        >
          {emptyContent ?? (canTap ? 'Put here' : '')}
        </button>
      )}
    </div>
  );
}

export function Bank({ items, label = 'Word bank', className = '' }: { items: string[]; label?: string; className?: string }) {
  const { state, place, disabled } = useBoard();
  const { isOver, setNodeRef } = useDroppable({ id: BANK, disabled });
  const free = items.filter((id) => !state.placements[id]);
  return (
    <div
      ref={setNodeRef}
      className={`rounded-3xl border-3 border-dashed border-slate-300 bg-white/60 p-3 min-h-[76px] ${isOver ? 'bg-amber-50' : ''} ${className}`}
      aria-label={label}
      role="group"
    >
      <div className="flex flex-wrap gap-3 justify-center">
        {free.map((id) => (
          <Tile key={id} id={id} />
        ))}
        {free.length === 0 && <span className="text-slate-400 font-bold self-center">All placed!</span>}
      </div>
      {state.selected && state.placements[state.selected] && (
        <div className="text-center mt-2">
          <button type="button" className="btn btn-sm" onClick={() => place(state.selected!, null)} disabled={disabled}>
            Put it back
          </button>
        </div>
      )}
    </div>
  );
}

export function useOccupant(targetId: string): string | undefined {
  const { state } = useBoard();
  return Object.keys(state.placements).find((k) => state.placements[k] === targetId);
}

export function useOccupants(targetId: string): string[] {
  const { state } = useBoard();
  return Object.keys(state.placements).filter((k) => state.placements[k] === targetId);
}
