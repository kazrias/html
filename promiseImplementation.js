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
              if (fulfilledFromLastPromise instanceof FakePromise) {
                fulfilledFromLastPromise.then(resolve, reject)
              }
              else {
                resolve(fulfilledFromLastPromise)
              }
            } catch (err) {
              reject(err);
            }
          });
          this.onRejectedCallbacks.push(() => {
            try {
              const rejectedFromLastPromise = onRejected(this.result);
              if (rejectedFromLastPromise instanceof Promise) {
                rejectedFromLastPromise.then(resolve, reject);
              } else {
                reject(rejectedFromLastPromise);
              }
            } catch (err) {
              reject(err);
            }
          });
          break;
        case 'fulfilled':
          try {
            const fulfilledFromLastPromise = onFulfilled(this.result);
            if (fulfilledFromLastPromise instanceof Promise) {
              fulfilledFromLastPromise.then(resolve, reject);
            } else {
              resolve(fulfilledFromLastPromise);
            }
          } catch (err) {
            reject(err);
          }
          break;
        case 'rejected':
          try {
            const rejectedFromLastPromise = onRejected(this.value);
            if (rejectedFromLastPromise instanceof Promise) {
              rejectedFromLastPromise.then(resolve, reject);
            } else {
              reject(rejectedFromLastPromise);
            }
          } catch (err) {
            reject(err);
          }
          break;
      }
    })
  }
}
