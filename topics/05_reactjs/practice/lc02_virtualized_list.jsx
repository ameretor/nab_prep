// ─── React Practice lc02: Virtualized List ────────────────────────────────────
//
// PROBLEM:
// A product list component renders 10,000 items and is extremely slow.
//
// TASK:
// 1. Implement a simple virtualisation manually (render only visible items)
// 2. OR integrate react-window's FixedSizeList
//
// This is a common senior interview topic at NAB — large lists in financial dashboards
// (transaction history, account activity).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useCallback, useMemo } from 'react';

// ─── DATA ────────────────────────────────────────────────────────────────────
function generateTransactions(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    description: `Transaction ${i + 1}`,
    amount: (Math.random() * 1000).toFixed(2),
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
    type: i % 2 === 0 ? 'debit' : 'credit',
  }));
}

const TRANSACTIONS = generateTransactions(10000);

// ─── BAD VERSION (renders all 10,000 items) ──────────────────────────────────
function TransactionListSlow({ transactions }) {
  return (
    <div style={{ height: '600px', overflow: 'auto' }}>
      {transactions.map(tx => (
        <TransactionRow key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}

function TransactionRow({ transaction }) {
  return (
    <div style={{
      height: 60,
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #eee',
    }}>
      <span>{transaction.date}</span>
      <span>{transaction.description}</span>
      <span style={{ color: transaction.type === 'debit' ? 'red' : 'green' }}>
        {transaction.type === 'debit' ? '-' : '+'}${transaction.amount}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YOUR TASK: Implement a virtualised version
// ─────────────────────────────────────────────────────────────────────────────

// Option A: Manual virtualisation
// Hints:
// - Track scrollTop with a scroll event listener
// - ITEM_HEIGHT = 60, VISIBLE_COUNT = Math.ceil(containerHeight / ITEM_HEIGHT) + buffer
// - startIndex = Math.floor(scrollTop / ITEM_HEIGHT)
// - Render only items[startIndex .. startIndex + VISIBLE_COUNT]
// - Apply paddingTop = startIndex * ITEM_HEIGHT to the inner container

const ITEM_HEIGHT = 60;

function TransactionListVirtual({ transactions }) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const containerHeight = 600;

  // YOUR CODE HERE: calculate startIndex, endIndex, visibleItems, paddingTop, totalHeight

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* YOUR RENDERING HERE */}
    </div>
  );
}

// Option B: react-window (if package installed)
// import { FixedSizeList } from 'react-window';
//
// function TransactionListWindow({ transactions }) {
//   const Row = ({ index, style }) => (
//     <div style={style}>
//       <TransactionRow transaction={transactions[index]} />
//     </div>
//   );
//
//   return (
//     <FixedSizeList
//       height={600}
//       itemCount={transactions.length}
//       itemSize={ITEM_HEIGHT}
//       width="100%"
//     >
//       {Row}
//     </FixedSizeList>
//   );
// }

export { TransactionListSlow, TransactionListVirtual, TRANSACTIONS };
