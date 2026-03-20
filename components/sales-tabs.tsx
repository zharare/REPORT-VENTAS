'use client';

import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { TAB_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useCrmStore } from '@/store/crm-store';

const SortableTab = ({
  tab,
  active,
  onSelect,
}: {
  tab: { id: string; name: string; color: string };
  active: boolean;
  onSelect: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });
  const { renameTab, updateTabColor, deleteTab } = useCrmStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(tab.name);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex min-w-[240px] items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition',
        active ? 'border-transparent ring-2 ring-offset-2' : 'border-slate-200 hover:border-slate-300'
      )}
      onClick={onSelect}
    >
      <button type="button" className="cursor-grab text-slate-400" {...attributes} {...listeners}>
        <GripHorizontal className="h-4 w-4" />
      </button>

      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tab.color }} />

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value.toUpperCase())}
            onBlur={() => {
              renameTab(tab.id, draft);
              setEditing(false);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                renameTab(tab.id, draft);
                setEditing(false);
              }
            }}
            className="w-full rounded-lg border border-slate-200 px-2 py-1 text-sm font-semibold uppercase outline-none"
          />
        ) : (
          <p className="truncate text-sm font-semibold uppercase tracking-[0.16em] text-primary">{tab.name}</p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:transition lg:group-hover:opacity-100">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setDraft(tab.name);
            setEditing(true);
          }}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <input
          type="color"
          value={tab.color}
          onChange={(event) => updateTabColor(tab.id, event.target.value)}
          onClick={(event) => event.stopPropagation()}
          className="h-9 w-9 cursor-pointer rounded-lg border border-slate-200 bg-transparent p-1"
          list="tab-colors"
          aria-label={`Color para ${tab.name}`}
        />

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            deleteTab(tab.id);
          }}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const SalesTabs = ({ activeTabId, onTabChange }: { activeTabId: string; onTabChange: (tabId: string) => void }) => {
  const { tabs, addTab, reorderTabs } = useCrmStore();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
    const newIndex = tabs.findIndex((tab) => tab.id === over.id);
    reorderTabs(arrayMove(tabs, oldIndex, newIndex));
  };

  return (
    <div className="flex flex-col gap-3">
      <datalist id="tab-colors">
        {TAB_COLORS.map((color) => (
          <option key={color} value={color} />
        ))}
      </datalist>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={tabs.map((tab) => tab.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <SortableTab key={tab.id} tab={tab} active={tab.id === activeTabId} onSelect={() => onTabChange(tab.id)} />
            ))}
            <button
              type="button"
              onClick={addTab}
              className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border border-dashed border-primary/25 bg-white px-4 py-3 font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
            >
              <Plus className="h-4 w-4" />
              Nuevo asesor
            </button>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
