'use client'
import "./globals.css";
import Nav from './Navigations'
import AuthContextProvider from "./auth-context";

import FinanceContextProvider from "./finance-context";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <body className={children.className}>
        <AuthContextProvider>
          <FinanceContextProvider> 
            <ToastContainer/>
            <Nav /> {children} 
          </FinanceContextProvider>
        </AuthContextProvider>
        </body>
      </head>
    </html>
  );
}
