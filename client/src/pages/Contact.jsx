import { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="py-20 container mx-auto px-4 max-w-2xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
                <p className="text-zinc-400">
                    Ready to start your digital transformation? Send us a message.
                </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                {status === 'success' ? (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-primary mb-4">Message Sent!</h3>
                        <p className="text-zinc-400">Thank you for reaching out. We will get back to you shortly.</p>
                        <button onClick={() => setStatus('idle')} className="mt-6 text-white underline hover:text-primary">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Tell us about your project..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full py-4 bg-primary text-black font-bold rounded-lg hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default Contact;
