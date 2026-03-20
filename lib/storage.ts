import { DEFAULT_TABS, INITIAL_TABLE_DATA } from '@/lib/constants';
import { SalesRow, SalesTab, UiPreferences } from '@/lib/types';

export const STORAGE_KEYS = {
  tabsConfig: 'consitec-tabs-config',
  uiPreferences: 'consitec-ui-preferences',
  tableData: (tabId: string) => `consitec-table-data-${tabId}`,
};

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const loadTabsConfig = (): { tabs: SalesTab[]; activeTabId: string } => {
  if (typeof window === 'undefined') {
    return { tabs: DEFAULT_TABS, activeTabId: DEFAULT_TABS[0].id };
  }

  const fallback = { tabs: DEFAULT_TABS, activeTabId: DEFAULT_TABS[0].id };
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.tabsConfig), fallback);
};

export const saveTabsConfig = (tabs: SalesTab[], activeTabId: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.tabsConfig, JSON.stringify({ tabs, activeTabId }));
};

export const loadUiPreferences = (): UiPreferences => {
  if (typeof window === 'undefined') return { darkMode: false };
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.uiPreferences), { darkMode: false });
};

export const saveUiPreferences = (ui: UiPreferences) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.uiPreferences, JSON.stringify(ui));
};

export const loadTableData = (tabs: SalesTab[]): Record<string, SalesRow[]> => {
  if (typeof window === 'undefined') return INITIAL_TABLE_DATA;

  return tabs.reduce<Record<string, SalesRow[]>>((acc, tab) => {
    acc[tab.id] = safeParse(window.localStorage.getItem(STORAGE_KEYS.tableData(tab.id)), INITIAL_TABLE_DATA[tab.id] ?? []);
    return acc;
  }, {});
};

export const saveTableDataForTab = (tabId: string, rows: SalesRow[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEYS.tableData(tabId), JSON.stringify(rows));
};

export const removeTableDataForTab = (tabId: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEYS.tableData(tabId));
};
