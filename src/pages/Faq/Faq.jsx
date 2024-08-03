// import "./Faq.css";
// import { useState } from 'react';
// import 'remixicon/fonts/remixicon.css';

// const faqData = [
//   { question: "Is your Flight Reservation/Itinerary verifiable?", answer: "Yes, we provide verifiable flight itineraries which can be confirmed on the official website." },
//   { question: "Can I select the airline that I want to get a reservation from?", answer: "Definitely. For this purpose simply write down the name of your preferred airline in the additional details box of Flight Itinerary while placing the order." },
//   { question: "Should I buy a Flight Ticket before applying for a visa?", answer: "No, we strongly recommend you not to buy an actual airline ticket. Because, if your visa application is denied, you will lose your money." },
//   { question: "What is the best time to order Flight Reservation?", answer: "The best time to order a Flight Reservation/Itinerary is 1 to 2 days prior to date of your visa interview. However, you can place your order at your convenience. Our team will forward your desired document as per your interview date." },
//   { question: "Do you provide a group traveler’s discount?", answer: "Yes, we give amazing discounts for group travelers. All you need to do is to visit us and see the discount on pages." },
//   { question: "What should I do in case of incorrect booking?", answer: "Please carefully enter the required details while filling the order form for Flight Reservation/Itinerary in the first phase. If you still commit a mistake, contact us at the earliest possible moment so that we can make necessary corrections before booking Flight Reservation for you." },
//   { question: "What is your mode of payment?", answer: "You can place an order (s) via any bank's credit card/debit card." },
//   { question: "Are you on Twitter, Facebook and other social media platforms?", answer: "We will never disclose your data to third parties and you can unsubscribe from the newsletter at any time. Subscribe here to our newsletter." }
// ];

// const Faq = () => { 
//   const [openIndex, setOpenIndex] = useState(null);

//   const handleToggle = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   return (

//     <>
//       <div className='Faq'>
//         <div className="faqq">
//           <h5>FAQ</h5>
//           <div className="f-top">
//             <i className="ri-search-line"></i>
//             <input type="text" placeholder='Search Here' />
//           </div>
//           <div className="f-btm">
//             {faqData.map((faq, index) => (
//               <div className="line" key={index}>
//                 <div className="one" onClick={() => handleToggle(index)}>
//                   <p>{faq.question}</p>
//                   <i className={openIndex === index ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"}></i>
//                 </div>
//                 {openIndex === index && (
//                   <div className="two show">
//                     <p>{faq.answer}</p>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Faq;



import "./Faq.css";
import { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);

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
        const questionsAnswers = content.split('<p>').map(item => item.replace('</p>', '').trim()).filter(item => item);
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

  return (
    <>
      <div className='Faq'>
        <div className="faqq">
          <h5>FAQ</h5>
          <div className="f-top">
            <i className="ri-search-line"></i>
            <input type="text" placeholder='Search Here' />
          </div>
          <div className="f-btm">
            {faqData.map((faq, index) => (
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
  )
}

export default Faq;
