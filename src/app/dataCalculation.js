export const calculateMean = (data) => {
    const total = data.reduce((total, item) => {
      return total + item.total;
    }, 0);
    return total / data.length;
};

export const calculateMedian = (data) => {
    const sortedData = [...data].sort((a, b) => a.total - b.total);
    const mid = Math.floor(sortedData.length / 2);

    let median;
    if (sortedData.length % 2 === 0) {
      median = (sortedData[mid - 1].total + sortedData[mid].total) / 2;
    } else {
      median = sortedData[mid].total;
    }

    return median;
};

export const calculateMode = (data) => {
    const frequencyMap = {};
    let maxFrequency = 0;
    let modes = [];

    for (let i = 0; i < data.length; i++) {
      const value = data[i].total;
      frequencyMap[value] = (frequencyMap[value] || 0) + 1;

      if (frequencyMap[value] > maxFrequency) {
        maxFrequency = frequencyMap[value];
        modes = [value];
      } else if (frequencyMap[value] === maxFrequency) {
        modes.push(value);
      }
    }

    return modes;
};