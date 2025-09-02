
import { Routes, Route, Outlet } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { CalendarPage } from './pages/CalendarPage';
import { PlaceholderPage } from './pages/PlaceholderPage';


const AppLayout = () => (
  <div className="h-screen w-screen bg-white font-sans flex flex-col">
    <main className="flex-grow overflow-hidden">
      <Outlet /> 
    </main>
    <BottomNav />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<CalendarPage />} />
        <Route path="home" element={<PlaceholderPage title="Home" />} />
        <Route path="search" element={<PlaceholderPage title="Search" />} />
        <Route path="add" element={<PlaceholderPage title="Add New" />} />
        <Route path="profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Route>
    </Routes>
  );
}

export default App;