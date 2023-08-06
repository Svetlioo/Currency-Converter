// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

import { useEffect, useState } from "react";

export default function App() {
  const [error, setError] = useState("");
  const [query, setQuery] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        setError("");
        try {
          if (fromCurrency === toCurrency) {
            throw new Error("Choose different type of currency.");
          }
          const response = await fetch(
            `https://api.frankfurter.app/latest?amount=${query}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );
          const data = await response.json();
          if (!response.ok) {
            throw new Error("Something went wrong with fetching movies");
          }
          console.log(data);
          console.log(data["rates"][toCurrency]);
          setResult(data["rates"][toCurrency]);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err);
          }
        }
      }
      fetchData();
      return function () {
        controller.abort();
      };
    },
    [query, fromCurrency, toCurrency]
  );

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(Number(e.target.value))}
      />
      <select
        value={fromCurrency}
        onChange={(e) => setFromCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={toCurrency}
        onChange={(e) => setToCurrency(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {!error && (
        <p>
          OUTPUT : {query} {fromCurrency} is{" "}
          <strong>
            {result} {toCurrency}
          </strong>
        </p>
      )}
      {error && <p>Error : {error.message}</p>}
    </div>
  );
}
//`https://api.frankfurter.app/latest?amount=${query}&from=${fromCurrency}&to=${toCurrency}`;
