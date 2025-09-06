const express = require('express');
const router = express.Router();
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // Import User model to get location

// @route   GET /api/advisor/irrigation
// @desc    Get smart irrigation advice based on user's location and weather
// @access  Private
router.get('/irrigation', authMiddleware, async (req, res) => {
  try {
    // The user's location is available from the authMiddleware
    // req.user is attached by the authMiddleware
    const district = req.user.location.district;
    const state = req.user.location.state;
    
    // Ensure we have a location to query
    if (!district || !state) {
        return res.status(400).json({ message: 'User location not found in profile.' });
    }

    const locationQuery = `${district},${state},IN`;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      // This error will be caught by the catch block
      throw new Error('Weather API key not configured on the server.');
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${locationQuery}&appid=${apiKey}&units=metric`;

    const weatherResponse = await axios.get(weatherUrl);
    const forecast = weatherResponse.data.list;
    
    if (!forecast || forecast.length === 0) {
        return res.status(404).json({ message: 'Weather data not found for the specified location.'})
    }

    // --- Simple Decision Logic ---
    let advice = "General irrigation is recommended as per your crop's schedule.";
    let reason = "The weather forecast shows stable conditions with no significant rain.";
    let icon = 'sun'; // Default icon

    // Check for significant rain in the next 48 hours (16 forecasts * 3 hours per forecast)
    for (let i = 0; i < 16; i++) {
      if (forecast[i].weather[0].main === 'Rain' && forecast[i].rain && forecast[i].rain['3h'] > 3) { // Check for rain over 3mm
        advice = "No need to irrigate for the next 2 days.";
        reason = `Significant rainfall is expected soon (${forecast[i].weather[0].description}). Conserve your water.`;
        icon = 'rain';
        break; // Stop checking once we find significant rain
      }
    }

    // If no significant rain, check for extreme heat
    if (icon === 'sun' && forecast[0].main.temp > 35) {
      advice = "High evaporation expected. Consider irrigating.";
      reason = `The temperature is very high (${Math.round(forecast[0].main.temp)}°C). It's best to water crops early in the morning or late in the evening.`;
      icon = 'thermometer-sun';
    }

    res.json({
      location: weatherResponse.data.city.name,
      temperature: Math.round(forecast[0].main.temp),
      weatherCondition: forecast[0].weather[0].main,
      advice,
      reason,
      icon,
    });

  } catch (err) {
    // Provide more specific error feedback
    console.error('Advisor Error:', err.message);
    if (err.response && err.response.status === 404) {
        return res.status(404).json({ message: 'Could not find weather data for your registered district. Please ensure it is spelled correctly.' });
    }
    res.status(500).json({ message: 'Could not fetch weather data or generate advice at this time.' });
  }
});

module.exports = router;

