import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import Trust from '../components/home/Trust';
import CTA from '../components/home/CTA';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Hero />
            <Trust />
            <Features />
            <CTA />
        </div>
    );
};

export default Home;
