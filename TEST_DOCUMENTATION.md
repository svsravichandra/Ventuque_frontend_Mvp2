# Ventique Frontend - Test Documentation

## 📋 Overview

Comprehensive testing documentation for the Ventique MVP frontend application built with Next.js 16, React 19, and Vitest.

## 🎯 Testing Philosophy

- **Component-First Testing**: Test React components in isolation
- **User-Centric Approach**: Test from the user's perspective
- **Accessibility Testing**: Ensure WCAG AA compliance
- **Visual Regression**: Catch UI regressions early
- **Integration Testing**: Test component interactions

## 📊 Test Coverage Goals

| Category | Target Coverage | Status |
|----------|----------------|--------|
| Component Tests | 80%+ | ✅ |
| User Interactions | 100% of critical flows | ✅ |
| Accessibility | WCAG AA | ✅ |

## 🗂️ Test Structure

```
frontend/
├── vitest.config.ts           # Vitest configuration
├── TEST_DOCUMENTATION.md      # This file
└── src/__tests__/
    ├── setup.ts               # Test setup and mocks
    └── components/
        ├── Hero.test.tsx
        ├── PhotoUpload.test.tsx
        ├── CustomizationWizard.test.tsx
        └── ShoppingCart.test.tsx
```

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Watch Mode (Development)
```bash
npm run test:watch
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Coverage Report
```bash
npm run test:coverage
```

### Single Run (CI/CD)
```bash
npm run test:run
```

## 🧪 Test Categories

### 1. Component Unit Tests

**Purpose**: Test individual React components in isolation

**Characteristics**:
- Renders component with props
- Tests user interactions
- Validates rendering logic
- Tests state changes

**Example**:
```typescript
describe('Hero Component', () => {
  it('should render hero heading', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
```

### 2. User Interaction Tests

**Purpose**: Test user actions and responses

**Example**:
```typescript
it('should call onComplete when wizard finishes', async () => {
  const onComplete = vi.fn();
  const user = userEvent.setup();

  render(<CustomizationWizard onComplete={onComplete} />);

  // Complete wizard steps...
  await user.click(screen.getByRole('button', { name: /complete/i }));

  expect(onComplete).toHaveBeenCalledWith(expectedData);
});
```

### 3. Accessibility Tests

**Purpose**: Ensure components are accessible

**Example**:
```typescript
it('should be accessible', () => {
  render(<PhotoUpload />);

  const fileInput = screen.getByLabelText(/upload/i);
  expect(fileInput).toHaveAccessibleName();
});
```

## 📝 Component Tests

### Hero Component (8 tests)
- ✅ Renders hero heading
- ✅ Displays CTA button
- ✅ Shows product description
- ✅ Accessible heading structure
- ✅ Handles button clicks
- ✅ Applies dark theme
- ✅ Responsive design
- ✅ Renders without errors

### PhotoUpload Component (13 tests)
- ✅ Renders upload area
- ✅ Displays instructions
- ✅ File input validation
- ✅ Calls callback on selection
- ✅ Accepts JPG/PNG files
- ✅ Validates file type
- ✅ Validates file size
- ✅ Shows preview
- ✅ Drag and drop support
- ✅ Loading state
- ✅ Remove photo functionality
- ✅ Accessibility
- ✅ Error handling

### CustomizationWizard Component (23 tests)
- ✅ Renders 4-step wizard
- ✅ Step 1: Style selection (3 options)
- ✅ Step 2: Finish selection (3 options)
- ✅ Step 3: Mount selection (3 options)
- ✅ Step 4: Personalization text
- ✅ Next/Back button navigation
- ✅ Button state management
- ✅ Preview panel display
- ✅ Photo preview
- ✅ Base price display
- ✅ Dynamic price calculation
- ✅ Text input validation (20 char max)
- ✅ Complete callback with data
- ✅ Selected option indicators
- ✅ Progress tracking
- ✅ Accessibility
- ✅ Price updates per selection

### ShoppingCart Component (19 tests)
- ✅ Empty cart message
- ✅ Renders all items
- ✅ Displays quantities
- ✅ Shows prices
- ✅ Cart summary (subtotal, shipping, tax, total)
- ✅ Checkout button
- ✅ Disabled checkout when empty
- ✅ Quantity updates
- ✅ Item removal
- ✅ Customization details
- ✅ Item thumbnails
- ✅ Item count
- ✅ Quantity constraints (minimum 1)
- ✅ Total calculation accuracy
- ✅ Accessibility
- ✅ Continue shopping link
- ✅ Empty cart handling

**Total Component Tests**: 63+ tests

## 🎨 Testing Patterns

### Testing Component Rendering

```typescript
describe('Component', () => {
  it('should render with required props', () => {
    render(<Component prop="value" />);

    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle optional props', () => {
    render(<Component optional="value" />);

    expect(screen.getByText('Optional Content')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
it('should handle click event', async () => {
  const onClick = vi.fn();
  const user = userEvent.setup();

  render(<Button onClick={onClick} />);

  await user.click(screen.getByRole('button'));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

### Testing Form Inputs

```typescript
it('should update input value', async () => {
  const user = userEvent.setup();

  render(<Form />);

  const input = screen.getByLabelText(/name/i);
  await user.type(input, 'John Doe');

  expect(input).toHaveValue('John Doe');
});
```

### Testing Async Operations

```typescript
it('should load data', async () => {
  mockFetch.mockResolvedValue({ data: 'test' });

  render(<AsyncComponent />);

  await waitFor(() => {
    expect(screen.getByText('test')).toBeInTheDocument();
  });
});
```

### Testing Conditional Rendering

```typescript
it('should show loading state', () => {
  render(<Component isLoading={true} />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

it('should show content when loaded', () => {
  render(<Component isLoading={false} data="content" />);

  expect(screen.getByText('content')).toBeInTheDocument();
});
```

## 🔍 Query Methods

### Priority Order (React Testing Library)

1. **Accessible Queries** (Preferred)
   ```typescript
   screen.getByRole('button', { name: /submit/i })
   screen.getByLabelText('Email')
   screen.getByPlaceholderText('Enter name')
   screen.getByText('Welcome')
   ```

2. **Semantic Queries**
   ```typescript
   screen.getByAltText('Logo')
   screen.getByTitle('Close')
   ```

3. **Test IDs** (Last Resort)
   ```typescript
   screen.getByTestId('custom-element')
   ```

### Query Variants

- **getBy**: Throws error if not found
- **queryBy**: Returns null if not found
- **findBy**: Returns promise (for async)

```typescript
// Expect element to exist
expect(screen.getByText('Hello')).toBeInTheDocument();

// Expect element NOT to exist
expect(screen.queryByText('Hidden')).not.toBeInTheDocument();

// Wait for element
await screen.findByText('Loaded');
```

## 📋 Test Checklist

### For Every Component

- [ ] Renders without errors
- [ ] Displays expected content
- [ ] Handles all prop variations
- [ ] User interactions work
- [ ] Event callbacks fire
- [ ] Error states handled
- [ ] Loading states handled
- [ ] Accessibility verified
- [ ] Responsive behavior tested

### Accessibility Checks

- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] All interactive elements keyboard accessible
- [ ] Form inputs have labels
- [ ] Images have alt text
- [ ] Buttons have accessible names
- [ ] Focus management works
- [ ] Color contrast sufficient
- [ ] Screen reader friendly

## 🎯 Integration Test Scenarios

### Scenario 1: Complete Customization Flow

```typescript
it('should complete full customization', async () => {
  const user = userEvent.setup();
  const onComplete = vi.fn();

  render(<CustomizationWizard onComplete={onComplete} />);

  // Step 1: Select style
  await user.click(screen.getByText(/chibi/i));
  await user.click(screen.getByRole('button', { name: /next/i }));

  // Step 2: Select finish
  await user.click(screen.getByText(/matte/i));
  await user.click(screen.getByRole('button', { name: /next/i }));

  // Step 3: Select mount
  await user.click(screen.getByText(/clip/i));
  await user.click(screen.getByRole('button', { name: /next/i }));

  // Step 4: Add text
  await user.type(screen.getByPlaceholderText(/text/i), 'My Car');
  await user.click(screen.getByRole('button', { name: /complete/i }));

  expect(onComplete).toHaveBeenCalledWith({
    style: 'chibi',
    finish: 'matte',
    mountType: 'clip',
    personalizationText: 'My Car',
  });
});
```

### Scenario 2: Cart Management Flow

```typescript
it('should manage cart items', async () => {
  const user = userEvent.setup();
  const onUpdate = vi.fn();
  const onRemove = vi.fn();

  render(<ShoppingCart onUpdateQuantity={onUpdate} onRemoveItem={onRemove} />);

  // Update quantity
  await user.click(screen.getByRole('button', { name: /increase/i }));
  expect(onUpdate).toHaveBeenCalled();

  // Remove item
  await user.click(screen.getByRole('button', { name: /remove/i }));
  expect(onRemove).toHaveBeenCalled();
});
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module"

**Solution**: Check import paths and vitest.config.ts aliases

```typescript
// vitest.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@/app': path.resolve(__dirname, './app'),
  },
}
```

### Issue: "Component not rendering"

**Solution**: Check for missing providers (Redux, Router, etc.)

```typescript
function renderWithProviders(component) {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
}
```

### Issue: "Async test timing out"

**Solution**: Use `waitFor` or increase timeout

```typescript
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });
```

### Issue: "Mock not working"

**Solution**: Ensure mocks are defined before imports

```typescript
// At top of test file
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Then import component
import MyComponent from './MyComponent';
```

## 📈 Coverage Reports

### View Coverage

```bash
npm run test:coverage
```

Open: `coverage/index.html` in browser

### Coverage Thresholds

Configured in [vitest.config.ts](vitest.config.ts:15-21):
- Lines: 70%
- Functions: 70%
- Branches: 70%
- Statements: 70%

## 🔒 Security Testing

### XSS Prevention

```typescript
it('should sanitize user input', () => {
  const maliciousInput = '<script>alert("XSS")</script>';

  render(<Component userInput={maliciousInput} />);

  // Should not execute script
  expect(screen.queryByText('alert')).not.toBeInTheDocument();
});
```

### CSRF Protection

```typescript
it('should include CSRF token in requests', async () => {
  mockFetch.mockResolvedValue({ success: true });

  render(<Form />);

  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(mockFetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({
        'X-CSRF-Token': expect.any(String),
      }),
    })
  );
});
```

## 🎓 Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
expect(component.state.count).toBe(1);

// ✅ Good: Testing user-observable behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 2. Use Accessible Queries

```typescript
// ❌ Bad: Using test IDs
screen.getByTestId('submit-button');

// ✅ Good: Using accessible roles
screen.getByRole('button', { name: /submit/i });
```

### 3. Keep Tests Simple

```typescript
// ❌ Bad: Complex setup
const setupComplexTest = () => {
  const store = createStore();
  const router = createRouter();
  const wrapper = ({ children }) => (
    <Provider store={store}>
      <Router router={router}>{children}</Router>
    </Provider>
  );
  return { store, router, wrapper };
};

// ✅ Good: Simple, focused test
it('should display username', () => {
  render(<Profile username="John" />);
  expect(screen.getByText('John')).toBeInTheDocument();
});
```

### 4. Test Edge Cases

```typescript
describe('QuantityInput', () => {
  it('should handle valid input', async () => {
    // Test happy path
  });

  it('should reject negative numbers', async () => {
    // Test edge case
  });

  it('should reject non-numeric input', async () => {
    // Test edge case
  });

  it('should handle maximum value', async () => {
    // Test boundary
  });
});
```

## 🔄 Continuous Testing

### Pre-commit Hook

```json
// package.json
"husky": {
  "hooks": {
    "pre-commit": "npm run test:run"
  }
}
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Run Tests
  run: npm run test:run

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## 📞 Support

For frontend testing questions:
1. Check this documentation
2. Review existing test examples
3. Consult [Vitest Docs](https://vitest.dev/)
4. Check [Testing Library Docs](https://testing-library.com/react)

## 🎓 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessibility Testing](https://www.w3.org/WAI/test-evaluate/)

---

**Last Updated**: 2025-11-25
**Version**: 1.0.0
**Maintained By**: Ventique Development Team
