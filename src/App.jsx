// App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Dashboard } from './pages/Dashboard';
import { Toaster } from "react-hot-toast";
import { Join } from './pages/Join';
import { Discover } from './pages/Discover';
import { ProblemDetail } from './pages/ProblemDetail';
import { PostProblem } from './pages/PostProblem';
import { Profile } from './pages/Profile';
import { Homepage } from './pages/Home';

function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <HashRouter>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Join />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/problem/:id' element={<ProblemDetail />} />
          <Route path='/post-problem' element={<PostProblem />} />
          <Route path='/profile' element={<Profile />} />
          {/* We'll add more routes as we build them */}
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;