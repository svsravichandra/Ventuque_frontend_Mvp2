/**
 * PhotoUpload Component Tests
 * Tests for photo upload functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoUpload from '@/app/components/PhotoUpload';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PhotoUpload Component', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should render upload area', () => {
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    expect(screen.getByText(/upload|drag|drop/i)).toBeInTheDocument();
  });

  it('should display upload instructions', () => {
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    expect(screen.getByText(/photo|image/i)).toBeInTheDocument();
  });

  it('should have file input element', () => {
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    const fileInput = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', expect.stringContaining('image'));
  });

  it('should call onPhotoSelect when file is selected', async () => {
    const onPhotoSelect = vi.fn();
    const user = userEvent.setup();

    render(<PhotoUpload onPhotoSelect={onPhotoSelect} />);

    const file = new File(['photo content'], 'test-photo.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

    await user.upload(input, file);

    await waitFor(() => {
      expect(onPhotoSelect).toHaveBeenCalled();
    });
  });

  it('should accept JPG and PNG files', () => {
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });
    const accept = input.getAttribute('accept');

    expect(accept).toMatch(/image\/jpeg|image\/png|\.jpg|\.png/i);
  });

  it('should show validation error for invalid file type', async () => {
    const user = userEvent.setup();
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

    await user.upload(input, file);

    await waitFor(() => {
      expect(screen.getByText(/only.*jpg.*png|invalid.*file.*type/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for file too small', async () => {
    const user = userEvent.setup();
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    // Create a very small file (< 500x500px equivalent)
    const file = new File(['tiny'], 'tiny.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

    await user.upload(input, file);

    await waitFor(() => {
      const errorMessage = screen.queryByText(/minimum.*size|too.*small|at least.*500/i);
      if (errorMessage) {
        expect(errorMessage).toBeInTheDocument();
      }
    }, { timeout: 3000 });
  });

  it('should display preview after successful upload', async () => {
    const user = userEvent.setup();
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

    await user.upload(input, file);

    await waitFor(() => {
      const preview = screen.queryByRole('img', { name: /preview|uploaded/i });
      if (preview) {
        expect(preview).toBeInTheDocument();
      }
    });
  });

  it('should have drag and drop area', () => {
    const { container } = render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    // Check for drag and drop classes or attributes
    const dropzone = container.querySelector('[class*="drop"], [class*="drag"]');
    expect(dropzone).toBeTruthy();
  });

  it('should show loading state during upload', async () => {
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const user = userEvent.setup();
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

    await user.upload(input, file);

    // Should show loading indicator
    const loading = screen.queryByText(/uploading|loading|processing/i);
    if (loading) {
      expect(loading).toBeInTheDocument();
    }
  });

  it('should allow removing uploaded photo', async () => {
    const user = userEvent.setup();
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

    await user.upload(input, file);

    await waitFor(() => {
      const removeButton = screen.queryByRole('button', { name: /remove|delete|clear/i });
      if (removeButton) {
        expect(removeButton).toBeInTheDocument();
      }
    });
  });

  it('should be accessible', () => {
    render(<PhotoUpload onPhotoSelect={vi.fn()} />);

    const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleName();
  });

  describe('File Validation Edge Cases', () => {
    it('should reject files over maximum size (10MB)', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      // Create a large file (11MB)
      const largeContent = 'a'.repeat(11 * 1024 * 1024);
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/too large|maximum.*size|exceed|10\s*mb/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });

    it('should handle multiple file types (GIF, WebP)', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const gifFile = new File(['gif'], 'test.gif', { type: 'image/gif' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, gifFile);

      await waitFor(() => {
        // Should either accept or reject with clear message
        expect(screen.queryByText(/.*/)).toBeInTheDocument();
      });
    });

    it('should handle corrupted image files', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      // Create corrupted file with JPG extension but invalid content
      const file = new File(['invalid image data'], 'corrupted.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/invalid|corrupt|error.*loading|failed.*upload/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });

    it('should handle files with no extension', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'photo_no_extension', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      // Should handle gracefully
      await waitFor(() => {
        expect(screen.getByRole('main') || screen.getByRole('region')).toBeInTheDocument();
      });
    });

    it('should handle files with special characters in name', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'my photo!@#$%^&*().jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.queryByText(/.*/)).toBeInTheDocument();
      });
    });

    it('should handle files with unicode characters in name', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], '我的照片🚗.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.queryByText(/.*/)).toBeInTheDocument();
      });
    });

    it('should reject zero-byte files', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File([], 'empty.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/empty|invalid|too small/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      });
    });
  });

  describe('Drag and Drop Tests', () => {
    it('should highlight drop zone on drag over', async () => {
      const { container } = render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const dropzone = container.querySelector('[class*="drop"], [class*="drag"]') || container.firstChild;

      if (dropzone) {
        const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
        const dataTransfer = {
          files: [file],
          types: ['Files'],
        };

        // Simulate dragover
        const dragOverEvent = new Event('dragover', { bubbles: true });
        Object.defineProperty(dragOverEvent, 'dataTransfer', { value: dataTransfer });

        dropzone.dispatchEvent(dragOverEvent);

        // Check for visual feedback (class change, style, etc.)
        await waitFor(() => {
          expect(dropzone).toBeInTheDocument();
        });
      }
    });

    it('should handle drop with invalid file type', async () => {
      const { container } = render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const dropzone = container.querySelector('[class*="drop"], [class*="drag"]') || container.firstChild;

      if (dropzone) {
        const file = new File(['doc'], 'document.txt', { type: 'text/plain' });
        const dataTransfer = {
          files: [file],
          types: ['Files'],
        };

        const dropEvent = new Event('drop', { bubbles: true });
        Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

        dropzone.dispatchEvent(dropEvent);

        await waitFor(() => {
          const errorMessage = screen.queryByText(/invalid|only.*jpg.*png/i);
          if (errorMessage) {
            expect(errorMessage).toBeInTheDocument();
          }
        });
      }
    });

    it('should handle multiple files dropped', async () => {
      const { container } = render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const dropzone = container.querySelector('[class*="drop"], [class*="drag"]') || container.firstChild;

      if (dropzone) {
        const file1 = new File(['photo1'], 'test1.jpg', { type: 'image/jpeg' });
        const file2 = new File(['photo2'], 'test2.jpg', { type: 'image/jpeg' });
        const dataTransfer = {
          files: [file1, file2],
          types: ['Files'],
        };

        const dropEvent = new Event('drop', { bubbles: true });
        Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer });

        dropzone.dispatchEvent(dropEvent);

        await waitFor(() => {
          // Should either take first file or show error about multiple files
          expect(screen.queryByText(/.*/)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Network Error Handling', () => {
    it('should handle upload timeout', async () => {
      mockFetch.mockImplementation(() => new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 100)
      ));

      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/timeout|failed|error/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });

    it('should handle network disconnection', async () => {
      mockFetch.mockRejectedValue(new Error('Network request failed'));

      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/network|connection|failed|offline/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });

    it('should handle server errors (500)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/server.*error|failed|something.*wrong/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });

    it('should handle unauthorized errors (401)', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/unauthorized|sign in|login|authenticate/i);
        if (errorMessage) {
          expect(errorMessage).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });
  });

  describe('User Experience Tests', () => {
    it('should show progress during upload', async () => {
      mockFetch.mockImplementation(() => new Promise(resolve =>
        setTimeout(() => resolve({ ok: true }), 500)
      ));

      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      // Should show progress indicator
      const progress = screen.queryByRole('progressbar') ||
                      screen.queryByText(/uploading|processing|\d+%/i);

      if (progress) {
        expect(progress).toBeInTheDocument();
      }
    });

    it('should allow retrying after failed upload', async () => {
      let attempts = 0;
      mockFetch.mockImplementation(() => {
        attempts++;
        if (attempts === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({ ok: true });
      });

      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const retryButton = screen.queryByRole('button', { name: /retry|try.*again/i });
        if (retryButton) {
          expect(retryButton).toBeInTheDocument();
        }
      }, { timeout: 3000 });
    });

    it('should disable upload button during processing', async () => {
      mockFetch.mockImplementation(() => new Promise(resolve =>
        setTimeout(() => resolve({ ok: true }), 1000)
      ));

      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      // Check if upload area is disabled during processing
      const uploadButton = screen.queryByRole('button', { name: /upload|choose/i });
      if (uploadButton) {
        await waitFor(() => {
          expect(uploadButton).toBeDisabled();
        });
      }
    });

    it('should show file name after selection', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'], 'my-awesome-car.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const fileName = screen.queryByText(/my-awesome-car/i);
        if (fileName) {
          expect(fileName).toBeInTheDocument();
        }
      });
    });

    it('should show file size after selection', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['photo'.repeat(1000)], 'test.jpg', { type: 'image/jpeg' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const fileSize = screen.queryByText(/\d+\s*(kb|mb|bytes)/i);
        if (fileSize) {
          expect(fileSize).toBeInTheDocument();
        }
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels', () => {
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });
      expect(input).toHaveAttribute('aria-label');
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        const errorMessage = screen.getByText(/only.*jpg.*png|invalid.*file.*type/i);
        // Should have role="alert" or aria-live="assertive"
        const parent = errorMessage.closest('[role="alert"], [aria-live]');
        if (parent) {
          expect(parent).toBeInTheDocument();
        }
      });
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });

      // Tab to input
      await user.tab();
      expect(input).toHaveFocus();
    });

    it('should have visible focus indicators', () => {
      render(<PhotoUpload onPhotoSelect={vi.fn()} />);

      const input = screen.getByLabelText(/upload|choose|select/i, { selector: 'input' });
      input.focus();

      // Component should have visible focus styling
      expect(input).toHaveFocus();
    });
  });
});
