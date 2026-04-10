# Technical Architecture Notes

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx (improved header/sidebar)
│   │   ├── page.tsx (completely redesigned)
│   │   ├── products/
│   │   │   └── page.tsx (enhanced with error handling)
│   │   └── products/new (add product page)
│   ├── (ecommerce)/
│   │   └── shop/
│   │       └── page.tsx (uses normalization utility)
│   └── api/
│       ├── products/
│       │   ├── route.ts (upload/create)
│       │   └── [id]/route.ts (update/delete)
│       └── upload/route.ts
├── components/
│   ├── image-upload.tsx (enhanced UX)
│   ├── product/
│   │   ├── add-product-form.tsx (improved feedback)
│   │   ├── edit-product.tsx (improved feedback)
│   │   └── ...
│   ├── shop/
│   │   ├── shop-results.tsx (uses normalizer)
│   │   └── ...
│   └── ui/ (shadcn components)
├── hooks/
│   ├── use-product.ts (product mutations/queries)
│   ├── use-dashboard.ts (dashboard data)
│   └── ...
├── lib/
│   ├── product-normalizer.ts (NEW - centralized)
│   ├── api-handler.ts
│   ├── validator.ts
│   └── ...
├── types/
│   └── product.ts
├── server/
│   └── products/
│       ├── products.service.ts
│       └── products.validators.ts
└── styles/
    └── globals.css

```

## Key Components

### 1. ImageUpload Component
**Location**: `src/components/image-upload.tsx`

**Features**:
- Drag-and-drop handler
- File validation (type, size)
- Preview generation with URL.createObjectURL
- File size formatting utility
- Visual feedback states

**Props**:
```typescript
interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  currentImage?: string | null;
  maxSize?: number; // MB (default: 5)
}
```

**State Management**:
- `error`: Validation error message
- `preview`: Preview URL (created with createObjectURL)
- `isDragging`: Drag state for styling
- `fileName`: Display file name
- `fileSize`: Formatted file size

### 2. AddProductForm Component
**Location**: `src/components/product/add-product-form.tsx`

**Features**:
- React Hook Form integration
- Zod schema validation
- Field array for variants
- FormData submission for file uploads
- Error and success state management

**Form Structure**:
```
General Information
├── Product Name
└── Description

Media
└── Product Image

Pricing & Inventory
├── Default Price
├── Default Sale Price
└── Default Stock

Variants
├── Variant 1
├── Variant 2
└── ... (can add unlimited)
```

**Submission Flow**:
1. Validate all fields with schema
2. Prepare FormData with file
3. Call API endpoint
4. Show success notification
5. Auto-redirect after delay

### 3. Product Normalizer Utility
**Location**: `src/lib/product-normalizer.ts`

**Purpose**: Ensure consistent product data across frontend

**Key Functions**:
```typescript
normalizeProduct(rawProduct): Product
  - Converts API response to Product type
  - Handles missing fields with defaults
  - Maps pricing fields correctly
  - Returns type-safe object

normalizeProducts(rawProducts[]): Product[]
  - Maps array of products
  - Maintains order
  - Consistent error handling

formatPrice(price, currency): string
  - Uses Intl.NumberFormat
  - Locale-aware formatting
  - Currency symbol inclusion

getDiscountPercentage(original, sale): number
  - Calculates discount %
  - Safe division (handles zero)

isOnSale(product): boolean
  - Checks if product has sale price
  - Compares prices for discount

getProductImageUrl(product): string
  - Gets primary image URL
  - Handles multiple image formats
  - Provides fallback
```

**Data Mapping**:
```typescript
Raw API → Normalized Product

p.id → String(id)
p.price → price (or salePrice if available)
p.salePrice → used as primary if exists
p.inventory.stock → stock
p.images[0] → image (fallback chain)
```

### 4. Enhanced Dashboard
**Location**: `src/app/dashboard/page.tsx`

**Architecture**:
- Component-based metric cards
- MetricCard reusable component
- Data aggregation at page level
- Separate concerns (UI vs data)

**Data Flow**:
```
useGetDashboardStats() 
  ↓
data.metrics, data.recentOrders
  ↓
