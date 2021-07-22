import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type MeasurementResponse = {
  metric: string;
  measurements: Measurement;
}

export type Measurement = {
  at: any;
  value: number;
  metric: string;
  unit: string;
}

export type InitialState = {
  measurements: Record<string, Array<Measurement>>
}

const initialState: InitialState = {
  measurements: {},
};

const slice = createSlice({
  name: 'measurement',
  initialState,
  reducers: {
    measurementDataRecevied: (state, action: PayloadAction<Array<MeasurementResponse>>) => {
      state.measurements = action.payload.reduce((obj: Record<string, any>, item) => {
        obj[item.metric] = item.measurements;
        return obj;
      }, {});
    },
    measurementApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    newMeasurementRecieved : (state, action: PayloadAction<Measurement>) => {
      const existingMetric = state.measurements[action.payload.metric];
      if(existingMetric) {
        existingMetric.push(action.payload);
      }
    }
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
