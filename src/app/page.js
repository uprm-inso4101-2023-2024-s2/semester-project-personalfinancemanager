'use client'
import React, {useState} from 'react';
import RenderBarChart from "./barChart";
import theNothinger from "./somethingElse";

export default function Home() {
  const [showBarChart, setShowBarChart] = useState(false);

  const toggleChange = () => {
      setShowBarChart(!showBarChart);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="  group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
        <button onClick={toggleChange}>{showBarChart ? 'Show Nothing' : 'Show Bar Chart'}</button>
      </div>
      {showBarChart ? <RenderBarChart /> : <theNothinger />}

      
    </main>
  );
}
