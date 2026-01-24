import Image from 'next/image';
import Link from 'next/link';
import { 
    RectangleGroupIcon,
    ChartBarIcon, 
    ArrowRightIcon, 
    ShieldCheckIcon,
    BoltIcon,
    UserGroupIcon,
    DevicePhoneMobileIcon,
    CheckCircleIcon,
    Squares2X2Icon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-beige-50 flex flex-col relative overflow-hidden font-sans selection:bg-accent-500 selection:text-white">
            {/* Warm Beige Decorative Background Elements */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[80%] bg-beige-100/50 blur-[120px] rounded-full -z-10 animate-pulse duration-[10s]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent-100/30 blur-[100px] rounded-full -z-10"></div>

            {/* Navigation / Header */}
            <header className="relative z-50 px-8 py-8 flex items-center justify-between max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <Image src="/logo.png" alt="TaskForge Logo" width={64} height={64} className="object-contain" />
                    </div>
                    <span className="text-3xl font-bold tracking-tight text-[#1c1917]">Task<span className="text-accent-600">Forge</span></span>
                </div>
                <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#1c1917]/60">
                    <a href="#" className="hover:text-accent-600 transition-colors">Platform</a>
                    <a href="#" className="hover:text-accent-600 transition-colors">Solutions</a>
                    <a href="#" className="hover:text-accent-600 transition-colors">Resources</a>
                    <a href="#" className="hover:text-accent-600 transition-colors">Pricing</a>
                </nav>
                <div className="flex items-center gap-6">
                    <a href="/login" className="text-sm font-semibold text-[#1c1917]/60 hover:text-accent-600 transition-colors">Sign In</a>
                    <a href="/login" className="btn-primary !px-6 !py-3 !text-sm !rounded-xl">Get Started</a>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 w-full">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 w-full max-w-6xl mx-auto bg-[#f3efe7] rounded-[3rem] overflow-hidden border border-[#e5dec9] shadow-2xl shadow-[#d9cfb0]/30 min-h-[550px]">
                    {/* Left: Content */}
                    <div className="p-12 lg:p-16 flex flex-col justify-center space-y-6 relative overflow-hidden">
                        {/* Decorative squares - refined placement */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5dec9]/30 rounded-bl-[4rem] -z-0"></div>
                        <div className="absolute bottom-10 left-10 w-16 h-16 bg-[#d9cfb0]/20 rounded-full -z-0"></div>

                        <div className="relative z-10">
                            <h2 className="text-sm font-black tracking-[0.3em] uppercase text-[#d97757] mb-2">Operations Hub</h2>
                            <h1 className="text-4xl lg:text-6xl font-black text-[#1c1917] tracking-tighter uppercase leading-[0.95]">
                                Project<br />Management
                            </h1>
                            <p className="text-[#1c1917]/70 font-medium text-base max-w-md mt-6 leading-relaxed">
                                Streamline your workflow with an intuitive, high-performance workspace designed for modern teams.
                            </p>
                            <div className="pt-8">
                                <a href="/login" className="bg-[#d9cfb0] hover:bg-[#c9bea0] text-[#1c1917] px-8 py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase transition-all inline-block shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="bg-[#eaddcf]/30 p-0 lg:p-8 flex items-center justify-center relative">
                        {/* Inner white frame for emphasis OR blend */}
                        <div className="relative w-full h-full flex items-center justify-center p-8">
                            <div className="relative aspect-square w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border-4 border-white/50">
                                <Image
                                    src="/hero_beige.png"
                                    alt="Project Management Illustration"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
=======
        <div className="min-h-screen bg-[#fafafb] flex flex-col relative overflow-hidden font-sans selection:bg-primary-500/30 selection:text-primary-900">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-primary-100/30 rounded-full blur-[120px] -z-10 animate-float" style={{ animationDuration: '10s' }}></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-100/20 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDuration: '15s', animationDelay: '2s' }}></div>

            {/* Premium Navigation */}
            <header className="relative z-50 px-8 py-8 flex items-center justify-between max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <RectangleGroupIcon className="w-7 h-7" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-secondary-900 leading-none">TaskForge</span>
                </div>
                
                <nav className="hidden lg:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-500">
                    <a href="#features" className="hover:text-primary-600 transition-colors relative group">
                        Solutions
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#" className="hover:text-primary-600 transition-colors relative group">
                        Enterprise
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#" className="hover:text-primary-600 transition-colors relative group">
                        Resources
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#" className="hover:text-primary-600 transition-colors relative group">
                        Pricing
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all group-hover:w-full"></span>
                    </a>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="btn-ghost">Sign In</Link>
                    <Link href="/login" className="btn-primary">Get Started</Link>
                </div>
            </header>

            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-24 max-w-7xl mx-auto w-full text-center">
                {/* Hero Content */}
                <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white shadow-soft rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-600 border border-primary-50 animate-pulse-subtle">
                        <div className="w-2 h-2 bg-primary-600 rounded-full animate-ping"></div>
                        <span>Version 2.8 Registry Live — Deployment Ready</span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-7xl md:text-[7.5rem] font-bold text-secondary-900 tracking-tighter leading-[0.9] select-none">
                            Management <br />
                            <span className="text-gradient">Redefined.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-secondary-500 font-medium leading-relaxed max-w-2xl mx-auto tracking-tight">
                            Execute your roadmap with absolute architectural precision. The high-performance workspace engineered for elite engineering and product teams.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
                        <Link href="/login" className="btn-primary h-16 px-12 text-base group">
                            Create Workspace 
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                        <div className="flex flex-col items-center sm:items-start gap-3">
                            <div className="flex items-center -space-x-3">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-11 h-11 rounded-full border-4 border-white bg-secondary-100 flex items-center justify-center text-xs font-bold text-secondary-500 overflow-hidden shadow-sm">
                                        <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" width={44} height={44} />
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-secondary-400 uppercase tracking-widest pl-1">Powering 500+ global entities</span>
                        </div>
                    </div>
                </div>

                {/* Main Visual Component - Glass Card */}
                <div className="mt-32 w-full animate-in fade-in zoom-in-95 duration-1000 delay-500 fill-mode-both">
                    <div className="card-glass p-4 sm:p-6 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/5 to-indigo-600/5 pointer-events-none"></div>
                        <div className="rounded-[1.5rem] overflow-hidden border border-white/60 shadow-2xl">
                             <div className="h-10 bg-secondary-50/50 flex items-center px-4 gap-2 border-b border-border/40">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                                </div>
                                <div className="flex-1 text-[10px] font-bold text-secondary-400 uppercase tracking-widest">TaskFlow Protocol Console</div>
                             </div>
                             <div className="bg-white p-12 aspect-[16/8] flex items-center justify-center relative overflow-hidden">
                                 <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                                 <div className="grid grid-cols-2 gap-8 w-full max-w-2xl relative z-10">
                                     <div className="card h-40 flex flex-col justify-end gap-3 p-6 text-left hover:scale-105 transition-transform bg-primary-50/10 border-primary-100">
                                         <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white"><Squares2X2Icon className="w-5 h-5"/></div>
                                         <h5 className="font-bold text-secondary-900">Project Nodes</h5>
                                     </div>
                                     <div className="card h-40 flex flex-col justify-end gap-3 p-6 text-left hover:scale-105 transition-transform bg-indigo-50/10 border-indigo-100">
                                         <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><RocketLaunchIcon className="w-5 h-5"/></div>
                                         <h5 className="font-bold text-secondary-900">Deployment Velocity</h5>
                                     </div>
                                 </div>
                             </div>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
                        </div>
                    </div>
                </div>
            </main>

<<<<<<< HEAD
            {/* Features Section */}
            <section className="relative z-10 px-8 py-20 w-full bg-[#eaddcf]/30">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Feedback Card */}
                        <div className="group flex flex-col">
                            <div className="bg-white p-8 aspect-square flex items-center justify-center relative z-10 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="relative w-full h-full">
                                    <Image src="/feature_feedback.png" alt="Feedback" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <div className="bg-[#d9cfb0] p-8 pb-12 text-center text-[#1c1917] flex-1 flex flex-col items-center space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-sm">Feedback</h3>
                                <p className="text-[#1c1917]/70 text-[11px] leading-relaxed line-clamp-4">
                                    Facilitate open channels for rapid iteration cycles. Transparent communication builds stronger products.
                                </p>
                                <button className="mt-auto bg-white text-[#1c1917] text-[10px] font-bold uppercase tracking-widest px-6 py-2 shadow-sm hover:shadow-md transition-all">Details...</button>
                            </div>
                        </div>

                        {/* Conflict Resolution Card */}
                        <div className="group flex flex-col mt-12 md:mt-0">
                            <div className="bg-white p-8 aspect-square flex items-center justify-center relative z-10 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="relative w-full h-full">
                                    <Image src="/feature_conflict.png" alt="Conflict Resolution" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <div className="bg-[#d9cfb0] p-8 pb-12 text-center text-[#1c1917] flex-1 flex flex-col items-center space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-sm">Conflict<br />Resolution</h3>
                                <p className="text-[#1c1917]/70 text-[11px] leading-relaxed line-clamp-4">
                                    Median aligned strategies for team cohesion. Resolve vectors of disagreement with data-driven insights.
                                </p>
                                <button className="mt-auto bg-white text-[#1c1917] text-[10px] font-bold uppercase tracking-widest px-6 py-2 shadow-sm hover:shadow-md transition-all">Details...</button>
                            </div>
                        </div>

                        {/* Deal Making Card */}
                        <div className="group flex flex-col">
                            <div className="bg-white p-8 aspect-square flex items-center justify-center relative z-10 shadow-sm transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="relative w-full h-full">
                                    <Image src="/feature_deal.png" alt="Deal Making" fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            </div>
                            <div className="bg-[#d9cfb0] p-8 pb-12 text-center text-[#1c1917] flex-1 flex flex-col items-center space-y-4">
                                <h3 className="text-xl font-black uppercase tracking-widest text-white drop-shadow-sm">Deal Making</h3>
                                <p className="text-[#1c1917]/70 text-[11px] leading-relaxed line-clamp-4">
                                    Seal partnerships with confidence. Secure protocols for high-value contract management.
                                </p>
                                <button className="mt-auto bg-white text-[#1c1917] text-[10px] font-bold uppercase tracking-widest px-6 py-2 shadow-sm hover:shadow-md transition-all">Details...</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        </div >
=======
            {/* Features Registry */}
            <section id="features" className="relative z-10 px-10 py-40 w-full max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-4 mb-24">
                     <h2 className="text-sm font-bold text-primary-600 uppercase tracking-[0.4em]">Infrastructure Layer</h2>
                     <h3 className="text-5xl font-bold text-secondary-900 tracking-tight leading-tight">Engineered for the modern software lifecycle.</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { icon: BoltIcon, title: 'Quantum Sync', text: 'State updates distributed via neural protocol for real-time consistency across every team member.', color: 'primary' },
                        { icon: UserGroupIcon, title: 'Personnel Orchestration', text: 'Manage multi-disciplinary teams with granular permission lattices and workload balancing.', color: 'indigo' },
                        { icon: ChartBarIcon, title: 'Telemetry Dashboards', text: 'Unparalleled insight into organizational velocity with advanced visualization components.', color: 'emerald' }
                    ].map((feature, i) => (
                        <div key={i} className="card group hover:border-primary-200 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[200ms]">
                            <div className={`w-16 h-16 bg-${feature.color}-50 text-${feature.color}-600 rounded-2xl flex items-center justify-center mb-8 border border-${feature.color}-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm`}>
                                <feature.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-bold text-secondary-900 mb-4 tracking-tight">{feature.title}</h4>
                            <p className="text-secondary-500 font-medium text-base leading-relaxed mb-8">{feature.text}</p>
                            <div className={`flex items-center gap-2 text-[10px] font-bold text-${feature.color}-600 uppercase tracking-widest hover:gap-4 transition-all cursor-pointer`}>
                                Explore Module <ArrowRightIcon className="w-4 h-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="px-10 py-32 border-t border-border/60 bg-white/50 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
                    <div className="col-span-1 md:col-span-1 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary-900 rounded-xl flex items-center justify-center text-white">
                                <RectangleGroupIcon className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-secondary-900">TaskForge</span>
                        </div>
                        <p className="text-sm font-medium text-secondary-400 leading-relaxed uppercase tracking-wider text-[10px]">
                            High performance project management for elite teams. <br />
                            v2.8-stable deployment.
                        </p>
                    </div>
                    
                    {[
                        { title: 'Governance', links: ['Security Policy', 'Architecture', 'API Docs', 'Status Node'] },
                        { title: 'Ecosystem', links: ['Integrations', 'Resource Hub', 'Registry', 'Changelog'] },
                        { title: 'Entity', links: ['About', 'Careers', 'Contact', 'Terms'] }
                    ].map((section, i) => (
                        <div key={i} className="space-y-6">
                            <h5 className="text-[10px] font-bold text-secondary-900 uppercase tracking-[0.3em]">{section.title}</h5>
                            <ul className="space-y-4">
                                {section.links.map(link => (
                                    <li key={link}>
                                        <a href="#" className="text-xs font-bold text-secondary-400 hover:text-primary-600 transition-colors uppercase tracking-widest leading-none block">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8">
                     <p className="text-[10px] font-bold text-secondary-300 uppercase tracking-widest">© 2026 TaskForge Operations Hub. All rights reserved.</p>
                     <div className="flex gap-10">
                         {['Twitter', 'Github', 'LinkedIn'].map(social => (
                             <a key={social} href="#" className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest hover:text-primary-600 transition-colors">{social}</a>
                         ))}
                     </div>
                </div>
            </footer>
        </div>
>>>>>>> f8a9eddf51e5dc62867bfd05e707e9748c4cf529
    );
}
