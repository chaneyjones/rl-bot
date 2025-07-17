import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Use env var from Render
const API_KEY = process.env.TRACKER_API_KEY;
// Replace with your actual platform + username
const USER_ID = 'epic/YOUR_USERNAME'; // or steam/12345678 or psn/YOUR_NAME

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://public-api.tracker.gg/v2/rocket-league/standard/profile/${USER_ID}`,
      {
        headers: {
          'TRN-Api-Key': API_KEY
        }
      }
    );

    const segments = response.data.data.segments;
    const twos = segments.find(p => p.metadata.name === 'Ranked Doubles 2v2');

    if (!twos) {
      return res.send("No 2v2 MMR found.");
    }

    const mmr = twos.stats.rating.value;
    const tier = twos.stats.tier.metadata.name;
    res.send(`2v2 MMR: ${mmr} (${tier})`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send("Error fetching Rocket League MMR.");
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
