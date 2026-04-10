# Dashboard Redesign - Quick Reference

## Color System

### Primary Blue (CSS Variables)
```css
var(--primary-50)   /* #eff6ff - Very light backgrounds */
var(--primary-600)  /* #2563eb - Main interactive elements */
var(--primary-700)  /* #1d4ed8 - Hover states */
```

### Secondary Colors
```css
emerald-600         /* Success, completed states */
red-600             /* Errors, failed states */
yellow-600          /* Warnings, low stock alerts */
gray-600            /* Neutral, secondary text */
```

## Using in Components

### Button with Primary Color
```tsx
<Button 
  className="text-white rounded-xl"
  style={{ backgroundColor: 'var(--primary-600)' }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-700)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
>
  Click Me
</Button>
```

### Icon with Primary Color
```tsx
<div style={{ color: 'var(--primary-600)' }}>
  <Icon className="h-6 w-6" />
</div>
```

### Background with Primary Color
```tsx
<div style={{ backgroundColor: 'var(--primary-50)' }}>
  Content here
</div>
```

## Currency Formatting

### Format as GHS with Code
```tsx
import { formatGHS } from '@/lib/currency';

formatGHS(1500)      // Returns "₵1,500.00 GHS"
formatGHS(1500.50)   // Returns "₵1,500.50 GHS"
```

### Format as GHS without Code
```tsx
formatGHS(1500, false)  // Returns "₵1,500.00"
```

### Calculate Discounts
```tsx
import { getDiscountPercent, getPriceAfterDiscount } from '@/lib/currency';

const originalPrice = 1000;
const salePrice = 750;

getDiscountPercent(originalPrice, salePrice)      // Returns 25
getPriceAfterDiscount(originalPrice, 25)          // Returns 750
```

## Dashboard Pages

### Overview (/dashboard)
**Key Features:**
- 4 metric cards with GHS currency
- Revenue chart with primary color gradient
- Recent orders with status badges
- Order status breakdown
- Top products ranking

### Products (/dashboard/products)
**Key Features:**
- Product listing table
- Add button with primary color
- Empty state with CTA
- Error handling

### Categories (/dashboard/categories)
**Key Features:**
- Category listing
- Add category dialog
- Empty state messaging

### Orders (/dashboard/orders)
**Key Features:**
- Order listing table
- Status badges
- Empty state

### Payments (/dashboard/payments)
**Key Features:**
- Payment stats with GHS
- Success/failed breakdown
- Payment records table

### Inventory (/dashboard/inventory)
**Key Features:**
- Stock level monitoring
- Low stock alerts
- Out of stock tracking
- Visual indicators

### Discounts (/dashboard/discounts)
**Key Features:**
- Active discounts count
- Add discount button
- Discount listing
- Empty state with CTA

## Common Patterns

### Page Header Structure
```tsx
<div>
  <h1 className="text-3xl font-bold tracking-tight text-gray-900">Page Title</h1>
  <p className="text-sm text-gray-600 mt-2">Helpful description</p>
</div>
```

### Action Button
```tsx
<Button 
  style={{ backgroundColor: 'var(--primary-600)' }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-700)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-600)'}
>
  Action Text
</Button>
```

### Error Alert
```tsx
<div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
  <div>
    <p className="font-medium text-red-900">Error Title</p>
    <p className="text-sm text-red-700 mt-1">Error message details</p>
  </div>
</div>
```

### Loading State
```tsx
{isLoading ? (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
    ))}
  </div>
) : (
  // Actual content
)}
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-gray-300 bg-gray-50">
  <Icon className="h-12 w-12 text-gray-400 mb-4" />
  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items</h3>
  <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">
    Helpful description
  </p>
  <Button style={{ backgroundColor: 'var(--primary-600)' }}>
    Action Button
  </Button>
</div>
```

## File Locations

| File | Purpose |
|------|---------|
| `/src/app/globals.css` | Primary color CSS variables |
| `/src/lib/currency.ts` | GHS formatting functions |
| `/src/components/app-sidebar.tsx` | Navigation with primary colors |
| `/src/app/dashboard/layout.tsx` | Header with primary colors |
| `/src/app/dashboard/page.tsx` | Overview page with metrics |
| `/src/app/dashboard/products/page.tsx` | Products management |
| `/src/app/dashboard/categories/page.tsx` | Categories management |
| `/src/app/dashboard/orders/page.tsx` | Orders listing |
| `/src/app/dashboard/payments/page.tsx` | Payments tracking |
| `/src/app/dashboard/inventory/page.tsx` | Inventory monitoring |
| `/src/app/dashboard/discounts/page.tsx` | Discounts management |

## Common Tasks

### Change Primary Color
Edit `/src/app/globals.css`:
```css
--primary-600: #your-new-color;
--primary-700: #your-darker-shade;
```

### Format Price in Component
```tsx
import { formatGHS } from '@/lib/currency';

<span>{formatGHS(productPrice, false)}</span>
```

### Add Loading State to Page
```tsx
const { isLoading } = useYourHook();

{isLoading ? <LoadingSkeleton /> : <YourContent />}
```

### Add Error Handling
```tsx
const { isError, error } = useYourHook();

{isError && (
  <ErrorAlert message={error?.message} />
)}
```

## Tailwind Classes Used

**Text Sizes:**
- `text-sm` - Small text
- `text-base` - Normal text
- `text-lg` - Large text
- `text-xl` - Extra large
- `text-2xl` - 2x large (headers)
- `text-3xl` - 3x large (page titles)

**Font Weights:**
- `font-medium` - Medium (labels)
- `font-semibold` - Semibold (subheaders)
- `font-bold` - Bold (headers/values)

**Spacing:**
- `p-4` - Padding
- `mb-6` - Margin bottom
- `gap-4` - Gap between flex items
- `mt-2` - Margin top

**Colors:**
- `text-gray-900` - Dark text
- `text-gray-600` - Secondary text
- `text-gray-400` - Tertiary text
- `bg-gray-50` - Light background
- `bg-white` - White background
- `border-gray-200` - Light border

## Tips & Best Practices

1. **Always use CSS variables for colors** - Makes theme changes easy
2. **Keep GHS formatting consistent** - Use `formatGHS()` everywhere
3. **Include error states** - Users need to know what went wrong
4. **Show loading states** - Better UX than sudden content changes
5. **Provide empty states** - Help users understand what's missing
6. **Use semantic HTML** - Improves accessibility
7. **Test on mobile** - Ensure responsive design works
8. **Keep components reusable** - DRY principle

## Support

- Check `/src/lib/currency.ts` for currency utilities
- Check `/src/app/globals.css` for color variables
- Check `/src/app/dashboard/` for page examples
- Review component patterns in existing pages
