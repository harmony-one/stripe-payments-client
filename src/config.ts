const config = {
    apiUrl: process.env.REACT_APP_ONE_COUNTRY_API_URL || 'http://localhost:3001',
    stripe: {
        pkKey: process.env.REACT_APP_STRIPE_PK_KEY || '',
        apiVersion: (process.env.REACT_APP_STRIPE_API_VERSION || '2022-11-15')
    },
    walletConnect: {
        projectId: (process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID || '')
    },
    chainParams: {
        id: 1666600000, // '0x63564C40'
        name: 'Harmony Mainnet Shard 0',
        network: 'harmony',
        nativeCurrency: {
            decimals: 18,
            name: 'ONE',
            symbol: 'ONE',
        },
        rpcUrls: {
            default: 'https://api.harmony.one',
        },
        blockExplorers: {
            default: { name: 'Explorer', url: 'https://explorer.harmony.one/' },
        },
        testnet: true,
    }
}

export default config
