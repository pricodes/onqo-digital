import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative py-24 lg:py-40 overflow-hidden bg-background">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-pattern opacity-20 pointer-events-none"></div>

            {/* Gradient Overlay */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 text-sm text-zinc-400 mb-8 backdrop-blur-sm animate-fade-in opacity-0" style={{ animationDelay: '0.1s' }}>
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Accepting new enterprise partners for Q4
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] text-white animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
                        Build Right. <br />
                        <span className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            Grow <span className="text-primary">Faster.</span>
                        </span>
                    </h1>

                    <p className="text-xl lg:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>
                        We architect scalable digital ecosystems for ambitious companies.
                        Reduce technical debt, accelerate go-to-market, and unlock practical AI value.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up opacity-0" style={{ animationDelay: '0.6s' }}>
                        <Link to="/audit" className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold text-lg rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_-5px_rgba(162,208,51,0.5)] hover:shadow-[0_0_25px_-5px_rgba(162,208,51,0.7)] hover:translate-y-[-2px] duration-200">
                            Take a Free Audit
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/services" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-700 text-white font-semibold text-lg rounded-lg hover:bg-zinc-800 hover:border-zinc-600 transition-all hover:translate-y-[-2px] duration-200">
                            Explore Services
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
