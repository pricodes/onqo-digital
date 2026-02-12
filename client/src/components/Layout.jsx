import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-zinc-900/90 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
                        ONQO Digital<span className="text-primary">.</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/services" className="text-sm font-medium hover:text-primary transition-colors">Services</Link>
                        <Link to="/how-we-work" className="text-sm font-medium hover:text-primary transition-colors">How We Work</Link>
                        <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
                        <Link to="/audit" className="px-4 py-2 bg-zinc-800 border border-primary/20 text-white rounded-md text-sm font-semibold hover:border-primary hover:shadow-[0_0_15px_-3px_rgba(162,208,51,0.3)] transition-all">
                            Free Audit
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2" onClick={toggleMenu}>
                        {isMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-foreground" />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden border-b border-border bg-background">
                        <nav className="flex flex-col p-4 space-y-4">
                            <Link to="/services" className="text-lg font-medium hover:text-primary" onClick={toggleMenu}>Services</Link>
                            <Link to="/how-we-work" className="text-lg font-medium hover:text-primary" onClick={toggleMenu}>How We Work</Link>
                            <Link to="/about" className="text-lg font-medium hover:text-primary" onClick={toggleMenu}>About</Link>
                            <Link to="/audit" className="text-lg font-medium text-primary" onClick={toggleMenu}>Free Audit</Link>
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
                        <Link to="/" className="text-2xl font-bold tracking-tighter text-white mb-4 block">
                            ONQO Digital<span className="text-primary">.</span>
                        </Link>
                        <p className="text-zinc-500 max-w-sm">
                            Helping businesses build right and grow faster through digital transformation and practical AI.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
                            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link to="#" className="hover:text-primary">Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-primary">Terms of Engagement</Link></li>
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
