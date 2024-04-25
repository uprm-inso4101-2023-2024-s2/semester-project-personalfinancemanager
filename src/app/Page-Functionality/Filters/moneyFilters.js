

/** Filters the given expenses with the given month and year. 
 * 
 * @param {Array} expenses - Given expenses to filter.
 * @param {integer} month - Month to filter.
 * @param {integer} year  - Year to filter.
 * @returns the expenses that are within that month and year
 */
export default function monthlyExpensefilter(expenses, month, year) {
  const filterExpensesByMonth = (expenses, month, year) => {
      //If expenses are empty, returns empty
      if (!expenses || !Array.isArray(expenses)) return [];
  
      return expenses.map(expense => {
          const items = expense.items;
          // Skip expense with missing or invalid items
          if (!items || !Array.isArray(items)) {
              console.error("Invalid items array:", items);
              return false; 
          }
          //filters items that don't match the month and year
          const filteredItems = items.filter(item => {
              const expenseDate =  new Date(item.createdAt);
              return expenseDate.getMonth() + 1 === month && expenseDate.getFullYear() === year;
          })
          //returns filtered items (May return categories with 0 items!)
          const total = filteredItems.reduce((acc, curr) => acc + curr.amount, 0);
          return {
              ...expense,
              items: filteredItems,
              total: total
          };
      }).filter(expense => expense.items && expense.items.length > 0);
  };
  const monthfilter = filterExpensesByMonth(expenses, month, year);
  return monthfilter;
}

/** Filters the given income by the given month and year. 
* 
* @param {Array} incomes - Given incomes to filter.
* @param {integer} month - Month to filter.
* @param {integer} year  - Year to filter.
* @returns the incomes that are within that month and year
*/
export function monthlyIncomeFilter(incomes, month, year) {
  const filterIncomebyMonth = (incomes, month, year) => {
      //If incomes are empty, return empty
      if (!incomes || !Array.isArray(incomes)) return [];
  
      //Check the date then filter accordingly
      return incomes.filter(income => {
          const createdAt = income.createdAt;
          const incomedate = new Date(createdAt);
          return incomedate.getMonth() + 1 === month && incomedate.getFullYear() === year;
      })
  };
  const monthfilter = filterIncomebyMonth(incomes, month, year);
  return monthfilter;
}

/** Filters the given expenses based on the given year.
* 
* @param {Array} expenses - An array containing the expenses of the user. 
* @param {integer} year - The year you want to find the expenses for. 
* @returns The filtered expenses in the given year.
*/
export function yearlyExpenseFilter(expenses, year) {
  const filterExpensesByYear = (expenses, year) => {
      //If expenses are empty, returns empty
      if (!expenses || !Array.isArray(expenses)) return [];
  
      return expenses.map(expense => {
          const items = expense.items;
          // Skip expense with missing or invalid items
          if (!items || !Array.isArray(items)) {
              return false; 
          }
          //filters items that don't match the month and year

          const filteredItems = items.filter(item => {
            const expenseDate = new Date(item.createdAt);
          
            // Ensure that expenseDate is a valid Date object
            if (!(expenseDate instanceof Date && !isNaN(expenseDate))) {
              console.error("Invalid createdAt value:", item.createdAt);
              return false;
            }
          
            return expenseDate.getFullYear() === year;
          })
          //


          //returns filtered items (May return categories with 0 items!)
          const total = filteredItems.reduce((acc, curr) => acc + curr.amount, 0);
          return {
              ...expense,
              items: filteredItems,
              total: total
          };
      });
  };
  const yearFilter = filterExpensesByYear(expenses, year);
  return yearFilter;
}

/** Filters the given income by the given year.
* 
* @param {Array} incomes - The array containing the income for the user. 
* @param {integer} year - The year you want to find the income for. 
* @returns The filtered income in the given year.
*/
export function yearlyIncomeFilter(incomes, year) {
  const filterIncomebyYear = (incomes, year) => {
      //If incomes are empty, return empty
      if (!incomes || !Array.isArray(incomes)) return [];
  
      //Check the date then filter accordingly
      return incomes.filter(income => {
          const createdAt = income.createdAt;
          const incomedate = new Date(createdAt);
          return incomedate.getFullYear() === year;
      })
  };
  const yearFilter = filterIncomebyYear(incomes, year);
  return yearFilter;
}

export function expensesFilterByMonth(data, month) {
  // Filter expenses by month
  const filteredExpenses = data.flatMap((data) =>
    data.items.filter(
      (item) => new Date(item.createdAt).getMonth() === month
    )
  );

  // Map to amounts
  const amounts = filteredExpenses.map((item) => item.amount);

  return amounts;
}

export function expensesFilterByDay(data) {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();

  return data.flatMap((item) => {
    return item.items
      .filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === currentMonth &&
          itemDate.getDate() === currentDay
        );
      })
      .map((item) => item.amount);
  });
}

export function expensesFilterByWeek(data) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return data.flatMap((item) => {
    return item.items
      .filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= oneWeekAgo;
      })
      .map((item) => item.amount);
  });
}

export function incomesFilterByMonth(data, month) {
  return data
    .filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate.getMonth() === month;
    })
    .map((item) => item.amount);
}

export function incomesFilterByDay(data) {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();

  return data
    .filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getMonth() === currentMonth &&
        itemDate.getDate() === currentDay
      );
    })
    .map((item) => item.amount);
}

export function incomesFilterByWeek(data) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return data
    .filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate >= oneWeekAgo;
    })
    .map((item) => item.amount);
}