import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsInfo } from '../order-details-info';
import { OrderDetailsItems } from '../order-details-item';
import { OrderDetailsToolbar } from '../order-details-toolbar';
import { OrderDetailsHistory } from '../order-details-history';

// ----------------------------------------------------------------------

export function OrderDetailsView({ order }) {
  const [status, setStatus] = useState(order?.status);

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink={paths.dashboard.order.root}
        orderNumber={order?.order_id}
        createdAt={order?.order_date}
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />

      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={[
                ...(order?.order_data?.quick_meals ?? []),
                ...(order?.order_data?.repeating_meals ?? []),
                ...(order?.order_data?.live_counter_meals ?? []),
              ]}
              totalAmount={order?.total_price}
            />
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <OrderDetailsInfo
            customer={order?.customer}
            delivery={order?.company_name}
            payment={order?.payment}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
