'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Pagination({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/50 bg-slate-900/40 backdrop-blur-md rounded-2xl">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => router.push(createPageURL(currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                    Prev
                </button>
                <button
                    onClick={() => router.push(createPageURL(currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">
                        Index <span className="text-white">{currentPage}</span> / <span className="text-slate-600">{totalPages}</span>
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-xl shadow-lg shadow-black/20 overflow-hidden border border-slate-800" aria-label="Pagination">
                        <button
                            onClick={() => router.push(createPageURL(currentPage - 1))}
                            disabled={currentPage <= 1}
                            className="relative inline-flex items-center px-4 py-2 text-slate-400 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors border-r border-slate-800"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => router.push(createPageURL(currentPage + 1))}
                            disabled={currentPage >= totalPages}
                            className="relative inline-flex items-center px-4 py-2 text-slate-400 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
