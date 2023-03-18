import "./App.css";
import LoadingFallback from "./components/LoadingFallback";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AudioRecorder from "./components/AudioRecorder";
let Dashboard = lazy(()=> import('./components/Dashboard'));
let ImageGrid = lazy(()=> import('./components/ImageGrid'));
let IndeterminateCheckbox = lazy(()=> import('./components/IndeterminateCheckbox'));


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Suspense fallback={<LoadingFallback />}><Dashboard /></Suspense>}>
          <Route path="/" element={<Suspense fallback={<LoadingFallback />}><ImageGrid /></Suspense>} />
          <Route path="checktree" element={<IndeterminateCheckbox />} />
          <Route path="recorder" element={<AudioRecorder/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
