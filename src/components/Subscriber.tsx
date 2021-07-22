import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, useQuery, useSubscription } from "urql";
import { client } from '../constants';
import { getSelectedMetricsNames } from '../Features/MetricChart/MetricChart';
import { actions } from '../Features/MetricChart/reducer';

const query = `
subscription {
  newMeasurement {
    unit
    at,
    metric,
    value,
  }
}
`;

export default () => {
  return (
    <Provider value={client}>
      <Subscriber />
    </Provider>
  );
};

const Subscriber = () => {
  const dispatch = useDispatch();

  const chartData = useSelector(getSelectedMetricsNames);

  const [{ data }] = useSubscription({ query });

  useEffect(
    () => {
      if(Object.keys(chartData).length === 0) return;
      
      if (!data) return;
      const { newMeasurement } = data;
      dispatch(actions.newMeasurementRecieved(newMeasurement));
    },
    [dispatch, data]
  );

  return null;
};
