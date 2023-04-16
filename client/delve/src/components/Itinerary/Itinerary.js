import React, { useState, useRef, useEffect } from 'react';
import { Grid, TextField, Typography, AppBar } from '@material-ui/core';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useStyles from './styles';


import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPostsBySearch } from '../../actions/posts';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}




const Itinerary = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const query = useQuery();
  const navigate = useNavigate();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);

  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
    } else {
      navigate('/');
    }
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  }

  function handleBudgetChange(event) {
    handleTextChange(event); hideWriter();
    setBudget(event.target.value);
  }

  const handleChange3 = (event, newValue) => {
    setBudget(newValue * 1000);
  };


  const [plc, setPlc] = useState("");

  const [budget, setBudget] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [recommendations, setRecommendations] = useState([]);

  const [season, setSeason] = useState('');
  const [goingWith, setGoingWith] = useState('');
  const [additionalPrefs, setAdditionalPrefs] = useState({});
  const [recommendations1, setRecommendations1] = useState([]);
  const [final_itnr, setfinal_itnr] = useState([]);


  function Typewriter({ text, delay, isTyping }) {
    const [currentText, setCurrentText] = useState("");
    const [index, setIndex] = useState(0);

    function startTyping() {
      setTimeout(() => {
        setCurrentText((prevText) => prevText + text[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, index === 0 ? 100 : delay);
    }

    if (isTyping && index < text.length) {
      startTyping();
    }

    return <div>{currentText}</div>;
  }

  const [showTypewriter, setShowTypewriter] = useState(false);
  const [key, setKey] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  function handleClick() {
    setIsTyping(true);
    setShowTypewriter(true);
    setShowTypewriter1(false)
  }
  function handleTextChange(event) {
    setKey((prevKey) => prevKey + 1);
    setIsTyping(false);
    setShowTypewriter(false)
  }


  function Typewriter1({ text, delay, isTyping1 }) {
    const [currentText1, setCurrentText1] = useState("");
    const [index1, setIndex1] = useState(0);

    function startTyping1() {
      setTimeout(() => {
        setCurrentText1((prevText1) => prevText1 + text[index1]);
        setIndex1((prevIndex1) => prevIndex1 + 1);
      }, index1 === 0 ? 100 : delay);
    }

    if (isTyping1 && index1 < text.length) {
      startTyping1();
    }

    return <div>{currentText1}</div>;
  }

  const [showTypewriter1, setShowTypewriter1] = useState(false);
  const [key1, setKey1] = useState(0);
  const [isTyping1, setIsTyping1] = useState(false);


  function handleClick1() {
    setIsTyping1(true);
    setShowTypewriter(false)
    setShowTypewriter1(true);
  }

  function hideWriter(event) {
    setShowTypewriter(false)
    setShowTypewriter1(false)
  }
  const itineraryText = Object.keys(final_itnr).map((day, index) => {
    const placesText = final_itnr[day].map((place, index) => `- ${place}`).join('\n');
    return `${day}\n${placesText}`;
  }).join('\n\n');


  const recommendationsList = recommendations1.map((recommendation) => `- ${recommendation.name} (score: ${recommendation.score})\n`).join('');


  // const recommendationsList = `<ul>
  //   ${recommendations1.map(
  //   (recommendation) => `<li>${recommendation.name} (score: ${recommendation.score})</li>`
  // ).join('')}
  // </ul>`;


  // const itineraryList = `<ul>
  //   ${Object.keys(final_itnr).map((day, index) => (
  //   `<li key=${index}>
  //   <h3>${day}</h3>
  //   <ul>
  //     ${final_itnr[day].map((place, index) => `<li key=${index}>${place}</li>`).join('')}
  //   </ul>
  // </li>`
  // )).join('')}
  // </ul>`;


  const handleInputChange = (event) => {
    hideWriter();
    const { name, value } = event.target;
    setAdditionalPrefs((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleInterests = async (event) => {
    event.preventDefault();
    const payload = {
      season,
      going_with: goingWith,
      additional_prefs: additionalPrefs,
      budget: budget
    };
    const response = await fetch('http://localhost:7000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setRecommendations1(data);
  };


  const generateItiernary = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:7000/create_itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          search: search
        })
      });

      const data = await response.json();
      setfinal_itnr(data);
    } catch (error) {
      console.error(error);
    }
  };

  // const handleRecommendations = async (e) => {
  //   e.preventDefault();

  //   // Make a POST request to the Flask API
  //   const response = await fetch('http://localhost:7000/recommendation', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       budget: budget,
  //       start_year: startDate.getFullYear(),
  //       start_month: startDate.getMonth() + 1,
  //       start_day: startDate.getDate(),
  //       end_year: endDate.getFullYear(),
  //       end_month: endDate.getMonth() + 1,
  //       end_day: endDate.getDate(),
  //     }),
  //   });

  //   // Parse the response as JSON
  //   const data = await response.json();

  //   // Update the state with the recommendations
  //   setRecommendations(data);
  // };


  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <div className={classes.leftSection}>
            <h2>DELVE YOUR PERSONALIZED ITIERNARY</h2>
            <div>
              <form>
                {/* <Typography id="budget-slider" align="center" gutterBottom>
                  Select your Budget in the range (k)
                </Typography>
                <Box sx={{ width: 450 }}>
                  <Slider
                    aria-label="Always visible"
                    defaultValue={10}
                    getAriaValueText={valuetext}
                    step={5}
                    marks={marks}
                    onChange={() => setBudget({ valuetext })}
                    valueLabelDisplay="on"
                  />
                </Box> */}
              </form>


            </div>

            <div className={classes.bSection}>
              <form onSubmit={handleInterests}>
                <Typography id="budget-slider" gutterBottom>
                  <center><strong>Slide Your Budget in Thousands(k)</strong></center>
                </Typography>
                <Slider
                  aria-label="Budget Slider"
                  value={budget / 1000}
                  min={0}
                  max={100}
                  step={1}
                  onChange={handleChange3}
                  valueLabelDisplay="on"
                />
                {budget && <Typography variant="subtitle1">
                <strong>₹ {budget}</strong>
                </Typography>
                }
                

                <label htmlFor="season">Choose Your Season: </label>
                <ToggleButtonGroup
                  id="season"
                  name="season"
                  value={season}
                  exclusive
                  onChange={(event, value) => { setSeason(value); hideWriter(event); }}
                >
                  <ToggleButton
                    value="summer"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&.Mui-selected': {
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                      },
                    }}
                  >
                    Summer
                  </ToggleButton>
                  <ToggleButton
                    value="winter"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&.Mui-selected': {
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                      },
                    }}
                  >
                    Winter
                  </ToggleButton>
                  <ToggleButton
                    value="monsoon"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&.Mui-selected': {
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                      },
                    }}
                  >
                    Monsoon
                  </ToggleButton>
                </ToggleButtonGroup>


                <br />
                <br />

                <label htmlFor="goingWith">Going with:  </label>
                <ToggleButtonGroup
                  id="goingWith"
                  name="going_with"
                  value={goingWith}
                  onChange={(event, value) => { setGoingWith(value); hideWriter(event); }}
                  exclusive
                >
                  <ToggleButton value="family">
                    Family
                  </ToggleButton>
                  <ToggleButton value="friends">
                    Friends
                  </ToggleButton>
                  <ToggleButton value="romantic">
                    Romantic
                  </ToggleButton>
                  <ToggleButton value="solo">
                    Solo
                  </ToggleButton>
                </ToggleButtonGroup>
                <br />
                <br />

                <label htmlFor="bm">Beaches or mountains: </label>
                <select id="bm" name="bm" value={additionalPrefs.bm || ''} onChange={handleInputChange}>
                  <option value="">--Please choose an option--</option>
                  <option value="beaches">Beaches</option>
                  <option value="mountains">Mountains</option>
                </select>
                <br />
                <br />
                <br />

                <label htmlFor="interest">Purpose of visit: </label>
                <select id="interest" name="interest" value={additionalPrefs.interest || ''} onChange={handleInputChange}>
                  <option value="">--Please choose an option--</option>
                  <option value="adventure">Adventure</option>
                  <option value="sightseeing">Sightseeing</option>
                </select>
                <br />

                <br />

                <Stack>
                  <Button variant="contained" endIcon={<SendIcon />}
                    onClick={handleInterests}
                    onClickCapture={handleClick1}>
                    Recommendation Engine!
                  </Button>
                </Stack>
              </form>
            </div>

            <div className={classes.Delve}>
              <form onSubmit={generateItiernary}>
                <b><label>
                  Enter Place Name: &nbsp;
                  <input type="text" value={search} onChange={event => { setSearch(event.target.value); handleTextChange(event); hideWriter(); }} />&nbsp;&nbsp;
                </label></b>
              </form>
              <div>
                <Button variant="contained" endIcon={<SendIcon />}
                  onClick={generateItiernary}
                  onClickCapture={handleClick}>
                  Delve It!
                </Button>


              </div>

            </div>

            <br />
            {showTypewriter && <Button onClick={searchPost} className={classes.searchButton} variant='contained' color='primary'>Explore Snippets</Button>}
          </div>
        </Grid>

        <Grid item xs={7}>
          <div className={classes.rightSection}>
            <div className={classes.scroll}>

              <Typography>
              Note: The Iternary is Based on Best Possible Match using Machine Learning techniques.
                <pre>
                  {showTypewriter && <Typewriter key={key} text={itineraryText} delay={40} isTyping={isTyping} />}
                </pre>
              </Typography>



              {/* <ul>
                {recommendations.map((rec) => (
                  <li key={rec.id}>
                    {rec.name} : (Minimum Cost: {rec.min_cost} - Maximum Cost: {rec.max_cost})
                  </li>
                ))}
              </ul> */}

              {recommendations1.length > 0 && (
                <div>
                  <Typography>
                    <pre>
                      {showTypewriter1 && <Typewriter1 key1={key1} text={recommendationsList} delay={40} isTyping1={isTyping1} />}
                    </pre>
                  </Typography>
                </div>
              )}






            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
export default Itinerary