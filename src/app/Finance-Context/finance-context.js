"use client";

import { createContext, useState, useEffect, useContext } from "react";

import { authContext } from "../Page-Functionality/Login/auth-context";
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const userPassword = "Password";
const keyLength = 32;

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
});

// encryption functions

function getKeyFromPassword(password) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("base64").slice(0, keyLength);
}

function encrypt(text, password) {
  const key = getKeyFromPassword(password);
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(JSON.stringify(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
}

function decrypt(encryptedObj, password) {
  const key = getKeyFromPassword(password);
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}



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
        const encryptedItem = encrypt(item, userPassword);
        const collectionRef = collection(db, "events");

        const docSnap = await addDoc(collectionRef, {
            uid: user.uid,
            encryptedData: encryptedItem.encryptedData,
            iv: encryptedItem.iv
        });

        setEvents((prevEvents) => {
            return [
                ...prevEvents,
                {
                    id: docSnap.id,
                    uid: user.uid,
                    encryptedData: encryptedItem.encryptedData,
                    iv: encryptedItem.iv
                },
            ];
        });

    } catch (err) {
        throw err;
    }
}


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
        const encryptedBudget = encrypt({ month: newBudget }, userPassword);
        const collectionRef = collection(db, "monthly_budget");
        const items = Array.from({ length: 12 }, () => ({ encryptedData: null, iv: null }));
        items[month] = encryptedBudget;
        const docSnap = await addDoc(collectionRef, {
            uid: user.uid,
            budgets: items,
        });

        setBudgets({
            id: docSnap.id,
            uid: user.uid,
            budgets: items,
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
        const docData = docSnap.docs[0].data();
        const updatedItems = docData.budgets;
        const encryptedBudget = encrypt({ month: newBudget }, userPassword);
        updatedItems[month] = encryptedBudget;
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

  const addCategory = async (categoryName) => {
    const encryptedCategory = encrypt({ name: categoryName, items: [] }, userPassword);
    try {
        const collectionRef = collection(db, "expenses");
        const docSnap = await addDoc(collectionRef, {
            uid: user.uid,
            encryptedData: encryptedCategory.encryptedData,
            iv: encryptedCategory.iv
        });
        setExpenses((prevExpenses) => [
            ...prevExpenses,
            {
                id: docSnap.id,
                uid: user.uid,
                name: categoryName, // Store decrypted locally
                items: []
            }
        ]);
    } catch (error) {
        throw error;
    }
};

const updateExpense = async (expenseId, updatedExpenseDetails) => {
  const encryptedExpense = encrypt(updatedExpenseDetails, userPassword);
  try {
      const docRef = doc(db, "expenses", expenseId);
      await updateDoc(docRef, {
          encryptedData: encryptedExpense.encryptedData,
          iv: encryptedExpense.iv
      });
      setExpenses((prevExpenses) => {
          return prevExpenses.map(expense => expense.id === expenseId ? { ...expense, ...updatedExpenseDetails } : expense);
      });
  } catch (error) {
      throw error;
  }
};


const addExpenseItem = async (expenseCategoryId, newExpense) => {
  const encryptedExpense = encrypt(newExpense, userPassword);
  try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await updateDoc(docRef, {
          ...encryptedExpense
      });
      setExpenses((prevState) => {
          return prevState.map(expense => {
              if (expense.id === expenseCategoryId) {
                  return { ...expense, items: [...expense.items, newExpense] }; 
              }
              return expense;
          });
      });
  } catch (error) {
      throw error;
  }
};


const deleteExpenseItem = async (expenseCategoryId, itemIndex) => {
  try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      const docSnap = await getDoc(docRef);
      let items = decrypt(docSnap.data().encryptedData, docSnap.data().iv, userPassword).items;
      items.splice(itemIndex, 1); // Remove the item at the specified index
      const encryptedData = encrypt({ items }, userPassword);
      await updateDoc(docRef, encryptedData);
      setExpenses((prevExpenses) => prevExpenses.map(exp => {
          if (exp.id === expenseCategoryId) {
              return { ...exp, items };
          }
          return exp;
      }));
  } catch (error) {
      throw error;
  }
};


const deleteExpenseCategory = async (expenseCategoryId) => {
  try {
      const docRef = doc(db, "expenses", expenseCategoryId);
      await deleteDoc(docRef);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== expenseCategoryId));
  } catch (error) {
      throw error;
  }
};



  
const addIncomeItem = async (newIncome) => {
  const encryptedIncome = encrypt(newIncome, userPassword);
  try {
      const collectionRef = collection(db, "income");
      const docSnap = await addDoc(collectionRef, {
          ...encryptedIncome,
          uid: user.uid
      });
      setIncome((prevState) => [
          ...prevState,
          {
              id: docSnap.id,
              ...newIncome
          }
      ]);
  } catch (error) {
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
  
      try {
          const docsSnap = await getDocs(q);
          const data = docsSnap.docs.map(doc => {
              const decryptedData = decrypt({ encryptedData: doc.data().encryptedData, iv: doc.data().iv }, userPassword);
              return {
                  id: doc.id,
                  ...decryptedData
              };
          });
          setIncome(data);
      } catch (error) {
          console.log(error.message);
          throw error;
      }
  };
  

  const getEventsData = async () => {
    const collectionRef = collection(db, "events");
    const q = query(collectionRef, where("uid", "==", user.uid));

    try {
        const docsSnap = await getDocs(q);
        const data = docsSnap.docs.map(doc => {
            const decryptedData = decrypt({ encryptedData: doc.data().encryptedData, iv: doc.data().iv }, userPassword);
            return {
                id: doc.id,
                ...decryptedData
            };
        });
        setEvents(data);
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};


const getBudgetData = async () => {
  const colRef = collection(db, "monthly_budget");
  const q = query(colRef, where("uid", "==", user.uid));

  try {
      const docSnap = await getDocs(q);
      const data = docSnap.docs.map(doc => {
          const decryptedBudgets = doc.data().budgets.map(budget => decrypt({ encryptedData: budget.encryptedData, iv: budget.iv }, userPassword));
          return {
              id: doc.id,
              budgets: decryptedBudgets,
              uid: user.uid
          };
      });
      setBudgets(data.length > 0 ? data[0] : null); // Assuming there should only be one budget document per user
  } catch (error) {
      console.log(error.message);
      throw error;
  }
};

const getExpensesData = async () => {
  const collectionRef = collection(db, "expenses");
  const q = query(collectionRef, where("uid", "==", user.uid));

  try {
      const docsSnap = await getDocs(q);
      const data = docsSnap.docs.map(doc => {
          const decryptedData = decrypt({ encryptedData: doc.data().encryptedData, iv: doc.data().iv }, userPassword);
          return {
              id: doc.id,
              ...decryptedData
          };
      });
      setExpenses(data);
  } catch (error) {
      console.log(error.message);
      throw error;
  }
};


    getIncomeData();
    getExpensesData();
    getBudgetData();
    getEventsData(); // calendar related
  }, [user]);

  return (
    <financeContext.Provider value={values}>{children}</financeContext.Provider>
  );
}