render MetricCards with trends
render charts with data
render order lists
```

**MetricCard Component**:
```typescript
interface MetricCardProps {
  icon: IconComponent;
  label: string;
  value: string | number;
  trend?: "up" | "down";
  trendValue?: string;
  color?: "indigo" | "emerald" | "blue" | "purple" | "orange";
}
```

**Styling System**:
- Tailwind CSS classes
- Consistent colors
- Responsive grid (gap-6, md:grid-cols-2, lg:grid-cols-7)
- Hover effects (shadow, border changes)

### 5. Products Page Enhancement
**Location**: `src/app/dashboard/products/page.tsx`

**States Handled**:
- `isLoading`: Show skeleton loaders
- `isError`: Display error message with details
- `empty`: Show helpful empty state
- `success`: Render data table

**Error UI**:
```tsx
<div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
  <AlertCircle icon />
  <div>
    <p className="font-medium text-red-900">Failed to load products</p>
    <p className="text-sm text-red-700">{error.message}</p>
  </div>
</div>
```

---

## Data Flow

### Product Creation
```
AddProductForm (Client)
  ↓ (handleSubmit)
Prepare FormData
  ↓ (includes file)
useCreateProduct mutation
  ↓
POST /api/products
  ↓ (server)
uploadFileToCloudinary(imageFile)
  ↓
createProductService(payload)
  ↓ (database)
Return created product
  ↓ (client)
Invalidate products query
  ↓
Redirect to /dashboard/products
```

### Product Normalization
```
API Response (raw product data)
  ↓
normalizeProduct() function
  ↓ (field mapping)
Normalized Product type
  ↓ (type-safe)
Components receive normalized data
  ↓
Consistent UI rendering
```

### Dashboard Data
```
useGetDashboardStats hook
  ↓ (React Query)
GET /api/dashboard/stats
  ↓ (server computes)
Return { metrics, recentOrders }
  ↓ (client aggregates)
Dashboard component renders
  ↓
MetricCard, Charts, Lists
```

---

## State Management Patterns

### Form State (React Hook Form)
```typescript
const form = useForm<CreateProductInput>({
  resolver: zodResolver(createProductSchema),
  defaultValues: {...}
});

const { register, handleSubmit, watch, formState: { errors } } = form;
```

**Advantages**:
- Performance optimized (doesn't rerender whole form)
- Built-in validation
- Zod schema integration
- Minimal re-renders

### Data Fetching (React Query)
```typescript
const { data, isLoading, isError, error } = useGetDashboardStats();
```

**Advantages**:
- Automatic caching
- Background refetching
- Stale state handling
- Built-in error handling

### Mutations (React Query)
```typescript
const { mutateAsync, isPending } = useCreateProduct();
await mutateAsync(formData);
```

**Benefits**:
- Handles async operations
- Automatic query invalidation
- Loading state management
- Error handling

### Local Component State (useState)
```typescript
const [submitError, setSubmitError] = useState<string | null>(null);
const [showSuccess, setShowSuccess] = useState(false);
```

**Use for**:
- UI-only state (modals, toasts)
- Temporary validation messages
- Animation triggers

---

## Styling Architecture

### Tailwind CSS Classes
- **Spacing**: gap-6, p-6, mb-4 (4px = 1 unit)
- **Sizing**: h-5, w-4, max-w-md
- **Colors**: indigo-600, red-50, gray-900
- **Effects**: shadow-sm, rounded-2xl
- **Responsive**: md:grid-cols-2, lg:grid-cols-4
- **States**: hover:, focus:, disabled:

### Color System
```
Primary (Indigo)
├── indigo-50 (light background)
├── indigo-100 (hover background)
├── indigo-500 (text/icon)
├── indigo-600 (primary color)
└── indigo-700 (hover state)

Success (Emerald)
├── emerald-50 (light background)
├── emerald-100 (hover)
├── emerald-600 (primary)
└── emerald-700 (hover)

Neutral (Gray)
├── white (backgrounds)
├── gray-50 (light background)
├── gray-100 (placeholder)
├── gray-300 (borders)
├── gray-500 (secondary text)
├── gray-600 (medium text)
└── gray-900 (primary text)
```

### Component Styling Pattern
```tsx
// Card wrapper
<div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all">
  {/* Icon with background */}
  <div className="bg-indigo-50 p-3 rounded-xl">
    <Icon className="h-6 w-6 text-indigo-600" />
  </div>
  
  {/* Content */}
  <p className="text-sm font-medium text-gray-600">Label</p>
  <p className="text-3xl font-bold text-gray-900 mt-1">Value</p>
