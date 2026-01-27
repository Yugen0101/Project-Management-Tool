import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listAllIdCards, getUsersWithoutCards } from '@/app/actions/id-cards';
import IdCardManager from '@/components/admin/IdCardManager';

export const metadata = {
    title: 'ID Card Management | TaskForge',
    description: 'Manage digital ID cards for team members'
};

export default async function IdCardsPage() {
    const user = await getCurrentUser();

    if (!user || user.role !== 'admin') {
        redirect('/');
    }

    const [cardsResult, usersResult] = await Promise.all([
        listAllIdCards(),
        getUsersWithoutCards()
    ]);

    const cards = cardsResult.success ? cardsResult.data : [];
    const users = usersResult.success ? usersResult.data : [];

    return (
        <div className="min-h-screen bg-[#f7f3ed] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold uppercase tracking-tight">ID Card Management</h1>
                    <p className="text-lg text-[#78716c] mt-2">
                        Create and manage digital ID cards for your team
                    </p>
                </div>

                {/* Manager */}
                <Suspense fallback={<LoadingState />}>
                    <IdCardManager initialCards={cards || []} users={users || []} />
                </Suspense>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-[#e5dec9] animate-pulse">
                        <div className="h-4 bg-[#e5dec9] rounded w-20 mb-3"></div>
                        <div className="h-8 bg-[#e5dec9] rounded w-12"></div>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-[#e5dec9] animate-pulse">
                        <div className="w-full h-[250px] bg-[#e5dec9] rounded-xl mb-4"></div>
                        <div className="h-10 bg-[#e5dec9] rounded-xl mb-2"></div>
                        <div className="h-10 bg-[#e5dec9] rounded-xl"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
