import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';

import client from './api/client';
import { useEffect, useState } from 'react';

type Data = {
  date: string;
  high: number;
  low: number;
  open: number;
  symbol: string;
  volume: number;
  close: number;
};

const getChartOptions = (data: Array<Data>) => {
  let ohlc: Array<Array<string | number>> = [];
  let volume = [];

  for (let i = 0; i < data.length; i++) {
    const date = new Date(data[i].date).toLocaleDateString();
    ohlc.push([
      date, // the date
      data[i].open, // open
      data[i].high, // high
      data[i].low, // low
      data[i].close, // close
    ]);

    volume.push([
      date, // the date
      data[i].volume, // the volume
    ]);
  }

  const options = {
    rangeSelector: {
      buttons: [
        {
          type: 'day',
          count: 3,
          text: '3d',
        },
        {
          type: 'week',
          count: 1,
          text: '1w',
        },
        {
          type: 'month',
          count: 1,
          text: '1m',
        },
        {
          type: 'month',
          count: 6,
          text: '6m',
        },
        {
          type: 'year',
          count: 1,
          text: '1y',
        },
        {
          type: 'all',
          text: 'All',
        },
      ],
      selected: 3,
    },

    title: {
      text: 'AAPL Historical',
    },

    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'OHLC',
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true,
        },
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        title: {
          text: 'Volume',
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2,
      },
    ],

    tooltip: {
      split: true,
    },

    series: [
      {
        type: 'candlestick',
        name: 'AAPL',
        data: ohlc,
        tooltip: {
          valueDecimals: 2,
        },
        // dataGrouping: {
        //   units: groupingUnits,
        // },
      },
      // {
      //   type: 'column',
      //   name: 'Volume',
      //   data: volume,
      //   yAxis: 1,
      //   dataGrouping: {
      //     units: groupingUnits,
      //   },
      // },
    ],
  };
  return options;
};

const App = () => {
  const [data, setData] = useState<Array<Data>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const result = await client({
          endpoint: `eod`,
          query: {
            symbols: 'AAPL',
            date_from: '2020-01-01',
            date_to: moment(new Date()).format('YYYY-MM-DD'),
            limit: 1000,
          },
        });
        setData(result.data);
      } catch (error: any) {
        setIsError(true);
        setErrorMessage(JSON.parse(error).error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isError) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className='align-center'>
      <main>
        <h1>Stock Chart</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={getChartOptions(data)}
            constructorType={'stockChart'}
          />
        )}
      </main>
    </div>
  );
};

export default App;
