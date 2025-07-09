import { BrowserRouter, Routes, Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate, useLocation } from "react-router-dom";
import About from "./pages/Dashboard";
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { clearAuth, isTokenValid } from "./lib/auth";
import DetailHome from "./pages/DetailHome";
import Ocupant from "./pages/Ocupant";
import DuesType from "./pages/DuesType";
import Payment from "./pages/Payment";
import Expense from "./pages/Expense";
import Report from "./pages/Report";


export const ProtectedRoute = ({children}) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token || !isTokenValid(token)) {
    clearAuth();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout/>
        </ProtectedRoute>
        }>
        <Route index element={<Report/>}></Route>
        <Route path="rumah" element={<Home/>}></Route>
        <Route path="rumah/:id/detail" element={<DetailHome/>}></Route>
        <Route path="penghuni" element={<Ocupant/>}></Route>
        <Route path="jenis-iuran" element={<DuesType/>}></Route>
        <Route path="iuran" element={<Payment/>}></Route>
        <Route path="pengeluaran" element={<Expense/>} />
      </Route>
    </>
  )
)


function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
