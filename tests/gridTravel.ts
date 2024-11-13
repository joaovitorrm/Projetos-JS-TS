const memoTravel = {};

const gridTravel : (rows: number, columns: number) => any = (rows : number, columns : number) => {

    const key = rows + "," + columns;

    if (memoTravel[key]) {
        return memoTravel[key];
    }

    if (rows === 0 || columns === 0) return 0;
    if (rows === 1 && columns === 1) return 1;
    
    memoTravel[key] = gridTravel(rows-1, columns) + gridTravel(rows, columns-1)
    memoTravel[`${columns},${rows}`] = memoTravel[key];

    return memoTravel[key];
} 

console.log(gridTravel(18, 18))