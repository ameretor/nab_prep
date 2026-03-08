/**
 * LIVE CODING — Compound Component Pattern: Tabs
 *
 * TASK: Build a Tabs component using the Compound Component pattern.
 * The API should be flexible and composable:
 *
 *   <Tabs defaultTab="profile">
 *     <TabList>
 *       <Tab id="profile">Profile</Tab>
 *       <Tab id="settings">Settings</Tab>
 *     </TabList>
 *     <TabPanel id="profile"><ProfileForm /></TabPanel>
 *     <TabPanel id="settings"><SettingsForm /></TabPanel>
 *   </Tabs>
 *
 * Why compound components?
 *   - Avoids deeply nested prop drilling
 *   - Caller controls layout and composition
 *   - Each sub-component is independently usable
 */

import { createContext, useContext, useState } from 'react';

// Shared context — the "wire" between parent and children
const TabsContext = createContext(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab components must be used inside <Tabs>');
  return ctx;
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

// ── Tab List (the navigation bar) ────────────────────────────────────────────
export function TabList({ children }) {
  return <div role="tablist" className="tab-list">{children}</div>;
}

// ── Individual Tab button ─────────────────────────────────────────────────────
export function Tab({ id, children }) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === id;
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      onClick={() => setActiveTab(id)}
      className={`tab ${isActive ? 'tab--active' : ''}`}
    >
      {children}
    </button>
  );
}

// ── Tab Panel (content area) ──────────────────────────────────────────────────
export function TabPanel({ id, children }) {
  const { activeTab } = useTabs();
  if (activeTab !== id) return null;
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      className="tab-panel"
    >
      {children}
    </div>
  );
}
