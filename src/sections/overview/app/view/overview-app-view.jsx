import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';
import { Iconify } from 'src/components/iconify';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppWelcome } from '../app-welcome';
import { AppNewInvoice } from '../app-new-invoice';
import { AppTopAuthors } from '../app-top-authors';
import { AppTopRelated } from '../app-top-related';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';
import { AppTopInstalledCountries } from '../app-top-installed-countries';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`Welcome back 👋 \n ${user?.displayName}`}
            img={<SeoIllustration hideBackground />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <div style={{backgroundImage: `url('/assets/sunny.jpg')`,backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', width: '90%', height: '20vh', borderRadius: '1rem', display: 'flex', flexDirection: 'row'}}>
            <div className='leftSide' style={{display: 'flex', flexDirection: 'column', width: '30%',justifyContent: 'center'}}>
              <h1 style={{fontSize:'3.5rem', fontWeight:'100', marginLeft: '1.3rem', color: 'black'}}>27&deg;</h1>
              </div>
            <div className='rightSide' style={{color: 'black', display: 'flex', flexDirection: 'column', width: '70%',justifyContent: 'center'}}>
              <p style={{fontSize:'0.8rem', margin: '0 2.2rem'}}>Tuesday, 10 February</p>
              <p style={{fontSize:'0.8rem',margin: '0 2.2rem'}}>Bangalore</p>
              </div>
          </div>
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total active users"
            total={18765}
            chart={{}}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Companies"
            total={4876}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Orders"
            percent={-0.1}
            total={678}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Total Food Items"
            total={18765}
            chart={{}}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Today's Delivered Orders"
            total={4876}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <AppWidgetSummary
            title="Today's Online Payments"
            total={678}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentDownload
            title="Guest Meal Order"
            subheader="5 new orders"
            chart={{
              series: [
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppAreaInstalled
            title="Total No. of Orders"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    { name: '', data: [12, 10, 18, 22, 20, 12, 8, 21, 20, 14, 15, 16] },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    { name: '', data: [6, 18, 14, 9, 20, 6, 22, 19, 8, 22, 8, 17] },
                  ],
                },
                {
                  name: '2024',
                  data: [
                    { name: '', data: [6, 20, 15, 18, 7, 24, 6, 10, 12, 17, 18, 10] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} lg={8}>
          <AppNewInvoice
            title="New invoice"
            tableData={_appInvoices}
            headLabel={[
              { id: 'id', label: 'Invoice ID' },
              { id: 'category', label: 'Category' },
              { id: 'price', label: 'Price' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopRelated title="Related applications" list={_appRelated} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top installed countries" list={_appInstalled} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTopAuthors title="Top authors" list={_appAuthors} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <AppWidget
              title="Conversion"
              total={38566}
              icon="solar:user-rounded-bold"
              chart={{ series: 48 }}
            />

            <AppWidget
              title="Applications"
              total={55566}
              icon="fluent:mail-24-filled"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          {/* <AnalyticsNews title="Dashboard Banners" list={_analyticPosts} /> */}
          <Card sx={{height: '64vh'}}>
            <CardHeader title="Dashboard Banners" />
            <Button
          size="small"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" width={18} sx={{ ml: -0.5 }}/>}
          // startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          sx={{
            // display: 'flex',
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
<section style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '2rem'}}>
            <AppWelcome
                      title={`Welcome back 👋 \n ${user?.displayName}`}
                      img={<SeoIllustration hideBackground />}
                      style={{width: '90%'}}
                    />

          <AppWelcome
                      title={`Welcome back 👋 \n ${user?.displayName}`}
                      img={<SeoIllustration hideBackground />}
                      style={{width: '90%'}}
                    /></section>
          </Card>
          
          
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          {/* <AnalyticsOrderTimeline title="Order timeline" list={_analyticOrderTimeline} /> */}
          <Card sx={{height: '64vh'}}>
            <CardHeader title="Company Banners" titleTypographyProps={{ variant: 'subtitle2', sx: { fontSize: '14px' } }}  />
            <Button
          size="small"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" width={12} sx={{ ml: -0.5 }}/>}
          // startIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          sx={{
            // display: 'flex',
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
<section style={{display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center', marginTop: '2.5rem'}}>
            
            <div style={{backgroundColor: '#F89C8B', width: '90%', height: '20vh', borderRadius: '1rem'}}><SeoIllustration hideBackground sx={{width: '65%', marginLeft: '3rem'}} /></div>
                    
            <div style={{backgroundColor: '#F2C84C', width: '90%', height: '20vh', borderRadius: '1rem'}}><SeoIllustration hideBackground sx={{width: '65%', marginLeft: '3rem'}} /></div>
                    </section>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
