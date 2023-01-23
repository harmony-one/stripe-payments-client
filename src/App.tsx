import React, {useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Grommet, Box } from 'grommet';
import {Root} from "./pages/Root";
import {Success} from "./pages/Success";
import {Cancel} from "./pages/Cancel";
import {theme} from "./theme";
import { WagmiConfig } from 'wagmi';
import { wagmiClient } from './utils';

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return ready ? (
    <WagmiConfig client={wagmiClient}>
      <Grommet full theme={theme}>
        <Box margin={'64px'}>
          <Routes>
            <Route path={'/'} element={<Root />} />
            <Route path={'/success'} element={<Success />} />
            <Route path={'/cancel'} element={<Cancel />} />
          </Routes>
        </Box>
      </Grommet>
    </WagmiConfig>
  ) : null;
}

export default App;
