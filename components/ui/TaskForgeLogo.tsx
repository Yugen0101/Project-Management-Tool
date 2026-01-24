import Image from 'next/image';

export default function TaskForgeLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl', className?: string }) {
    const dimensions = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-24 h-24'
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
