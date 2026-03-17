// ─── Unit Testing Practice p02: Test a React Component ───────────────────────
//
// TASK: Write tests for the AccountCard component below.
// Covers: render, user interaction, async state, accessibility queries.
//
// Philosophy: test BEHAVIOR from user perspective (RTL), not implementation.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ─── Component under test ────────────────────────────────────────────────────
function AccountCard({ account, onTransfer }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [error, setError] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount);
    if (!transferAmount || isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }
    if (amount > account.balance) {
      setError('Insufficient funds');
      return;
    }
    setError('');
    setIsTransferring(true);
    try {
      await onTransfer(amount);
      setTransferAmount('');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div>
      <h2>{account.name}</h2>
      <p>Balance: ${account.balance.toFixed(2)}</p>
      <button
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded(prev => !prev)}
      >
        {isExpanded ? 'Hide' : 'Show'} Transfer
      </button>

      {isExpanded && (
        <div>
          <label htmlFor="amount">Transfer amount</label>
          <input
            id="amount"
            type="number"
            value={transferAmount}
            onChange={e => setTransferAmount(e.target.value)}
          />
          {error && <span role="alert">{error}</span>}
          <button onClick={handleTransfer} disabled={isTransferring}>
            {isTransferring ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── YOUR TESTS ──────────────────────────────────────────────────────────────

const mockAccount = { name: 'Savings Account', balance: 1000 };

describe('AccountCard', () => {
  // Test 1: renders account info
  it('displays account name and balance', () => {
    // YOUR CODE HERE
    // render(<AccountCard account={mockAccount} onTransfer={jest.fn()} />)
    // expect name and formatted balance to be in the document
  });

  // Test 2: transfer form is hidden initially
  it('hides transfer form initially', () => {
    // YOUR CODE HERE
  });

  // Test 3: clicking "Show Transfer" reveals the form
  it('reveals transfer form when Show Transfer is clicked', async () => {
    // YOUR CODE HERE
    // const user = userEvent.setup();
    // await user.click(...)
  });

  // Test 4: button toggles aria-expanded
  it('toggles aria-expanded on the toggle button', async () => {
    // YOUR CODE HERE
  });

  // Test 5: shows error for empty amount
  it('shows error when transfer is submitted with empty amount', async () => {
    // YOUR CODE HERE
    // Open form, click Transfer without entering amount
    // expect(screen.getByRole('alert')).toHaveTextContent('valid amount')
  });

  // Test 6: shows error for insufficient funds
  it('shows "Insufficient funds" error when amount exceeds balance', async () => {
    // YOUR CODE HERE
    // Enter 9999 (> 1000), click Transfer
  });

  // Test 7: calls onTransfer with correct amount
  it('calls onTransfer with the entered amount on valid submit', async () => {
    // YOUR CODE HERE
    // const mockTransfer = jest.fn().mockResolvedValue(undefined);
    // Enter 250, click Transfer, expect mockTransfer to have been called with 250
  });

  // Test 8: disables button during transfer
  it('disables the transfer button while transferring', async () => {
    // YOUR CODE HERE
    // Use a never-resolving promise to keep isTransferring true
    // const mockTransfer = jest.fn().mockImplementation(() => new Promise(() => {}));
    // After click, expect button to have text 'Transferring...' and be disabled
  });

  // Test 9: clears input after successful transfer
  it('clears the amount input after a successful transfer', async () => {
    // YOUR CODE HERE
  });
});
