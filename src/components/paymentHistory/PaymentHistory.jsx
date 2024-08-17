import React from 'react'
import CustomNavbar from '../../pages/navbar/CustomNavbar'
import Footer from '../../pages/footer/Footer'
import PaypalLogo from "../../assets/images/paypal.png"
import Atmcard from "../../assets/images/atm-card.png"
import GpayLogo from "../../assets/images/google-pay.png"
import './PaymentHistory.css';

function PaymentHistory() {
    const paymentDetails = [
        {
            id: 1,
            img: GpayLogo,  
            method: "Paypal",
            date: "Mar, 01 2023 at 08:26 PM",
            price: "390",
            status: "Successful"
        },
        {
            id: 2,
            img: PaypalLogo,  
            method: "Credit Card",
            date: "Feb, 15 2023 at 02:10 PM",
            price: "410",
            status: "Successful"
        },
        {
            id: 2,
            img: Atmcard,  
            method: "Credit Card",
            date: "Feb, 15 2023 at 02:10 PM",
            price: "410",
            status: "Successful"
        },
        {
            id: 2,
            img: PaypalLogo,  
            method: "Credit Card",
            date: "Feb, 15 2023 at 02:10 PM",
            price: "410",
            status: "Successful"
        },
        {
            id: 2,
            img: Atmcard,  
            method: "Credit Card",
            date: "Feb, 15 2023 at 02:10 PM",
            price: "410",
            status: "Successful"
        },
        {
            id: 2,
            img: PaypalLogo,  
            method: "Credit Card",
            date: "Feb, 15 2023 at 02:10 PM",
            price: "410",
            status: "Successful"
        },
        {
            id: 1,
            img: GpayLogo,  
            method: "Paypal",
            date: "Mar, 01 2023 at 08:26 PM",
            price: "390",
            status: "Successful"
        },
    ];

    return (
        <>
            <CustomNavbar />
            <section className='paymentHistorymaisec'>
                <div className="container">
                    <div className="row paymentHistoryROW">
                        <div className="col-md-10 paymentHistoryCOL1">
                            <h4>Payment History</h4>
                            <div className="col-12">
                                {paymentDetails.map((payment) => (
                                    <div key={payment.id} className="paymentHistoryItem">
                                        <div className="paymentHistoryDetail">
                                            <img src={payment.img} className='img-fluid' alt={`${payment.method}`} />
                                            <div>
                                                <h6>{payment.method}</h6>
                                                <p>{payment.date}</p>
                                            </div>
                                        </div>
                                        <div className='statusDiv'>
                                            <p className='statusDivprice'>₹{payment.price}</p>
                                            <h6 className='statusDivstaus'>{payment.status}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default PaymentHistory;
