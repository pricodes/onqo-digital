import { Code2, BarChart3, Zap } from 'lucide-react';

const Features = () => {
    return (
        <section className="py-24 bg-zinc-900/50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Code2 className="w-10 h-10 text-primary" />,
                            title: "Digital Foundation",
                            description: "Robust architecture and scalable tech stacks built for growth. We ensure your core systems are future-proof."
                        },
                        {
                            icon: <BarChart3 className="w-10 h-10 text-primary" />,
                            title: "Growth & GTM",
                            description: "Data-driven strategies to accelerate market penetration and revenue. We align product with market demand."
                        },
                        {
                            icon: <Zap className="w-10 h-10 text-primary" />,
                            title: "Practical AI",
                            description: "Leverage AI to automate workflows and enhance decision making. Real-world applications, not just hype."
                        }
                    ].map((item, index) => (
                        <div key={index} className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-primary/30 transition-all hover:shadow-[0_0_20px_-10px_rgba(162,208,51,0.2)] group flex flex-col h-full">
                            <div className="mb-6 p-4 rounded-xl bg-zinc-900 w-fit border border-zinc-800 group-hover:border-primary/50 transition-colors">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                            <p className="text-zinc-400 leading-relaxed flex-grow">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
