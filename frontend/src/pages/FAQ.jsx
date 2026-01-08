import React, { useState } from "react";
import Footer from "./components/footer";
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book farm equipment?",
      answer:
        "Search or filter by machinery type and location, select the hourly rate and rental hours, then confirm and pay securely. You’ll receive a confirmation and delivery details from the supplier."
    },
    {
      question: "What are typical delivery options for heavy machinery?",
      answer:
        "Most owners offer farm delivery (especially for harvesters and tractors). For small tools, you may be able to pick them up from the supplier. Delivery details appear on the confirmation."
    },
    {
      question: "Is payment refundable if the weather prevents work?",
      answer:
        "Refunds and cancellations are subject to the supplier’s policy. During peak seasons (e.g., harvest), suppliers often have stricter cancellation terms — always review the booking terms before confirming."
    },
    {
      question: "Do you provide insurance or damage protection?",
      answer:
        "Some owners include basic damage protection; additional insurance options may be available at checkout depending on the equipment and owner."
    },
    {
      question: "How accurate are the soil sensors and crop recommendations?",
      answer:
        "Soil sensors measure moisture, temperature, and pH to provide guidance. Recommendations are data-driven but should be combined with local knowledge — we also show nearby suppliers for equipment tailored to the recommended crop."
    },
    {
      question: "Can I rent equipment for long-term work (days/weeks)?",
      answer:
        "Yes. When you choose rental hours, you can scale up to multi-day or weekly rentals—adjust the hours accordingly and owners will confirm availability."
    },
    {
      question: "What if equipment breaks down during use?",
      answer:
        "Report any mechanical issues immediately through the app; we’ll notify the owner and help coordinate repairs or replacements per the owner’s policy."
    },
    {
      question: "How do I find equipment for time-sensitive tasks like harvesting?",
      answer:
        "Filter by availability and rating, and consider nearby owners with delivery options. During harvest season, book early and confirm delivery windows to avoid delays."
    }
  ];

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-green-900 mb-6">Frequently Asked Questions</h1>
        <p className="text-slate-600 mb-6">Answers to common farm-focused questions about renting machinery, delivery, insurance and smart farming tools.</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between focus:outline-none ${openIndex === index ? 'bg-green-50' : 'bg-white'}`}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <span className="font-semibold text-green-800">{faq.question}</span>
                <span className="text-green-600">{openIndex === index ? '−' : '+'}</span>
              </button>

              <div
                id={`faq-${index}`}
                className={`px-4 pt-0 pb-4 text-slate-700 transition-max-height duration-300 ${openIndex === index ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
              >
                <p className="mt-3">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-green-50 p-4 rounded-lg text-center">
          <p className="text-slate-700">Still have questions?</p>
          <a href="mailto:support@agrishare.local" className="text-green-700 font-semibold">Contact our support team</a>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default FAQ;
