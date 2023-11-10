class FakePromise {
  constructor(executor) {
    this.status = 'pending';
    this.result = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    function resolve(res) {
      if (this.status === 'pending') {
        this.pending = 'fulfilled';
        this.result = res;
        this.onFulfilledCallbacks.forEach(fn => fn(res));
      }
    }
    function reject(error) {
      if (this.status === 'pending') {
        this.pending = 'rejected';
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
  then(onFulfilled, onReject) {
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

const p1 = new Promise((resolve, reject) => {
  resolve('resolved!');
});
const p2 = new Promise((resolve, reject) => {
  reject('rejected!')
})
p1.then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
});
p2.then((res) => {
  console.log(res);
}, (err) => {
  console.log(err);
});
