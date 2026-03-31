const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SERPAPI_KEY = process.env.SERPAPI_KEY || 'SUA_CHAVE_SERPAPI_AQUI';

app.post('/api/search-flights', async (req, res) => {
  const { origin, destination, days, tripType, returnDays } = req.body;

  if (!origin || !destination || !days) {
    return res.status(400).json({ error: 'Parâmetros inválidos.' });
  }

  const isRoundTrip = tripType === 'roundtrip';
  const results = [];
  const today   = new Date();

  for (let i = 0; i < parseInt(days); i++) {
    const outDate = new Date(today);
    outDate.setDate(today.getDate() + i);
    const outDateStr = outDate.toISOString().split('T')[0];

    let url;

    if (isRoundTrip) {
      const retDate = new Date(outDate);
      retDate.setDate(outDate.getDate() + (parseInt(returnDays) || 7));
      const retDateStr = retDate.toISOString().split('T')[0];

      // type=1 = round trip, requires return_date
      url = `https://serpapi.com/search.json?engine=google_flights` +
            `&departure_id=${origin}&arrival_id=${destination}` +
            `&outbound_date=${outDateStr}&return_date=${retDateStr}` +
            `&type=1&currency=BRL&hl=pt&api_key=${SERPAPI_KEY}`;
    } else {
      // type=2 = one way
      url = `https://serpapi.com/search.json?engine=google_flights` +
            `&departure_id=${origin}&arrival_id=${destination}` +
            `&outbound_date=${outDateStr}` +
            `&type=2&currency=BRL&hl=pt&api_key=${SERPAPI_KEY}`;
    }

    try {
      const response = await fetch(url);
      const data     = await response.json();

      if (data.error) {
        results.push({ date: outDateStr, error: data.error });
        continue;
      }

      const allFlights = [
        ...(data.best_flights   || []),
        ...(data.other_flights  || []),
      ];

      if (!allFlights.length) {
        results.push({ date: outDateStr, flights: [], cheapest: null });
        continue;
      }

      const flightList = allFlights.map(f => {
        const leg = f.flights?.[0] || {};
        return {
          price:        f.price,
          airline:      leg.airline         || 'N/A',
          flightNumber: leg.flight_number   || 'N/A',
          departure:    leg.departure_airport?.time || 'N/A',
          arrival:      leg.arrival_airport?.time  || 'N/A',
          duration:     f.total_duration,
          stops:        f.layovers?.length  || 0,
        };
      }).sort((a, b) => a.price - b.price);

      results.push({
        date:     outDateStr,
        flights:  flightList,
        cheapest: flightList[0],
      });

    } catch (err) {
      results.push({ date: outDateStr, error: err.message });
    }
  }

  // Overall cheapest across all days
  const overallCheapest = results
    .filter(r => r.cheapest)
    .sort((a, b) => a.cheapest.price - b.cheapest.price)[0] || null;

  res.json({ results, overallCheapest });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✈️  FlightBot v3 rodando em http://localhost:${PORT}`);
});
