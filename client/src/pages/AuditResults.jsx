import { useLocation, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Download, AlertTriangle, ArrowRight, Gauge, ShieldCheck, Mail, Calendar } from 'lucide-react';

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

const CALENDLY_URL = 'https://calendly.com/';

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
    const g = gap.toLowerCase();

    if (g.includes('silo') || g.includes('disparate') || g.includes('fragment')) {
        return 'Decision-making slows down because teams operate on different versions of the truth.';
    }
    if (g.includes('manual') || g.includes('spreadsheet') || g.includes('handoff')) {
        return 'Operational throughput drops as execution depends on people, not systems.';
    }
    if (g.includes('cloud') || g.includes('infrastructure') || g.includes('underutil')) {
        return 'Cost and scalability stay unpredictable because capacity isn’t governed or optimized.';
    }
    if (g.includes('security') || g.includes('compliance') || g.includes('access')) {
        return 'Risk increases because controls are not consistently enforced as the org scales.';
    }
    if (g.includes('report') || g.includes('visibility') || g.includes('kpi') || g.includes('analytics')) {
        return 'Leaders lose visibility into what’s working, so priorities drift and ROI becomes unclear.';
    }

    return 'This creates hidden friction that compounds as volume, teams, and customer expectations grow.';
}

const AuditResults = () => {
    const location = useLocation();

    // Default mock data if no state is present (e.g., direct navigation)
    const report = location.state?.report || {
        score: 0,
        summary: 'No report data found. Please take the audit first.',
        gaps: [],
        pillar: 'N/A',
        nextSteps: [],
        id: null,
    };

    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [showPersonalOverride, setShowPersonalOverride] = useState(false);
    const [submittingEmail, setSubmittingEmail] = useState(false);

    const readinessLabel = useMemo(() => readinessLabelForScore(Number(report.score || 0)), [report.score]);

    const gapImpacts = useMemo(() => {
        const gaps = Array.isArray(report.gaps) ? report.gaps : [];
        return gaps.map((gap) => ({
            gap,
            whyItMatters: impactTextForGap(gap),
        }));
    }, [report.gaps]);

    const handleDownloadPDF = async () => {
        if (!report.id) return;
        try {
            // NOTE: Keep as-is for now; deployment/PDF thread will fix base URL later.
            window.open(`http://localhost:3000/api/audit/${report.id}/pdf`, '_blank');
        } catch (e) {
            console.error(e);
            alert('Failed to download PDF. Please try again.');
        }
    };

    const handleSubmitEmail = async () => {
        const trimmed = email.trim().toLowerCase();
        const valid = isValidEmailBasic(trimmed);

        if (!valid) {
            alert('Please enter a valid email address.');
            return;
        }

        const personal = isLikelyPersonalEmail(trimmed);
        if (personal && !showPersonalOverride) {
            // Soft gate: warn first, allow override.
            setShowPersonalOverride(true);
            return;
        }

        try {
            setSubmittingEmail(true);

            // Store lead after insight only. Keep it minimal and non-marketing.
            // If your backend expects different fields, we’ll adjust in the next step.
            await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: trimmed,
                    reportId: report.id,
                    source: 'audit_report',
                    createdAt: new Date().toISOString(),
                }),
            });

            setEmailSubmitted(true);
        } catch (e) {
            console.error(e);
            alert('Could not submit email right now. Please try again.');
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
                <button
                    onClick={handleDownloadPDF}
                    className="mt-6 md:mt-0 px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 hover:border-primary/50 transition-all flex items-center gap-2"
                >
                    <Download className="w-5 h-5 text-primary" />
                    Email / Save as PDF
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left Column: Score & Summary */}
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
                        <p className="mt-2 text-sm text-zinc-500">
                            Directional, not definitive. Best used to frame what to examine next.
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Gauge className="w-5 h-5 text-primary" />
                            Executive Summary
                        </h3>
                        <p className="text-zinc-400 leading-relaxed text-sm">{report.summary}</p>
                    </div>
                </div>

                {/* Right Column: Detailed Breakdown */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Structural Gaps -> Business Impact */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                            Structural Gaps
                        </h3>
                        <p className="text-sm text-zinc-500 mb-6">
                            These are patterns that typically slow execution as teams, systems, and data grow.
                        </p>

                        <div className="grid gap-4">
                            {gapImpacts.length === 0 ? (
                                <div className="text-zinc-500 text-sm">No gap data available.</div>
                            ) : (
                                gapImpacts.map((item, i) => (
                                    <div
                                        key={i}
                                        className="p-5 bg-zinc-950/50 rounded-xl border border-zinc-800/50 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="text-zinc-200 font-semibold">{item.gap}</div>
                                        <div className="mt-2 text-sm text-zinc-400">
                                            <span className="text-zinc-500">Why this matters:</span> {item.whyItMatters}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recommended Focus (keep neutral) */}
                    <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl p-8">
                        <span className="text-primary text-sm font-bold uppercase tracking-widest mb-2 block">Recommended Focus</span>
                        <h3 className="text-3xl font-bold mb-3 text-white">{report.pillar}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            This is a directional focus area — intended to guide what to examine and prioritize, not a prescriptive solution set.
                        </p>
                    </div>

                    {/* Next Steps (discovery-oriented) */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 text-primary" />
                            Immediate Next Steps
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
                                <li className="text-zinc-500 text-sm">No next steps available.</li>
                            )}
                        </ul>
                    </div>

                    {/* Trust Boundary Block */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            <h3 className="text-xl font-bold">What this assessment does not cover</h3>
                        </div>
                        <p className="text-sm text-zinc-500 mb-4">
                            This is a directional assessment, not a technical audit.
                        </p>
                        <ul className="grid gap-3 text-sm text-zinc-400">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">•</span> ROI modelling or business-case quantification
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">•</span> Vendor/tool selection recommendations
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">•</span> Security audit, penetration testing, or compliance certification
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-primary">•</span> Architecture review of source code or infrastructure deep-dive
                            </li>
                        </ul>
                    </div>

                    {/* Email Gate (after insight only) */}
                    {!emailSubmitted && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <Mail className="w-5 h-5 text-primary" />
                                <h3 className="text-xl font-bold">Get a copy of this report</h3>
                            </div>
                            <p className="text-sm text-zinc-500 mb-6">
                                We’ll email you a copy of this assessment. <span className="text-zinc-300">This is not a marketing email.</span> No automated sequences.
                            </p>

                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setShowPersonalOverride(false);
                                    }}
                                    placeholder="Business email address"
                                    className="w-full md:flex-1 px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/40 text-zinc-200"
                                />
                                <button
                                    onClick={handleSubmitEmail}
                                    disabled={submittingEmail}
                                    className="px-6 py-3 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition disabled:opacity-60"
                                >
                                    {submittingEmail ? 'Submitting…' : 'Email me the report'}
                                </button>
                            </div>

                            {showPersonalOverride && (
                                <div className="mt-4 p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 text-sm text-zinc-400">
                                    This looks like a personal email domain. Prefer a business email for faster context.
                                    <button
                                        onClick={() => setShowPersonalOverride(true)} // keep state
                                        className="hidden"
                                        aria-hidden="true"
                                    />
                                    <div className="mt-3">
                                        <button
                                            onClick={() => {
                                                // allow personal email
                                                setShowPersonalOverride(true);
                                                // proceed with submit on next click
                                                alert('You can use this email. Click “Email me the report” again to confirm.');
                                            }}
                                            className="text-primary hover:underline"
                                        >
                                            Use this email anyway
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Consultation CTA (post-email only) */}
                    {emailSubmitted && (
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
                    )}
                </div>
            </div>

            {/* Remove the generic salesy footer CTA; it’s replaced by the gated CTA above. */}
            <div className="mt-16 text-center text-sm text-zinc-600">
                <Link to="/audit" className="text-primary hover:underline">
                    Run another audit
                </Link>
            </div>
        </div>
    );
};

export default AuditResults;
