import  React, {useState, useEffect}from 'react';
import './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map'
import Table from './Table'
import {sortData} from './util'
import LineGraph from './LineGraph'
import 'leaflet/dist/leaflet.css'

function App() {

  const [countries, setCountries ] = useState([])

  const [country, setCountry] = useState(['worldwide'])

  const [countryInfo, setCountryInfo] = useState([])

  const [tableData, setTableData] = useState([])

  const [mapCenter, setMapCenter] = useState( { lat: 34.80746, lng: -40.4796 } )

  const [mapZoom, setMapZoom] = useState(3)

  const [mapCountries, setMapCountries] = useState([])

  const [casesType, setCasesType] = useState("cases");
  
  useEffect(() =>{
    fetch ('https://disease.sh/v3/covid-19/all')
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data)
        })
   }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch ('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getCountriesData()
  }, []);

  const onCountryChange = async (event)  => {
    const countryCode = event.target.value;
    console.log('c ', countryCode)
    setCountry(countryCode)

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : 
     `https://disease.sh/v3/covid-19/countries/${countryCode}`

     await fetch(url)
     .then(response => response.json())
     .then(data => {
      setCountry(countryCode)
      setCountryInfo(data)

      //update map locatioon
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)
      
     })
  }

  console.log('country', countryInfo)

  return (
    <div className="app">
      <div className='app_left'>
        <div className='app_header'>
          <h1>Covid APP</h1>
          <FormControl className='app_dropdown'>
            <Select
            onChange={onCountryChange}
            variant='outlined'
            value={country}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map( country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='app_stats'>
          <InfoBox title='Todays Cases' total={countryInfo.cases} cases={countryInfo.todayCases}/>
          <InfoBox title='Todays Recooveries' total={countryInfo.recovered} cases={countryInfo.todayRecovered}/>
          <InfoBox title='Todays Deaths' total={countryInfo.deaths} cases={countryInfo.todayDeaths}/>
        </div>  
        <Map 
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />  
      </div>  

      <div className='app_right'>
        <Card>
          <CardContent>
                <h3>Live Cases by Country</h3>
                <Table  countries={tableData}/>
                <br/>
                <h3>Worldwide New Cases</h3>
                <br/>
                <LineGraph />
          </CardContent>
        </Card>
      </div>      
      

    </div>
  );
}

export default App;
