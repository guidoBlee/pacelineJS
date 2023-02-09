export function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }
// elementwise addition of a and b. 
export function addA(a,b){
    let c = Array();
    for (let i = 0; i < a.length;i++){
        c[i] = a[i] + b[i];
    }
    return c;
}

// function for elementwise multiplication of an array, 'a', with 
// either another array or scalar, 'b'
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
    y -= sz
    return y
  }
  export function whiteText(context, content,x,y,sz) {
    context.font = "italic bold " + sz + "px Tahoma";
    context.fillStyle = 'white';
    context.textAlign = 'right;'
    context.fillText(content, x, y);
  }

export function pwrToFontsize(pwr){
    let base_size = 40;
    base_size = base_size + Math.max(pwr/40,0);
    return String(base_size)
}

export function rainbow(n) {
    n = Math.max(n,0);
    let str = 'hsl('+ 360*n/2400 +',100%,50%)';
    return str
}