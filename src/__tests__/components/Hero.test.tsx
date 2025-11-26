/**
 * Hero Component Tests
 * Tests for landing page hero section
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hero from '@/app/components/Hero';

describe('Hero Component', () => {
  it('should render hero heading', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('should render call-to-action button', () => {
    render(<Hero />);

    const ctaButton = screen.getByRole('button', { name: /get started|start|create/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('should display product description', () => {
    render(<Hero />);

    // Check for key product messaging
    expect(screen.getByText(/transform/i)).toBeInTheDocument();
    expect(screen.getByText(/3d/i)).toBeInTheDocument();
    expect(screen.getByText(/figurine/i)).toBeInTheDocument();
  });

  it('should have accessible heading structure', () => {
    render(<Hero />);

    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    expect(h1Elements.length).toBeGreaterThan(0);
  });

  it('should render without crashing', () => {
    const { container } = render(<Hero />);
    expect(container).toBeTruthy();
  });

  it('should handle button click', async () => {
    const user = userEvent.setup();
    render(<Hero />);

    const button = screen.getByRole('button', { name: /get started|start|create/i });
    await user.click(button);

    // Button should be clickable (no error thrown)
    expect(button).toBeInTheDocument();
  });

  it('should apply dark theme styles', () => {
    const { container } = render(<Hero />);

    // Check for dark theme classes (common patterns)
    expect(container.querySelector('[class*="dark"]')).toBeTruthy();
  });

  it('should be responsive', () => {
    const { container } = render(<Hero />);

    // Check for responsive classes (Tailwind patterns)
    const responsiveElements = container.querySelectorAll('[class*="sm:"], [class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });
});
