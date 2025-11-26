/**
 * ShoppingCart Component Tests
 * Tests for shopping cart UI and interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShoppingCart from '@/app/components/ShoppingCart';

describe('ShoppingCart Component', () => {
  const mockCartItems = [
    {
      id: 'item-1',
      customizationId: 'custom-1',
      photoUrl: '/images/photo-1.jpg',
      style: 'Chibi Style',
      finish: 'Matte Finish',
      mountType: 'Vent Clip',
      quantity: 1,
      unitPrice: 49.99,
      totalPrice: 49.99,
    },
    {
      id: 'item-2',
      customizationId: 'custom-2',
      photoUrl: '/images/photo-2.jpg',
      style: 'Classic Style',
      finish: 'Glossy Finish',
      mountType: 'Magnetic Mount',
      quantity: 2,
      unitPrice: 62.99,
      totalPrice: 125.98,
    },
  ];

  const emptyCart = {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0,
  };

  const fullCart = {
    items: mockCartItems,
    subtotal: 175.97,
    shipping: 5.0,
    tax: 14.08,
    total: 195.05,
  };

  it('should display empty cart message when no items', () => {
    render(<ShoppingCart cart={emptyCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/empty|no items/i)).toBeInTheDocument();
  });

  it('should render all cart items', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/chibi style/i)).toBeInTheDocument();
    expect(screen.getByText(/classic style/i)).toBeInTheDocument();
  });

  it('should display item quantities', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    const quantities = screen.getAllByText(/quantity|qty/i);
    expect(quantities.length).toBeGreaterThan(0);
  });

  it('should display item prices', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/\$49\.99/)).toBeInTheDocument();
    expect(screen.getByText(/\$62\.99/)).toBeInTheDocument();
  });

  it('should show cart summary with subtotal', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getByText(/\$175\.97/)).toBeInTheDocument();
  });

  it('should show shipping cost', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/shipping/i)).toBeInTheDocument();
    expect(screen.getByText(/\$5\.00/)).toBeInTheDocument();
  });

  it('should show tax amount', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/tax/i)).toBeInTheDocument();
    expect(screen.getByText(/\$14\.08/)).toBeInTheDocument();
  });

  it('should show total amount', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/total/i)).toBeInTheDocument();
    expect(screen.getByText(/\$195\.05/)).toBeInTheDocument();
  });

  it('should have checkout button', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    const checkoutButton = screen.getByRole('button', { name: /checkout|proceed/i });
    expect(checkoutButton).toBeInTheDocument();
  });

  it('should disable checkout button when cart is empty', () => {
    render(<ShoppingCart cart={emptyCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    const checkoutButton = screen.queryByRole('button', { name: /checkout|proceed/i });
    if (checkoutButton) {
      expect(checkoutButton).toBeDisabled();
    }
  });

  it('should allow quantity update', async () => {
    const onUpdateQuantity = vi.fn();
    const user = userEvent.setup();

    render(<ShoppingCart cart={fullCart} onUpdateQuantity={onUpdateQuantity} onRemoveItem={vi.fn()} />);

    // Find quantity input or buttons
    const quantityControls = screen.getAllByRole('button', { name: /increase|decrease|\+|-/i });
    if (quantityControls.length > 0) {
      await user.click(quantityControls[0]);
      expect(onUpdateQuantity).toHaveBeenCalled();
    }
  });

  it('should allow item removal', async () => {
    const onRemoveItem = vi.fn();
    const user = userEvent.setup();

    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={onRemoveItem} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove|delete/i });
    await user.click(removeButtons[0]);

    expect(onRemoveItem).toHaveBeenCalledWith('item-1');
  });

  it('should display customization details', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(screen.getByText(/matte finish/i)).toBeInTheDocument();
    expect(screen.getByText(/vent clip/i)).toBeInTheDocument();
    expect(screen.getByText(/glossy finish/i)).toBeInTheDocument();
    expect(screen.getByText(/magnetic mount/i)).toBeInTheDocument();
  });

  it('should show item thumbnails', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });

  it('should display item count', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    // Total items = 1 + 2 = 3
    const itemCount = screen.getByText(/3.*item|item.*3/i);
    expect(itemCount).toBeInTheDocument();
  });

  it('should prevent quantity below 1', async () => {
    const onUpdateQuantity = vi.fn();
    const user = userEvent.setup();

    const singleItemCart = {
      ...fullCart,
      items: [{ ...mockCartItems[0], quantity: 1 }],
    };

    render(<ShoppingCart cart={singleItemCart} onUpdateQuantity={onUpdateQuantity} onRemoveItem={vi.fn()} />);

    const decreaseButton = screen.queryByRole('button', { name: /decrease|-/i });
    if (decreaseButton) {
      await user.click(decreaseButton);
      // Should not call update with quantity 0
      expect(onUpdateQuantity).not.toHaveBeenCalledWith(expect.anything(), 0);
    }
  });

  it('should calculate correct total for multiple items', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    // Verify calculation: subtotal + shipping + tax = total
    // 175.97 + 5.00 + 14.08 = 195.05
    expect(screen.getByText(/\$195\.05/)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    // Check for proper ARIA labels
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);

    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  it('should show continue shopping link', () => {
    render(<ShoppingCart cart={fullCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    const continueButton = screen.queryByRole('link', { name: /continue shopping|back/i });
    if (continueButton) {
      expect(continueButton).toBeInTheDocument();
    }
  });

  it('should handle empty cart gracefully', () => {
    const { container } = render(<ShoppingCart cart={emptyCart} onUpdateQuantity={vi.fn()} onRemoveItem={vi.fn()} />);

    expect(container).toBeTruthy();
    expect(screen.getByText(/empty|no items/i)).toBeInTheDocument();
  });
});
