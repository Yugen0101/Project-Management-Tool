'use client';

import { QrCodeIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const ROLE_COLORS = {
    admin: {
        primary: '#d97757',
        secondary: '#1c1917',
        accent: '#e89c82',
        gradient: 'from-[#d97757] to-[#c26242]',
        header: 'SYSTEM ADMINISTRATOR'
    },
    associate: {
        primary: '#7c9473',
        secondary: '#1c1917',
        accent: '#a8c5a0',
        gradient: 'from-[#7c9473] to-[#6a8061]',
        header: 'PROJECT ASSOCIATE'
    },
    member: {
        primary: '#6b7280',
        secondary: '#1c1917',
        accent: '#9ca3af',
        gradient: 'from-[#6b7280] to-[#4b5563]',
        header: 'TEAM MEMBER'
    }
};

interface IdCardPreviewProps {
    user: {
        full_name: string;
        email: string;
        role: 'admin' | 'associate' | 'member';
    };
    photoUrl?: string;
    department?: string;
    phone?: string;
    bloodGroup?: string;
    employeeId?: string;
    qrCodeUrl?: string;
    cardNumber?: string;
    issueDate?: string;
    showBack?: boolean;
}

export default function IdCardPreview({
    user,
    photoUrl,
    department,
    phone,
    bloodGroup,
    employeeId,
    qrCodeUrl,
    cardNumber,
    issueDate,
    showBack = false
}: IdCardPreviewProps) {
    const colors = ROLE_COLORS[user.role] || ROLE_COLORS.member;

    if (showBack) {
        // Back of the card
        return (
            <div className="w-[430px] h-[265px] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 relative" style={{ borderColor: colors.primary }}>
                {/* Decorative wave */}
                <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${colors.gradient}`}>
                    <svg className="absolute bottom-0 w-full" viewBox="0 0 400 50" preserveAspectRatio="none">
                        <path d="M0,25 Q100,0 200,25 T400,25 L400,50 L0,50 Z" fill="white" />
                    </svg>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 pt-24 flex flex-col items-center justify-center h-full">
                    {/* Company logo/name */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold" style={{ color: colors.primary }}>
                            Task<span className="text-[#1c1917]">Forge</span>
                        </h2>
                        <p className="text-[8px] font-medium text-[#78716c] uppercase tracking-widest mt-1">
                            Project Management Platform
                        </p>
                    </div>

                    {/* Barcode */}
                    {cardNumber && (
                        <div className="mb-4">
                            <svg width="200" height="40">
                                {/* Simple barcode representation */}
                                {Array.from({ length: 20 }).map((_, i) => (
                                    <rect
                                        key={i}
                                        x={i * 10}
                                        y="0"
                                        width={Math.random() > 0.5 ? 4 : 2}
                                        height="30"
                                        fill="#1c1917"
                                    />
                                ))}
                            </svg>
                            <p className="text-[8px] font-medium text-center text-[#78716c] mt-1">{cardNumber}</p>
                        </div>
                    )}

                    {/* Terms & Conditions */}
                    <div className="text-[7px] text-[#78716c] text-center space-y-1">
                        <p className="font-medium uppercase tracking-wide">Terms & Conditions:</p>
                        <p>• This card is property of TaskForge</p>
                        <p>• Must be returned upon termination</p>
                        <p>• Report if lost or stolen immediately</p>
                    </div>

                    {/* Signature line */}
                    <div className="mt-4 pt-3 border-t border-[#e5dec9] w-full">
                        <div className="flex justify-between items-end text-[8px]">
                            <div>
                                <div className="w-20 border-b border-[#78716c] mb-1"></div>
                                <p className="font-medium text-[#78716c]">Authorized Signature</p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-[#78716c]">Valid Until Revoked</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Front of the card
    return (
        <div className="w-[430px] h-[265px] bg-white rounded-2xl shadow-2xl overflow-hidden border-4 relative" style={{ borderColor: colors.primary }}>
            {/* Decorative wave header */}
            <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-br ${colors.gradient}`}>
                <svg className="absolute bottom-0 w-full" viewBox="0 0 400 30" preserveAspectRatio="none">
                    <path d="M0,15 Q100,0 200,15 T400,15 L400,30 L0,30 Z" fill="white" />
                </svg>
            </div>

            {/* Company logo/header */}
            <div className="absolute top-4 left-0 right-0 flex flex-col items-center z-10">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-semibold text-white text-xs">TF</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm uppercase tracking-tight">TaskForge</h3>
                </div>
                <p className="text-white/90 text-[8px] font-semibold uppercase tracking-[0.2em]">{colors.header}</p>
            </div>

            {/* Content */}
            <div className="relative pt-[78px] px-6 pb-6 h-full flex gap-5">
                {/* Photo */}
                <div className="flex-shrink-0">
                    {photoUrl ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg" style={{ borderColor: colors.accent }}>
                            <Image
                                src={photoUrl}
                                alt={user.full_name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-semibold text-white shadow-lg border-4 border-white"
                            style={{ backgroundColor: colors.primary }}
                        >
                            {user.full_name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="space-y-0.5">
                        <h3 className="font-semibold text-[17px] uppercase tracking-tight truncate leading-none" style={{ color: colors.secondary }}>
                            {user.full_name}
                        </h3>
                        {department && (
                            <p className="text-[10px] font-medium uppercase tracking-wider truncate" style={{ color: colors.primary }}>
                                {department}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1 text-[9px]">
                        <div className="grid grid-cols-[60px_10px_1fr] items-baseline">
                            <span className="font-bold text-[#78716c] uppercase">ID No</span>
                            <span className="text-[#d97757]/40 font-serif">:</span>
                            <span className="font-semibold text-[#1c1917] truncate">{employeeId || 'EMPXXXX'}</span>
                        </div>
                        {issueDate && (
                            <div className="grid grid-cols-[60px_10px_1fr] items-baseline">
                                <span className="font-bold text-[#78716c] uppercase">Issued</span>
                                <span className="text-[#d97757]/40 font-serif">:</span>
                                <span className="font-semibold text-[#1c1917] truncate">{new Date(issueDate).toLocaleDateString()}</span>
                            </div>
                        )}
                        {bloodGroup && (
                            <div className="grid grid-cols-[65px_10px_1fr] items-baseline">
                                <span className="font-bold text-[#78716c] uppercase">B.Group</span>
                                <span className="text-[#d97757]/40 font-serif">:</span>
                                <span className="font-black text-[#1c1917]">{bloodGroup}</span>
                            </div>
                        )}
                        {phone && (
                            <div className="grid grid-cols-[60px_10px_1fr] items-baseline">
                                <span className="font-bold text-[#78716c] uppercase">Phone</span>
                                <span className="text-[#d97757]/40 font-serif">:</span>
                                <span className="font-semibold text-[#1c1917] truncate">{phone}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-[65px_10px_1fr] items-baseline">
                            <span className="font-bold text-[#78716c] uppercase">E-mail</span>
                            <span className="text-[#d97757]/40 font-serif">:</span>
                            <span className="font-semibold text-[#1c1917] break-all text-[8.5px] leading-tight">{user.email}</span>
                        </div>
                    </div>
                </div>

                {/* QR Code */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    {qrCodeUrl ? (
                        <div className="w-20 h-20 bg-white rounded-lg p-1 shadow-md">
                            <Image src={qrCodeUrl} alt="QR Code" width={76} height={76} className="w-full h-full" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 bg-[#f7f3ed] rounded-lg flex items-center justify-center">
                            <QrCodeIcon className="w-10 h-10 text-[#78716c]" />
                        </div>
                    )}
                    <p className="text-[7px] font-medium text-[#78716c] mt-1 text-center">SCAN TO VERIFY</p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 h-6 flex items-center justify-center text-white font-semibold text-[8px] tracking-widest" style={{ backgroundColor: colors.secondary }}>
                AUTHORIZED ACCESS ONLY
            </div>
        </div>
    );
}
