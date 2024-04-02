"use client";

import { createContext, useState, useEffect, useContext } from "react";

import { authContext } from "../Page-Functionality/Login/auth-context";

// Firebase
import { db } from "../index";
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
  events: [],
  addMonthlyBudget: async () => {},
  updateMonthlyBudget: async () => {},
  deleteBudget: async () => {},
  checkBudgetDuplication: async () => {},
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
  addEventCategory: async () => {},
  addEventItem: async () => {},
  deleteEventCategory: async () => {},
  deleteEventItem: async () => {},
});

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setBudget] = useState([]);
  const [events, setEvents] = useState([]);

  const { user } = useContext(authContext);

  /** Adds a new event category, identified by the user and the event date. This should be called 
   * when the user does not hae any events in the specified date.
   * The category should look something like this:
   *  {date : selectedDate, total:0}
   * 
   * @param {array} category - A list of events where it contains the userID, date, and another array of events 
   */
  const addEventCategory = async (category) => {
    try {
      const collectionRef = collection(db, "events");

      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...category,
        items: [],
      });

      setEvents((prevEvents) => {
        return [
          ...prevEvents,
          {
            id: docSnap.id,
            uid: user.uid,
            items: [],
            ...category,
          },
        ];
      });
      
    } catch (err) {
      throw err;
    }
  }

  /** Adds a new event to the already existing event list.
   * The new event should have the following properties:
   * const newEvent = {
            date : event.date
            total: event.total + +eventExpectedExpenses,
            items: [
                ...event.items,
                {
                    amount: +eventExpectedExpenses,
                    id: uuidv4(),
                },
            ],
        };
   *  
   * 
   * @param {string} eventCategoryID 
   * @param {array} newEvent 
   */
  const AddEventItem = async (eventCategoryID, newEvent) => {
    const docRef = doc(db, "expenses", eventCategoryID);
    try {
      await updateDoc(docRef, { ...newEvent });
      setEvents((prevState) => {
        const updatedEvents = [...prevState];

        const foundIndex = updatedEvents.findIndex((event) => {
          return event.id === eventCategoryID;
        });

        updatedEvents[foundIndex] = { id: eventCategoryID, ...newEvent };

        return updatedEvents;
      });
    } catch (err) {
      throw err;
    }
  }

  const deleteEventCategory = async (eventCategoryID) => {
    try {
      const docRef = doc(db, "expenses", eventCategoryID);
      await deleteDoc(docRef);

      setExpenses((prevExpenses) => {
        const updatedEvents = prevExpenses.filter(
          (expense) => expense.id !== eventCategoryID
        );

        return [...updatedEvents];
      });
    } catch (err) {
      throw err;
    }
  }

  const deleteEventItem = async (updatedEvent, eventCategoryID) => {
      try {
        const docRef = doc(db, "expenses", eventCategoryID);
        await updateDoc(docRef, {
          ...updatedEvent,
        });
        setExpenses((prevEvents) => {
          const updatedEvents = [...prevEvents];
          const pos = updatedEvents.findIndex(
            (ex) => ex.id === eventCategoryID
          );
          updatedEvents[pos].items = [...updatedEvent.items];
          updatedEvents[pos].total = updatedEvent.total;
          return updatedEvents;
        });
      } catch (err) {
        throw err;
      }
  }

  /** Adds a new monthly budget document to the database. It is saved with the document Id and the User Id.
   * 
   * @param {integer} newBudget - The budget to be added to the database.
   */
  const addMonthlyBudget = async (newBudget) => {
    try {
      const collectionRef = collection(db, "monthly_budget");
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

      await checkBudgetDuplication();
    } catch (err) {
      throw err; 
    }
  }

  /** Updates the monthly budget using the budget to update it to.
   * This looks for the document with the user id.
   * 
   * @param {integer} newBudget - The new budget to update to the database.
   */
  const updateMonthlyBudget = async (newBudget) => {
    try {
      const colRef = collection(db, "monthly_budget");
      const q = query(colRef, where("uid", "==", user.uid));
      const docSnap = await getDocs(q);
      if (docSnap.size === 0) {
        await addMonthlyBudget(newBudget);
      } else {
        const budgetId = docSnap.docs[0].id;
        const docRef = doc(db, "monthly_budget", budgetId);
        await updateDoc(docRef, { budget: newBudget });
        setBudget((prevBudget) => ({
          ...prevBudget,
          budget : newBudget
        }));
        await checkBudgetDuplication();
      } 
    } catch (err) {
      throw err;
    }
  }

  /** Deletes the monthly budget doc from the database.
   * 
   * @param {string} docID - The ID of the document you want to delete in string format. 
   */
  const deleteBudget = async (docID) => {
    try {
      const docRef = doc(db, "monthly_budget", docID);
      await deleteDoc(docRef);

    } catch (err) {
      throw err;
    }
  };

  /**
   * Checks if the documents are duplicated, and keeps deleting documents until there is only one.
   */
  const checkBudgetDuplication = async () => {
    try {
      const collectionRef = collection(db, "monthly_budget");
      const q = query(collectionRef, where("uid", "==", user.uid));
      const docSnap = await getDocs(q);
      if (docSnap.size > 1) {
        const docsToDelete = docSnap.docs.slice(1); 
        const deletePromises = docsToDelete.map((doc) => deleteBudget(doc.id));
        await Promise.all(deletePromises);
      }
    } catch (err) {
      throw err;
    }
  };

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
    events,
    addMonthlyBudget,
    updateMonthlyBudget,
    deleteBudget,
    checkBudgetDuplication,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
    addEventCategory,
    AddEventItem,
    deleteEventCategory,
    deleteEventItem,
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
          items: doc.data().items.map((item) => ({
            ...item,
            createdAt: new Date(item.createdAt.toMillis()), 
        }))
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