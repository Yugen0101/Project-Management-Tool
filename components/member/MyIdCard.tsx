'use client';

import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import IdCardPreview from '@/components/admin/IdCardPreview';
import { useState } from 'react';

interface MyIdCardProps {
    card: {
        card_number: string;
        employee_id: string;
        photo_url: string;
        department: string | null;
        phone: string | null;
        blood_group: string | null;
        issue_date: string;
        status: string;
        qr_code_data: string;
        user: {
            full_name: string;
            email: string;
            role: 'admin' | 'associate' | 'member';
        };
    };
}

export default function MyIdCard({ card }: MyIdCardProps) {
    const [showBack, setShowBack] = useState(false);

    const getStatusBadge = (status: string) => {
        const styles = {
            active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
            revoked: { bg: 'bg-red-100', text: 'text-red-700', label: 'Revoked' },
            suspended: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Suspended' }
        };
        return styles[status as keyof typeof styles] || styles.active;
    };

    const statusInfo = getStatusBadge(card.status);

    return (
        <div className="min-h-screen bg-[#f7f3ed] p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold uppercase tracking-tight text-[#1c1917]">My ID Card</h1>
                    <p className="text-lg text-[#78716c] mt-2">
                        Your official TaskForge identification card
                    </p>
                </div>

                {/* Status alert */}
                {card.status !== 'active' && (
                    <div className={`${statusInfo.bg} border-2 border-${statusInfo.text.replace('text-', '')} rounded-xl p-4 mb-6`}>
                        <p className={`font-semibold ${statusInfo.text}`}>
                            ⚠️ Your ID card is currently {statusInfo.label.toLowerCase()}. Please contact your administrator for assistance.
                        </p>
                    </div>
                )}

                {/* Card display */}
                <div className="bg-white rounded-2xl p-8 border border-[#e5dec9] shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-full font-semibold text-sm ${statusInfo.bg} ${statusInfo.text}`}>
                                {statusInfo.label}
                            </span>
                            <span className="text-sm text-[#78716c] font-medium">
                                Issued: {new Date(card.issue_date).toLocaleDateString()}
                            </span>
                        </div>

                        <button
                            onClick={() => setShowBack(!showBack)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#f7f3ed] hover:bg-[#e5dec9] rounded-xl text-sm font-semibold transition-all"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                            {showBack ? 'Show Front' : 'Show Back'}
                        </button>
                    </div>

                    <div className="flex justify-center mb-6">
                        <IdCardPreview
                            user={card.user}
                            photoUrl={card.photo_url}
                            department={card.department || undefined}
                            phone={card.phone || undefined}
                            bloodGroup={card.blood_group || undefined}
                            employeeId={card.employee_id}
                            qrCodeUrl={card.qr_code_data}
                            cardNumber={card.card_number}
                            issueDate={card.issue_date}
                            showBack={showBack}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => alert('Download feature coming soon')}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#d97757] hover:bg-[#c26242] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#d97757]/20"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Download PDF
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-800 font-medium">
                            💡 <strong className="font-semibold">Tip:</strong> Save this card to your phone or print it for physical access. The QR code can be scanned for verification.
                        </p>
                    </div>
                </div>

                {/* Card details */}
                <div className="mt-6 bg-white rounded-2xl p-6 border border-[#e5dec9]">
                    <h2 className="text-xl font-semibold uppercase mb-4 text-[#1c1917]">Card Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Card Number</p>
                            <p className="font-semibold text-[#1c1917]">{card.card_number}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Employee ID</p>
                            <p className="font-semibold text-[#1c1917]">{card.employee_id}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Full Name</p>
                            <p className="font-semibold text-[#1c1917]">{card.user.full_name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Email</p>
                            <p className="font-semibold text-[#1c1917]">{card.user.email}</p>
                        </div>
                        {card.department && (
                            <div>
                                <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Department</p>
                                <p className="font-semibold text-[#1c1917]">{card.department}</p>
                            </div>
                        )}
                        {card.phone && (
                            <div>
                                <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Phone</p>
                                <p className="font-semibold text-[#1c1917]">{card.phone}</p>
                            </div>
                        )}
                        {card.blood_group && (
                            <div>
                                <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Blood Group</p>
                                <p className="font-semibold text-[#1c1917]">{card.blood_group}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-medium text-[#78716c] uppercase tracking-wider mb-1">Role</p>
                            <p className="font-semibold text-[#1c1917] uppercase">{card.user.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
