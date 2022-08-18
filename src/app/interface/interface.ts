export interface customer {
    name: string;
    age: number;
    phoneNumber: string;
    gender: string;
    address: string;
    citizenship: string;
    registerDate: string;
    occupied: string;
}

export interface customerWithInvoice {
    name: string;
    age: number;
    phoneNumber: string;
    gender: string;
    address: string;
    invoiceId: number;
    TotalPrice: number;
    bookingId: number;
}

export interface booking {
    checkInDate: Date;
    checkOutDate: Date;
    customerId: number;
    price: number;
    noOfRooms: number;
}

export interface Invoice {
    isprinted: string,
    customerId: number,
    bookingId: number;
}

