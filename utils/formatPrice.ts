export const formatPrice = (price:number) => {
    const roundedPrice = price.toFixed(2);
    
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(parseFloat(roundedPrice));
};
