import axios from 'axios'
import config from './config'

const api = axios.create({
    baseURL: `${config.apiUrl}`,
    headers: { "Content-Type": "application/json" },
});

export const createPaymentIntent = async (): Promise<string> => {
    const { data } = await api.post('/stripe/create-payment-intent')
    return data.clientSecret
}
