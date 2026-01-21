  import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from './stores/authStore'

import Login from './pages/Login';
import Register from './pages/Register';
import BrokerDashboard from './pages/BrokerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MarketerDashboard from './pages/MarketerDashboard';
//import LeadMarketplace from './pages/LeadMarketplace';
import LeadDetail from './pages/LeadDetail';
import DealRegister from './pages/DealRegister';
import AdminLeadVerification from './pages/AdminLeadVerification';
import AdminDealReview from './pages/AdminDealReview';
import axios from 'axios';

function App() {
  const { user, checkAuth } = useAuthStore();
    const [leads, setLeads] = useState([]);
  const fetchLeads = async () => {
    try {
      const res = await axios.get('http://localhost:3001/leads/marketplace',{
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
      setLeads(res.data);
    } catch (error) {
      console.error('Failed to fetch leads', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);
  const path =`/deals/register/6970b52d03fd253b57743ca8`;
  useEffect(() => {
    checkAuth();
  }, []);

  if (user === undefined) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}

          {/* Protected - Role based */}
          {user && (
            <>
              <Route path="/" element={
                user.role === 'broker' ? <BrokerDashboard /> :
                user.role === 'admin' ? <AdminDashboard /> :
                user.role === 'marketer' ? <MarketerDashboard /> :
                <Navigate to="/login" replace />
              } />

             {user.role === 'broker' && (
  <>
    <Route path="/leads/detail" element={<LeadDetail />} />
    <Route path="/deals/register/:6970b52d03fd253b57743ca8" element={<DealRegister />} />
  </>
)}

{user.role === 'admin' && (
  <>
    <Route path="/admin/verify-leads" element={<AdminLeadVerification />} />
    <Route path="/admin/deals" element={<AdminDealReview />} />
  </>
)}

              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;