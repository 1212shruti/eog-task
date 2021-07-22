import { Container, makeStyles } from '@material-ui/core';
import ReactECharts from 'echarts-for-react';
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Provider, useQuery } from "urql";
import { client } from "../../constants";
import { IState } from "../../store";
import { calcThirtyMinutesPastTime } from "../../utils";
import { actions } from "./reducer";

const useStyles = makeStyles({
  chart: {
    height: '70% !important',
    margin: '20px 100px',
  },
  noData: {
    height: '70% !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

export default () => {
  return (
    <Provider value={client}>
      <MetricChart />
    </Provider>
  );
};

export const getSelectedMetricsNames = (state: IState) => state.metric.selectedMetrics;

export const getChartData = (state: IState) => state.measurement.measurements;

const MetricChart = () => {
  const dispatch = useDispatch();
  const metrics = useSelector(getSelectedMetricsNames);
  const chartData = useSelector(getChartData);
  const classes = useStyles();

  useEffect(() => {
    fetchMeasurements();
  }, [metrics]);

  const [{ data }, fetchMeasurements] = useQuery(
    {
      query,
      variables: {
        input: metrics.map(metricName => ({ metricName, after: calcThirtyMinutesPastTime() }))
      },
      pause: true
    },
  );

  useEffect(
    () => {
      if (!data) return;
      const { getMultipleMeasurements } = data;
      dispatch(actions.measurementDataRecevied(getMultipleMeasurements))
    },
    [data]
  );
  if (Object.values(chartData).length === 0) {
    return <Container className={classes.noData}>No Metric Seleced</Container>;
  }

  const options = {
    grid: { top: 8, right: 8, bottom: 24, left: 36 },
    xAxis: {
      type: 'category',
      data: Object.values(chartData)[0].map(({ at }) => moment(at).format('HH:mm')),
      label: 'Time',
    },
    yAxis: {
      type: 'value',
      label: 'Pressure/Temperature'
    },
    series: Object.keys(chartData).map((key: string) => {
      const data = chartData[key];
      return ({
        data: data.map(({ value }) => value),
        type: 'line',
        smooth: true,
        name: key,
      })
    }),
    tooltip: {
      trigger: 'axis',
    },
    legend: {},
  };

  return (
      <ReactECharts option={options} className={classes.chart} />
  );

};
