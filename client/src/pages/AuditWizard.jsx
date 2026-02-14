import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';

const QUESTIONS = [
    {
        id: 'industry',
        label: 'Which industry best describes your business?',
        type: 'select',
        options: ['SaaS', 'Manufacturing', 'Retail/E-commerce', 'Professional Services', 'Healthcare', 'Finance', 'Logistics', 'Other']
    },
    {
        id: 'businessSize',
        label: 'What is your current annual revenue range?',
        type: 'select',
        options: ['Startup (<$1M)', 'Growth ($1M-$10M)', 'Mid-Market ($10M-$50M)', 'Enterprise ($50M+)']
    },
    {
        id: 'infrastructure',
        label: 'How would you describe your digital infrastructure?',
        type: 'radio',
        options: ['Legacy (On-premise / Older systems)', 'Hybrid (Mix of old and cloud)', 'Modern (Cloud-native / SaaS heavy)']
    },
    {
        id: 'bottleneck',
        label: 'What is the primary constraint to scaling right now?',
        type: 'radio',
        options: ['Lead Generation & Sales', 'Operational Fulfillment', 'Hiring & Team Capacity', 'Data Visibility & Reporting', 'Technology Systems']
    },
    {
        id: 'automation',
        label: 'To what extent are your core workflows automated?',
        type: 'radio',
        options: ['Mostly manual / Spreadsheets', 'Some tools, but disconnected', 'Integrated systems with some manual steps', 'Fully automated end-to-end']
    },
    {
        id: 'data',
        label: 'How do you track Key Performance Indicators (KPIs)?',
        type: 'radio',
        options: ['Manual spreadsheets / Ad-hoc', 'Disparate dashboards per tool', 'Centralized BI (Tableau, PowerBI)', 'Real-time predictive analytics']
    },
    {
        id: 'ai_readiness',
        label: 'What is your current approach to AI adoption?',
        type: 'radio',
        options: ['No active exploration', 'Experimenting with tools (ChatGPT etc)', 'Piloting specific use cases', 'Deployed in production']
    },
    {
        id: 'customer_journey',
        label: 'How unified is your customer data across touchpoints?',
        type: 'radio',
        options: ['Siloed (Sales vs Support vs Marketing)', 'Partially connected', 'Unified 360-degree view']
    },
    {
        id: 'tech_stack',
        label: 'List your key software tools (CRM, ERP, etc.)',
        type: 'textarea',
        placeholder: 'e.g. Salesforce, HubSpot, NetSuite, Slack...'
    }
];

const AuditWizard = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState({});

    const handleAnswer = (value) => {
        setAnswers(prev => ({ ...prev, [QUESTIONS[currentStep].id]: value }));
    };

    const handleNext = () => {
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        // Simulate analysis time
        setTimeout(() => {
            // --- SCORING LOGIC ---
            let score = 10;
            const gaps = [];

            // 1. Infrastructure Penalty
            if (answers.infrastructure?.includes('Legacy')) score -= 2;
            else if (answers.infrastructure?.includes('Hybrid')) score -= 1;

            // 2. Automation Penalty
            if (answers.automation?.includes('Manual')) {
                score -= 3;
                gaps.push("Heavy reliance on manual workflows");
            } else if (answers.automation?.includes('Disconnected')) {
                score -= 2;
                gaps.push("Tool fragmentation preventing automation");
            }

            // 3. Data Maturity Penalty
            if (answers.data?.includes('Manual')) {
                score -= 2;
                gaps.push("Lack of real-time performance visibility");
            } else if (answers.data?.includes('Disparate')) {
                score -= 1;
                gaps.push("Data silos across departments");
            }

            // 4. Customer Journey
            if (answers.customer_journey?.includes('Siloed')) {
                gaps.push("Disjointed customer experience data");
            }

            // 5. Complexity Penalty (Size)
            if (answers.businessSize?.includes('Mid') || answers.businessSize?.includes('Enterprise')) {
                score -= 1; // Natural complexity drag
            }

            // 6. AI Readiness Check
            if (answers.ai_readiness?.includes('No active')) {
                // No score penalty, but maybe a gap or note?
            }

            // Clamp score
            score = Math.max(3, Math.min(9, score));

            // Ensure we have at least 3 gaps for the UI
            if (gaps.length < 3) {
                if (answers.tech_stack?.length > 50) gaps.push("Potential tech stack sprawl");
                if (answers.bottleneck?.includes('Hiring')) gaps.push("Process dependencies on headcount");
                if (answers.bottleneck?.includes('Operational')) gaps.push("Scalability bottlenecks in fulfillment");
                if (gaps.length < 3) gaps.push("Hidden operational friction");
            }

            // Slice to top 3
            const topGaps = gaps.slice(0, 3);

            navigate('/audit/results', {
                state: {
                    answers,
                    report: {
                        score,
                        gaps: topGaps,
                        // Other fields will be generated by AI later, but we need structure for initial view
                        summary: "Analysis complete. Unlock full report to see details.",
                        pillar: "Pending Analysis...",
                        nextSteps: []
                    }
                }
            });
        }, 2000);
    };

    const currentQuestion = QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
    const isLastStep = currentStep === QUESTIONS.length - 1;
    const canProceed = !!answers[currentQuestion.id];

    return (
        <div className="min-h-screen py-20 container mx-auto px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-1 bg-zinc-800 w-full">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: loading ? '100%' : `${progress}%` }}
                    ></div>
                </div>

                {loading ? (
                    <div className="text-center py-20 flex flex-col items-center animate-in fade-in duration-500">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                        <h2 className="text-3xl font-bold mb-2">Analyzing your inputs...</h2>
                        <p className="text-zinc-400">Benchmarking against industry standards.</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 flex justify-between items-end">
                            <div>
                                <span className="text-primary font-mono text-sm tracking-wider uppercase">Question {currentStep + 1} of {QUESTIONS.length}</span>
                                <h2 className="text-2xl md:text-3xl font-bold mt-2 text-white leading-tight">
                                    {currentQuestion.label}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-4 animate-in slide-in-from-right duration-300 key-{currentStep}">
                            {currentQuestion.type === 'select' && (
                                <select
                                    className="w-full px-4 py-4 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors appearance-none text-lg"
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                >
                                    <option value="" disabled>Select an option</option>
                                    {currentQuestion.options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            )}

                            {currentQuestion.type === 'radio' && (
                                <div className="grid gap-3">
                                    {currentQuestion.options.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => handleAnswer(opt)}
                                            className={`w-full text-left px-6 py-4 rounded-lg border transition-all text-lg font-medium ${
                                                answers[currentQuestion.id] === opt
                                                    ? 'bg-primary/10 border-primary text-primary'
                                                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentQuestion.type === 'textarea' && (
                                <textarea
                                    className="w-full px-4 py-4 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors text-lg"
                                    rows={4}
                                    placeholder={currentQuestion.placeholder}
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                />
                            )}
                        </div>

                        <div className="flex gap-4 mt-10 pt-6 border-t border-zinc-800">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                                    currentStep === 0 ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white'
                                }`}
                            >
                                <ChevronLeft className="w-5 h-5" /> Back
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!canProceed}
                                className="ml-auto flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:translate-y-[-2px] active:translate-y-0"
                            >
                                {isLastStep ? 'Analyze Results' : 'Next Question'}
                                {isLastStep ? <CheckCircle2 className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuditWizard;
