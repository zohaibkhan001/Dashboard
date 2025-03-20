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

  const [userData, setUserData] = useState({
    user: null,
    orders: null,
    transactions: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, ordersRes, transactionsRes] = await Promise.all([
          api.get(`/superAdmin/fetch_particular_customer/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/superAdmin/fetch_particular_user_order/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/superAdmin/fetch_particular_customer_transaction/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserData({
          user: userRes.data.data,
          orders: ordersRes.data.data,
          transactions: transactionsRes.data.data,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setUserData({ user: null, orders: null, transactions: null });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <UserDetailsVew
        user={userData.user}
        orders={userData.orders}
        transactions={userData.transactions}
      />
    </>
  );
}
