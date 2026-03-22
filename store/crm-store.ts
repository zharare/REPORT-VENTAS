'use client';

import { create } from 'zustand';
import { DEFAULT_TABS, INITIAL_TABLE_DATA, TAB_COLORS, createEmptyRow } from '@/lib/constants';
import { CRMState, SalesRow, SalesTab } from '@/lib/types';
import {
  loadTableData,
  loadTabsConfig,
  loadUiPreferences,
  removeTableDataForTab,
  saveTableDataForTab,
  saveTabsConfig,
  saveUiPreferences,
} from '@/lib/storage';
import { getDayFromDate, getMonthFromDate } from '@/lib/utils';
import { supabase } from '../lib/supabase';

const buildDefaultState = (): CRMState => ({
  tabs: DEFAULT_TABS,
  activeTabId: DEFAULT_TABS[0].id,
  tableData: INITIAL_TABLE_DATA,
  ui: { darkMode: false },
});

type Store = CRMState & {
  hydrated: boolean;
  hydrateFromStorage: () => void;
  
  setActiveTab: (tabId: string) => void;
  addTab: () => void;
  renameTab: (tabId: string, name: string) => void;
  reorderTabs: (tabs: SalesTab[]) => void;
  updateTabColor: (tabId: string, color: string) => void;
  deleteTab: (tabId: string) => void;
  addRow: (tabId: string) => Promise<void>;
  deleteRow: (tabId: string, rowId: string) => Promise<void>;
  updateCell: (tabId: string, rowId: string, field: keyof SalesRow, value: string) => Promise<void>;
  toggleDarkMode: () => void;
  resetStore: () => void;
};

const persistTabs = (tabs: SalesTab[], activeTabId: string) => saveTabsConfig(tabs, activeTabId);

export const useCrmStore = create<Store>((set, get) => ({
  ...buildDefaultState(),
  hydrated: false,

  hydrateFromStorage: () => {
    const { tabs, activeTabId } = loadTabsConfig();
    const tableData = loadTableData(tabs);
    const ui = loadUiPreferences();
    set({ tabs, activeTabId, tableData, ui, hydrated: true });
  },

  setActiveTab: (tabId) => {
    set({ activeTabId: tabId });
    persistTabs(get().tabs, tabId);
  },

  addTab: () =>
    set((state) => {
      const tabId = crypto.randomUUID();
      const newTab = {
        id: tabId,
        name: `ASESOR ${state.tabs.length + 1}`,
        color: TAB_COLORS[state.tabs.length % TAB_COLORS.length],
      };
      const rows = Array.from({ length: 50 }, () => createEmptyRow());

      saveTableDataForTab(tabId, rows);
      persistTabs([...state.tabs, newTab], tabId);

      return {
        tabs: [...state.tabs, newTab],
        activeTabId: tabId,
        tableData: {
          ...state.tableData,
          [tabId]: rows,
        },
      };
    }),

  renameTab: (tabId, name) =>
    set((state) => {
      const tabs = state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, name: name.trim() || tab.name } : tab
      );
      persistTabs(tabs, state.activeTabId);
      return { tabs };
    }),

  reorderTabs: (tabs) => {
    set({ tabs });
    persistTabs(tabs, get().activeTabId);
  },

  updateTabColor: (tabId, color) =>
    set((state) => {
      const tabs = state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, color } : tab
      );
      persistTabs(tabs, state.activeTabId);
      return { tabs };
    }),

  deleteTab: (tabId) =>
    set((state) => {
      if (state.tabs.length === 1) return state;

      const tabs = state.tabs.filter((tab) => tab.id !== tabId);
      const tableData = { ...state.tableData };
      delete tableData[tabId];

      removeTableDataForTab(tabId);

      const activeTabId =
        state.activeTabId === tabId ? tabs[0].id : state.activeTabId;

      persistTabs(tabs, activeTabId);

      return { tabs, activeTabId, tableData };
    }),

  addRow: async (tabId) => {
  const newRow = createEmptyRow();

  const { data, error } = await supabase
    .from('sales')
    .insert({
      id: newRow.id,
      tab: tabId,
      data: newRow,
    })
    .select(); // 👈 IMPORTANTE

  console.log('INSERT RESULT:', { data, error });

  if (error) return;

  set((state) => ({
    tableData: {
      ...state.tableData,
      [tabId]: [...(state.tableData[tabId] ?? []), newRow],
    },
  }));
},

  deleteRow: async (tabId, rowId) => {
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', rowId);

  if (error) {
    console.log('❌ ERROR DELETE:', error);
    return;
  }

  set((state) => {
    const nextRows = (state.tableData[tabId] ?? []).filter(
      (row) => row.id !== rowId
    );

    return {
      tableData: {
        ...state.tableData,
        [tabId]: nextRows,
      },
    };
  });
},
  
  updateCell: async (tabId, rowId, field, value) => {
  let updatedRow: SalesRow | null = null;

  set((state) => {
    const nextRows = (state.tableData[tabId] ?? []).map((row) => {
      if (row.id !== rowId) return row;

      const updated = { ...row, [field]: value };

      if (field === 'fecha') {
        updated.mes = getMonthFromDate(value);
        updated.dia = getDayFromDate(value);
      }

      updatedRow = updated;
      return updated;
    });

    return {
      tableData: {
        ...state.tableData,
        [tabId]: nextRows,
      },
    };
  });

  if (!updatedRow) return;

  const { error } = await supabase
    .from('sales')
    .update({ data: updatedRow })
    .eq('id', rowId);

  if (error) {
    console.log('❌ ERROR UPDATE:', error);
  }
},

  toggleDarkMode: () =>
    set((state) => {
      const ui = { darkMode: !state.ui.darkMode };
      saveUiPreferences(ui);
      return { ui };
    }),

  resetStore: () => {
    const defaults = buildDefaultState();
    persistTabs(defaults.tabs, defaults.activeTabId);

    defaults.tabs.forEach((tab) =>
      saveTableDataForTab(tab.id, defaults.tableData[tab.id])
    );

    saveUiPreferences(defaults.ui);

    set({ ...defaults, hydrated: true });
  },
}));