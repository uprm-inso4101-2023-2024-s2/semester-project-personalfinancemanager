export const currencyFormatter = (amount) => {
    const formatter = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    })

    return formatter.format(amount);
}