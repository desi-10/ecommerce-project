"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsLoading(true);
      // const { error } = await authClient.changePassword({
      //     currentPassword,
      //     newPassword,
      //     revokeOtherSessions: true,
      // });

      if (error) {
        alert(error.message || "Failed to update password");
      } else {
        alert("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Security Settings
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Protect your account by managing your password and sessions.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-neutral-100 bg-neutral-50/30 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-neutral-400" />
              Change Password
            </span>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              {showPasswords ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              {showPasswords ? "Hide Passwords" : "Show Passwords"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-neutral-700 ml-1">
                Current Password
              </label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="rounded-xl border-neutral-200 focus-visible:ring-blue-500 h-11"
                required
              />
            </div>

            <div className="h-px bg-neutral-50" />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700 ml-1">
                  New Password
                </label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="rounded-xl border-neutral-200 focus-visible:ring-blue-500 h-11"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700 ml-1">
                  Confirm New Password
                </label>
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="rounded-xl border-neutral-200 focus-visible:ring-blue-500 h-11"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-50">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <AlertCircle className="h-3.5 w-3.5" />
                Password must be at least 8 characters
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-6 h-auto font-bold shadow-lg shadow-blue-100 disabled:opacity-70 transition-all hover:scale-[1.02]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6">
            <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4" />
              Security Status
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-xs text-blue-800 font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                Your account is currently verified.
              </li>
              <li className="flex items-start gap-3 text-xs text-blue-800 font-medium">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                Two-factor authentication is not yet enabled.
              </li>
            </ul>
            <button className="w-full mt-6 py-2.5 rounded-xl border border-blue-200 bg-white text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
              Enable 2FA
            </button>
          </div>

          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6">
            <h3 className="text-sm font-bold text-neutral-900 mb-2">
              Account Tip
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Always use a strong, unique password for each of your online
              accounts to prevent unauthorized access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
