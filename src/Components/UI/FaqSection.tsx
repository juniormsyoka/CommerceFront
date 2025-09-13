// Components/UI/FaqSection.tsx
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiHelpCircle, FiMessageSquare, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import IconWrapper from "../IconWrapper";
import "./FaqSection.css";

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const faqs: FaqItem[] = [
  {
    question: "How do I post an item for sale?",
    answer: "Go to your profile, click 'Post Item', fill out the details with images and pricing, and submit. Your listing will appear under 'Browse' after a quick verification process.",
    category: "Selling"
  },
  {
    question: "How do I receive notifications?",
    answer: "Sellers automatically get notifications when someone orders one of their products. You can customize notification preferences in your account settings for email, push, or SMS alerts.",
    category: "Account"
  },
  {
    question: "Can I buy items without signing in?",
    answer: "You need to create an account to complete purchases, so we can track orders and send updates. However, you can browse listings without an account to see what's available.",
    category: "Buying"
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit cards, PayPal, and campus-specific payment options. All transactions are encrypted for your security.",
    category: "Payment"
  },
  {
    question: "How do I arrange item pickup?",
    answer: "After purchase, you'll receive contact information to coordinate pickup. We recommend meeting in public campus locations during daylight hours.",
    category: "Logistics"
  },
  {
    question: "What if I receive a damaged item?",
    answer: "Contact our support team within 24 hours with photos of the issue. We'll mediate between buyer and seller to find a resolution.",
    category: "Support"
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));
  const navigate = useNavigate();

  // Filter FAQs by category if one is selected
  const filteredFaqs = activeCategory 
    ? faqs.filter(faq => faq.category === activeCategory)
    : faqs;

  return (
    <div className="faq-section">
      <div className="faq-header">
        <div className="faq-title-container">
           <div className="faq-title-icon">
            <IconWrapper icon={FiHelpCircle}/>
           </div>
          
          <h2>Frequently Asked Questions</h2>
        </div>
        <p className="faq-subtitle">Find answers to common questions about buying and selling on Campus Marketplace</p>
      </div>

      {/* Category Filter */}
      <div className="faq-categories">
        <button 
          className={`category-filter ${!activeCategory ? 'active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All Questions
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`category-filter ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category ?? null)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="faq-items">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? "open" : ""}`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="faq-question-container">
              <div className="faq-marker">
                <div className="faq-number">{(index + 1).toString().padStart(2, '0')}</div>
                <div className="faq-category-tag">{faq.category}</div>
              </div>
              <div className="faq-question">
                <h3>{faq.question}</h3>
                {openIndex === index ? (
                  <div className="faq-chevron">
                    <IconWrapper icon={FiChevronUp}/>
                    </div>
                 
                ) : (
                  <div className="faq-chevron">
                    <IconWrapper icon={FiChevronDown}/>
                  </div>
                  
                )}
              </div>
            </div>
            <div className={`faq-answer-container ${openIndex === index ? "visible" : ""}`}>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="faq-support">
        <div className="support-content">
          
           <div className="support-icon"><IconWrapper icon={FiMessageSquare}/></div>
          <h3>Still have questions?</h3>
          <p>Our support team is here to help you with any additional questions</p>
          <div className="support-actions">
            <button className="support-btn primary" onClick={() => navigate("*")}>
               <div className="btn-icon" ><IconWrapper icon={FiMail}/></div>
              
              Contact Support
            </button>
            <button className="support-btn secondary" onClick={() => navigate("*")}>
              Visit Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;