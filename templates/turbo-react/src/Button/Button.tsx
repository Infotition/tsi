import { FunctionComponent } from 'react';

import styles from './Button.module.scss';

export const Button: FunctionComponent = () => {
  return (
    <button data-testid="btn" className={styles.btn}>
      Hello World
    </button>
  );
};
