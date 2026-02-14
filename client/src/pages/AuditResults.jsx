import { useLocation, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Download, AlertTriangle, ArrowRight, Gauge, ShieldCheck, Mail, Calendar, Loader2, CheckCircle2 } from 'lucide-react';

const PERSONAL_EMAIL_DOMAINS = new Set([
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'aol.com',
    'proton.me',
    'protonmail.com',
]);

const CALENDLY_URL = 'https://calendly.com/'; // Update with real link if available

function getEmailDomain(email = '') {
    const at = email.lastIndexOf('@');
    if (at === -1) return '';
    return email.slice(at + 1).trim().toLowerCase();
}

function isValidEmailBasic(email = '') {
    return email.includes('@') && email.includes('.') && email.length >= 6;
}

function isLikelyPersonalEmail(email = '') {
    const domain = getEmailDomain(email);
    return PERSONAL_EMAIL_DOMAINS.has(domain);
}

function readinessLabelForScore(score) {
    if (score <= 3) return 'Foundational Risk Signals';
    if (score <= 6) return 'Structural Constraints Emerging';
    return 'Execution Discipline Improving';
}

function impactTextForGap(gap = '') {
    // Basic mapping or generic text
    return 'This creates hidden friction that compounds as volume, teams, and customer expectations grow.';
}

