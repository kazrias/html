class FakePromise {
  constructor(executor) {
    this.status = 'pending';
    this.result = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (res) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled';
        this.result = res;
        this.onFulfilledCallbacks.forEach(fn => fn(res));
      }
    }
    const reject = (error) => {
      if (this.status === 'pending') {
        this.status = 'rejected';
        this.result = error;
        this.onRejectedCallbacks.forEach(fn => fn(error));
      }
    }
    try {
      executor(resolve, reject);
    }
    catch (err) {
      reject(err)
    }
  }
  then(onFulfilled, onRejected) {
    return new FakePromise((resolve, reject) => {
      switch (this.status) {
        case 'pending':
          this.onFulfilledCallbacks.push(() => {
            try {
              const fulfilledFromLastPromise = onFulfilled(this.result);
              resolve(fulfilledFromLastPromise);
            } catch (err) {
              reject(err);
            }
          });
          this.onRejectedCallbacks.push(() => {
            try {
              const rejectedFromLastPromise = onRejected(this.result);
              reject(rejectedFromLastPromise);
            } catch (err) {
              reject(err);
            }
          });
          break;
        case 'fulfilled':
          try {
            const fulfilledFromLastPromise = onFulfilled(this.result);
            resolve(fulfilledFromLastPromise);
          } catch (err) {
            reject(err);
          }

          break;
        case 'rejected':
          try {
            const rejectedFromLastPromise = onRejected(this.result);
            reject(rejectedFromLastPromise);
          } catch (err) {
            reject(err);
          }
          break;
      }
    })
  }
}

const p1 = new FakePromise((resolve, reject) => {
  resolve('resolved!');
});
const p2 = new FakePromise((resolve, reject) => {
  reject('rejected!')
})

p1.then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
});

const p3 = new FakePromise((resolve, reject) => {
  setTimeout(() => resolve('resolved!'), 1000);
});
p3.then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
});

const p = new FakePromise((resolve, reject) => {
  setTimeout(() => resolve('resolved first one'), 1000);
});
p.then((res) => {
  console.log(res);
  return 5
}).then(res => console.log(res))