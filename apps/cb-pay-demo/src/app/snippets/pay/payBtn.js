import { useRef, useState, useEffect } from 'react';
import { initOnRamp } from '@coinbase/cbpay-js';
import { payConfig } from './connectionOptions';

export const PayWithCoinbaseButton = () => {
  const onrampInstance = useRef();
  // set isReady state when the Pay button can be clicked
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onrampInstance.current = initOnRamp({
      ...payConfig,
      onReady: () => {
        setIsReady(true);
      },
      onSuccess: () => {
        console.log('success');
      },
      onExit: (event) => {
        console.log('exit', event);
      },
      onEvent: (event) => {
        console.log('onEvent', event); // open, transition view, errors
      },
      closeOnExit: true,
      closeOnSuccess: true,
    });
    return () => {
      onrampInstance.current?.destroy();
    };
  }, []);

  const handleClick = () => {
    onrampInstance.current?.open();
  };

  return (
    <button onClick={handleClick} disabled={!isReady}>
      <img
        src="/static/img/add-crypto-button.png"
        alt="Add crypto with Coinbase Pay"
      />
    </button>
  );
};

const snippet = `import { useRef, useState, useEffect } from 'react'
import { initOnRamp } from '@coinbase/cbpay-js';
import { payConfig } from './connectionOptions';

export const PayWithCoinbaseButton = () => {
  const onrampInstance = useRef();
  // set isReady state when the Pay button can be clicked
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onrampInstance.current = initOnRamp({
      ...payConfig,
      onReady: () => {
        setIsReady(true);
      },
      onSuccess: () => {
        console.log('success');
      },
      onExit: (event) => {
        console.log('exit', event);
      },
      onEvent: (event) => {
        console.log('onEvent', event); // open, transition view, errors
      },
      closeOnExit: true,
      closeOnSuccess: true,
    });
    return () => {
      onrampInstance.current?.destroy();
    };
  }, []);

  const handleClick = () => {
    onrampInstance.current?.open();
  };

  return (
      <button onClick={handleClick} disabled={!isReady}>
        <img
          src="/static/img/add-crypto-button.png"
          alt="Add crypto with Coinbase Pay"
        />
      </button>
  );
};`;

export default snippet;
