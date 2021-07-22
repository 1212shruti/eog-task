import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricReducer } from '../Features/MetricSelection//reducer';
import { reducer as measurementReducer } from '../Features/MetricChart/reducer';

export default {
  weather: weatherReducer,
  metric: metricReducer,
  measurement: measurementReducer
};
