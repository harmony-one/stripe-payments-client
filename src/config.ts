const config = {
    apiUrl: process.env.REACT_APP_ONE_COUNTRY_API_URL || 'http://localhost:3001',
    stripe: {
        pkKey: process.env.REACT_APP_STRIPE_PK_KEY || '',
        apiVersion: (process.env.REACT_APP_STRIPE_API_VERSION || '2022-11-15')
    }
}

export default config
