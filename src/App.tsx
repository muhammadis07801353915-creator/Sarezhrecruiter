import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CVForm } from './pages/candidate/CVForm';
import { JobForm } from './pages/employer/JobForm';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import './lib/i18n';
import { useDataStore } from './store/dataStore';

export default function App() {
  const fetchData = useDataStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="submit-cv" element={<CVForm />} />
          <Route path="post-job" element={<JobForm />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
