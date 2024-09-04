const fareQuoteHandler = async () => {
  setLoading(true);

  const FtraceId = localStorage.getItem('F-TraceId');
  const FresultIndex = localStorage.getItem('F-ResultIndex');
  const FsrdvType = localStorage.getItem('F-SrdvType');
  const FsrdvIndex = localStorage.getItem('F-SrdvIndex');

  if (!FtraceId || !FresultIndex || !FsrdvType || !FsrdvIndex) {
      console.error('TraceId, ResultIndex, SrdvType, or SrdvIndex not found in local storage');
      setLoading(false);
      return;
  }

  const payload = {
      SrdvIndex: FsrdvIndex,
      ResultIndex: FresultIndex,
      TraceId: parseInt(FtraceId),
      SrdvType: FsrdvType,
  };

  try {
      const response = await fetch('https://sajyatra.sajpe.in/admin/api/farequote', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('FareQuote API Response:', data);

      const fare = data.Results?.Fare || {};

      // Save all fare details in local storage
      localStorage.setItem('BaseFare', fare.BaseFare);
      localStorage.setItem('YQTax', fare.YQTax);
      localStorage.setItem('Tax', fare.Tax);
      localStorage.setItem('AdditionalTxnFeeOfrd', fare.AdditionalTxnFeeOfrd);
      localStorage.setItem('AdditionalTxnFeePub', fare.AdditionalTxnFeePub);
      localStorage.setItem('AirTransFee', fare.AirTransFee);
      localStorage.setItem('OtherCharges', fare.OtherCharges);
      localStorage.setItem('TransactionFee', fare.TransactionFee);
      localStorage.setItem('Currency', fare.Currency);
      localStorage.setItem('CommissionEarned', fare.CommissionEarned);
      localStorage.setItem('Discount', fare.Discount);
      localStorage.setItem('TdsOnCommission', fare.TdsOnCommission);
      localStorage.setItem('PublishedFare', fare.PublishedFare);         
      localStorage.setItem('OfferedFare', fare.OfferedFare)


      if (data.Results && formData) {
          setLoading(false);
          setTimeout(() => {
              navigate('/flight-Farequote', { state: { fareData: data.Results, formData: formData } });
          }, 1000);
      } else {
          console.error('data.Results or formData is undefined');
          setLoading(false);
      }
  } catch (error) {
      console.error('Error calling the farequote API:', error);
      setLoading(false);
  }
};