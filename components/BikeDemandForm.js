'use client';

import { useMemo, useState } from 'react';

const initialState = {
  placeName: '',
  placeDescription: '',
  temperature: 25,
  humidity: 50,
  windspeed: 12,
  holiday: 'no',
  workingday: 'yes'
};

function getPlaceAdjustment(placeName) {
  const normalized = placeName.trim().toLowerCase();
  if (!normalized) return 0;

  const hash = normalized
    .split('')
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return (hash % 181) - 90;
}

function estimateDemand({ placeName, temperature, humidity, windspeed, holiday, workingday }) {
  const tempScore = Number(temperature) * 18;
  const humidityPenalty = Number(humidity) * 5;
  const windPenalty = Number(windspeed) * 7;
  const holidayPenalty = holiday === 'yes' ? 220 : 0;
  const workdayBonus = workingday === 'yes' ? 180 : 0;
  const placeAdjustment = getPlaceAdjustment(placeName);

  const raw = 900 + tempScore + workdayBonus - humidityPenalty - windPenalty - holidayPenalty + placeAdjustment;
  return Math.max(0, Math.round(raw));
}

export default function BikeDemandForm() {
  const [form, setForm] = useState(initialState);
  const [submissions, setSubmissions] = useState([]);

  const latestSubmission = submissions[0] || initialState;
  const output = useMemo(() => estimateDemand(latestSubmission), [latestSubmission]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const submission = {
      ...form,
      placeName: form.placeName.trim(),
      placeDescription: form.placeDescription.trim()
    };

    setSubmissions((previous) => [submission, ...previous].slice(0, 5));
  }

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-bold">Bike Demand Estimator</h1>
      <p className="mt-2 text-slate-600">
        Add weather details with a place name and short description, then click <strong>Get Output</strong> to compare
        how different places get different bike rental predictions.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="font-medium">Place name</span>
          <input
            name="placeName"
            type="text"
            placeholder="Example: Central Park"
            value={form.placeName}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 p-2"
            required
          />
        </label>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="font-medium">Short place description</span>
          <textarea
            name="placeDescription"
            rows={3}
            maxLength={120}
            placeholder="Example: Busy city park area near bike lanes"
            value={form.placeDescription}
            onChange={handleChange}
            className="rounded-lg border border-slate-300 p-2"
            required
          />
        </label>

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
          <select name="workingday" value={form.workingday} onChange={handleChange} className="rounded-lg border border-slate-300 p-2">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <button type="submit" className="md:col-span-2 rounded-lg bg-slate-900 p-3 font-semibold text-white hover:bg-slate-700">
          Get Output
        </button>
      </form>

      <div className="mt-8 rounded-xl bg-slate-100 p-6">
        <h2 className="text-xl font-semibold">Latest Prediction</h2>
        {submissions.length === 0 ? (
          <p className="mt-2 text-slate-700">Submit a place and weather data to see the estimated bike demand.</p>
        ) : (
          <>
            <p className="mt-2 text-slate-700">
              <span className="font-semibold">Place:</span> {latestSubmission.placeName}
            </p>
            <p className="mt-1 text-slate-700">
              <span className="font-semibold">Description:</span> {latestSubmission.placeDescription}
            </p>
            <p className="mt-2 text-slate-700">
              Estimated bike demand: <span className="font-bold">{output}</span> rentals
            </p>
          </>
        )}
      </div>

      {submissions.length > 1 && (
        <div className="mt-6 rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold">Recent place predictions</h3>
          <ul className="mt-3 space-y-3">
            {submissions.map((entry, index) => (
              <li key={`${entry.placeName}-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">{entry.placeName}</span>: {estimateDemand(entry)} rentals
                </p>
                <p className="text-slate-600">{entry.placeDescription}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
