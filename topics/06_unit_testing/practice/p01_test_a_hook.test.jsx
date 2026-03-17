// ─── Unit Testing Practice p01: Test a Custom Hook ───────────────────────────
//
// TASK: Write tests for the usePagination hook below.
// Covers: renderHook, act, edge cases.
//
// Run: npx jest p01_test_a_hook.test.jsx (requires Jest + RTL setup)
// ─────────────────────────────────────────────────────────────────────────────

import { renderHook, act } from '@testing-library/react';

// ─── The hook to test ────────────────────────────────────────────────────────
function usePagination({ totalItems, pageSize, initialPage = 1 }) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}

// ─── YOUR TESTS ──────────────────────────────────────────────────────────────

describe('usePagination', () => {
  const defaultProps = { totalItems: 100, pageSize: 10 };

  // Test 1: initial state
  it('initializes with page 1 by default', () => {
    // YOUR CODE HERE
  });

  // Test 2: calculates totalPages correctly
  it('calculates total pages correctly', () => {
    // YOUR CODE HERE
    // Hint: 100 items / 10 per page = 10 pages
    // Also test non-even: 95 items / 10 per page = 10 pages (Math.ceil)
  });

  // Test 3: nextPage increments
  it('increments page with nextPage', () => {
    // YOUR CODE HERE
    // Hint: use act(() => { result.current.nextPage(); })
  });

  // Test 4: prevPage decrements
  it('decrements page with prevPage', () => {
    // YOUR CODE HERE
  });

  // Test 5: nextPage does nothing on last page
  it('does not go past last page', () => {
    // YOUR CODE HERE
    // Hint: initialize on page 10, call nextPage, expect still 10
  });

  // Test 6: prevPage does nothing on first page
  it('does not go below first page', () => {
    // YOUR CODE HERE
  });

  // Test 7: goToPage navigates directly
  it('navigates directly to a specific page', () => {
    // YOUR CODE HERE
  });

  // Test 8: correct startIndex and endIndex
  it('calculates correct startIndex and endIndex for page 2', () => {
    // YOUR CODE HERE
    // Page 2, pageSize 10: startIndex = 10, endIndex = 19
  });

  // Test 9: isFirstPage / isLastPage flags
  it('sets isFirstPage correctly', () => {
    // YOUR CODE HERE
  });

  // Test 10: respects initialPage prop
  it('starts at initialPage when provided', () => {
    // YOUR CODE HERE
    // { ...defaultProps, initialPage: 5 } → currentPage should be 5
  });
});
