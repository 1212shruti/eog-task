import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type InitialState = {
  metrics: Array<string>
  selectedMetrics: Array<string>
}

const initialState: InitialState = {
  metrics: [],
  selectedMetrics: []
};

const slice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricDataRecevied: (state, action: PayloadAction<Array<string>>) => {
      state.metrics = action.payload;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    metricsSelected: (state, action: PayloadAction<Array<string>>) => {
      state.selectedMetrics = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
