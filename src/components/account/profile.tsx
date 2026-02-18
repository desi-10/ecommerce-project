"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileSection() {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john@example.com");

    return (
        <div>
            <h1 className="text-xl font-semibold">Profile Information</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Update your personal details below.
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Profile updated (connect to backend)");
                }}
                className="mt-6 space-y-4 max-w-md"
            >
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                        className="mt-1 rounded-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                        className="mt-1 rounded-sm"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <Button className="rounded-sm bg-blue-600 hover:bg-blue-700">
                    Save Changes
                </Button>
            </form>
        </div>
    );
}
