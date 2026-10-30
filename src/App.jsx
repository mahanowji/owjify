import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import MuiThemeBridge from './context/MuiThemeBridge';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import ScrollToTop from './routes/ScrollToTop';
import AppRoutes from './routes/AppRoutes';
import ToastContainer from './components/common/ToastContainer';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <MuiThemeBridge>
          <ToastProvider>
            <AuthProvider>
              <MarketplaceProvider>
                <ScrollToTop />
                <AppRoutes />
                <ToastContainer />
              </MarketplaceProvider>
            </AuthProvider>
          </ToastProvider>
        </MuiThemeBridge>
      </LanguageProvider>
    </BrowserRouter>
  );
}
