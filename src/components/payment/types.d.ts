declare type StripeElementTypes = "cardNumber" | "cardExpiry" | "cardCvc";

declare type StripeError = {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

declare type Quote = {
  id: string;
  submission_id: string;
  status: string;
  product: string;
  premium: {
    annual: number;
    monthly?: number;
    currency: string;
    taxesSurcharges: number;
  };
  product_details: {
    identifier: string;
    country: string;
    type: string;
    insurer: string;
  };
};

declare type PaymentPayload = {
  quote_id: string;
  paymentType: string;
  carrier: string;
  productType: string;
  premium: number;
  currency: string;
};

declare type SummaryItem = {
  frequency: string;
  quote: Quote;
  transactionFee?: number;
  premiumAmount: number;
  taxesSurcharges: number;
};
