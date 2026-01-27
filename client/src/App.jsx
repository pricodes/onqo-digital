import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import HowWeWork from './pages/HowWeWork';
import Contact from './pages/Contact';
import AuditWizard from './pages/AuditWizard';
import AuditResults from './pages/AuditResults';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="about" element={<About />} />
                    <Route path="how-we-work" element={<HowWeWork />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="audit" element={<AuditWizard />} />
                    <Route path="audit/results" element={<AuditResults />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}

export default App;
