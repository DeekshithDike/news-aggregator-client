// src/pages/PreferencesPage.js
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AuthNavbar from "../components/AuthNavbar";

// Hardcoded default source options
const SOURCE_OPTIONS = ["New York Times", "The Guardian", "NewsAPI"];

function PreferencesPage() {
  const navigate = useNavigate();
  
  // For sources: using hardcoded options
  const [defaultSources, setDefaultSources] = useState([]);
  // For authors: options come from API
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [defaultAuthors, setDefaultAuthors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Authentication check
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch available authors and saved preferences
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        
        // Fetch available authors from API
        const authorsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/preferences/author/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });        
        setAvailableAuthors(authorsRes.data.results);

        // Fetch saved default sources from API
        const prefSourcesRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/preferences/source`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (prefSourcesRes.data.defaultSources) {
          setDefaultSources(prefSourcesRes.data.defaultSources);
        }

        // Fetch saved default authors from API
        const prefAuthorsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/preferences/author`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (prefAuthorsRes.data.defaultAuthors) {
          setDefaultAuthors(prefAuthorsRes.data.defaultAuthors);
        }
      } catch (err) {
        console.error("Failed to fetch data or preferences", err);
        setError("Failed to load available options or your preferences.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const token = Cookies.get("token");
      // Save default sources
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/preferences/source`,
        { defaultSources },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Save default authors
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/preferences/author`,
        { defaultAuthors },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/news"); // Redirect after saving
    } catch (err) {
      console.error("Failed to save preferences", err);
      setError("Failed to save your preferences.");
    }
  };

  if (loading) {
    return (
      <>
        <AuthNavbar />
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <AuthNavbar />
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Preferences
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Default Sources (hardcoded options) */}
          <FormControl>
            <InputLabel id="default-sources-label">Default Sources</InputLabel>
            <Select
              labelId="default-sources-label"
              multiple
              value={defaultSources}
              onChange={(e) => setDefaultSources(e.target.value)}
              input={<OutlinedInput label="Default Sources" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {SOURCE_OPTIONS.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Default Authors (fetched from API) */}
          <FormControl>
            <InputLabel id="default-authors-label">Default Authors</InputLabel>
            <Select
              labelId="default-authors-label"
              multiple
              value={defaultAuthors}
              onChange={(e) => setDefaultAuthors(e.target.value)}
              input={<OutlinedInput label="Default Authors" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {availableAuthors.map((author) => (
                <MenuItem key={author.author} value={author.author}>
                  {author.author}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleSave}>
            Save Preferences
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default PreferencesPage;
