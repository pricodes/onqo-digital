import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTA = () => {
    return (
        <section className="py-24 border-t border-zinc-800 bg-gradient-to-b from-zinc-900 to-black">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tighter">
                    Ready to scale your business?
                </h2>
                <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light">
                    Get a comprehensive analysis of your digital maturity and a personalized roadmap for growth.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <Link to="/audit" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:bg-zinc-200 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] group">
                        Start Your Audit Now
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/contact" className="text-zinc-400 hover:text-white font-medium underline-offset-4 hover:underline transition-all">
                        Contact Sales
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTA;
