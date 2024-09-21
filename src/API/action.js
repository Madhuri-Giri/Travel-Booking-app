/* eslint-disable no-unused-vars */
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../axios'

export const getFlightList =
    async ({ setListingData, setDataToPass, setLogos, setLoading, formData, navigate }) => {
        setLoading(true);
        // console.log("formDataCheck", formData);
        // Fetch airline logos by codes

        try {

            // const response = await fetch('https://sajyatra.sajpe.in/admin/api/flight-search', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     // body: JSON.stringify(formData),
            //     body: JSON.stringify(formData),
            // });

            const response = await axios.post("/flight-search", formData);
            if (response.status != 200) {
                // const errorText = await response.text();
                // console.error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
                // alert(`Failed to fetch flight data: ${errorText}`);

                console.error(`HTTP error! Status: ${response.status}, Response: ${response.statusText}`);
                alert(`Failed to fetch flight data: ${response.statusText}`);
                setLoading(false);
                return;
            }

            // const data = await response.json();
            const data = response.data;

            if (!data.Results) {
                console.error("No results found in the API response");
                alert("No flights found. Please try again later.");
                setLoading(false);
                navigate("/flight-search");
                return;
            }

            setListingData(data);

            const firstResult = data?.Results?.[0]?.[0];
            if (firstResult && firstResult.FareDataMultiple?.[0]) {
                const { SrdvIndex, ResultIndex, IsLCC } = firstResult.FareDataMultiple[0];
                const { TraceId, SrdvType } = data;

                setDataToPass({
                    SrdvIndex: SrdvIndex,
                    ResultIndex: ResultIndex,
                    TraceId: TraceId,
                    SrdvType: SrdvType,
                    IsLCC: IsLCC,
                });

                // ===============Needs to remove later====
                localStorage.setItem("F-SrdvIndex", SrdvIndex);
                localStorage.setItem("F-ResultIndex", ResultIndex);
                localStorage.setItem("F-TraceId", TraceId);
                localStorage.setItem("F-SrdvType", SrdvType);
                localStorage.setItem("F-IsLcc", IsLCC);
                // ===============Needs to remove later====


            } else {
                console.log("SrdvIndex or FareDataMultiple not found");
            }

            localStorage.setItem('Flight-search', JSON.stringify(data));
            const airlineCodes = data.Results.flatMap(result =>
                result.flatMap(fareData =>
                    fareData.FareDataMultiple.flatMap(fare =>
                        fare.FareSegments.map(segment => segment.AirlineCode)
                    )
                )
            );
            const filteredAirlineCodes = airlineCodes.filter(code => code !== "");
            const logos = await fetchAirlineLogos(filteredAirlineCodes);

            const logoMap = filteredAirlineCodes.reduce((acc, code, index) => {
                acc[code] = logos[index] || '';
                return acc;
            }, {});

            setLogos(logoMap);

            setLoading(false);


            // const params = new URLSearchParams({
            //     formData: JSON.stringify(formData)
            //   }).toString();
            // navigate(`/flight-list?${params}`, { state: { data: data, formData: formData } })
            // navigate("/flight-list", { state: { data: data, formData: formData } });
            // return { ...data, logoMap: logoMap };

        } catch (error) {
            console.log("calledError", error);
            console.log("errorCheck", error.message);
            console.error('Error fetching flight data:', error.message);
            // // alert(`An error occurred: ${error.message}`);
            alert(`failed: ${error.message}`);
            navigate("/flight-search");
        } finally {
            setLoading(false);
        }
    }

const fetchAirlineLogos = async (airlineCodes) => {
    try {

        // const response = await fetch('https://sajyatra.sajpe.in/admin/api/airline-logo', {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });
        const response = await axios.get("/airline-logo");
        if (response.status != 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // const data = await response.json();
        const data = response.data;
        console.log("Airline logo API response: ", data);

        const logoMap = data.data.reduce((acc, curr) => {
            acc[curr.airline_code] = curr.airline_log;
            return acc;
        }, {});

        return airlineCodes.map(code => logoMap[code] || null);
    } catch (error) {
        console.log("error", error);
        console.error('Error fetching airline logos:', error);
        return airlineCodes.map(() => null);
    }
};






// userdetails api call 