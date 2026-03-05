import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Home, BarChart3, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';

const defaultFeatures = {
    MedInc: 3.5,
    HouseAge: 30,
    AveRooms: 5,
    AveBedrms: 1,
    Population: 1000,
    AveOccup: 3,
    Latitude: 17.4,
    Longitude: 78.5
};

const indianCities = [
    { name: "Custom", lat: 17.4, lon: 78.5 },
    { name: "Hyderabad", lat: 17.385, lon: 78.486 },
    { name: "Mumbai", lat: 19.076, lon: 72.877 },
    { name: "Bangalore", lat: 12.971, lon: 77.594 },
    { name: "Delhi", lat: 28.613, lon: 77.209 },
    { name: "Chennai", lat: 13.082, lon: 80.270 },
    { name: "Kolkata", lat: 22.572, lon: 88.363 }
];

function App() {
    const [features, setFeatures] = useState(defaultFeatures);
    const [metadata, setMetadata] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await axios.get('http://localhost:8000/metadata');
                setMetadata(response.data);
            } catch (err) {
                console.error('Failed to fetch metadata:', err);
                setMetadata({
                    MedInc: { label: "Median Income", min: 0.5, max: 15.0 },
                    HouseAge: { label: "House Age", min: 1, max: 52 },
                    AveRooms: { label: "Average Rooms", min: 1, max: 10 },
                    AveBedrms: { label: "Average Bedrooms", min: 0.5, max: 5 },
                    Population: { label: "Population", min: 3, max: 35000 },
                    AveOccup: { label: "Average Occupancy", min: 1, max: 6 },
                    Latitude: { label: "Latitude", min: 32.5, max: 42.0 },
                    Longitude: { label: "Longitude", min: -124.3, max: -114.3 }
                });
            }
        };
        fetchMetadata();
    }, []);

    const handleCityChange = (e) => {
        const city = indianCities.find(c => c.name === e.target.value);
        if (city && city.name !== "Custom") {
            setFeatures(prev => ({
                ...prev,
                Latitude: city.lat,
                Longitude: city.lon
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeatures(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/predict', features);
            setPrediction(response.data.formatted_price);
        } catch (err) {
            console.error('Prediction failed:', err);
            setError(err.response?.data?.detail || 'Failed to communicate with prediction service.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <>
            <div className="liquid-bg">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <nav className="navbar">
                <div className="nav-content max-w">
                    <div className="nav-pill nav-brand glass-pill">
                        <Building2 className="nav-icon" />
                        <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>House</span>
                        <span style={{ color: 'var(--accent-color)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Prediction</span>
                    </div>

                    <ul className="nav-pill nav-links glass-pill">
                        <li><a href="#home" className="jelly-btn active">Home</a></li>
                        <li><a href="#predict" className="jelly-btn">AI Predictor</a></li>
                        <li><a href="#about" className="jelly-btn">About</a></li>
                    </ul>

                    <div className="nav-pill nav-right glass-pill">
                        <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1rem', color: '#fff' }}>Aura AI</span>
                        <div className="status-dot"></div>
                    </div>
                </div>
            </nav>

            <div className="page-wrapper">
                {/* Hero Section */}
                <section id="home" className="hero-section max-w">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1>Next-Gen <br /><span className="gradient-text">Real Estate</span> <br />Valuation.</h1>
                        <p>Harness the power of Artificial Intelligence to instantly estimate property values with unprecedented precision.</p>
                        <a href="#predict" className="hero-btn jelly-btn">Start Estimation</a>
                    </motion.div>
                    <motion.div
                        className="hero-image-container glass-panel"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <img src="/images/exterior.png" alt="Modern Smart Home exterior at night" className="hero-image" />
                    </motion.div>
                </section>

                {/* Features Section */}
                <section className="features-section max-w">
                    <div className="glass-panel feature-card">
                        <Home className="feature-icon" />
                        <h3>Smart Analysis</h3>
                        <p>Evaluates age, rooms, and localized specs to determine foundational value.</p>
                    </div>
                    <div className="glass-panel feature-card">
                        <BarChart3 className="feature-icon" />
                        <h3>Market Context</h3>
                        <p>Incorporates neighborhood demographics and population metrics.</p>
                    </div>
                    <div className="glass-panel feature-card">
                        <MapPin className="feature-icon" />
                        <h3>Geospatial Data</h3>
                        <p>Pinpoints latitude and longitude for precise location-based modifiers.</p>
                    </div>
                </section>

                {/* Main Dashboard / Predictor */}
                <section id="predict" className="predictor-section max-w">
                    <div className="section-header text-center">
                        <h2>Predictive <span className="gradient-text">Engine</span></h2>
                        <p>Adjust parameters below and let our Random Forest ML Model analyze the market trajectory.</p>
                    </div>

                    <motion.main
                        className="main-content"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {/* Form Panel */}
                        <motion.div className="glass-panel" variants={itemVariants}>
                            <form onSubmit={handleSubmit} className="form-grid">
                                <motion.div className="input-group" key="city-select" variants={itemVariants}>
                                    <label><span>Select Indian City</span></label>
                                    <select
                                        className="glass-input"
                                        onChange={handleCityChange}
                                        style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                                    >
                                        {indianCities.map(city => (
                                            <option key={city.name} value={city.name} style={{ background: '#1a1a1a' }}>{city.name}</option>
                                        ))}
                                    </select>
                                </motion.div>

                                {Object.keys(defaultFeatures).map((key) => {
                                    const meta = metadata?.[key] || {};
                                    const min = meta.min || 0;
                                    const max = meta.max || 100;

                                    return (
                                        <motion.div className="input-group" key={key} variants={itemVariants}>
                                            <label>
                                                <span>{meta.label || key}</span>
                                                <span className="value">
                                                    {key === 'MedInc' ? `₹${(features[key] * 100000).toFixed(0)}` : features[key]?.toFixed(2)}
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                className="slider"
                                                name={key}
                                                min={min}
                                                max={max}
                                                step={(max - min) / 100}
                                                value={features[key]}
                                                onChange={handleChange}
                                            />
                                        </motion.div>
                                    );
                                })}

                                <motion.div style={{ gridColumn: '1 / -1' }} variants={itemVariants}>
                                    <button type="submit" className="submit-btn jelly-btn" disabled={loading}>
                                        {loading ? 'ANALYZING MARKET...' : 'CALCULATE ESTIMATE'}
                                    </button>
                                    {error && <div className="error-msg">{error}</div>}
                                </motion.div>
                            </form>
                        </motion.div>

                        {/* Result Panel */}
                        <motion.div className="glass-panel result-panel-wrapper" variants={itemVariants}>
                            <div className="result-bg-image" style={{ backgroundImage: "url('/images/market.png')" }}></div>
                            <div className="result-container blur-content">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                            className="loader"
                                        />
                                    ) : prediction ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        >
                                            <div className="result-label">Estimated Market Value</div>
                                            <motion.div
                                                className="price-display"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2, duration: 0.5 }}
                                            >
                                                {prediction}
                                            </motion.div>
                                            <p className="success-tag"><CheckCircle2 size={16} /> AI Confidence High</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="placeholder-text"
                                        >
                                            System Ready.<br />Awaiting environmental parameters.
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.main>
                </section>

                {/* Visual Break */}
                <section id="about" className="info-section max-w">
                    <div className="glass-panel info-row">
                        <div className="info-image-cont">
                            <img src="/images/interior.png" alt="Futuristic interior" />
                        </div>
                        <div className="info-text">
                            <h2>Building the <span className="gradient-text">Future</span> of Living</h2>
                            <p>Our algorithms take into account hundreds of thousands of historical data points, distilling them down to a sleek, instantaneous interface meant to streamline real estate for buyers, sellers, and agents.</p>
                            <ul className="check-list">
                                <li><CheckCircle2 size={20} className="check-icon" /> Over 20,000 data points modeled</li>
                                <li><CheckCircle2 size={20} className="check-icon" /> Real-time geographic mapping</li>
                                <li><CheckCircle2 size={20} className="check-icon" /> 99.9% prediction sub-routine uptime</li>
                            </ul>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content max-w">
                    <div className="footer-section">
                        <div className="nav-brand">
                            <Building2 className="nav-icon" />
                            <span>House Prediction</span>
                        </div>
                        <p className="footer-desc">Precision AI-powered property evaluation services mapping the future of physical spaces using cutting-edge machine learning and predictive analytics.</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home Dashboard</a></li>
                            <li><a href="#predict">Valuation Engine</a></li>
                            <li><a href="#about">Our Technology</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Contact Office</h4>
                        <div className="contact-item"><MapPin size={16} /><span>123 Glass Tower, Cyber District</span></div>
                        <div className="contact-item"><Phone size={16} /><span>+91 6303506870</span></div>
                        <div className="contact-item"><Mail size={16} /><span>systems@auraproperty.ai</span></div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 House Prediction AI. All systems nominal. Data subject to theoretical market limits.</p>
                </div>
            </footer>
        </>
    );
}

export default App;
