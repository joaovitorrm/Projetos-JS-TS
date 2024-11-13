const canSum = (target: number, numbers: number[], memo={}) => {
    
    if (target in memo) return memo[target];
    if (target === 0) return true;
    if (target < 0) return false;

    for (let n of numbers) {

        const resto = target - n;

        if (canSum(resto, numbers, memo)) {
            memo[target] = true;
            return true;            
        };
        
    }

    memo[target] = false;
    return false;
    
}


console.log(canSum(7, [2, 3]))
console.log(canSum(7, [5, 3, 4, 7]))
console.log(canSum(7, [2, 4]))
console.log(canSum(8, [2, 3, 5]))
console.log(canSum(300, [7, 14]))