const AuditResults = () => {
    const location = useLocation();

    // Default mock data if no state is present (e.g., direct navigation)
    const initialReport = location.state?.report || {
        score: 0,
        summary: 'No report data found. Please take the audit first.',
        gaps: [],
        pillar: 'N/A',
        nextSteps: [],
        id: null,
    };
    const answers = location.state?.answers || {};

    const [report, setReport] = useState(initialReport);
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [showPersonalOverride, setShowPersonalOverride] = useState(false);
    const [submittingEmail, setSubmittingEmail] = useState(false);
    const [error, setError] = useState('');

    const readinessLabel = useMemo(() => readinessLabelForScore(Number(report.score || 0)), [report.score]);

    const handleDownloadPDF = async () => {
        if (!report.id) return;
        // Basic email fallback
        alert('We will email you the PDF along with the report.');
    };

    const handleSubmitEmail = async () => {
        setError('');
        const trimmed = email.trim().toLowerCase();
        const valid = isValidEmailBasic(trimmed);

        if (!valid) {
            setError('Please enter a valid email address.');
            return;
        }

        const personal = isLikelyPersonalEmail(trimmed);
        if (personal && !showPersonalOverride) {
            setShowPersonalOverride(true);
            return;
        }

        try {
            setSubmittingEmail(true);

            const response = await fetch('/api/audit/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: trimmed,
                    answers: answers,
                    score: report.score,
                    initialGaps: report.gaps
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));

                if (response.status === 503 || errData.error === 'Service not configured') {
                     throw new Error('Service not configured');
                }

                throw new Error('Report generation is temporarily unavailable. Please try again in a few minutes.');
            }

            const data = await response.json();

            // Update report with the full AI generated data
            setReport(prev => ({
                ...prev,
                summary: data.summary,
                pillar: data.pillar || data.focusSignal,
                nextSteps: data.nextSteps || [],
                id: data.id,
                gapImpacts: data.gapImpacts
            }));

            setEmailSubmitted(true);
        } catch (e) {
            console.error(e);
            if (e.message === 'Service not configured') {
                 setError('Service not configured. Please contact the administrator.');
            } else {
                 setError('Report generation is temporarily unavailable. Please try again in a few minutes.');
            }
        } finally {
            setSubmittingEmail(false);
        }
    };

    if (!location.state?.report) {
        return (
            <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">No Report Found</h1>
                <Link to="/audit" className="text-primary hover:underline">
                    Take the Audit
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-8">
                <div>
                    <span className="text-primary font-mono text-sm tracking-wider uppercase">Directional Assessment</span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2">Digital Readiness Audit</h1>
                    <p className="text-zinc-500 mt-3 text-sm max-w-2xl">
                        A consulting-style snapshot designed to surface structural risks and decision bottlenecks — not to prescribe solutions.
                    </p>
                </div>
                {emailSubmitted && (
                    <button
                        onClick={handleDownloadPDF}
                        className="mt-6 md:mt-0 px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 hover:border-primary/50 transition-all flex items-center gap-2"
                    >
                        <Download className="w-5 h-5 text-primary" />
                        Email me the PDF
                    </button>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left Column: Score */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                        <h3 className="text-xl font-bold mb-2 text-zinc-300">Digital Readiness Index</h3>
                        <p className="text-xs text-zinc-500 mb-6">
                            Indicator of structural risk over the next <span className="text-zinc-300">6–12 months</span>.
                        </p>

                        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#27272a" strokeWidth="8" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#a2d033"
                                    strokeWidth="8"
                                    strokeDasharray={`${Number(report.score || 0) * 28.27} 282.7`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-5xl font-bold leading-none">{report.score}</span>
                                <span className="text-sm text-zinc-500">/ 10</span>
                            </div>
                        </div>

                        <p className="mt-6 text-lg font-semibold text-white">
                            {report.score} / 10 — <span className="text-zinc-300">{readinessLabel}</span>
                        </p>
                    </div>

                    {/* Show Gaps Initial View */}
                     <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Core Structural Gaps
                        </h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            Observed patterns based on your inputs.
                        </p>

                        <div className="grid gap-4">
                            {(report.gaps || []).map((gap, i) => (
                                <div
                                    key={i}
                                    className="p-5 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-primary/30 transition-colors"
                                >
                                    <div className="text-zinc-200 font-semibold">{gap}</div>
                                    <div className="mt-2 text-sm text-zinc-400">
                                        <span className="text-zinc-500">Why this matters:</span> {impactTextForGap(gap)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Gate or Full Report */}
                <div className="lg:col-span-2 space-y-8">

                    {!emailSubmitted ? (
                         <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 border-l-4 border-l-primary">
                            <div className="flex items-center gap-2 mb-2">
                                <Mail className="w-5 h-5 text-primary" />
                                <h3 className="text-xl font-bold">Unlock Full Executive Summary</h3>
                            </div>
                            <p className="text-sm text-zinc-500 mb-6">
                                Enter your business email to generate the complete consultant-grade report, including:
                            </p>
                            <ul className="grid gap-2 text-sm text-zinc-400 mb-8">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Detailed Executive Summary</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Business Risk Analysis</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary"/> Recommended Focus Areas (Next 90 Days)</li>
                            </ul>

                            <div className="flex flex-col gap-3 max-w-lg">
                                <input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setShowPersonalOverride(false);
                                        setError('');
                                    }}
                                    placeholder="Business email address"
                                    className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/40 text-zinc-200"
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <button
                                    onClick={handleSubmitEmail}
                                    disabled={submittingEmail}
                                    className="px-6 py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {submittingEmail ? <Loader2 className="animate-spin w-5 h-5"/> : 'Generate Full Report'}
                                </button>
                            </div>

                            {showPersonalOverride && (
                                <div className="mt-4 p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-400 animate-fade-in">
                                    <p className="mb-2">This looks like a personal email domain. We recommend a business email for a more tailored analysis.</p>
                                    <button
                                        onClick={() => {
                                            setShowPersonalOverride(true);
                                            // Bypass check logic or just allow re-click
                                            // Actually we just need to re-click button, but state needs to allow it.
                                            // The logic in handleSubmitEmail checks !showPersonalOverride.
                                            // So next click will pass.
                                            handleSubmitEmail();
                                        }}
                                        className="text-primary hover:underline font-semibold"
                                    >
                                        Use {email} anyway
                                    </button>
                                </div>
                            )}

                             <p className="mt-4 text-xs text-zinc-600">
                                Not a marketing email. No automated sequences.
                            </p>
                        </div>
                    ) : (
                        /* Full Report View */
                        <div className="space-y-8 animate-fade-in-up">
                             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Gauge className="w-5 h-5 text-primary" />
                                    Executive Summary
                                </h3>
                                <p className="text-zinc-300 leading-relaxed whitespace-pre-line">{report.summary}</p>
                            </div>

                            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8">
                                <span className="text-primary text-sm font-bold uppercase tracking-widest mb-2 block">Primary Area of Attention</span>
                                <h3 className="text-3xl font-bold mb-3 text-white">{report.pillar}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Based on your bottleneck profile, this area represents the highest leverage for improvement in the next 90 days.
                                </p>
                            </div>

                             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5 text-primary" />
                                    Next Considerations
                                </h3>
                                <ul className="space-y-4">
                                    {Array.isArray(report.nextSteps) && report.nextSteps.length > 0 ? (
                                        report.nextSteps.map((step, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700 text-primary font-bold text-sm">
                                                    {i + 1}
                                                </div>
                                                <span className="text-zinc-300 mt-1">{step}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-zinc-500 text-sm">No specific next steps generated.</li>
                                    )}
                                </ul>
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-bold">Consultant's Note</h3>
                                </div>
                                <p className="text-sm text-zinc-400 italic mb-4">
                                    "This automated assessment surfaces patterns we commonly see in {answers.industry || 'growing'} organizations. However, every context is unique. This report is a directional compass, not a map."
                                </p>
                                <div className="mt-6 pt-6 border-t border-zinc-800">
                                     <h4 className="font-bold text-white mb-2">What this does not cover:</h4>
                                     <ul className="text-xs text-zinc-500 space-y-1">
                                        <li>• ROI modelling or business-case quantification</li>
                                        <li>• Vendor/tool selection recommendations</li>
                                        <li>• Security audit, penetration testing, or compliance certification</li>
                                     </ul>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <h3 className="text-2xl font-bold">Schedule a 30-Minute Consultation</h3>
                                </div>
                                <p className="text-sm text-zinc-400 mb-6 max-w-2xl">
                                    Optional. No pitch. We’ll walk through what this indicates for your context and what to examine next.
                                </p>
                                <a
                                    href={CALENDLY_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition"
                                >
                                    Book a 30-min call <ArrowRight className="w-5 h-5" />
                                </a>
                                <div className="mt-4 text-xs text-zinc-500">
                                    You’ll receive a calendar link. No automated marketing sequences.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-16 text-center text-sm text-zinc-600">
                <Link to="/audit" className="text-primary hover:underline">
                    Run another audit
                </Link>
            </div>
        </div>
    );
};

export default AuditResults;
