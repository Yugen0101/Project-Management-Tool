'use client';

import { useState } from 'react';
import { EyeIcon, ArrowDownTrayIcon, XCircleIcon, CheckCircleIcon, PauseCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import IdCardPreview from './IdCardPreview';
import { updateCardStatus, deleteIdCard } from '@/app/actions/id-cards';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface IdCard {
    id: string;
    card_number: string;
    employee_id: string;
    photo_url: string;
    department: string | null;
    phone: string | null;
    blood_group: string | null;
    issue_date: string;
    status: 'active' | 'revoked' | 'suspended';
    qr_code_data: string;
    template_id: string;
    user: {
        full_name: string;
        email: string;
        role: 'admin' | 'associate' | 'member';
    };
}

interface IdCardListProps {
    cards: IdCard[];
    filters: {
        role: string;
        status: string;
        search: string;
    };
}

export default function IdCardList({ cards, filters }: IdCardListProps) {
    const [selectedCard, setSelectedCard] = useState<IdCard | null>(null);
    const [showBack, setShowBack] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    const handleDownloadPDF = async (card: IdCard) => {
        const id = `card-${card.id}`;
        const element = document.getElementById(id);
        if (!element) return;

        setIsDownloading(card.id);
        toast.promise(
            (async () => {
                const canvas = await html2canvas(element, {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: null,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'px',
                    format: [canvas.width / 3, canvas.height / 3]
                });

                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
                pdf.save(`ID_CARD_${card.user.full_name.replace(/\s+/g, '_')}_${card.card_number}.pdf`);
            })(),
            {
                loading: 'Preparing PDF...',
                success: 'ID Card downloaded successfully',
                error: 'Failed to generate PDF'
            }
        );
        setIsDownloading(null);
    };

    const filteredCards = cards.filter(card => {
        if (filters.role && card.template_id !== filters.role) return false;
        if (filters.status && card.status !== filters.status) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                card.user.full_name.toLowerCase().includes(search) ||
                card.card_number.toLowerCase().includes(search) ||
                card.employee_id?.toLowerCase().includes(search)
            );
        }
        return true;
    });

    const handleStatusChange = async (cardId: string, newStatus: 'active' | 'revoked' | 'suspended') => {
        const statusText = newStatus === 'revoked' ? 'revoke' : newStatus === 'suspended' ? 'suspend' : 'activate';

        if (!confirm(`Are you sure you want to ${statusText} this ID card?`)) {
            return;
        }

        setActionLoading(cardId);
        const result = await updateCardStatus(cardId, newStatus);

        if (result.success) {
            toast.success(`Card ${statusText}d successfully`);
            window.location.reload();
        } else {
            toast.error(result.error || `Failed to ${statusText} card`);
        }

        setActionLoading(null);
    };

    const handleDelete = async (cardId: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY DELETE this ID card? This action cannot be undone.')) {
            return;
        }

        setActionLoading(cardId);
        const result = await deleteIdCard(cardId);

        if (result.success) {
            toast.success('Card deleted successfully');
            window.location.reload();
        } else {
            toast.error(result.error || 'Failed to delete card');
        }

        setActionLoading(null);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            active: 'bg-green-100 text-green-700',
            revoked: 'bg-red-100 text-red-700',
            suspended: 'bg-yellow-100 text-yellow-700'
        };
        return styles[status as keyof typeof styles] || styles.active;
    };

    return (
        <>
            <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-10">
                {filteredCards.map(card => (
                    <div key={card.id} className="group bg-white rounded-[2.5rem] p-8 border border-[#e5dec9] hover:shadow-[0_20px_50px_rgba(217,119,87,0.15)] hover:border-[#d97757]/30 transition-all duration-500 w-full relative">
                        {/* Status Label (Flipped to top right for premium feel) */}
                        <div className="absolute top-6 right-8 z-20">
                            <span className={`badge ${card.status === 'active' ? 'badge-success' : 'badge-danger'} px-4 py-1.5`}>
                                {card.status.toUpperCase()}
                            </span>
                        </div>

                        <div id={`card-${card.id}`} className="mb-8 relative transition-transform duration-500 group-hover:scale-[1.03] group-hover:-translate-y-2">
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
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mb-3">
                            <button
                                onClick={() => {
                                    setSelectedCard(card);
                                    setShowBack(false);
                                }}
                                className="flex-[1.5] flex items-center justify-center gap-2 px-4 py-2 bg-[#f7f3ed] hover:bg-[#e5dec9] rounded-xl text-xs font-medium transition-all"
                            >
                                <EyeIcon className="w-4 h-4" />
                                View
                            </button>
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#f7f3ed] hover:bg-[#e5dec9] rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                                onClick={() => handleDownloadPDF(card)}
                                disabled={isDownloading === card.id}
                            >
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                {isDownloading === card.id ? 'Saving...' : 'Download'}
                            </button>
                            <button
                                onClick={() => handleDelete(card.id)}
                                disabled={actionLoading === card.id}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Delete
                            </button>
                        </div>

                        {/* Status actions */}
                        <div className="flex gap-2">
                            {card.status === 'active' && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange(card.id, 'suspended')}
                                        disabled={actionLoading === card.id}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                                    >
                                        <PauseCircleIcon className="w-4 h-4" />
                                        Suspend
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(card.id, 'revoked')}
                                        disabled={actionLoading === card.id}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                                    >
                                        <XCircleIcon className="w-4 h-4" />
                                        Revoke
                                    </button>
                                </>
                            )}
                            {(card.status === 'suspended' || card.status === 'revoked') && (
                                <button
                                    onClick={() => handleStatusChange(card.id, 'active')}
                                    disabled={actionLoading === card.id}
                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-xs font-medium transition-all disabled:opacity-50"
                                >
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Activate
                                </button>
                            )}
                        </div>

                        {/* Card info */}
                        <div className="mt-4 flex items-center justify-between text-[11px] border-t border-[#e5dec9] pt-4">
                            <span className="text-[#78716c] font-medium uppercase tracking-widest">
                                Issued {new Date(card.issue_date).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}

                {filteredCards.length === 0 && (
                    <div className="col-span-full text-center py-12 text-[#78716c]">
                        <p className="text-lg font-semibold">No ID cards found</p>
                        <p className="text-sm mt-2">Try adjusting your filters or create a new card</p>
                    </div>
                )}
            </div>

            {/* View modal */}
            {selectedCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1c1917]/20 backdrop-blur-sm" onClick={() => setSelectedCard(null)}>
                    <div className="bg-white rounded-2xl p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold uppercase">ID Card Details</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowBack(!showBack)}
                                    className="text-sm font-medium text-[#d97757] hover:text-[#c26242] uppercase tracking-wider"
                                >
                                    {showBack ? 'Show Front' : 'Show Back'}
                                </button>
                                <button
                                    onClick={() => setSelectedCard(null)}
                                    className="p-2 hover:bg-[#f7f3ed] rounded-xl transition-colors"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <IdCardPreview
                            user={selectedCard.user}
                            photoUrl={selectedCard.photo_url}
                            department={selectedCard.department || undefined}
                            phone={selectedCard.phone || undefined}
                            bloodGroup={selectedCard.blood_group || undefined}
                            employeeId={selectedCard.employee_id}
                            qrCodeUrl={selectedCard.qr_code_data}
                            cardNumber={selectedCard.card_number}
                            issueDate={selectedCard.issue_date}
                            showBack={showBack}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
