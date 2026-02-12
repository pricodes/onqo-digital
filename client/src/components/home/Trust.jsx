const Trust = () => {
    return (
        <section className="py-12 border-y border-zinc-900 bg-zinc-950">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm font-medium text-zinc-500 uppercase tracking-widest mb-8">
                    Trusted by forward-thinking companies
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-500">
                    {/* Placeholders for logos */}
                    {['Acme Corp', 'GlobalTech', 'Nebula Inc', 'FutureSystems', 'Quantico'].map((company, index) => (
                        <div key={index} className="text-xl font-bold text-zinc-400 font-sans">
                            {company}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Trust;
