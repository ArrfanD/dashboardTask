import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
let Dashboard = lazy(()=> import('./components/Dashboard'))
let ImageGrid = lazy(()=> import('./components/ImageGrid'))
let IndeterminateCheckbox = lazy(()=> import('./components/IndeterminateCheckbox'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Suspense><Dashboard /></Suspense>}>
          <Route path="/" element={<ImageGrid />} />
          <Route path="checktree" element={<IndeterminateCheckbox />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
