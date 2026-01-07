import React from "react";

function FAQ() {
  const faqs = [
    {
      question: "How do I book equipment?",
      answer:
        "Browse available equipment, select your requirement, and confirm your booking."
    },
    {
      question: "Is advance payment required?",
      answer:
        "Yes, advance payment may be required depending on the supplier."
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Cancellations depend on supplier policies. Please check before confirming."
    },
    {
      question: "How can I track my order?",
      answer:
        "After booking, you can track your order from the Track Order page."
    },
    {
      question: "Are suppliers verified?",
      answer:
        "Yes, all suppliers on the platform are verified."
    },

    /* 🔧 HARDWARE & SMART AGRICULTURE QUESTIONS */
  {
  question: "How does the system recommend crops using hardware sensors?",
  answer:
    "Soil sensors monitor parameters like moisture, temperature, and pH, and the analyzed data is used to recommend suitable crops."
},
{
  question: "Does the platform suggest equipment after crop recommendation?",
  answer:
    "Yes, once a crop is recommended, the system suggests the required farming equipment and shows nearby availability for easy booking."
}

  ];

  return (
    <div className="min-h-screen bg-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-purple-800 mb-8">
          Frequently Asked Questions
        </h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;
