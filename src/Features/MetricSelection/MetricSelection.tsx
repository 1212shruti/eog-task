import { makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { createSelector } from 'redux-starter-kit';
import { Provider, useQuery } from 'urql';
import { client } from '../../constants';
import { IState } from '../../store';
import { actions } from './reducer';

type Option = {
  label: string;
  value: string
};

const useStyles = makeStyles({
  select: {
    margin: '16px 100px',
  },
});

const query = `
query {
  getMetrics
}
`;

export const getMetricSelectOptions = createSelector(
  (state: IState) => state.metric.metrics,
  (metrics: Array<string>) => metrics.map((metric: string) => ({ label: metric, value: metric })) 
)

export const getSelectedMetrics = createSelector(
  (state: IState) => state.metric.selectedMetrics,
  (metrics: Array<string>) => metrics.map((metric: string) => ({ label: metric, value: metric })) 
)

export default () => {
  return (
    <Provider value={client}>
      <MetricSelection />
    </Provider>
  );
};

const MetricSelection = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const options: Array<Option> = useSelector(getMetricSelectOptions);
  const selectedValues: Array<Option> = useSelector(getSelectedMetrics);

  const [{ data, error }] = useQuery({
    query,
  });

  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricDataRecevied(getMetrics));
  }, [dispatch, data, error]);

  const onChange = (opts: any) => {
    dispatch(actions.metricsSelected(opts.map(({ value }: Option) => value )));
  }

  return (
    <Select
      closeMenuOnSelect={false}
      onChange={onChange}
      options={options}
      value={selectedValues}
      isMulti
      className={classes.select}
    />
  )

};
