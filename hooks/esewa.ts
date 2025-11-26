import axios from "axios";
import api from "./axios";

export interface EsewaPayload {
  amount: string;
  failure_url: string;
  product_delivery_charge: string;
  product_service_charge: string;
  product_code: string;
  signature: string;
  signed_field_names: string;
  success_url: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
}

export async function initiateEsewaPayment(payload: EsewaPayload) {
  try {
    const response = await api.get("/transaction/esewa-init?price=" + payload.amount, );
    console.log(response);
    if (response.status === 200) {
    //   window.location.href = response.data.url;
    }
  } catch (error) {
    console.error("Error initiating Esewa payment:", error);
  }
}
