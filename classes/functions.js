export function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

export function addA(a,b){
    let c = Array();
    for (let i = 0; i < a.length;i++){
        c[i] = a[i] + b[i];
    }
    return c;
}

// function for multiplication of an array with either another array or 
// a scalar, b
export function multiA(a,b){
    let c = Array()
    if (typeof b == 'number'){
        for (let i = 0; i < a.length;i++){
            c[i] = a[i] * b;
        }
    } else {
    for (let i = 0; i < a.length;i++){
        c[i] = a[i] * b[i];
    }
    }

    return c;
}

