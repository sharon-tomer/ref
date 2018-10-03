export function promisify(f, args) { // assuming last arg is cb
    
    return new Promise((resolve) => {
      f(...args, res => resolve(res));
    })
}