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
  monthlyBudgets: [],
  events: [],
  preferences: [],
  createMonthlyBudgets: async () => {},
  updateMonthlyBudgets: async () => {},
  deleteBudget: async () => {},
  checkBudgetDuplication: async () => {},
  addIncomeItem: async () => {},
  removeIncomeItem: async () => {},
  addExpenseItem: async () => {},
  addCategory: async () => {},
  deleteExpenseItem: async () => {},
  deleteExpenseCategory: async () => {},
  addEvent: async () => {},
  deleteEvent: async () => {},
  updateExpense: async () => {},
  addPreferenceItem: async () => {},
  deletePreferenceItem: async () => {},
  deletePreferenceCategory: async () => {},
  updatePreference: async () => {},
});

 export async function checkExpensesDuplication(user,title){
  try {
    const collectionRef = collection(db, "expenses");
    const q = query(collectionRef, where("uid", "==", user.uid));
    const docSnap = await getDocs(q);
    const categoryTitles = []; 
    docSnap.forEach(doc => {
      const newTitle = doc.data().title.toLowerCase().split(' ').join('');
      categoryTitles.push(newTitle);
    });

    return categoryTitles.includes(title.toLowerCase().split(' ').join(''));
  } catch (err) {
    throw err;
  }
};

export default function FinanceContextProvider({ children }) {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudgets, setBudgets] = useState([]);
  const [events, setEvents] = useState([]);
  const [preferences, setPreferences] = useState([]);

  const { user } = useContext(authContext);

  /** Adds a new event category, identified by the user and the event date. This should be called 
   * when the user does not hae any events in the specified date.
   * The category should look something like this:
   *  {date : selectedDate, total:0}
   * 
   * @param {array} item - A list of events where it contains the userID, date, and another array of events 
   */
  const addEvent = async (item) => {
    try {
      const collectionRef = collection(db, "events");

      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...item,
      });

      setEvents((prevEvents) => {
        return [
          ...prevEvents,
          {
            id: docSnap.id,
            uid: user.uid,
            ...item,
          },
        ];
      });
      
    } catch (err) {
      throw err;
    }
  }

  const addPreferenceItem = async (newPreference) => {
    try {
      const collectionRef = collection(db, "preferences");
      const docSnap = await addDoc(collectionRef, {
        uid: user.uid,
        ...newPreference,
      });
      setPreferences((prevPreferences) => [
        ...prevPreferences,
        { id: docSnap.id, uid: user.uid, ...newPreference },
      ]);
    } catch (error) {
      console.error("Error adding preference item:", error);
      throw error;
    }
  };

  const deletePreferenceItem = async (updatedPreference, preferenceId) => {
    try {
      const docRef = doc(db, "preferences", preferenceId);
      await updateDoc(docRef, {
        ...updatedPreference,
      });
      setPreferences((prevPreferences) => {
        const updatedPreference = [...prevPreferences];
        const pos = updatedPreference.findIndex(
          (preference) => preference.id === preferenceId
        );
        updatedPreference[pos].items = [...updatedPreference.items];
        updatedPreference[pos].total = updatedPreference.total;
        return updatedPreference;
      });
    } catch (error) {
      throw error;
    }
  };

  const deletePreferenceCategory = async (preferenceCategoryId) => {
    try {
      const docRef = doc(db, "preferences", preferenceCategoryId);
      await deleteDoc(docRef);

      setPreferences((prevPreferences) => {
        const updatedPreference = prevPreferences.filter(
          (preference) => preference.id !== preferenceCategoryId
        );

        return [...updatedPreference];
      });
    } catch (error) {
      throw error;
    }
  };

  const updatePreference = async (updatedPreference) => {
    try {
        const docRef = doc(db, "preferences", updatedPreference.id);
        await updateDoc(docRef, {
            ...updatedPreference
        });

        setPreferences(prevPreferences => {
            const updatedPreference = [...prevPreferences];
            const index = updatedPreference.findIndex(preference => preference.id === updatedPreference.id);
            if (index !== -1) {
              updatedPreference[index] = updatedPreference;
            }
            return updatedPreference;
        });
    } catch (error) {
        throw error;
    }
};

  const deleteEvent = async (eventID) => {
    try {
      const docRef = doc(db, "events", eventID);
      await deleteDoc(docRef);

      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.filter(
          (event) => event.id !== eventID
        );

        return [...updatedEvents];
      });
    } catch (err) {
      throw err;
    }
  }


  /** Adds a new monthly budget document to the database. It is saved with the document Id and the User Id.
   * 
   * @param {integer} newBudget - The budget to be added to the database.
   */
  const createMonthlyBudgets = async (newBudget, month) => {
    try {
      const collectionRef = collection(db, "monthly_budget");
      const items = Array.from({ length: 12 }, () => 0); 
      items[month] = newBudget;
      const docSnap = await addDoc(collectionRef, {
        uid : user.uid,
        budgets: items,
      });

      setBudgets({
          id: docSnap.id,
          uid : user.uid,
          budgets : items,
        })

    } catch (err) {
      throw err; 
    }
  }

  /** Updates the monthly budget using the budget to update it to.
   * This looks for the document with the user id.
   * 
   * @param {integer} newBudget - The new budget to update to the database.
   */
  const updateMonthlyBudgets = async (newBudget, month) => {
    try {
      const colRef = collection(db, "monthly_budget");
      const q = query(colRef, where("uid", "==", user.uid));
      const docSnap = await getDocs(q);
      const updatedItems = docSnap.docs[0].data().budgets;
      updatedItems[month] = newBudget;
      const budgetId = docSnap.docs[0].id;
      const docRef = doc(db, "monthly_budget", budgetId);
      await updateDoc(docRef, { budgets: updatedItems });
      setBudgets({
        id: budgetId,
        uid: user.uid,
        budgets: updatedItems
      });
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

  const updateExpense = async (updatedExpense) => {
    try {
        const docRef = doc(db, "expenses", updatedExpense.id);
        await updateDoc(docRef, {
            ...updatedExpense
        });

        setExpenses(prevExpenses => {
            const updatedExpenses = [...prevExpenses];
            const index = updatedExpenses.findIndex(expense => expense.id === updatedExpense.id);
            if (index !== -1) {
                updatedExpenses[index] = updatedExpense;
            }
            return updatedExpenses;
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
    monthlyBudgets,
    events,
    preferences, 
    createMonthlyBudgets,
    updateMonthlyBudgets,
    deleteBudget,
    checkBudgetDuplication,
    addIncomeItem,
    removeIncomeItem,
    addExpenseItem,
    addCategory,
    deleteExpenseItem,
    deleteExpenseCategory,
    addEvent,
    deleteEvent,
    updateExpense,
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

    const getEventsData = async () => { // calendar related
      const collectionRef = collection(db, "events");
      const q = query(collectionRef, where("uid", "==", user.uid));

      const docsSnap = await getDocs(q);

      const data = docsSnap.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          date:  docData.date.toDate(),
          uid:  docData.uid,
          eventInfo: {
            event: docData.eventInfo.event,
            expense: docData.eventInfo.expense,
          }
        };
      });

      setEvents(data);
    };

    const getBudgetData = async () => {
      const colRef = collection(db, "monthly_budget");
      const q = query(colRef, where("uid", "==", user.uid));
      const docSnap = await getDocs(q);
      const items = docSnap.size > 0 ? docSnap.docs[0].data().budgets : [];
      const docID = docSnap.size > 0 ? docSnap.docs[0].id : "";
      
      setBudgets({
        id: docID,
        uid: user.uid,
        budgets: items
      });
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

    const getPreferencesData = async () => {
      try {
        const collectionRef = collection(db, "preferences");
        const q = query(collectionRef, where("uid", "==", user.uid));
        const docsSnap = await getDocs(q);
        const data = docsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPreferences(data);
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    // Call function to fetch preferences data
    getPreferencesData();
    getIncomeData();
    getExpensesData();
    getBudgetData();
    getEventsData(); // calendar related
  }, [user]);

  return (
    <financeContext.Provider value={values}>{children}</financeContext.Provider>
  );
}