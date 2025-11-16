// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import BaseLayout from './components/BaseLayout';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Assets from './pages/Assets';
import Profile from './pages/Profile';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Bonus from './pages/Bonus';
import AuthPage from './auth/signin';
import { CurrencyProvider } from './contexts/CurrencyContext';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Trading from './components/Trading';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (

    <Routes>
      {/* Public route */}
      <Route path="/" element={<AuthPage />} />
      
      {/* Protected routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <BaseLayout>
            <Home />
          </BaseLayout>
        </ProtectedRoute>
      } />
      <Route path="/wallet" element={
        <ProtectedRoute>
          <BaseLayout>
            <Wallet />
          </BaseLayout>
        </ProtectedRoute>
      } />
      <Route path="/assets" element={
        <ProtectedRoute>
          <BaseLayout>
            <Assets />
          </BaseLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <BaseLayout>
            <Profile />
          </BaseLayout>
        </ProtectedRoute>
      } />
      <Route path="/deposit" element={
        <ProtectedRoute>
          <BaseLayout>
            <Deposit />
          </BaseLayout>
        </ProtectedRoute>
      } />
      <Route path="/withdraw" element={
        <ProtectedRoute>
          <BaseLayout>
            <Withdraw />
          </BaseLayout>
        </ProtectedRoute>
      } />
      <Route path="/bonus" element={
        <ProtectedRoute>
          <BaseLayout>
            <Bonus />
          </BaseLayout>
        </ProtectedRoute>
      } />
      <Route path="/trading/:pairId?" element={
        <ProtectedRoute>
          <BaseLayout>
            <Trading />
          </BaseLayout>
        </ProtectedRoute>
      } />


      <Route path="/about" element={
        <ProtectedRoute>
          <BaseLayout>
        <AboutUs />
        </BaseLayout>
        </ProtectedRoute>
        } />
        <Route path="/contact" element={
        <ProtectedRoute>
          <BaseLayout>
        <Contact />
        </BaseLayout>
        </ProtectedRoute>
        } />
        <Route path="/faqs" element={
        <ProtectedRoute>
          <BaseLayout>
        <FAQs />
        </BaseLayout>
        </ProtectedRoute>
        } />
        <Route path="/terms" element={
        <ProtectedRoute>
          <BaseLayout>
        <TermsConditions />
        </BaseLayout>
        </ProtectedRoute>
        } />
        <Route path="/privacy" element={
        <ProtectedRoute>
          <BaseLayout>
        <PrivacyPolicy />
        </BaseLayout>
        </ProtectedRoute>
        } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
        <AppRoutes />
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import BaseLayout from './components/BaseLayout';
// import Home from './pages/Home';
// import Wallet from './pages/Wallet';
// import Assets from './pages/Assets';
// import Profile from './pages/Profile';
// import Deposit from './pages/Deposit';
// import Withdraw from './pages/Withdraw';
// import Bonus from './pages/Bonus';
// import AuthPage from './auth/signin';
// import { CurrencyProvider } from './contexts/CurrencyContext';
// import Trading from './components/Trading';
// import AboutUs from './pages/AboutUs';
// import PrivacyPolicy from './pages/PrivacyPolicy';
// import TermsConditions from './pages/TermsConditions';
// import FAQs from './pages/FAQs';
// import Contact from './pages/Contact';

// // Check if we're in development mode
// const IS_DEV = import.meta.env.MODE === 'development' || import.meta.env.DEV;

// // Demo user data for testing
// const DEMO_USER = {
//   id: "1",
//   name: "Demo User", 
//   email: "demo@pesadash.com",
//   phone_number: "+254712345678",
//   created_at: new Date().toISOString()
// };

// // Protected Route component
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
  
//   // For testing: always render children, skip authentication
//   if (IS_DEV) {
//     return <>{children}</>;
//   }
  
//   // Production behavior
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
//       </div>
//     );
//   }
  
//   return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
// };

// // Component to handle auto-redirect in development
// const AppRoutes = () => {
//   const { isAuthenticated } = useAuth();
//   const location = useLocation();
  
//   // Auto-redirect to home if in development and on root path
//   if (IS_DEV && location.pathname === '/') {
//     return <Navigate to="/home" replace />;
//   }

//   return (
//     <Routes>
//       {/* Public route - only show in production */}
//       {!IS_DEV && (
//         <Route path="/" element={<AuthPage />} />
//       )}
      
//       {/* Protected routes */}
//       <Route path="/home" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Home />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/wallet" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Wallet />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/assets" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Assets />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/profile" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Profile />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/deposit" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Deposit />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/withdraw" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Withdraw />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/bonus" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Bonus />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />
//       <Route path="/trading/:pairId?" element={
//         <ProtectedRoute>
//           <BaseLayout>
//             <Trading />
//           </BaseLayout>
//         </ProtectedRoute>
//       } />


//       <Route path="/about" element={
//         <ProtectedRoute>
//           <BaseLayout>
//         <AboutUs />
//         </BaseLayout>
//         </ProtectedRoute>
//         } />
//         <Route path="/contact" element={
//         <ProtectedRoute>
//           <BaseLayout>
//         <Contact />
//         </BaseLayout>
//         </ProtectedRoute>
//         } />
//         <Route path="/faqs" element={
//         <ProtectedRoute>
//           <BaseLayout>
//         <FAQs />
//         </BaseLayout>
//         </ProtectedRoute>
//         } />
//         <Route path="/terms" element={
//         <ProtectedRoute>
//           <BaseLayout>
//         <TermsConditions />
//         </BaseLayout>
//         </ProtectedRoute>
//         } />
//         <Route path="/privacy" element={
//         <ProtectedRoute>
//           <BaseLayout>
//         <PrivacyPolicy />
//         </BaseLayout>
//         </ProtectedRoute>
//         } />
         
      
//       {/* Catch all route */}
//       <Route path="*" element={<Navigate to={IS_DEV ? "/home" : "/"} replace />} />
//     </Routes>
//   );
// };

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <CurrencyProvider>
//         <AppRoutes />
//         </CurrencyProvider>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;