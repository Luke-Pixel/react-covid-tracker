import  React, {useState, useEffect}from 'react';
import './App.css';
import {MenuItem, FormControl, Select, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map'
import Table from './Table'
import {sortData} from './util'
import LineGraph from './LineGraph'
import Warning from './Warning'
import 'leaflet/dist/leaflet.css'
import {prettyPrintStat} from './util'
import numeral from 'numeral'

function App() {

  const [countries, setCountries ] = useState([])

  const [country, setCountry] = useState(['worldwide'])

  const [countryInfo, setCountryInfo] = useState([])

  const [tableData, setTableData] = useState([])

  const [mapCenter, setMapCenter] = useState( { lat: 34.80746, lng: -40.4796 } )

  const [mapZoom, setMapZoom] = useState(3)

  const [mapCountries, setMapCountries] = useState([])

  const [casesType, setCasesType] = useState("cases")


  
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
      if(countryCode === 'worldwide'){
        setMapCenter([34.80746, -40.4796])
        setMapZoom(2)
      }else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        console.log( data.countryInfo.lat)
        console.log(data.countryInfo.long)
        setMapZoom(4)
      }
    })
  }

  console.log('country', countryInfo)

  return (
    <div className='app-wrapper'>
      <div className="app">
        <div className='app_left'>
          <div className='app_header'>
            <h1>Covid-19 Tracker</h1>
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
            <InfoBox 
            isRed
            active={casesType ==='cases'}
            onClick={e => setCasesType('cases')} 
            title='Todays Cases' 
            total={numeral(countryInfo.cases).format()} 
            cases={prettyPrintStat(countryInfo.todayCases)}/>

            <InfoBox 
            active={casesType === 'recovered'}
            onClick={e => setCasesType('recovered')} 
            title='Todays Recooveries' 
            total={numeral(countryInfo.recovered).format()} 
            cases={prettyPrintStat(countryInfo.todayRecovered)}/>

            <InfoBox 
            isRed
            active={casesType === 'deaths'}
            onClick={e => setCasesType('deaths')} 
            title='Todays Deaths' 
            total={numeral(countryInfo.deaths).format()} 
            cases={prettyPrintStat(countryInfo.todayDeaths)}/>
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
                  <h3>Worldwide new {casesType}</h3>
                  <br/>
                  <LineGraph casesType={casesType}/>
            </CardContent>
          </Card>
        </div>      
        
      </div>
      <Warning />
    </div>
  );
}

export default App;
