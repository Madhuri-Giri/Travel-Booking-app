SrdvType: SrdvType,
transaction_num: transaction_num,
transaction_id: transaction_id,
SrdvIndex: SrdvIndexValue,
TraceId: TraceId,
ResultIndex: ResultIndexValue,
Title: "Mr",
FirstName: Passenger.firstName,
LastName: Passenger.LastName,
PaxType: 1,
DateOfBirth: Passenger.dob,
Gender: "1",
PassportNo: null,
PassportExpiry: "",
PassportIssueDate: "",
AddressLine1: Passenger.address,
City: "Delhi",
CountryCode: "IN",
CountryName: "INDIA",
ContactNo: Passenger.Mobile,
Email: Passenger.Email,
IsLeadPax: 1,
BaseFare: BaseFare,
Tax: Tax,
YQTax: YQTax,
TransactionFee: TransactionFee,
AdditionalTxnFeeOfrd: AdditionalTxnFeeOfrd,
AdditionalTxnFeePub: AdditionalTxnFeePub,
AirTransFee: AirTransFee,





SrdvType: SrdvType,
        SrdvIndex: SrdvIndexValue,
        TraceId: TraceId,
        ResultIndex: ResultIndexValue,
        "Passengers": [
          {
            "Title": "Mr",
            "FirstName": Passenger.firstName,
            "LastName": Passenger.LastName,
            "PaxType": 1,
            "DateOfBirth": `${Passenger.dob}T00:00:00`,
            "Gender": "1",
            "PassportNo": "abc123456",
            "PassportExpiry": "2031-03-12T00:00:00",
            "AddressLine1": Passenger.address,
            "City": "Noida",
            "CountryCode": "IN",
            "CountryName": "INDIA",
            "ContactNo": Passenger.Mobile,
            "Email": Passenger.Email,
            "IsLeadPax": 1,
            "Fare": [
              {
                "Currency": Currency,
                "BaseFare": BaseFare,
                "Tax": Tax,
                "YQTax": YQTax,
                "OtherCharges": OtherCharges,
                "TransactionFee": TransactionFee,
                "AdditionalTxnFeeOfrd": AdditionalTxnFeeOfrd,
                "AdditionalTxnFeePub": AdditionalTxnFeePub,
                "AirTransFee": AirTransFee,
                "Discount": Discount,
                "PublishedFare": PublishedFare,
                "OfferedFare": OfferedFare,
                "CommissionEarned": CommissionEarned,
                "TdsOnCommission": TdsOnCommission









