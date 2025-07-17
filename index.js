import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.TRACKER_API_KEY;

app.get('/', async (req, res) => {
  const { platform, username } = req.query;

  if (!platform || !username) {
    return res.send('Please provide both ?platform= and ?username=');
  }

  try {
    const encodedUsername = encodeURIComponent(username);
    const response = await axios.get(
      `https://public-api.tracker.gg/v2/rocket-league/standard/profile/${platform}/${encodedUsername}`,
      {
        headers: {
          'TRN-Api-Key': API_KEY
        }
      }
    );

    const segments = response.data.data.segments;
    const twos = segments.find(p => p.metadata.name === 'Ranked Doubles 2v2');

    if (!twos) return res.send(`No 2v2 MMR found for ${username}.`);

    const mmr = twos.stats.rating.value;
    const tier = twos.stats.tier.metadata.name;

    res.send(`${username}'s 2v2 MMR: ${mmr} (${tier})`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send(`Could not fetch MMR for ${username}.`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
