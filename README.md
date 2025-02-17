# News Aggregator Application - Installation Guide

This guide provides step-by-step instructions to set up React frontend for the News Aggregator application.

---

## Frontend (React.js)

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 16.x)
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```sh
   git clone https://github.com/your-repository/news-aggregator-frontend.git
   cd news-aggregator-frontend
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

   or

   ```sh
   yarn install
   ```

3. **Create a **``** file and configure API base URL**

   ```sh
   cp .env.example .env
   ```

   Update `.env` with the API base URL:

   ```env
   REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
   ```

4. **Run the React application**

   ```sh
   npm start
   ```

   or

   ```sh
   yarn start
   ```

   The frontend will be available at `http://localhost:3000`

---

## Additional Notes

- Ensure that both backend and frontend are running concurrently.
- If using Docker, update the `.env` file for both Laravel and React accordingly.
- CORS should be properly handled in Laravel if accessing from a different origin.
- API routes should be prefixed with `/api/` in the frontend requests.

Now your News Aggregator application should be up and running!

