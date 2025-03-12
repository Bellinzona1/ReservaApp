import { useState } from 'react'
import './App.css'
import { useAppContext } from './store/appContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return <AppRoutes />;
}

export default App
