declare module 'khalti-checkout-web' {
  interface KhaltiCheckoutConfig {
    publicKey: string;
    productIdentity: string;
    productName: string;
    productUrl?: string;
    eventHandler: {
      onSuccess(payload: { token: string; amount: number }): void;
      onError?(error: any): void;
      onClose?(): void;
    };
    paymentPreference?: string[];
  }

  interface KhaltiCheckout {
    new (config: KhaltiCheckoutConfig): KhaltiCheckout;
    show(options: { amount: number }): void;
  }

  const KhaltiCheckout: KhaltiCheckout;
  export default KhaltiCheckout;
}
