import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card, Accordion } from 'react-bootstrap';
import './HotelRoom.css';
import CustomNavbar from "../../pages/navbar/CustomNavbar";
import Footer from "../../pages/footer/Footer";
import Timer from '../timmer/Timer';

import { useDispatch, useSelector } from 'react-redux';
import { fetchHotelRooms } from '../../redux-toolkit/slices/hotelRoomSlice';
import { blockHotelRooms } from '../../redux-toolkit/slices/hotelBlockSlice';
import { useNavigate } from 'react-router-dom';

const HotelRoom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    
    const [selectedRoom, setSelectedRoom] = useState(null);
    const hotelRooms = location.state?.hotelRooms || [];
    
    const { loading, error } = useSelector((state) => state.hotelRooms || {});
    const { hotels = [], srdvType, resultIndexes, srdvIndexes, hotelCodes, traceId } = useSelector((state) => state.hotelSearch || {});

    useEffect(() => {
        dispatch(fetchHotelRooms());
    }, [dispatch]);

    let isProcessing = false;

    const roomblockHandler = async (event, index) => {
        event.preventDefault();
        if (index < 0 || index >= hotels.length) {
            console.error('Invalid hotel index:', index);
            return;
        }

        const resultIndex = resultIndexes[index];
        const srdvIndex = srdvIndexes[index];
        const hotelCode = hotelCodes[index];

        if (resultIndex === undefined || srdvIndex === undefined || hotelCode === undefined) {
            console.error('One or more values are undefined. Check your data arrays.');
            return;
        }

        if (isProcessing || !selectedRoom) return;
        isProcessing = true;

        const hotelRoomsDetails = {
            ResultIndex: resultIndex || '9',
            // ResultIndex: '9',
            SrdvIndex: srdvIndex,
            SrdvType: srdvType,
            HotelCode: hotelCode || "92G|DEL",
            // HotelCode:  "92G|DEL",
            TraceId: traceId,
            // TraceId: '1',
            GuestNationality: "IN",
            HotelName: 'The Manor',
            NoOfRooms: '1',
            HotelRoomsDetails: [
                {
                    ChildCount: selectedRoom.ChildCount || 0,
                    RequireAllPaxDetails: selectedRoom.RequireAllPaxDetails || false,
                    RoomId: selectedRoom.RoomId || 0,
                    RoomStatus: selectedRoom.RoomStatus || 0,
                    RoomIndex: selectedRoom.RoomIndex || 0,
                    RoomTypeCode: selectedRoom.RoomTypeCode || 'DEFAULT_CODE',
                    RoomTypeName: selectedRoom.RoomTypeName || 'Unknown',
                    RatePlanCode: selectedRoom.RatePlanCode || '',
                    RatePlan: selectedRoom.RatePlan || 0,
                    InfoSource: selectedRoom.InfoSource || 'Unknown',
                    SequenceNo: selectedRoom.SequenceNo || '0',
                    DayRates: (selectedRoom.DayRates && selectedRoom.DayRates.length > 0
                        ? selectedRoom.DayRates.map(dayRate => ({
                            Amount: dayRate.Amount || 0,
                            Date: dayRate.Date || 'Unknown'
                        }))
                        : [{ Amount: 0, Date: 'Unknown' }]
                    ),
                    Price: {
                        CurrencyCode: selectedRoom.Price?.CurrencyCode || 'INR',
                        RoomPrice: selectedRoom.Price?.RoomPrice || 0,
                        Tax: selectedRoom.Price?.Tax || 0,
                        ExtraGuestCharge: selectedRoom.Price?.ExtraGuestCharge || 0,
                        ChildCharge: selectedRoom.Price?.ChildCharge || 0,
                        OtherCharges: selectedRoom.Price?.OtherCharges || 0,
                        Discount: selectedRoom.Price?.Discount || 0,
                        PublishedPrice: selectedRoom.Price?.PublishedPrice || 0,
                        PublishedPriceRoundedOff: selectedRoom.Price?.PublishedPriceRoundedOff || 0,
                        OfferedPrice: selectedRoom.Price?.OfferedPrice || 0,
                        OfferedPriceRoundedOff: selectedRoom.Price?.OfferedPriceRoundedOff || 0,
                        AgentCommission: selectedRoom.Price?.AgentCommission || 0,
                        AgentMarkUp: selectedRoom.Price?.AgentMarkUp || 0,
                        ServiceTax: selectedRoom.Price?.ServiceTax || 0,
                        TDS: selectedRoom.Price?.TDS || 0,
                        ServiceCharge: selectedRoom.Price?.ServiceCharge || 0,
                        TotalGSTAmount: selectedRoom.Price?.TotalGSTAmount || 0,
                        GST: {
                            CGSTAmount: selectedRoom.Price?.GST?.CGSTAmount || 0,
                            CGSTRate: selectedRoom.Price?.GST?.CGSTRate || 0,
                            CessAmount: selectedRoom.Price?.GST?.CessAmount || 0,
                            CessRate: selectedRoom.Price?.GST?.CessRate || 0,
                            IGSTAmount: selectedRoom.Price?.GST?.IGSTAmount || 0,
                            IGSTRate: selectedRoom.Price?.GST?.IGSTRate || 0,
                            SGSTAmount: selectedRoom.Price?.GST?.SGSTAmount || 0,
                            SGSTRate: selectedRoom.Price?.GST?.SGSTRate || 0,
                            TaxableAmount: selectedRoom.Price?.GST?.TaxableAmount || 0
                        }
                    },
                    Amenities: (selectedRoom.Amenities && selectedRoom.Amenities.length > 0
                        ? selectedRoom.Amenities
                        : ['Unknown']
                    ),
                    SmokingPreference: selectedRoom.SmokingPreference || 'NoPreference',
                    CancellationPolicies: (selectedRoom.CancellationPolicies && selectedRoom.CancellationPolicies.length > 0
                        ? selectedRoom.CancellationPolicies.map(policy => ({
                            Charge: policy.Charge || 0,
                            ChargeType: policy.ChargeType || 0,
                            Currency: policy.Currency || 'INR',
                            FromDate: policy.FromDate || 'Unknown',
                            ToDate: policy.ToDate || 'Unknown'
                        }))
                        : [{ Charge: 0, ChargeType: 0, Currency: 'INR', FromDate: 'Unknown', ToDate: 'Unknown' }]
                    ),
                    CancellationPolicy: selectedRoom.CancellationPolicy || 'No Policy',
                    Inclusion: (selectedRoom.Inclusion && selectedRoom.Inclusion.length > 0
                        ? selectedRoom.Inclusion
                        : ['None']
                    ),
                    LastCancellationDate: selectedRoom.LastCancellationDate || 'Unknown',
                    BedTypes: (selectedRoom.BedTypes && selectedRoom.BedTypes.length > 0
                        ? selectedRoom.BedTypes.map(bedType => ({
                            BedTypeCode: bedType.BedTypeCode || 'DEFAULT_CODE',
                            BedTypeDescription: bedType.BedTypeDescription || 'Description not available'
                        }))
                        : [{ BedTypeCode: 'DEFAULT_CODE', BedTypeDescription: 'Description not available' }]
                    )
                }
            ],
            ArrivalTime: new Date().toISOString(),
            IsPackageFare: true,
        };
        console.log("Request data block:", hotelRoomsDetails);
        
        try {
            await dispatch(blockHotelRooms(hotelRoomsDetails)).unwrap();
            alert('Room reserved successfully!');

            navigate('/hotel-guest');

        } catch (error) {
            console.error('Error:', error);
        }
        isProcessing = false;
    };

    const cleanCancellationPolicy = (text) => {
        if (!text) return '';
        let cleanedText = text
            .replace(/#\^#|#!#|\s+/g, ' ')
            .replace(/\|/g, '\n')
            .replace(/(\d{2}-\w{3}-\d{4}), (\d{2}:\d{2}:\d{2})/, '$1, $2')
            .replace(/INR (\d+\.\d{2})/, 'INR $1')
            .replace(/(\d+)% of total amount/, '$1% of the total amount')
            .replace(/(\d{2}-\w{3}-\d{4})/, '$1');

        cleanedText = cleanedText
            .replace(/\s{2,}/g, ' ')
            .trim();

        return cleanedText;
    };

    return (
        <>
            <CustomNavbar />
            <Timer />
            <div className='room_bg'>
            <Container>
            <div className='room_heading'>
                <h1>Available Hotel Rooms</h1>
                </div>
                {loading && <p>Loading hotel rooms...</p>}
                {error && <p>Error: {error}</p>}
                {hotelRooms.length === 0 && !loading && <p>No hotel room data available.</p>}
                {hotelRooms.map((room, index) => (
                    <Card key={index} className="mb-4">
                        <Card.Body>
                            <h4>{room.RoomTypeName}</h4>
                            <Card.Text>
                                <p><b>Price:</b> INR {room.Price.RoomPrice.toFixed(2)}</p>
                                <p><b>Amenities:</b> {room.Amenities.join(', ')}</p>
                                <p><b>Smoking Preference:</b> {room.SmokingPreference}</p>
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header><b>Cancellation Policy</b></Accordion.Header>
                                        <Accordion.Body>
                                            <p>{cleanCancellationPolicy(room.CancellationPolicy)}</p>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </Card.Text>
                            <button className='reserve_button' onClick={(event) => { 
                                setSelectedRoom(room); 
                                roomblockHandler(event, index); 
                            }}>
                                Reserve
                            </button>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
            </div>
            <Footer />
        </>
    );
};

export default HotelRoom;
