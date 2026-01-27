import { ArrowRight, CheckCircle2, Zap, BarChart3, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-background bg-pattern pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            Build Right. <br />
                            <span className="text-primary">Grow Faster.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            We help ambitious companies accelerate growth through digital transformation,
                            scalability audits, and practical AI integration.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/audit" className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 group">
                                Free Digital Audit
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/services" className="w-full sm:w-auto px-8 py-4 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-all font-semibold">
                                Explore Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-20 bg-zinc-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Code2 className="w-10 h-10 text-primary" />,
                                title: "Digital Foundation",
                                description: "Robust architecture and scalable tech stacks built for growth."
                            },
                            {
                                icon: <BarChart3 className="w-10 h-10 text-primary" />,
                                title: "Growth & GTM",
                                description: "Data-driven strategies to accelerate market penetration and revenue."
                            },
                            {
                                icon: <Zap className="w-10 h-10 text-primary" />,
                                title: "Practical AI",
                                description: "Leverage AI to automate workflows and enhance decision making."
                            }
                        ].map((item, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-primary/30 transition-all hover:shadow-lg group">
                                <div className="mb-6 p-4 rounded-full bg-zinc-950 w-fit border border-zinc-800 group-hover:border-primary/50 transition-colors">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-zinc-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to scale your business?</h2>
                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                        Get a comprehensive analysis of your digital maturity and a personalized roadmap for growth.
                    </p>
                    <Link to="/audit" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all">
                        Start Your Audit Now
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
