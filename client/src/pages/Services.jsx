import { Code2, BarChart3, Zap, Database, Globe, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
    const services = [
        {
            title: "Digital Foundation",
            description: "We build the technical bedrock for your business to scale.",
            icon: <Database className="w-8 h-8 text-primary" />,
            features: ["Cloud Infrastructure", "Scalable Architecture", "Security & Compliance", "API Development"]
        },
        {
            title: "Product Engineering",
            description: "End-to-end development of web and mobile applications.",
            icon: <Code2 className="w-8 h-8 text-primary" />,
            features: ["React & Node.js Apps", "Mobile Development", "UX/UI Design", "MVP Development"]
        },
        {
            title: "Growth & GTM",
            description: "Strategies to launch products and acquire customers.",
            icon: <Rocket className="w-8 h-8 text-primary" />,
            features: ["Market Analysis", "Conversion Optimization", "Sales Enablement", "Analytics Setup"]
        },
        {
            title: "Practical AI",
            description: "Integrating AI into your daily operations for efficiency.",
            icon: <Zap className="w-8 h-8 text-primary" />,
            features: ["Workflow Automation", "Chatbot Integration", "Predictive Analytics", "Custom AI Models"]
        }
    ];

    return (
        <div className="py-20 container mx-auto px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    Comprehensive digital solutions designed to help you build right and grow faster.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
                {services.map((service, index) => (
                    <div key={index} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-primary/30 transition-all">
                        <div className="mb-6 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                                {service.icon}
                            </div>
                            <h2 className="text-2xl font-bold">{service.title}</h2>
                        </div>
                        <p className="text-zinc-400 mb-6">{service.description}</p>
                        <ul className="space-y-3">
                            {service.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-zinc-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-800">
                <h2 className="text-3xl font-bold mb-6">Unsure what you need?</h2>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                    Take our free digital readiness audit to identify gaps and get a recommended roadmap.
                </p>
                <Link to="/audit" className="inline-block px-8 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all">
                    Take the Audit
                </Link>
            </div>
        </div>
    );
};

export default Services;
