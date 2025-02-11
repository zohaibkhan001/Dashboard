import { useState } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import {
  _analyticTasks,
  _analyticTraffic,
} from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { AppWelcome } from 'src/sections/overview/app/app-welcome';

import { useMockedUser } from 'src/auth/hooks';

import { AnalyticsTasks } from '../analytics-tasks';
import { CompanyControls } from '../company-controls';
import { NewLocationDialog } from '../new-location-view';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';





// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { user } = useMockedUser();


  const [open, setOpen] = useState(false);
  const [openCompanyControls, setOpenCompanyControls] = useState(false);

  return (
    <DashboardContent maxWidth="xl">
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          Aarogyatech 👋
        </Typography>

        <div style={{ display: 'flex', width: '40%', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" width={12} sx={{ ml: -0.5 }} />}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              py: '1rem',
              px: '1rem',
              marginTop: '-2rem',
              fontSize: '10px',
              '&:hover': {
                backgroundColor: 'black',
                opacity: '80%',
              },
            }}
          >
            New Meal
          </Button>

          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" width={12} sx={{ ml: -0.5 }} />}
            onClick={() => setOpen(true)}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              py: '1rem',
              px: '1rem',
              marginTop: '-2rem',
              fontSize: '10px',
              '&:hover': {
                backgroundColor: 'black',
                opacity: '80%',
              },
            }}
          >
            New Location
          </Button>

          <NewLocationDialog open={open} onClose={() => setOpen(false)} />

          <Button
            size="small"
            color="inherit"
            onClick={() => setOpenCompanyControls(true)}
            sx={{
              backgroundColor: '#FFAB00',
              color: 'white',
              py: '1rem',
              px: '1rem',
              marginTop: '-2rem',
              fontSize: '10px',
              '&:hover': {
                backgroundColor: '#FFAB00',
                opacity: '80%',
              },
            }}
          >
            Company Controls
          </Button>

          <CompanyControls open={openCompanyControls} onClose={() => setOpenCompanyControls(false)} />


        </div>
      </div>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Users"
            total={719}
            icon={
              <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-bag.svg`} />
            }
            chart={{}}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Orders"
            total={719}
            color="warning"
            icon={
              <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-buy.svg`} />
            }
            chart={{}}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Reviews"
            total={719}
            color="secondary"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
              />
            }
            chart={{}}
          />
        </Grid>



        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Total Meal Items"
            total={719}
            color="error"
            icon={
              <img
                alt="icon"
                src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-message.svg`}
              />
            }
            chart={{}}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'America', value: 3500 },
                { label: 'Asia', value: 2500 },
                { label: 'Europe', value: 1500 },
                { label: 'Africa', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <Card sx={{ height: '64vh' }}>
            <CardHeader title="Dashboard Banners" />
            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" width={18} sx={{ ml: -0.5 }} />}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                py: '1rem',
                px: '2rem',
                marginTop: '-3rem',
                marginLeft: '31rem',
                '&:hover': {
                  backgroundColor: 'black',
                  opacity: '80%',
                },
              }}
            >
              Add New
            </Button>
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '2rem' }}>
              <AppWelcome
                title={`Welcome back 👋 \n ${user?.displayName}`}
                img={<SeoIllustration hideBackground />}
                style={{ width: '90%' }}
              />

              <AppWelcome
                title={`Welcome back 👋 \n ${user?.displayName}`}
                img={<SeoIllustration hideBackground />}
                style={{ width: '90%' }}
              /></section>
          </Card>


        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Card sx={{ height: '64vh' }}>
            <CardHeader title="Company Banners" titleTypographyProps={{ variant: 'subtitle2', sx: { fontSize: '14px' } }} />
            <Button
              size="small"
              color="inherit"
              startIcon={<Iconify icon="mingcute:add-line" width={12} sx={{ ml: -0.5 }} />}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                py: '1rem',
                px: '1rem',
                marginTop: '-3rem',
                marginLeft: '13rem',
                fontSize: '10px',
                '&:hover': {
                  backgroundColor: 'black',
                  opacity: '80%',
                },
              }}
            >
              Add New
            </Button>
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '2.5rem' }}>

              <div style={{ backgroundColor: '#F89C8B', width: '90%', height: '20vh', borderRadius: '1rem' }}><SeoIllustration hideBackground sx={{ width: '65%', marginLeft: '3rem' }} /></div>

              <div style={{ backgroundColor: '#F2C84C', width: '90%', height: '20vh', borderRadius: '1rem' }}><SeoIllustration hideBackground sx={{ width: '65%', marginLeft: '3rem' }} /></div>
            </section>
          </Card>
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite title="Traffic by site" list={_analyticTraffic} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_analyticTasks} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
