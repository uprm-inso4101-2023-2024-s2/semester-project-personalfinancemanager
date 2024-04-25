'use client'
import "./globals.css";
import Nav from './Page-Functionality/Navigations'
import AuthContextProvider from "./Page-Functionality/Login/auth-context";

import FinanceContextProvider from "./Finance-Context/finance-context";
import CalendarContext from "./Page-Functionality/calendarContext";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <body className={children.className}>
        <CalendarContext>
        <AuthContextProvider>
          <FinanceContextProvider> 
            <ToastContainer/>
            <Nav /> {children}
          </FinanceContextProvider>
        </AuthContextProvider>
        </CalendarContext>
        </body>
      </head>
    </html>
  );
}
