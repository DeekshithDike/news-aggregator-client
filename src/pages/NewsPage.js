// src/pages/NewsPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AuthNavbar from "../components/AuthNavbar";

// Helper function to format the date to "15 Feb 2025 15:38"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const SOURCE_OPTIONS = ["New York Times", "The Guardian", "NewsAPI"];

function NewsPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter states: search, date, and source (single selection)
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState(""); // single selection

  // Check authentication
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/news`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNews(response.data.results);
      } catch (err) {
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Handler to open URL in new tab
  const handleOpenNews = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Filtering logic:
  // - Search: title contains the search term.
  // - Date: if provided, compare local date in "YYYY-MM-DD" format.
  // - Source: if a source is selected, map the selected value to the expected backend value.
  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDate = true;
    if (dateFilter) {
      const publishedDate = new Date(item.published_at).toLocaleDateString("en-CA");
      matchesDate = publishedDate === dateFilter;
    }

    let matchesSource = true;
    if (sourceFilter) {
      const lowerSource = item.source.toLowerCase();
      let expectedSource = "";
      if (sourceFilter === "NewsAPI") expectedSource = "newsapi.org";
      else if (sourceFilter === "The Guardian") expectedSource = "guardianapis.com";
      else if (sourceFilter === "New York Times") expectedSource = "nytimes.com";
      matchesSource = lowerSource === expectedSource;
    }

    return matchesSearch && matchesDate && matchesSource;
  });

  return (
    <>
      <AuthNavbar />
      <Container maxWidth="md" sx={{ mt: 3 }}>
        <Typography variant="h3" gutterBottom>
          News
        </Typography>

        {/* Combined Filter Row */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
          mb={2}
        >
          <TextField
            label="Search by Title"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel id="source-select-label">Source</InputLabel>
            <Select
              labelId="source-select-label"
              value={sourceFilter}
              label="Source"
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {SOURCE_OPTIONS.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          {filteredNews.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card>
                <CardActionArea onClick={() => handleOpenNews(item.url)}>
                  {item.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Published at: {formatDate(item.published_at)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Source: {item.source}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {filteredNews.length === 0 && !loading && (
            <Grid item xs={12}>
              <Alert severity="info">No news items match your criteria.</Alert>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default NewsPage;
