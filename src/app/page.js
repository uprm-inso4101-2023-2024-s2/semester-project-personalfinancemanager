'use client'
import React, {useState} from 'react';
import RenderBarChart from "./barChart";
import theNothinger from "./somethingElse";
import {currencyFormatter} from './utils'
import ExpenseCategoryItem from './ExpenseCategoryItem';
import Modal from './modal';

const DUMMY_DATA = [
  {
    id: '1',
    title: 'Family',
    color: '#f00',
    amount: 500,
  },
  {
    id: '2',
    title: 'Education',
    color: '#ff6',
    amount: 200,
  },
  {
    id: '3',
    title: 'Pets',
    color: '#008f',
    amount: 1200,
  },
  {
    id: '4',
    title: 'Cinema',
    color: '#d07',
    amount: 800,
  }
];

export default function Home() {

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showBarChart, setShowBarChart] = useState(false);

  const toggleChange = () => {
      setShowBarChart(!showBarChart);
  }

  return (
    <>
      {/* Modal */}
      <Modal show={modalIsOpen} onClose={setModalIsOpen}>
        <h3>Hello World</h3>
      </Modal>

      <main className="container max-w-2x1 px-6 mx-auto">
        <section className="py-3">
          <small className="text-gray-600 text-md">My Balance</small>
          <h2 className="text-4x1 font-bold">{currencyFormatter(12345)}</h2>
        </section>

        <section className='flex items-center gap-2 py-3'>
          <button 
          onClick={() => {
              setModalIsOpen(true);
            }}
            className='btn btn-primary'>+ Expenses</button>
          <button className='btn btn-primary'>+ Income</button>
        </section>

        {/** Expenses */}
        <section className='py-6'>
          <h3 className="text-2xl">My Expenses</h3>
          <div className='flex flex-col gap-4 mt-6'>
            {DUMMY_DATA.map((expense) => {
              return (
                <ExpenseCategoryItem 
                color={expense.color} 
                title={expense.title} 
                amount={expense.amount} 
            />
              );
            })}
          </div>
        </section>

        <div className="mt-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <button onClick={toggleChange}>{showBarChart ? 'Show Nothing' : 'Show Bar Chart'}</button>
        </div>
        <section className='max-w-2x1 px-6 mx-auto'>{showBarChart ? <RenderBarChart /> : <theNothinger />}</section>
        
      </main>
    </>
    
  );
}