</div>
```

---

## Error Handling Strategy

### Form Validation
```typescript
// Zod schema validation
const schema = z.object({
  name: z.string().min(1, "Name required"),
  price: z.number().positive("Price must be positive")
});

// Display in component
{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
```

### API Errors
```typescript
try {
  await mutateAsync(data);
} catch (error: any) {
  const message = error?.message || "Default message";
  setSubmitError(message);
}
```

### UI Error Display
```tsx
{submitError && (
  <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
    <AlertCircle className="h-5 w-5 text-red-600" />
    <div>
      <p className="font-medium text-red-900">Error</p>
      <p className="text-sm text-red-700">{submitError}</p>
    </div>
  </div>
)}
```

---

## Performance Considerations

### Optimization Techniques
1. **useMemo for expensive computations**
   ```typescript
   const normalized = useMemo(
     () => rawProducts.map(normalizeProduct), 
     [rawProducts]
   );
   ```

2. **useCallback for stable functions**
   ```typescript
   const handleFileSelect = useCallback(
     (file: File) => { /* ... */ },
     [onFileSelect, maxSize]
   );
   ```

3. **Lazy loading components**
   ```typescript
   const Component = dynamic(() => import('./Heavy'), {
     loading: () => <LoadingSkeleton />
   });
   ```

4. **Image optimization**
   - Use next/image for auto-optimization
   - Provide width/height attributes
   - Use modern formats (WebP)

5. **Bundle size**
   - Tree-shaking unused code
   - Code splitting by route
   - Minified dependencies

---

## Testing Recommendations

### Unit Tests
- normalizeProduct utility
- formatPrice function
- isOnSale function
- ValidationSchemas

### Integration Tests
- Form submission flow
- Data fetching and display
- Error handling scenarios
- State management

### E2E Tests
- Product creation complete flow
- Product edit workflow
- Dashboard data display
- Image upload process

### Test Data
```typescript
// Mock product
const mockProduct = {
  id: "1",
  name: "Test Product",
  price: 99.99,
  salePrice: 79.99,
  stock: 10,
  image: "https://example.com/image.jpg"
};

// Mock dashboard stats
const mockStats = {
  metrics: [
    { title: "Revenue", value: 5000, trend: "up", change: "12%" }
  ],
  recentOrders: []
};
```

---

## Deployment Considerations

### Environment Variables
- `NEXT_PUBLIC_API_URL`: API endpoint
- `CLOUDINARY_API_KEY`: Image upload service
- `DATABASE_URL`: Database connection
- `JWT_SECRET`: Authentication

### Build Process
```bash
npm run build  # Production build
npm run start  # Start server
npm run dev    # Development mode
```

### Performance Checklist
- [ ] Images optimized (WebP, compressed)
- [ ] Code minified and bundled
- [ ] Unused CSS removed
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] Error tracking enabled

---

## Future Enhancements

### Planned Features
1. **Product Search** - Full-text search with debouncing
2. **Advanced Filters** - Category, price range, stock status
3. **Bulk Operations** - Edit multiple products at once
4. **Export Functionality** - CSV/Excel export of products
5. **Analytics** - Detailed sales analytics
6. **Inventory Alerts** - Low stock notifications
7. **Product Scheduling** - Schedule launches
8. **A/B Testing** - Test different product layouts

### Scalability
- Database query optimization
- API caching strategy
- Frontend code splitting
- Image CDN integration
- Database indexing

### Security
- Input validation on all forms
- SQL injection prevention (use parameterized queries)
- XSS protection (sanitize HTML)
- CSRF tokens for state-changing operations
- Rate limiting on APIs
- User permission verification

---

## Debugging Tips

### Browser Console
```javascript
// Check React Query cache
window.__REACT_QUERY_DEVTOOLS_PANEL__

// Check form state
console.log(form.watch())

// Check errors
console.log(formState.errors)
```

### Network Tab
- Monitor API requests
- Check response payloads
- Verify error responses
- Check performance (timing)

### React DevTools
- Inspect component state
- Track re-renders
- Profile performance
- Check hooks

---

## Documentation Links

- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [React Query](https://tanstack.com/query/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

