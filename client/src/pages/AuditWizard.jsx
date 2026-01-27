import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const AuditWizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessSize: '',
        industry: '',
        techStack: '',
        bottleneck: '',
        goal: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => {
        if (step === 1 && formData.businessSize && formData.industry) {
            setStep(2);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate processing delay for UX (5-10s as per spec)
        // In reality, the backend call might take this long if calling an LLM.

        try {
            const response = await fetch('http://localhost:3000/api/audit/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const data = await response.json();

            // Wait a bit if response was too fast to show the loading state properly
            setTimeout(() => {
                navigate('/audit/results', { state: { report: data } });
            }, 3000);

        } catch (error) {
            console.error("Audit submission error:", error);
            // Fallback for demo if backend isn't running
            setTimeout(() => {
                const mockReport = {
                    score: 7,
                    summary: "Your business shows strong potential but lacks integration in key areas.",
                    gaps: ["Manual data entry in sales", "Legacy CRM system", "Lack of automated marketing"],
                    pillar: "Automated Lead Gen",
                    nextSteps: ["Implement HubSpot CRM", "Set up email automation workflows", "Train team on new tools"],
                    id: "mock-id-123"
                };
                navigate('/audit/results', { state: { report: mockReport } });
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen py-20 container mx-auto px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
                    <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: loading ? '100%' : step === 1 ? '50%' : '100%' }}
                    ></div>
                </div>

                {loading ? (
                    <div className="text-center py-20 flex flex-col items-center animate-in fade-in duration-500">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                        <h2 className="text-3xl font-bold mb-2">Analyzing your inputs...</h2>
                        <p className="text-zinc-400">Our AI is generating your strategic roadmap.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <span className="text-primary font-mono text-sm tracking-wider uppercase">Step {step} of 2</span>
                            <h2 className="text-3xl font-bold mt-2">
                                {step === 1 ? "Business Context" : "Operational Details"}
                            </h2>
                        </div>

                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            {step === 1 ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Business Size</label>
                                        <select
                                            name="businessSize"
                                            value={formData.businessSize}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                        >
                                            <option value="" disabled>Select an option</option>
                                            <option value="Startup">Startup (&lt;$1M)</option>
                                            <option value="SMB">SMB ($1M - $10M)</option>
                                            <option value="Mid-Market">Mid-Market ($10M - $50M)</option>
                                            <option value="Enterprise">Enterprise ($50M+)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Industry</label>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            placeholder="e.g. Manufacturing, SaaS, Retail"
                                            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <button
                                        onClick={handleNext}
                                        disabled={!formData.businessSize || !formData.industry}
                                        className="w-full py-4 mt-4 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Next Step <ArrowRight className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Current Tech Stack</label>
                                        <textarea
                                            name="techStack"
                                            value={formData.techStack}
                                            onChange={handleChange}
                                            placeholder="What tools are you currently using?"
                                            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Main Digital Bottleneck</label>
                                        <textarea
                                            name="bottleneck"
                                            value={formData.bottleneck}
                                            onChange={handleChange}
                                            placeholder="What is your biggest operational challenge?"
                                            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-2">Primary Growth Goal</label>
                                        <input
                                            type="text"
                                            name="goal"
                                            value={formData.goal}
                                            onChange={handleChange}
                                            placeholder="What is your main objective for the next 12 months?"
                                            className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                    <div className="flex gap-4 mt-6">
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-1/3 py-4 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!formData.techStack || !formData.bottleneck || !formData.goal}
                                            className="w-2/3 py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            Generate Report <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuditWizard;
