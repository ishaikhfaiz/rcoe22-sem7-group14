import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const API_KEY = 'Mju2I2gIdbh74gCTyItu0F4pObyWlpyA'
const API_SECRET = 'EdJxMSq7Hu0VT00J'

const getToken = async () => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
    });
    const { access_token } = response.data;
    return access_token;
  } catch (err) {
    console.log(err);
  };
}

const Deals = () => {
  const [originLocationCode, setOrigin] = useState("");
  const [destinationLocationCode, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [flightOffers, setFlightOffers] = useState([]);
  const [adults, setAdultCount] = useState(0);
  const nonStop = false;
  const currencyCode = 'INR';
  const max = 5;
  const [cityCode, setCityCode] = useState("");
  const radius = 5;
  const radiusUnit = 'KM';
  const [ratings, setRatings] = useState('');
  const hotelSource = 'ALL';
  const [data, setData] = useState([]);
  const [showFlight, setShowFlight] = useState(false);
  const [showHotel, setShowHotel] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const accessToken = await getToken()
    try {
      const response = await axios({
        method: 'get',
        url: 'https://test.api.amadeus.com/v2/shopping/flight-offers',
        params: {
          originLocationCode,
          destinationLocationCode,
          departureDate,
          returnDate,
          adults,
          nonStop,
          currencyCode,
          max,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const { data } = response.data;
      setFlightOffers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const hotelSearch = async (e) => {
    e.preventDefault();
    const accessToken = await getToken();
    try {
      const result2 = await axios({
        method: 'get',
        url: 'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city',
        params: {
          cityCode,
          radius,
          radiusUnit,
          ratings,
          hotelSource
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      });
      const { data } = result2.data;
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className={styles.Pcontainer}>
        <div className={styles.flightContainer}>
          <h1>Flight Search</h1>
          <form className={styles.flighForm} onSubmit={handleSearch}>
            <label className={styles.flightLabel}>
              Source:
              <input className={styles.inputFlights}
                type="text"
                value={originLocationCode}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Enter Source"
                required
              />
            </label >
            <br />
            <label className={styles.flightLabel}>
              Destination:
              <input className={styles.inputFlights}
                type="text"
                value={destinationLocationCode}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter Destination"
                required
              />
            </label>
            <br />
            <label className={styles.flightLabel}>
              Departure Date:
              <input className={styles.inputFlights}
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </label>
            <br />
            <label className={styles.flightLabel}>
              Return Date:
              <input className={styles.inputFlights}
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </label>
            <br />
            <label className={styles.flightLabel}>
              Adult:
              <input className={styles.inputFlights}
                type="number"
                value={adults}
                onChange={(e) => setAdultCount(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit" onClick={(e) => setShowFlight(true)} className={styles.searchBtn}>Search</button>
          </form >
        </div>

        <div className={styles.hotelContainer}>
          <h1>Hotel Search</h1>
          <form className={styles.flighForm} onSubmit={hotelSearch}>
            <label className={styles.flightLabel}>
              City:
            </label>
            <input className={styles.inputFlights}
              type="text"
              value={cityCode}
              onChange={(e) => setCityCode(e.target.value)}
              placeholder="Enter City Name"
              required
            />
            <br />
            <label className={styles.flightLabel}>Hotel Ratings:</label>
            <select className={styles.flightSelect} name="ratings" onChange={(e) => setRatings(e.target.value)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="2">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <br />
            <button type="submit" onClick={(e) => setShowHotel(true)} className={styles.searchBtn}>Search</button>
          </form>
        </div>
        {showFlight && <div className={`${styles.flightResultContainer} ${styles.deal}`}>
          <h2>Flight Deals</h2>
          {(flightOffers.length > 0 && showFlight) ? (
            // <ul style={{ listStyleType: 'none' }}>
            <>
              {
                flightOffers.map((flight, i) => (
                  <>
                    <p className={styles['travel-cost']}>{` ${i + 1}. DEAL`} <br />Travel Cost: ₹{flight.price.total}</p>
                    {flight.itineraries.map((da, index) => (
                      <div className={styles['flight-schedule']}>
                        <h3>{!index ? 'Departure Flight Schedule' : 'Return Flight Schedule'}</h3>
                        <table>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th colSpan="2">Departure From</th>
                              <th colSpan="2">Arrival at</th>
                            </tr>
                          </thead>
                          {da.segments.map((at, j) => {
                            const timeZone = 'Asia/Kolkata';
                            const optionsDate = { timeZone, year: 'numeric', month: 'numeric', day: 'numeric' };
                            const optionsTime = { timeZone, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                            const dateDeparture = new Date(at.departure.at);
                            const dateArrival = new Date(at.arrival.at);
                            const formattedDateDeparture = dateDeparture.toLocaleDateString('en-US', optionsDate);
                            const formattedTimeDeparture = dateDeparture.toLocaleTimeString('en-US', optionsTime);
                            const formattedDateArrival = dateArrival.toLocaleDateString('en-US', optionsDate);
                            const formattedTimeArrival = dateArrival.toLocaleTimeString('en-US', optionsTime);
                            return (
                              <tbody>
                                <tr>
                                  <td>{`${j + 1}`}</td>
                                  <td>{at.departure.iataCode}</td>
                                  <td>{formattedDateDeparture} {formattedTimeDeparture}</td>
                                  <td>{at.arrival.iataCode}</td>
                                  <td>{formattedDateArrival} {formattedTimeArrival}</td>
                                </tr>
                              </tbody>
                            )
                          }
                          )}
                        </table>
                      </div>
                    ))}
                    <br />
                  </>
                ))
              }
              {/* // </ul> */}
            </>
          ) : (
            <p>Loading...</p>
          )
          }</div>
        }
        {showHotel && <div className={`${styles.hotelResultContainer} ${styles.deal}`}>
          <h2>Hotels Available Near Airport</h2>
          <div className={styles['flight-schedule']}>
            <table>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Hotel Name</th>
                  <th>Distance</th>
                </tr>
              </thead>
              {data.length > 0 ? (<>
                {data.map((hotel, index) => (
                  <tbody>
                    <tr>
                      <td>{`${index + 1}`}</td>
                      <td>{hotel.name}</td>
                      <td>{hotel.distance.value}KM</td>
                    </tr>
                  </tbody>
                ))}
              </>) : <p>Loading...</p>}
            </table>
          </div>
        </div>}
      </div>
    </>
  );
}

export default Deals;