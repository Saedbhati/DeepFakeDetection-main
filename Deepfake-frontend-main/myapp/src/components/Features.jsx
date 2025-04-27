import React, { useState, useEffect, useContext } from 'react';
import StickyHeader from './Stickyheader';
import 'aos/dist/aos.css';
import AOS from 'aos';
import '../Styles/Features.css';
import '../Styles/Stickyheader.css';

const Features = ({ handleOrderPopup }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: 'ease-in-out',
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const features = [
    {
      icon: "/Brain.svg",
      title: "Real-Time Deep Fake Detection",
    },
    {
      icon: "/features/media-analysis.svg",
      title: "Comprehensive Media Analysis",
    },
    {
      icon: "/features/Multi-format.svg",
      title: "Multi-Format Support",
    },
    {
      icon: "/features/user-friendly.svg",
      title: "User-Friendly Interface",
    },
    {
      icon: "/features/batch.svg",
      title: "Batch Processing",
    },
    {
      icon: "/features/privacy.svg",
      title: "Privacy and Data Security",
    },
    {
      icon: "/features/alerts.svg",
      title: "Customizable Alerts and Notifications",
    },
    {
      icon: "/features/report.svg",
      title: "Detailed Reporting and Insights",
    },
    {
      icon: "/features/api.svg",
      title: "API Integration",
    },
    {
      icon: "/features/mobile.svg",
      title: "Mobile Compatibility",
    },
    {
      icon: "/features/ethical.svg",
      title: "Ethical and Legal Guidance",
    },
    {
      icon: "/features/supports-language.svg",
      title: "Support for Multiple Languages",
    },
  ];

  const footerLinks = {
    features: ['Detect videos', 'Detect audio', 'Detect pictures'],
    information: ['Impact of deep fake', 'Research and development', 'Accuracy and Reliability', 'Overview of deep fakes'],
    support: ['FAQ', 'Contact', 'Technical Support', 'Troubleshooting Tips', 'Updates and Release Notes'],
    download: ['iOS', 'Android', 'Windows', 'MAC'],
    social: ['WhatsApp', 'YouTube', 'Instagram', 'Twitter', 'Facebook', 'Discord']
  };
 
  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { email: feedbackEmail, message: feedbackMessage });
    setFeedbackEmail('');
    setFeedbackMessage('');
    alert('Thank you for your feedback!');
  };

  return (
    <div className="features-container">
        <StickyHeader />
      <h1 
        className="title text-5xl sm:text-6xl lg:text-7xl font-bold" 
        data-aos="zoom-out" 
        data-aos-duration="500" 
        data-aos-once="true"
      >
        Fantastic Features
      </h1>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <img src={feature.icon} alt="" className="feature-icon" />
            <h3>{feature.title}</h3>
          </div>
        ))}
      </div>

    <footer 
      className="footer" 
      data-aos="zoom-out" 
      data-aos-duration="500" 
      data-aos-once="true"
    >
      <div className="footer-section">
        <h4>Features</h4>
        <ul>
          {footerLinks.features.map((link, index) => (
            <li key={index}>{link}</li>
          ))}
        </ul>
      </div>


      <div className="footer-section">
        <h4>Information</h4>
        <ul>
          {footerLinks.information.map((link, index) => (
            <li key={index}>{link}</li>
          ))}
        </ul>
      </div>

      <div className="footer-section">
          <h4>Support</h4>
          <ul>
            {footerLinks.support.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Download</h4>
          <ul>
            {footerLinks.download.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>


      <div className="social-section">
        <h2>Follow us on :</h2>
        <div className="social-icons">
          <a href="#" className="social-icon">
            <img src="/social/whatsapp.svg" alt="WhatsApp" />
          </a>
          <a href="#" className="social-icon">
            <img src="/social/youtube.svg" alt="YouTube" />
          </a>
          <a href="#" className="social-icon">
            <img src="/social/instagram.svg" alt="Instagram" />
          </a>
          <a href="#" className="social-icon">
            <img src="/social/twitter.svg" alt="Twitter" />
          </a>
          <a href="#" className="social-icon">
            <img src="/social/facebook.svg" alt="Facebook" />
          </a>
        </div>
      </div> 
    </footer>

    <div className="contact-section">
        <h2>Contact Us</h2>
        <p>Gmail: rv1175544@gmail.com</p>
        <p>Phone: +91 (775) 603-8758</p>
        
        <form onSubmit={handleSubmitFeedback} className="feedback-form">
          <h3>Share Your Experience</h3>
          <input 
            type="email" 
            placeholder="Your email" 
            value={feedbackEmail}
            onChange={(e) => setFeedbackEmail(e.target.value)}
            required 
          />
          <textarea 
            placeholder="Your message" 
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit">Send Feedback</button>
        </form>
      </div>

      <div className="copyright">
        <p>©2024 All Rights Reserved. This site is protected by the Google Privacy Policy and Terms of Service apply.</p>
      </div>
    </div>
  );
};

export default Features;
