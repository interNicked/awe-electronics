import AddressForm from '@/lib/components/AddressForm';
import CartCard from '@/lib/components/cards/CartCard';

export function CheckoutPage() {
  return (
    <>
      <CartCard />
      <AddressForm />
    </>
  );
}

export default CheckoutPage;
