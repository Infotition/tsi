import React, { FunctionComponent } from 'react';

import { add } from './add';
import styles from './index.module.scss';

export const Button: FunctionComponent = () => {
  return (
    <button data-testid="btn" className={styles.btn}>
      Hello World {add(40, 2)}
    </button>
  );
};
