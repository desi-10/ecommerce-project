"use client";

import { Button } from "@/components/ui/button";

export default function PaginationBar({
    page,
    totalPages,
    onChange,
}: {
    page: number;
    totalPages: number;
    onChange: (p: number) => void;
}) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

    return (
        <div className="mt-8 flex items-center justify-center gap-2 bg-white rounded-lg w-fit p-4 mx-auto border">
            <Button
                variant="outline"
                className="rounded-sm"
                disabled={page === 1}
                onClick={() => onChange(page - 1)}
            >
                Prev
            </Button>

            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(p)}
                    className={[
                        "h-9 w-9 border rounded-sm text-sm",
                        p === page ? "border-primary text-primary" : "border-neutral-200",
                    ].join(" ")}
                >
                    {p}
                </button>
            ))}

            <Button
                variant="outline"
                className="rounded-sm"
                disabled={page === totalPages}
                onClick={() => onChange(page + 1)}
            >
                Next
            </Button>
        </div>
    );
}
