import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-zinc-900/90 backdrop-blur-md h-[72px] md:h-[84px] flex items-center transition-all duration-300">
                <div className="container mx-auto px-4 flex justify-between items-center h-full">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center h-full py-2">
                        {!logoError ? (
                            <img
                                src="/logo.png"
                                alt="ONQO Digital"
                                className="h-full w-auto object-contain max-h-[48px] md:max-h-[56px]"
                                onError={() => setLogoError(true)}
                            />
                        ) : (
                            <span className="text-2xl font-bold tracking-tighter text-white">
                                ONQO Digital<span className="text-primary">.</span>
                            </span>
                        )}
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
                        <Link to="/how-we-work" className="text-sm font-medium hover:text-primary transition-colors">How We Work</Link>
                        <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
                        <Link to="/contact" className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all shadow-md hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 duration-200 text-sm">
                            Book a Call
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle menu">
                        {isMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-foreground" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 w-full border-b border-border bg-background md:hidden animate-fade-in-up">
                        <nav className="flex flex-col p-6 space-y-6 items-center">
                            <Link to="/services" className="text-lg font-medium hover:text-primary" onClick={toggleMenu}>Services</Link>
                            <Link to="/how-we-work" className="text-lg font-medium hover:text-primary" onClick={toggleMenu}>How We Work</Link>
                            <Link to="/about" className="text-lg font-medium hover:text-primary" onClick={toggleMenu}>About</Link>
                            <Link to="/contact" className="w-full text-center px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all" onClick={toggleMenu}>
                                Book a Call
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-800 bg-zinc-950/50 py-12">
                <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                         <Link to="/" className="flex items-center mb-4">
                            {!logoError ? (
                                <img
                                    src="/logo.png"
                                    alt="ONQO Digital"
                                    className="h-8 w-auto object-contain"
                                    onError={() => setLogoError(true)}
                                />
                            ) : (
                                <span className="text-2xl font-bold tracking-tighter text-white">
                                    ONQO Digital<span className="text-primary">.</span>
                                </span>
                            )}
                        </Link>
                        <p className="text-zinc-500 max-w-sm">
                            Helping businesses build right and grow faster through digital transformation and practical AI.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">Terms of Engagement</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
                    &copy; {new Date().getFullYear()} ONQO Digital. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
