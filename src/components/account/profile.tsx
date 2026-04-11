// app/account/profile/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGetProfile, useUpdateProfile } from "@/hooks/use-account";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Camera, User, Mail, Phone, MapPin, Globe, Save } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function ProfilePage() {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const { data: profileData, isLoading } = useGetProfile();
    const updateProfile = useUpdateProfile();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        country: "",
        city: "",
        addressLine1: "",
        postalCode: "",
    });
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (profileData?.data) {
            const user = profileData.data;
            setFormData({
                name: user.name || "",
                phone: user.profile?.phone || "",
                country: user.profile?.country || "",
                city: user.profile?.city || "",
                addressLine1: user.profile?.addressLine1 || "",
                postalCode: user.profile?.postalCode || "",
            });
            setAvatarUrl(user.image || "");
        }
    }, [profileData]);

    function onPick() {
        fileRef.current?.click();
    }

    async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const res = await uploadToCloudinary(file);
            setAvatarUrl(res.secure_url);
            
            // Auto update image in DB
            await updateProfile.mutateAsync({ image: res.secure_url });
            alert("Avatar updated successfully");
        } catch (error) {
            alert("Failed to upload image");
            console.log(error);
            
        } finally {
            setIsUploading(false);
        }
    }

    async function onSave() {
        try {
            await updateProfile.mutateAsync({
                ...formData,
                image: avatarUrl
            });
            alert("Profile updated successfully");
        } catch (error) {
            alert("Failed to save changes");
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-neutral-500 font-medium animate-pulse">Loading your profile...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
                        <p className="text-sm text-neutral-600 mt-1">
                            Manage your personal information and preferences.
                        </p>
                    </div>

                    <Button variant="outline" asChild className="rounded-xl border-neutral-200">
                        <Link href="/account/orders" className="gap-2">
                            View Order History →
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
                    {/* Avatar card */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col items-center">
                            <div className="group relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md bg-neutral-100">
                                {avatarUrl ? (
                                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <User className="h-12 w-12 text-neutral-300" />
                                    </div>
                                )}
                                
                                <button 
                                    onClick={onPick}
                                    disabled={isUploading}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100 disabled:bg-black/20"
                                >
                                    {isUploading ? (
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                    ) : (
                                        <Camera className="h-6 w-6 text-white" />
                                    )}
                                </button>
                            </div>

                            <div className="mt-4 text-center">
                                <h3 className="font-semibold text-neutral-900">{profileData?.data?.name}</h3>
                                <p className="text-xs text-neutral-500 mt-1">{profileData?.data?.email}</p>
                            </div>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onFileChange}
                            />
                        </div>

                        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                            <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Account Role</p>
                            <p className="text-sm font-medium text-blue-900 mt-1 capitalize">{profileData?.data?.role || "Regular User"}</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-neutral-100">
                                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                    <User className="h-5 w-5 text-neutral-400" />
                                    Personal Information
                                </h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-700 ml-1">Full Name</label>
                                        <div className="relative">
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="rounded-xl pl-10 focus-visible:ring-blue-500 focus-visible:border-blue-500 border-neutral-200"
                                                placeholder="Enter your full name"
                                            />
                                            <User className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-700 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Input
                                                value={profileData?.data?.email}
                                                disabled
                                                className="rounded-xl pl-10 bg-neutral-50 border-neutral-100 text-neutral-500"
                                            />
                                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-300" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-700 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Input
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="rounded-xl pl-10 focus-visible:ring-blue-500 focus-visible:border-blue-500 border-neutral-200"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            <Phone className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-neutral-100">
                                <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-neutral-400" />
                                    Shipping Address
                                </h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-neutral-700 ml-1">Street Address</label>
                                    <div className="relative">
                                        <Input
                                            value={formData.addressLine1}
                                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                            className="rounded-xl pl-10 focus-visible:ring-blue-500 focus-visible:border-blue-500 border-neutral-200"
                                            placeholder="123 Shopping St, Apt 4"
                                        />
                                        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-700 ml-1">City</label>
                                        <Input
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="rounded-xl focus-visible:ring-blue-500 border-neutral-200"
                                            placeholder="New York"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-700 ml-1">Country</label>
                                        <div className="relative">
                                            <Input
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                className="rounded-xl pl-10 focus-visible:ring-blue-500 border-neutral-200"
                                                placeholder="United States"
                                            />
                                            <Globe className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-neutral-700 ml-1">Postal Code</label>
                                        <Input
                                            value={formData.postalCode}
                                            onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                                            className="rounded-xl focus-visible:ring-blue-500 border-neutral-200"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button 
                                onClick={onSave}
                                disabled={updateProfile.isPending}
                                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-6 h-auto text-base font-semibold transition-all hover:shadow-lg hover:shadow-blue-200 disabled:opacity-70 gap-2"
                            >
                                {updateProfile.isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
