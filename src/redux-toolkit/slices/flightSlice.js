// import { createSlice } from "@reduxjs/toolkit";
// import { getFlightList } from "../../components/flight/FlightSearch";
// const initialState = {
//     // loading: false,
//     flightSearchData: null,
//     flightFareQuoteData: null,
//     // error: null,
//     // success: false,
// };

// const flightSlice = createSlice({
//     name: "flightSlice",
//     initialState,
//     reducers: {
//         // addToCart: (state, count) => {
//         //     console.log("state", state, count);
//         //     state.cartCount = state.cartCount + 1;
//         // },
//         // removeFromCart: (state) => {
//         //     state.cartCount = state.cartCount - 1;
//         // },
//     },
//     extraReducers: (builder) => {
//         builder

//             // ==============flight search api response ============
//             .addCase(getFlightList.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(getFlightList.fulfilled, (state, { payload }) => {
//                 const data = {...payload}
//                 console.log("data", data);
//                 const firstResult = data?.Results?.[0]?.[0];
//                 if (firstResult && firstResult.FareDataMultiple?.[0]) {
//                     const { SrdvIndex, ResultIndex, IsLCC } = firstResult.FareDataMultiple[0];
//                     const { TraceId, SrdvType } = data;
//                     // localStorage.setItem("F-SrdvIndex", SrdvIndex);
//                     // localStorage.setItem("F-ResultIndex", ResultIndex);
//                     // localStorage.setItem("F-TraceId", TraceId);
//                     // localStorage.setItem("F-SrdvType", SrdvType);
//                     // localStorage.setItem("F-IsLcc", IsLCC);
//                     state.flightSearchData = {
//                         SrdvIndex: SrdvIndex,
//                         ResultIndex: ResultIndex,
//                         TraceId: TraceId,
//                         SrdvType: SrdvType,
//                         IsLCC: IsLCC,
//                         logoMap:data.logoMap
//                     }

//                 } else {
//                     console.log("SrdvIndex or FareDataMultiple not found");
//                 }

//                 // state.loading = false;
//                 // state.success = true;
//                 // state.cartCount = payload?.cart_count;
//             })
//             .addCase(getFlightList.rejected, (state, { payload }) => {
//                 state.loading = false;
//                 state.error = payload;
//             })

//             // ==============flight farequote api response ============
//             // .addCase(getFlightList.pending, (state) => {
//             //     state.loading = true;
//             //     state.error = null;
//             // })
//             // .addCase(getFlightList.fulfilled, (state, { payload }) => {
//             //     const data = {...payload}
//             //     console.log("data", data);
//             //     const firstResult = data?.Results?.[0]?.[0];
//             //     if (firstResult && firstResult.FareDataMultiple?.[0]) {
//             //         const { SrdvIndex, ResultIndex, IsLCC } = firstResult.FareDataMultiple[0];
//             //         const { TraceId, SrdvType } = data;
//             //         // localStorage.setItem("F-SrdvIndex", SrdvIndex);
//             //         // localStorage.setItem("F-ResultIndex", ResultIndex);
//             //         // localStorage.setItem("F-TraceId", TraceId);
//             //         // localStorage.setItem("F-SrdvType", SrdvType);
//             //         // localStorage.setItem("F-IsLcc", IsLCC);
//             //         state.flightSearchData = {
//             //             SrdvIndex: SrdvIndex,
//             //             ResultIndex: ResultIndex,
//             //             TraceId: TraceId,
//             //             SrdvType: SrdvType,
//             //             IsLCC: IsLCC,
//             //             logoMap:data.logoMap
//             //         }

//             //     } else {
//             //         console.log("SrdvIndex or FareDataMultiple not found");
//             //     }

//             //     // state.loading = false;
//             //     // state.success = true;
//             //     // state.cartCount = payload?.cart_count;
//             // })
//             // .addCase(getFlightList.rejected, (state, { payload }) => {
//             //     state.loading = false;
//             //     state.error = payload;
//             // })
//     },
// });

// // export const { addToCart, removeFromCart } = cartSlice.actions;
// export default flightSlice.reducer;
