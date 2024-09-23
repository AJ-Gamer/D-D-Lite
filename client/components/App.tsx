import React, { FC } from 'react';
import HomePage from './HomePage';
import CharCreation from './CharCreation';

const App: FC = () => {
  return (
    <div>
      <HomePage />
      <CharCreation />
    </div>
  );
};

export default App;