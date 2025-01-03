let c = 0;

function mergeSort(arr : number[]) {    
    if (arr.length <= 1) return arr;
    c++;

    const [left_half, right_half] = [...split(arr)];

    const left = mergeSort(left_half);
    const right = mergeSort(right_half);

    return merge(left, right);
}

function split(arr: number[]) : [number[], number[]] {

    const left_half = arr.splice(0, arr.length / 2);
    const right_half = arr;

    return [left_half, right_half];
}

function merge(arr1: number[], arr2: number[]) : number[] {

    const sortedArr : number[] = [];

    let i = 0, j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            sortedArr.push(arr1[i]);
            i++;
        } else {
            sortedArr.push(arr2[j]);
            j++;
        }
    }

    while (i < arr1.length) {
        sortedArr.push(arr1[i]);
        i++;
    }

    while (j < arr1.length) {
        sortedArr.push(arr2[j]);
        j++;
    }

    return sortedArr;
}

console.log(mergeSort([8, 4, 5, 6, 3, 1, 2, 9, 7]))
console.log(c);


































/* interface Item {
    id: string
    value: number,
    weight: number
}

const items : Item[] = [{id: "a", value: 10, weight: 3}, {id: "b", value: 6, weight: 8}, {id: "c", value: 3, weight: 3}]

const maxWeight = 8;

const bag : string[] = [];

for (let i = 0, size = 0; size < maxWeight && items[i]; i++) {
    if (items[i].weight + size <= maxWeight) {
        size += items[i].weight;
        bag.push(items[i].id);
    } 
}

console.log(items, bag) */

/* function sumUp(n : number) {    
    return (1 + n) * (n / 2);
} */


// const numbers = [1, 3, 10];

/* const array = Array.from({length: 10000}, (_, i) => i + 1);

let steps = 0;

const findFunc : (arr : number[], value : number) => boolean = (arr, value) => {    
    steps++;

    if (arr.length === 0) return false;

    if (value === arr[Math.floor(arr.length/2)-1]) {
        return true;
    }
    else if (value > arr[Math.floor(arr.length/2)-1]) {
        return findFunc(arr.slice(arr.length/2, arr.length), value);
    }
    else if (value < arr[Math.floor(arr.length/2)-1]) {
        return findFunc(arr.slice(0, arr.length/2), value);
    }    
    return false;
}

console.log(findFunc(array, 5000), steps); */