import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const COMPANY_STATUS_OPTIONS = [
  // { value: 'completed', label: 'Completed' },
];

const ITEMS = [...Array(3)].map((_, index) => ({
  domain: _mock.domain(index),
  name: _mock.productName(index),
  address :_mock.address(index),
  pocName: _mock.pocName(index),
  pocContact: _mock.pocContacts(index),
}));

export const _company = [...Array(20)].map((_, index) => {
  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const domain = _mock.domain(index);

  const address = _mock.address(index);

  const pocName = _mock.pocName(index);

  const pocContact= _mock.pocContacts(index);

  const customer = {
    name: _mock.fullName(index),
    email: _mock.email(index),
  };

  return {
    items,
    customer,
    address,
    pocName,
    pocContact,
    domain,
   };
});
