"use client";

import { createContext, useState, useEffect, useContext } from "react";

import { authContext } from "./auth-context";

// Firebase
import { db } from "./index";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

export const financeContext = createContext({
  income: [],
  expenses: [],
  monthlyBudget: [],
  addMonthlyBudget: async () => {},
  updateMonthlyBudget: async () => {},
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
});

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setBudget] = useState([]);

  const { user } = useContext(authContext);

  /** Adds a new monthly budget to the database. It is saved with the document Id and the User Id.
   * 
   * @param {integer} newBudget - The budget to be added to the database.
   */
  const addMonthlyBudget = async (newBudget) => {
    try {
      const collectionRef = collection(db, "monthly_budget");
      const q = query(collectionRef, where("uid", "==", user.uid));
      const q_checker = await getDocs(q);
      if(!q_checker.empty){
        updateMonthlyBudget(monthlyBudget.id, newBudget);
        return;
      }
      const docSnap = await addDoc(collectionRef, {
        uid : user.uid,
        budget : newBudget
      });

      setBudget((newBudget) => {
        return {
          id: docSnap.id,
          uid : user.uid,
          budget : newBudget,
        }
      })
    } catch (err) {
      throw err; 
    }
  }

  /** Updates the monthly budget using its document id and a the budget to update it to.
   * 
   * @param {string} docID - The string id of the document.
   * @param {integer} newBudget - The new budget to update to the database.
   */
  const updateMonthlyBudget = async (docID, newBudget) => {
    const docRef = doc(db, "monthly_budget", docID);
    try {
      await updateDoc(docRef, {budget : newBudget} );
      setBudget((prevBudget) => ({
        ...prevBudget,
        budget : newBudget
      }));
    } catch (err) {
      throw err;
    }
  }

  const addCategory = async (category) => {
    try {
      const collectionRef = collection(db, "expenses");

      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...category,
        items: [],
      });

      setExpenses((prevExpenses) => {
        return [
          ...prevExpenses,
          {
            id: docSnap.id,
            uid: user.uid,
            items: [],
            ...category,
          },
        ];
      });
    } catch (error) {
      throw error;
    }
  };

  const addExpenseItem = async (expenseCategoryId, newExpense) => {
    const docRef = doc(db, "expenses", expenseCategoryId);

    try {
      await updateDoc(docRef, { ...newExpense });

      // Update State
      setExpenses((prevState) => {
        const updatedExpenses = [...prevState];

        const foundIndex = updatedExpenses.findIndex((expense) => {
          return expense.id === expenseCategoryId;
        });

        updatedExpenses[foundIndex] = { id: expenseCategoryId, ...newExpense };

        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseItem = async (updatedExpense, expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, {
        ...updatedExpense,
      });
      setExpenses((prevExpenses) => {
        const updatedExpenses = [...prevExpenses];
        const pos = updatedExpenses.findIndex(
          (ex) => ex.id === expenseCategoryId
        );
        updatedExpenses[pos].items = [...updatedExpense.items];
        updatedExpenses[pos].total = updatedExpense.total;
        return updatedExpenses;
      });
    } catch (error) {
      throw error;
    }
  };

  const deleteExpenseCategory = async (expenseCategoryId) => {
    try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);

      setExpenses((prevExpenses) => {
        const updatedExpenses = prevExpenses.filter(
          (expense) => expense.id !== expenseCategoryId
        );

        return [...updatedExpenses];
      });
    } catch (error) {
      throw error;
    }
  };

  const addIncomeItem = async (newIncome) => {
    const collectionRef = collection(db, "income");

    try {
      const docSnap = await addDoc(collectionRef, newIncome);

      // Update state
      setIncome((prevState) => {
        return [
          ...prevState,
          {
            id: docSnap.id,
            ...newIncome,
          },
        ];
      });
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };
  const removeIncomeItem = async (incomeId) => {
    const docRef = doc(db, "income", incomeId);
    try {
      await deleteDoc(docRef);
      setIncome((prevState) => {
        return prevState.filter((i) => i.id !== incomeId);
      });
      // Update State
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  };

  const values = {
    income,
    expenses,
    monthlyBudget,
    addMonthlyBudget,
    updateMonthlyBudget,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
  };

  useEffect(() => {
    if (!user) return;

    const getIncomeData = async () => {
      const collectionRef = collection(db, "income");
      const q = query(collectionRef, where("uid", "==", user.uid));

      const docsSnap = await getDocs(q);

      const data = docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        };
      });

      setIncome(data);
    };

    const getBudgetData = async () => {
      const colRef = collection(db, "monthly_budget");
      const q = query(colRef, where("uid", "==", user.uid));
      const docSnap = await getDocs(q);
      const data = docSnap.docs.map((doc) => {
        return {
         id : doc.id,
         user : user.uid,
         ...doc.data(), 
        }
      });
      setBudget(data);
    }

    const getExpensesData = async () => {
      const collectionRef = collection(db, "expenses");
      const q = query(collectionRef, where("uid", "==", user.uid));
      const docsSnap = await getDocs(q);

      const data = docsSnap.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      setExpenses(data);
    };

    getIncomeData();
    getExpensesData();
    getBudgetData();
  }, [user]);

  return (
    <financeContext.Provider value={values}>{children}</financeContext.Provider>
  );
}