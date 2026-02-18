"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SecuritySection() {
    const [current, setCurrent] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    return (
        <div>
            <h1 className="text-xl font-semibold">Security Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
                Change your password below.
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (password !== confirm) {
                        alert("Passwords do not match");
                        return;
                    }
                    alert("Password updated (connect backend)");
                }}
                className="mt-6 space-y-4 max-w-md"
            >
                <div>
                    <label className="text-sm font-medium">Current Password</label>
                    <Input
                        type="password"
                        className="mt-1 rounded-sm"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                        type="password"
                        className="mt-1 rounded-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input
                        type="password"
                        className="mt-1 rounded-sm"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />
                </div>

                <Button className="rounded-sm bg-blue-600 hover:bg-blue-700">
                    Update Password
                </Button>
            </form>
        </div>
    );
}
