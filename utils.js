// generate random number
export function randomNum(start, end) {
    if (!start || !end) return Math.floor(Math.random() * 11);
    let numsArr = [];

    if (start > end) return "Wrong input";

    for (let i = start; i <= end; i++) {
        numsArr.push(i);
    }

    let index = Math.floor(Math.random() * numsArr.length);

    return numsArr[index];
}



