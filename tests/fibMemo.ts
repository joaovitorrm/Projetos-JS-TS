const memo = {};

const fib: (n: number) => number = (n) => {
    if (n <= 2) return 1;

    if (memo[n]) return memo[n];

    memo[n] = fib(n - 1) + fib(n - 2);

    return memo[n];
}

console.time("Fib");

console.timeLog("Fib");

console.log(fib(1100));

console.timeEnd("Fib");