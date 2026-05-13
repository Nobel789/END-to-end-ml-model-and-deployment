'use client';

import { useMemo, useState } from 'react';

const initialState = {
  temperature: 25,
  humidity: 50,
  windspeed: 12,
  holiday: 'no',
  workingday: 'yes'
};

function estimateDemand({ temperature, humidity, windspeed, holiday, workingday }) {
  const tempScore = Number(temperature) * 18;
  const humidityPenalty = Number(humidity) * 5;
  const windPenalty = Number(windspeed) * 7;
  const holidayPenalty = holiday === 'yes' ? 220 : 0;
  const workdayBonus = workingday === 'yes' ? 180 : 0;

  const raw = 900 + tempScore + workdayBonus - humidityPenalty - windPenalty - holidayPenalty;
  return Math.max(0, Math.round(raw));
}

export default function BikeDemandForm() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(initialState);

  const output = useMemo(() => estimateDemand(submitted), [submitted]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => {
      const next = { ...previous, [name]: value };

      // A holiday cannot also be a working day in this simplified UI model.
      if (name === 'holiday' && value === 'yes') {
        next.workingday = 'no';
      }

      if (name === 'workingday' && value === 'yes') {
        next.holiday = 'no';
      }

      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(form);
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold">Bike Demand Estimator</h1>
      <p className="mt-2 text-slate-600">
        Enter your values below and click <strong>Get Output</strong>. This beginner-friendly demo uses a simple formula
        to estimate bike demand.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Temperature (°C)</span>
          <input name="temperature" type="number" value={form.temperature} onChange={handleChange} className="rounded-lg border border-slate-300 p-2" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium">Humidity (%)</span>
          <input name="humidity" type="number" value={form.humidity} onChange={handleChange} className="rounded-lg border border-slate-300 p-2" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium">Windspeed (km/h)</span>
          <input name="windspeed" type="number" value={form.windspeed} onChange={handleChange} className="rounded-lg border border-slate-300 p-2" />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium">Holiday?</span>
          <select name="holiday" value={form.holiday} onChange={handleChange} className="rounded-lg border border-slate-300 p-2">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="font-medium">Working day?</span>
          <select
            name="workingday"
            value={form.workingday}
            onChange={handleChange}
            disabled={form.holiday === 'yes'}
            className="rounded-lg border border-slate-300 p-2 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <button type="submit" className="md:col-span-2 rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700">
          Get Output
        </button>
      </form>

      <div className="mt-8 rounded-xl bg-slate-100 p-6">
        <h2 className="text-xl font-semibold">Desired Output</h2>
        <p className="mt-2 text-slate-700">Estimated bike demand: <span className="font-bold">{output}</span> rentals</p>
      </div>
    </div>
  );
}
