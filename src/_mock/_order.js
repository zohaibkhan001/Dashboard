import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
  // { value: 'pending', label: 'Non-Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

export const COMPANY_STATUS_OPTIONS = [
  // { value: 'pending', label: 'Non-Active' },
  // { value: 'completed', label: 'Completed' },
  // { value: 'cancelled', label: 'Cancelled' },
  // { value: 'refunded', label: 'Refunded' },
];

const ITEMS = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  sku: `16H9UR${index}`,
  quantity: index + 1,
  domain: _mock.domain(index),
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
  price: _mock.number.price(index),
  address :_mock.address(index),
  pocName: _mock.pocName(index),
  pocContact: _mock.pocContacts(index),
}));

export const _orders = [...Array(20)].map((_, index) => {
  const shipping = 10;

  const discount = 10;

  const taxes = 10;

  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const domain = _mock.domain(index);

  const subtotal = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subtotal - shipping - discount + taxes;

  const address = _mock.address(index);

  const pocName = _mock.pocName(index);

  const pocContact= _mock.pocContacts(index);

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    ipAddress: '192.158.1.38',
  };

  const delivery = { shipBy: 'DHL', speedy: 'Standard', trackingNumber: 'SPX037739199373' };

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Delivery successful', time: _mock.time(1) },
      { title: 'Transporting to [2]', time: _mock.time(2) },
      { title: 'Transporting to [1]', time: _mock.time(3) },
      { title: 'The shipping unit has picked up the goods', time: _mock.time(4) },
      { title: 'Order has been created', time: _mock.time(5) },
    ],
  };

  return {
    id: _mock.id(index),
    createdAt: _mock.time(index),
    taxes,
    items,
    history,
    subtotal,
    shipping,
    discount,
    customer,
    delivery,
    address,
    totalAmount,
    totalQuantity,
    pocName,
    pocContact,
    domain,
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: '365-374-4961',
    },
    payment: { cardType: 'mastercard', cardNumber: '**** **** **** 5678' },
    status:
      (index % 2 && 'completed') ||
      (index % 3 && 'refunded') ||
      (index % 4 && 'cancelled') ||
      'completed',
  };
});
