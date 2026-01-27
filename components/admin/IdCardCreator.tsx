'use client';

import { useState } from 'react';
import { XMarkIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { createIdCard, uploadCardPhoto } from '@/app/actions/id-cards';
import IdCardPreview from './IdCardPreview';
import { toast } from 'sonner';

interface User {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'associate' | 'member';
}

interface IdCardCreatorProps {
    users: User[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function IdCardCreator({ users, onClose, onSuccess }: IdCardCreatorProps) {
    const [selectedUser, setSelectedUser] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [department, setDepartment] = useState('');
    const [phone, setPhone] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBack, setShowBack] = useState(false);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Photo size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !photoFile) {
            toast.error('Please select a user and upload a photo');
            return;
        }

        setLoading(true);

        try {
            // Upload photo
            const uploadResult = await uploadCardPhoto(photoFile, selectedUser);
            if (!uploadResult.success) {
                throw new Error(uploadResult.error);
            }

            // Create card
            const result = await createIdCard({
                userId: selectedUser,
                photoUrl: uploadResult.data!,
                department: department || undefined,
                phone: phone || undefined,
                bloodGroup: bloodGroup || undefined,
                employeeId: employeeId || undefined
            });

            if (result.success) {
                toast.success(result.message || 'ID card created successfully!');
                onSuccess();
            } else {
                toast.error(result.error || 'Failed to create ID card');
            }
        } catch (err: any) {
            toast.error(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const selectedUserData = users.find(u => u.id === selectedUser);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1c1917]/20 backdrop-blur-sm">
            <div className="w-full max-w-7xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-10 py-6 border-b border-[#e5dec9] flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-semibold uppercase tracking-tight">Create ID Card</h2>
                        <p className="text-sm text-[#78716c] mt-1">Generate a new ID card for a team member</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#f7f3ed] rounded-xl transition-colors"
                        disabled={loading}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-10">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* User selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
                                Select User *
                            </label>
                            <select
                                required
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-[#e5dec9] rounded-xl focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none font-medium"
                                disabled={loading}
                            >
                                <option value="">Choose a user...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.full_name} ({user.role})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Photo upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
                                Photo * (Max 5MB)
                            </label>
                            <div className="flex items-start gap-4">
                                {photoPreview && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-32 h-32 rounded-xl object-cover border-2 border-[#e5dec9]"
                                        />
                                    </div>
                                )}
                                <label className="flex-1 flex flex-col items-center justify-center px-6 py-8 border-2 border-dashed border-[#e5dec9] rounded-xl cursor-pointer hover:border-[#d97757] transition-colors">
                                    <PhotoIcon className="w-8 h-8 text-[#78716c] mb-2" />
                                    <span className="text-sm font-medium text-[#78716c] text-center">
                                        {photoFile ? photoFile.name : 'Click to upload photo'}
                                    </span>
                                    <span className="text-xs text-[#78716c] mt-1">JPG, PNG (Recommended: 400x400px)</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                        required
                                        disabled={loading}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
                                Department
                            </label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                placeholder="e.g., Engineering, Marketing"
                                className="w-full px-4 py-3 bg-white border border-[#e5dec9] rounded-xl focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none font-medium"
                                disabled={loading}
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g., +91 98765 43210"
                                className="w-full px-4 py-3 bg-white border border-[#e5dec9] rounded-xl focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none font-medium"
                                disabled={loading}
                            />
                        </div>

                        {/* Blood Group */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
                                Blood Group
                            </label>
                            <select
                                value={bloodGroup}
                                onChange={(e) => setBloodGroup(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-[#e5dec9] rounded-xl focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none font-medium"
                                disabled={loading}
                            >
                                <option value="">Select blood group...</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        {/* Employee ID */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
                                Employee ID (Optional)
                            </label>
                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                placeholder="Auto-generated if left blank"
                                className="w-full px-4 py-3 bg-white border border-[#e5dec9] rounded-xl focus:border-[#d97757] focus:ring-4 focus:ring-[#d97757]/10 transition-all outline-none font-medium"
                                disabled={loading}
                            />
                        </div>

                        {/* Info message */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-xs text-blue-800 font-medium">
                                📧 Login credentials will be sent to the user's email address automatically.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-white border border-[#e5dec9] rounded-xl font-medium text-sm hover:bg-[#f7f3ed] transition-all"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-[#d97757] hover:bg-[#c26242] text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-[#d97757]/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <ArrowPathIcon className="w-5 h-5 animate-spin" />}
                                {loading ? 'Creating...' : 'Create Card'}
                            </button>
                        </div>
                    </form>

                    {/* Live preview */}
                    <div className="flex flex-col items-center justify-center bg-[#f7f3ed] rounded-xl p-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider">
                                Card Preview
                            </p>
                            <button
                                type="button"
                                onClick={() => setShowBack(!showBack)}
                                className="text-xs font-medium text-[#d97757] hover:text-[#c26242] uppercase tracking-wider flex items-center gap-1"
                            >
                                <ArrowPathIcon className="w-4 h-4" />
                                {showBack ? 'Show Front' : 'Show Back'}
                            </button>
                        </div>

                        {selectedUserData ? (
                            <IdCardPreview
                                user={selectedUserData}
                                photoUrl={photoPreview}
                                department={department}
                                phone={phone}
                                bloodGroup={bloodGroup}
                                employeeId={employeeId || 'EMP24XXXX'}
                                showBack={showBack}
                            />
                        ) : (
                            <div className="w-[400px] h-[250px] flex items-center justify-center text-center text-[#78716c] border-2 border-dashed border-[#e5dec9] rounded-2xl">
                                <div>
                                    <p className="text-sm font-medium">Select a user to preview the card</p>
                                    <p className="text-xs mt-2">The card design will vary based on the user's role</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
