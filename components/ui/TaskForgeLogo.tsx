import Image from 'next/image';

export default function TaskForgeLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
    const dimensions = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-20 h-20',
        xl: 'w-32 h-32'
    };

    return (
        <div className={`relative ${dimensions[size]} flex items-center justify-center transition-all duration-300 ${className}`}>
            <Image
                src="/brand-logo.png"
                alt="TaskForge Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
