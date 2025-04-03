import { DeliveryType } from "./delivery.type"
import { OrderStatusType } from "./order-status.type"
import { PaymentType } from "./payment.type"

export type OrderType = {
    deliveryType: DeliveryType,
    firstName: string,
    lastName: string,
    fatherName?: string,
    phone: string | number,
    paymentType: PaymentType,
    email: string,
    street?: string,
    house?: string | number,
    entrance?: string | number,
    apartment?: string | number,
    comment?: string,
    items?: {
        id: string,
        name: string,
        quantity: number,
        price: number,
        total: number
    }[],
    totalAmount?: number,
    status?: OrderStatusType,
    statusRus?: string,
    color?: string
}