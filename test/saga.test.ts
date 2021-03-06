import {
  eventEmitter,
  IEventEmitter,
  TContainerWithEventEmitter,
} from '../src/decorator/eventEmitter';
import * as assert from 'assert';
import {ISaga, saga} from '../src/decorator/saga';
import {take} from 'redux-saga/effects';
import {
  ContainerWithImmerAndGlobAccessAndDispatch,
  TContainerWithStore,
} from '../src/Container';

const test = () => {
  {
    interface ITest2 {
      hello?: string;
      world?: number;
    }

    interface MyColonne
      extends ContainerWithImmerAndGlobAccessAndDispatch<
          ITest2,
          TEventEmitter,
          keyof ITest2
        >,
        IEventEmitter<ITest2, keyof ITest2>,
        ISaga {}

    type TEventEmitter = TContainerWithEventEmitter<keyof ITest2> &
      TContainerWithStore<ITest2, keyof ITest2>;

    @saga
    @eventEmitter
    class MyColonne extends ContainerWithImmerAndGlobAccessAndDispatch<
      ITest2,
      TEventEmitter,
      keyof ITest2
    > {}
    const ev = new MyColonne({});

    const fn = (bus: any, data: any) => {
      console.log('HELLO', data);
      assert.deepStrictEqual('world', data);
      assert.deepStrictEqual(bus, ev);
    };

    ev.runSaga(function* () {
      console.log("HELLO WORLD IT's ME SAGA");

      while (1) {
        yield take('hello');
        console.log('hello TAKEN in SAGA');
      }
    });

    ev.subscribe('hello', fn)
      .dispatch('hello', 'world')
      .unsubscribe('hello', fn)
      .dispatch('hello', 'should not subscribe');
  }
};

test();
