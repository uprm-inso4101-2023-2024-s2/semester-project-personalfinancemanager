'use client'
import "./globals.css";
import Nav from './Page-Functionality/Navigations'
import AuthContextProvider from "./Page-Functionality/Login/auth-context";

import FinanceContextProvider from "./Finance-Context/finance-context";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from "react";
// import { PageContext } from "./page.js";


export default function RootLayout({ children }) {
  // const { currentPage, setCurrentPage } = useContext(PageContext);

  return (
    <html lang="en">
      <head>
      <body className={children.className}>
        <AuthContextProvider>
          <FinanceContextProvider> 
            <ToastContainer/>
            {/* <Nav currentPage={currentPage} setCurrentPage={setCurrentPage}/> {children}  */}
            <Nav /> {children}
          </FinanceContextProvider>
        </AuthContextProvider>
        </body>
      </head>
    </html>
  );
}
