import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Grommet, Box } from 'grommet';
import {Root} from "./pages/Root";
import {Success} from "./pages/Success";
import {Cancel} from "./pages/Cancel";
import {theme} from "./theme";
import { Checkout } from './pages/Checkout';

function App() {
  return (
      <Grommet full theme={theme}>
          <Box margin={'64px'}>
              <Routes>
                  <Route path={'/'} element={<Root />} />
                  <Route path={'/success'} element={<Success />} />
                  <Route path={'/cancel'} element={<Cancel />} />
                  <Route path={'/checkout'} element={<Checkout />} />
              </Routes>
          </Box>
      </Grommet>
  );
}

export default App;
