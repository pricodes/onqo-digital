import { Search, PenTool, Radio, Rocket } from 'lucide-react';

const HowWeWork = () => {
    const steps = [
        {
            title: "Discover",
            description: "We dive deep into your business to understand your goals, bottlenecks, and user needs.",
            icon: <Search className="w-6 h-6 text-black" />
        },
        {
            title: "Define",
            description: "We architect a roadmap and technical strategy tailored to your specific growth targets.",
            icon: <PenTool className="w-6 h-6 text-black" />
        },
        {
            title: "Execute",
            description: "Our engineers build with precision, using modern stacks for speed, security, and scalability.",
            icon: <Code2 className="w-6 h-6 text-black" />
        },
        {
            title: "Enable",
            description: "We launch, train your team, and set up analytics to ensure long-term success.",
            icon: <Rocket className="w-6 h-6 text-black" />
        }
    ];

    return (
        <div className="py-20 container mx-auto px-4">
            <div className="text-center mb-20">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">How We Work</h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    A proven 4-step framework to take you from concept to market leader.
                </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Vertical Line for Desktop */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-zinc-800 hidden md:block -translate-x-1/2" />

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <div key={index} className={`relative flex items-center md:items-start gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                            {/* Timeline Dot */}
                            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-zinc-950 z-10 hidden md:block top-1"></div>

                            {/* Content Side */}
                            <div className="flex-1 md:text-right">
                                {index % 2 === 0 ? (
                                    <div className="hidden md:block">
                                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-zinc-400">{step.description}</p>
                                    </div>
                                ) : (
                                    <div className="md:hidden">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold">{step.title}</h3>
                                        </div>
                                        <p className="text-zinc-400 pl-14">{step.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Spacer for desktop alignment */}
                            <div className="hidden md:block w-10 shrink-0"></div>

                            {/* Icon Side (or Content for flipped) */}
                            <div className="flex-1">
                                {index % 2 !== 0 ? (
                                    <div className="hidden md:block">
                                        <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-zinc-400">{step.description}</p>
                                    </div>
                                ) : (
                                    <div className="md:hidden">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-2xl font-bold">{step.title}</h3>
                                        </div>
                                        <p className="text-zinc-400 pl-14">{step.description}</p>
                                    </div>
                                )}

                                {/* Desktop Icon */}
                                <div className={`hidden md:flex w-12 h-12 rounded-full bg-primary items-center justify-center mb-4 ${index % 2 === 0 ? 'ml-auto' : ''}`}>
                                    {step.icon}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Missing icon import fix
import { Code2 } from 'lucide-react';

export default HowWeWork;
