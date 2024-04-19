'use client'
import "./globals.css";
import Nav from './Page-Functionality/Navigations'
import AuthContextProvider from "./Page-Functionality/Login/auth-context";
import GraphContext from "./Page-Functionality/graphcontext";
import FinanceContextProvider from "./Finance-Context/finance-context";
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <body className={children.className}>
        <GraphContext>
        <AuthContextProvider>
          <FinanceContextProvider> 
            <ToastContainer/>
            <Nav /> {children} 
          </FinanceContextProvider>
        </AuthContextProvider>
        </GraphContext>
        </body>
      </head>
    </html>
  );
}
