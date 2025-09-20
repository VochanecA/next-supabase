'use client';

import { Stethoscope, Clipboard, Activity, Microscope, Pill, Apple, CheckCircle2 } from 'lucide-react';

// This is a static, dummy component based on the provided design.
// All state, functions, and external dependencies for logic have been removed.
export default function DummyMedicalAnalysisDashboard() {

  // Dummy data to display in the results section
  const dummyAnalysis = {
    diagnosis: 'Akutni bronhitis s komplikacijama',
    therapy: [
      'Azitromicin 500mg, 1 tableta dnevno 3 dana',
      'Acetilcistein 600mg, 1 šumeća tableta dnevno',
      'Ibuprofen 400mg, po potrebi za snižavanje temperature',
    ],
    dietary: [
      'Povećan unos tekućine (voda, čajevi)',
      'Vitamin C iz svježeg voća (limun, naranče)',
      'Lako probavljiva hrana (juhe, kuhano povrće)',
    ],
    behavioral: [
      'Izbjegavati pušenje i zagađen zrak',
      'Mirovanje i dovoljno sna',
      'Redovito provjetravanje prostorije',
      'Izbjegavati fizičke napore',
    ],
    risks: [
      { label: 'Sekundarna bakterijska infekcija', severity: 7 },
      { label: 'Dehidracija', severity: 4 },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-rose-600 to-pink-600 text-transparent bg-clip-text">
          AI Analiza Laboratorijskih i Radioloških Nalaza
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clipboard className="w-5 h-5 mr-2 text-rose-500" />
              Laboratorija i testovi
            </h2>
            <textarea placeholder="Unesite rezultate krvne analize" className="w-full p-2 rounded-md border min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            <textarea placeholder="Unesite rezultate briseva i bakterioloških testova" className="w-full p-2 rounded-md border min-h-[100px] mt-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Microscope className="w-5 h-5 mr-2 text-rose-500" />
              Radiološki nalazi
            </h2>
            <textarea placeholder="Opis MR nalaza" className="w-full p-2 rounded-md border min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500" />
            <textarea placeholder="Opis CT nalaza" className="w-full p-2 rounded-md border min-h-[100px] mt-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Stethoscope className="w-5 h-5 mr-2 text-rose-500" />
            Simptomi
          </h2>
          <textarea placeholder="Unesite simptome pacijenta" className="w-full p-2 rounded-md border min-h-[120px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-500" />
        </div>

        <button
          className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-semibold shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          Analiziraj medicinske podatke
        </button>

        {/* Dummy Results Section */}
        <div className="mt-10">
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-rose-500" />
                Dijagnoza
              </h2>
              <p>{dummyAnalysis.diagnosis}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-rose-500" />
                  Terapija (EU lijekovi)
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {dummyAnalysis.therapy.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
                <h2 className="text-xl font-bold mb-2 flex items-center">
                  <Apple className="w-5 h-5 mr-2 text-rose-500" />
                  Preporučena ishrana
                </h2>
                <ul className="list-disc list-inside space-y-1">
                  {dummyAnalysis.dietary.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700">
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-rose-500" />
                Ponašanje i oporavak
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {dummyAnalysis.behavioral.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
