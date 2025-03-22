import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { _orders } from 'src/_mock/_order';
import { CONFIG } from 'src/config-global';

import { OrderDetailsView } from 'src/sections/order/view';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from 'src/utils/api';
import { LoadingScreen } from 'src/components/loading-screen';
import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `Order details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.superAdminAuth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log(id);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/superAdmin/fetch_particular_order/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(response.data.data);
      } catch (err) {
        setError('Failed to fetch order details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, token]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <NotFoundView />;
  }
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderDetailsView order={Array.isArray(order) ? order[0] || {} : {}} />
    </>
  );
}
