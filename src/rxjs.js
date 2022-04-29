import { 
    range, 
    filter,
    map, 
    from, 
    take,
    of,  
    first, 
    catchError,
    defer,
    fromEvent,
    interval,
    pipe,
    Observable,
    BehaviorSubject,
    Subject,
    AsyncSubject,
    ReplaySubject
} from 'rxjs';
 
// var subject = new BehaviorSubject(0); // 0是初始值

// subject.subscribe({
//   next: (v) => console.log('BehaviorSubject observerA: ' + v)
// });

// subject.next(1);
// subject.next(2);

// subject.subscribe({
//   next: (v) => console.log('BehaviorSubject observerB: ' + v)
// });

// subject.next(3);
// // BehaviorSubject observerA: 0
// // BehaviorSubject observerA: 1
// // BehaviorSubject observerA: 2
// // BehaviorSubject observerB: 2
// // BehaviorSubject observerA: 3
// // BehaviorSubject observerB: 3


// var subject1 = new Subject(0); // 0是初始值

// subject1.subscribe({
//   next: (v) => console.log('Subject observerA: ' + v)
// });

// subject1.next(1);
// subject1.next(2);

// subject1.subscribe({
//   next: (v) => console.log('Subject observerB: ' + v)
// });

// subject1.next(3);
// // Subject observerA: 1
// // Subject observerA: 2
// // Subject observerA: 3
// // Subject observerB: 3


// var asySubject = new AsyncSubject();

// asySubject.subscribe({
//   next: (v) => console.log('asySubject observerA: ' + v)
// });

// asySubject.next(1);
// asySubject.next(2);
// asySubject.next(3);
// asySubject.next(4);

// asySubject.subscribe({
//   next: (v) => console.log('asySubject observerB: ' + v)
// });

// asySubject.next(5);
// asySubject.complete();
// // 输出：
// // asySubject observerA: 5
// // asySubject observerB: 5

// var rpSubject = new ReplaySubject(3); // 为新的订阅者缓冲3个值

// rpSubject.subscribe({
//   next: (v) => console.log('rpSubject observerA: ' + v)
// });

// rpSubject.next(1);
// rpSubject.next(2);
// rpSubject.next(3);
// rpSubject.next(4);

// rpSubject.subscribe({
//   next: (v) => console.log('rpSubject observerB: ' + v)
// });

// rpSubject.next(5);
// rpSubject observerA: 1
// rpSubject observerA: 2
// rpSubject observerA: 3
// rpSubject observerA: 4
// rpSubject observerB: 2
// rpSubject observerB: 3
// rpSubject observerB: 4
// rpSubject observerA: 5
// rpSubject observerB: 5

let abc = new Observable((subscriber) => {
  subscriber.next('kiki');
  subscriber.next('tsin');
});
abc.subscribe((name) => {
  console.log('expected name:', name)
})
// function delay(delayInMillis) {
//   return (observable) =>
//     new Observable((subscriber) => {
//       console.log('delay funcs')
//       const subscription = observable.subscribe({
//         next(value) {
//           console.log('next', value)
//         },
//         error(err) {
//           // We need to make sure we're propagating our errors through.
//           subscriber.error(err);
//         },
//         complete() {
//           subscriber.complete();
//         },
//       });

//       return () => {
//         subscription.unsubscribe();
//       };
//     });
// }
 
// // Try it out!
// of(1, 2, 3).pipe(delay(1000)).subscribe((x) => {
//   console.log('finally---', x)
// });

// const numbers = range(5, 3);
 
// numbers.subscribe({
//   next: value => console.log(`range: ${value}`),
//   complete: () => console.log('Complete!')
// });
 
// Logs:
// 1
// 2
// 3
// 'Complete!'

// function* generateDoubles (seed) {
//   let i = seed;
//   while (true) {
//     yield i;
//     i = 2 * i;
//   }
// }

// const iterator = generateDoubles(3);
// const result = from(iterator).pipe(take(2));

// result.subscribe(x => console.log('iterator '+ x))

// const deferDemo = defer(() => {
//   return interval(1000)
// })

// deferDemo.subscribe(x => console.log(x))

// import { ajax } from 'rxjs/ajax'; 
// const obs$ = ajax({
//     url: 'https://httpbin.org/delay/2',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'rxjs-custom-header': 'Rxjs'
//     },
//     body: {
//       rxjs: 'Hello World!'
//     }
//   }).pipe(
//   map(userResponse => console.log('users: ', userResponse)),
//   catchError(error => {
//     console.log('error: ', error);
//     return of(error);
//   })
// );
 
// obs$.subscribe({
//   next: value => console.log(value),
//   error: err => console.log(err)
// });

// const observable = of('abc ')
// observable
// .pipe(first())
// .subscribe({
//     next: (x) => {
//         console.log(x + 'subscribe')
//     },
//     error: (err) => {
//         console.error(err)
//     }
// })
// range(1, 10)
//   .pipe(
//     filter(x => x % 2 === 1),
//     map(x => x + x)
//   )
//   .subscribe(x => console.log(x));