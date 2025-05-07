import React, { useState, useMemo, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import findoraLogo from './assets/findora.png';

import {
  Box,
  Container,
  TextField,
  IconButton,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  CardMedia
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Findora from 'findora';


const theme = createTheme();

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [elapsed, setElapsed] = useState(0);


  const findora = useMemo(() => new Findora(), []);

  useEffect(() => {
      let timer;

      if (loading) {
        setElapsed(0);
        timer = setInterval(() => {
          setElapsed((prev) => parseFloat((prev + 0.1).toFixed(1)));
        }, 100);
      } else {
        clearInterval(timer);
      }

      return () => clearInterval(timer);
    }, [loading]);


  const handleSearch = async () => {
      if (!query.trim()) return;
      setLoading(true);
      setSubmitted(true);
      setResults([]);

      try {
        const result = await findora.search(query);
        setResults(result);
      } catch (err) {
        console.error('Error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };


  const generateImageUrl = (url) => {
    const mainDomain = url.split('/')[2];
    const encodedUrl = encodeURIComponent(url);
    return `https://image.thum.io/get/crop/600/width/400/maxAge/0/allowJPG/https://${mainDomain}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box display="flex" flexDirection="column" minHeight="100vh">
          <Container
              maxWidth="md"
              sx={{
                mt: submitted ? 2 : '25vh',
                transition: 'margin-top 0.3s ease-in-out',
              }}
            >
              {!submitted && (
                <Box
                  component="img"
                  src={findoraLogo}
                  alt="Findora"
                  sx={{
                    display: 'block',
                    height: 240,
                    mx: 'auto',
                    mb: 4,
                    transition: 'all 0.3s ease',
                  }}
                />
              )}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={1}
            sx={{ width: '100%' }}
          >
            {submitted && (
              <Box
                component="img"
                src={findoraLogo}
                alt="Findora mini"
                sx={{
                  height: 96,
                  width: 'auto',
                  transition: 'all 0.3s ease',
                }}
              />
            )}
            <TextField
              fullWidth
              placeholder="Search something..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              disabled={loading}
            />

            <IconButton color="primary" onClick={handleSearch} disabled={loading}>
              <SearchIcon />
            </IconButton>
          </Box>

        {loading && (
          <Box mt={4} textAlign="center">
            <CircularProgress />
            <Typography variant="body2" mt={1}>
              Loading... {elapsed.toFixed(1)}s
            </Typography>
          </Box>
        )}

        {!loading && results.length > 0 && (
          <Grid container spacing={2} mt={4} justifyContent="center">
            {results.slice(0, 10).map((item, index) => (
              <Grid item key={index}>
                <Card sx={{ width: 400 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={generateImageUrl(item.url)}
                    loading="lazy"
                    alt={item.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        {item.name}
                      </a>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

        )}
      </Container>

      {/* Footer fixed to bottom if content is short */}

      <Box component="footer" textAlign="center" py={2}>
        <Typography variant="body2" color="text.secondary">
          © 2025 <strong>Findora.dev</strong> &nbsp;·&nbsp; Created by{' '}
          <a
            href="https://www.linkedin.com/in/eugene-evstafev-716669181/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eugene Evstafev
          </a>
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          <a
            href="https://www.npmjs.com/package/findora"
            target="_blank"
            rel="noopener noreferrer"
          >
            NPM Package
          </a>
          &nbsp;|&nbsp;
          <a
            href="https://pypi.org/project/findora/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PyPI Package
          </a>
        </Typography>
      </Box>
    </Box>
    </ThemeProvider>
  );
}
