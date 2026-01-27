const About = () => {
    return (
        <div className="py-20 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-8">About ONQO</h1>
                <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                    ONQO Digital was founded on a simple premise: **Technology should enable business, not complicate it.**
                    We bridge the gap between complex engineering and practical business outcomes.
                </p>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-white">Our Mission</h2>
                        <p className="text-zinc-400">
                            To empower businesses with the digital tools and strategies they need to compete in a modern economy.
                            We believe in "Building Right" from day one to avoid technical debt and "Growing Faster" through data-driven decisions.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-white">Our Philosophy</h2>
                        <p className="text-zinc-400">
                            We value clarity over jargon, outcomes over output, and long-term partnerships over quick fixes.
                            Our approach is pragmatic, utilizing the best tools for the job—whether that's a simple no-code solution or a complex custom AI model.
                        </p>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-12">
                    <h2 className="text-2xl font-bold mb-8 text-center text-primary">Core Values</h2>
                    <div className="grid sm:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Pragmatism</h3>
                            <p className="text-zinc-500">Practical solutions that work in the real world.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Transparency</h3>
                            <p className="text-zinc-500">No hidden fees, no black boxes. You own your IP.</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">Excellence</h3>
                            <p className="text-zinc-500">High standards in code, design, and communication.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
