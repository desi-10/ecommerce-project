export default function SearchSheetContent() {
    return (
        <div>
            <input
                placeholder="Search products..."
                className="w-full border p-3 rounded-sm"
            />
            <p className="mt-3 text-sm text-muted-foreground">
                Type to search products.
            </p>
        </div>
    );
}
