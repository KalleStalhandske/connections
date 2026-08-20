import { Navigate, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { PlayBrowsePage } from './pages/PlayBrowsePage';
import { GamePage } from './pages/GamePage';
import { CreatePage } from './pages/CreatePage';

function App() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/play" replace />} />
        <Route path="/play" element={<PlayBrowsePage />} />
        <Route path="/play/:id" element={<GamePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="*" element={<Navigate to="/play" replace />} />
      </Routes>
    </div>
  );
}

export default App;
