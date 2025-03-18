import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { _userList } from 'src/_mock/_user';
import { UserDetailsVew } from 'src/sections/user/view';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from 'src/utils/api';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const metadata = { title: `User Details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.superAdminAuth);

  const [transactions, setTransactions] = useState(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [orders, setOrders] = useState(null);
  const [orderLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!id || !token) return;

    const getTransactions = async () => {
      setTransactionsLoading(true);
      try {
        const response = await api.get(`/superAdmin/fetch_particular_customer_transaction/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTransactions(response.data.data);
      } catch (error) {
        console.error('Error fetching customer transactions:', error);
        setTransactions(null);
      } finally {
        setTransactionsLoading(false);
      }
    };

    getTransactions();
  }, [id, token]);

  useEffect(() => {
    if (!id || !token) return;

    const getCustomerOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await api.get(`/superAdmin/fetch_particular_user_order/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
        setOrders(null);
      } finally {
        setOrdersLoading(false);
      }
    };

    getCustomerOrders();
  }, [id, token]);

  console.log(transactions);
  console.log(orders);

  if (orderLoading || transactionsLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserDetailsVew orders={orders} transactions={transactions} />
    </>
  );
}
