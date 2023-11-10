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
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      }
    }
    function reject(error) {
      if (this.status === 'pending') {
        this.pending = 'rejected';
        this.result = error;
        this.onRejectedCallbacks.forEach(fn => fn(value));
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
    switch (this.status) {
      case 'pending':
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
        break;
      case 'fulfilled':
        onFulfilled(this.result);
      case 'rejected':
        onReject(this.result)
    }
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
