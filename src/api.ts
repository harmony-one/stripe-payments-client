import axios from 'axios'
import config from './config'

const api = axios.create({
    baseURL: `${config.apiUrl}`,
    headers: { "Content-Type": "application/json" },
});

export const createPaymentIntent = async (paymentMethodType = 'card', currency = 'usd'): Promise<string> => {
    const { data } = await api.post('/stripe/create-payment-intent', {
        paymentMethodType,
        currency
    })
    return data.clientSecret
}
