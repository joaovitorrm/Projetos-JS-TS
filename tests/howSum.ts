const howSum = (target: number, numbers: number[], memo={}) => {
    
    if (target < 0) return null;
    if (target === 0) return;
    const array = [];

    for (const n of numbers) {
        const remainder = target - n;

        const resultArray = howSum(remainder, numbers)

        if (resultArray != null) {
            array.concat(resultArray);
        }

    }

}


