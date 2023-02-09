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

export function writeText(context, content,x,y,sz, colorVal) {
    context.font = "italic bold " + sz + "px Tahoma";
    context.fillStyle = 'white';
    context.textAlign = 'right;'
    context.fillStyle = rainbow(colorVal)
    context.fillText(content, x, y);
  }

export function pwrToFontsize(pwr){
    let base_size = 40;
    base_size = base_size + Math.max(pwr/40,0);
    return String(base_size)
}

export function rainbow(n) {
    let str = 'hsl('+ 360*n/1200 +',100%,50%)';
    return str
}