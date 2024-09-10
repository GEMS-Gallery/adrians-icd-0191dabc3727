import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Container, Grid, Typography, Card, CardContent, CircularProgress, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TokenMetrics {
  price: number;
  marketCap: number;
  circulatingSupply: number;
}

interface NetworkStats {
  canisters: number;
  subnets: number;
  nodes: number;
}

interface GovernanceData {
  activeProposals: number;
  totalNeurons: number;
}

interface HistoricalDataPoint {
  timestamp: number;
  price: number;
  canisters: number;
}

const App: React.FC = () => {
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [governanceData, setGovernanceData] = useState<GovernanceData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      await backend.updateDashboard();
      const [tokenMetricsResult, networkStatsResult, governanceDataResult, historicalDataResult] = await Promise.all([
        backend.getTokenMetrics(),
        backend.getNetworkStats(),
        backend.getGovernanceData(),
        backend.getHistoricalData()
      ]);

      if ('ok' in tokenMetricsResult) {
        setTokenMetrics({
          price: tokenMetricsResult.ok[0],
          marketCap: tokenMetricsResult.ok[1],
          circulatingSupply: tokenMetricsResult.ok[2]
        });
      }

      if ('ok' in networkStatsResult) {
        setNetworkStats({
          canisters: networkStatsResult.ok[0],
          subnets: networkStatsResult.ok[1],
          nodes: networkStatsResult.ok[2]
        });
      }

      if ('ok' in governanceDataResult) {
        setGovernanceData({
          activeProposals: governanceDataResult.ok[0],
          totalNeurons: governanceDataResult.ok[1]
        });
      }

      setHistoricalData(historicalDataResult.map(([timestamp, price, canisters]) => ({
        timestamp: Number(timestamp),
        price: Number(price),
        canisters: Number(canisters)
      })));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const chartData = {
    labels: historicalData.map(d => new Date(d.timestamp / 1000000).toLocaleDateString()),
    datasets: [
      {
        label: 'ICP Price',
        data: historicalData.map(d => d.price),
        borderColor: '#4E7DE9',
        backgroundColor: 'rgba(78, 125, 233, 0.5)',
      },
      {
        label: 'Canisters',
        data: historicalData.map(d => d.canisters),
        borderColor: '#00FFA3',
        backgroundColor: 'rgba(0, 255, 163, 0.5)',
      }
    ]
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          ICP Dashboard
        </Typography>
        <Button variant="contained" color="primary" onClick={fetchData} style={{ marginBottom: '20px' }}>
          Refresh Data
        </Button>
        <Grid container spacing={3}>
          {tokenMetrics && (
            <>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      ICP Price
                    </Typography>
                    <Typography variant="h5" component="h2">
                      ${formatNumber(tokenMetrics.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Market Cap
                    </Typography>
                    <Typography variant="h5" component="h2">
                      ${formatNumber(tokenMetrics.marketCap)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Circulating Supply
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {formatNumber(tokenMetrics.circulatingSupply)} ICP
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
          {networkStats && (
            <>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Canisters
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {formatNumber(networkStats.canisters)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Subnets
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {formatNumber(networkStats.subnets)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Nodes
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {formatNumber(networkStats.nodes)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
          {governanceData && (
            <>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Active Proposals
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {formatNumber(governanceData.activeProposals)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Neurons
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {formatNumber(governanceData.totalNeurons)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Historical Data
                </Typography>
                <Line data={chartData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default App;
