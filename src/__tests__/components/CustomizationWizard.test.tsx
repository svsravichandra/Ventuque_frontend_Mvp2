/**
 * CustomizationWizard Component Tests
 * Tests for customization wizard flow
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomizationWizard from '@/app/components/CustomizationWizard';

describe('CustomizationWizard Component', () => {
  const mockOnComplete = vi.fn();
  const photoPreview = 'data:image/jpeg;base64,/9j/4AAQ...';

  it('should render wizard with 4 steps', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Check for step indicators
    expect(screen.getByText(/choose.*style/i)).toBeInTheDocument();
    expect(screen.getByText(/select.*finish/i)).toBeInTheDocument();
    expect(screen.getByText(/mount.*type/i)).toBeInTheDocument();
    expect(screen.getByText(/personalize/i)).toBeInTheDocument();
  });

  it('should start at step 1 (Style Selection)', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    expect(screen.getByText(/choose.*style/i)).toBeInTheDocument();
    expect(screen.getByText(/chibi/i)).toBeInTheDocument();
  });

  it('should display all style options', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    expect(screen.getByText(/chibi/i)).toBeInTheDocument();
    expect(screen.getByText(/classic/i)).toBeInTheDocument();
    expect(screen.getByText(/minimal/i)).toBeInTheDocument();
  });

  it('should show pricing for each option', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Check for price displays ($ symbols or price text)
    const prices = screen.getAllByText(/\$|included|\+/i);
    expect(prices.length).toBeGreaterThan(0);
  });

  it('should disable Next button until style is selected', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('should enable Next button after selecting style', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) {
      await user.click(chibiOption);
    }

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).not.toBeDisabled();
  });

  it('should advance to step 2 when Next is clicked', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Select style
    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);

    // Click Next
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // Should now see finish options
    expect(screen.getByText(/select.*finish/i)).toBeInTheDocument();
    expect(screen.getByText(/matte/i)).toBeInTheDocument();
  });

  it('should display all finish options in step 2', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Navigate to step 2
    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText(/matte/i)).toBeInTheDocument();
    expect(screen.getByText(/glossy/i)).toBeInTheDocument();
    expect(screen.getByText(/metallic/i)).toBeInTheDocument();
  });

  it('should display all mount options in step 3', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Navigate to step 3
    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const matteOption = screen.getByText(/matte/i).closest('div');
    if (matteOption) await user.click(matteOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText(/vent.*clip|clip/i)).toBeInTheDocument();
    expect(screen.getByText(/magnetic/i)).toBeInTheDocument();
    expect(screen.getByText(/adhesive/i)).toBeInTheDocument();
  });

  it('should allow Back button navigation', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Navigate to step 2
    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Click Back
    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);

    // Should be back at step 1
    expect(screen.getByText(/choose.*style/i)).toBeInTheDocument();
  });

  it('should disable Back button on first step', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeDisabled();
  });

  it('should display preview panel', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    expect(screen.getByText(/preview/i)).toBeInTheDocument();
  });

  it('should show photo in preview panel', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    const previewImage = screen.getByAltText(/your photo|photo/i);
    expect(previewImage).toBeInTheDocument();
  });

  it('should display base price in preview', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    expect(screen.getByText(/\$49\.99/)).toBeInTheDocument();
  });

  it('should update total price when options are selected', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Select Classic style (+$5)
    const classicOption = screen.getByText(/classic/i).closest('div');
    if (classicOption) await user.click(classicOption);

    // Total should update (base + premium)
    const totalPrice = screen.getByText(/total/i).parentElement;
    if (totalPrice) {
      expect(totalPrice.textContent).toMatch(/54\.99/);
    }
  });

  it('should allow personalization text in step 4', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Navigate to step 4
    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const matteOption = screen.getByText(/matte/i).closest('div');
    if (matteOption) await user.click(matteOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const clipOption = screen.getByText(/clip|vent/i).closest('div');
    if (clipOption) await user.click(clipOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Should have text input
    const textInput = screen.getByPlaceholderText(/name|text/i);
    expect(textInput).toBeInTheDocument();

    await user.type(textInput, 'My Car');
    expect(textInput).toHaveValue('My Car');
  });

  it('should limit personalization text to 20 characters', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Navigate to step 4
    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const matteOption = screen.getByText(/matte/i).closest('div');
    if (matteOption) await user.click(matteOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const clipOption = screen.getByText(/clip|vent/i).closest('div');
    if (clipOption) await user.click(clipOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const textInput = screen.getByPlaceholderText(/name|text/i);
    expect(textInput).toHaveAttribute('maxLength', '20');
  });

  it('should call onComplete with selected options', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Complete all steps
    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const matteOption = screen.getByText(/matte/i).closest('div');
    if (matteOption) await user.click(matteOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    const clipOption = screen.getByText(/clip|vent/i).closest('div');
    if (clipOption) await user.click(clipOption);
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Click Complete
    const completeButton = screen.getByRole('button', { name: /complete/i });
    await user.click(completeButton);

    expect(mockOnComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        style: 'chibi',
        finish: 'matte',
        mountType: 'clip',
      })
    );
  });

  it('should show selected option checkmark', async () => {
    const user = userEvent.setup();
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    const chibiOption = screen.getByText(/chibi/i).closest('div');
    if (chibiOption) await user.click(chibiOption);

    // Should show checkmark or selected indicator
    const checkmarks = screen.getAllByRole('img', { hidden: true });
    expect(checkmarks.length).toBeGreaterThan(0);
  });

  it('should be accessible', () => {
    render(<CustomizationWizard photoPreview={photoPreview} onComplete={mockOnComplete} />);

    // Check for proper button roles
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });
});
