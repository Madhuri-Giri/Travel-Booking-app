import "./Faq.css";
import { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqhandler = async () => {
    try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/get-faq');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Parsing questions and answers from content
      const parsedFaqs = data.data.map(faq => {
        const content = faq.content;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        const questionsAnswers = Array.from(tempDiv.querySelectorAll("p"))
          .map(p => p.textContent.trim())
          .filter(item => item);

        let parsedData = [];
        for (let i = 0; i < questionsAnswers.length; i += 2) {
          parsedData.push({
            question: questionsAnswers[i],
            answer: questionsAnswers[i + 1] || ''
          });
        }
        return parsedData;
      }).flat();

      setFaqData(parsedFaqs);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
    }
  };

  useEffect(() => {
    faqhandler();
  }, []);

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className='Faq'>
        <div className="faqq">
          <h5>FAQ</h5>
          <div className="f-top">
            <i className="ri-search-line"></i>
            <input 
              type="text" 
              placeholder='Search Here' 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="f-btm">
            {filteredFaqs.map((faq, index) => (
              <div className="line" key={index}>
                <div className="one" onClick={() => handleToggle(index)}>
                  <p>{faq.question}</p>
                  <i className={openIndex === index ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
                </div>
                {openIndex === index && (
                  <div className="two show">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
