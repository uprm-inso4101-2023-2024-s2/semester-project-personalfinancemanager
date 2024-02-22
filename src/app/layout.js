'use client'
import "./globals.css";
import Nav from './Navigations'
import FinanceContextProvider from "./finance-context";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <body>
          <FinanceContextProvider> 
            <Nav /> {children} 
          </FinanceContextProvider>
        </body>
      </head>
    </html>
  );
}
