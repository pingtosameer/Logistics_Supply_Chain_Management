
export const shipments = [
    {
        id: "TRK-IN-849201",
        sender: "Flipkart Seller: TechRetail",
        recipient: "Amit Sharma",
        origin: "Bhiwandi, Maharashtra",
        destination: "Connaught Place, New Delhi",
        status: "In Transit",
        courier: "Ecom Express",
        estimatedDelivery: "2023-11-15",
        currentLocation: "Jaipur, Rajasthan",
        lastUpdated: "2023-11-12T14:30:00Z",
        events: [
            { date: "2023-11-12T14:30:00Z", status: "Arrived at Facility", location: "Jaipur, Rajasthan", description: "Package arrived at regional hub" },
            { date: "2023-11-11T09:15:00Z", status: "Departed", location: "Bhiwandi, Maharashtra", description: "Departed from origin facility" },
            { date: "2023-11-10T16:00:00Z", status: "Picked Up", location: "Bhiwandi, Maharashtra", description: "Package received by Ecom Express" },
        ]
    },
    {
        id: "TRK-IN-392104",
        sender: "Myntra Designs",
        recipient: "Priya Patel",
        origin: "Gurugram, Haryana",
        destination: "Indiranagar, Bengaluru",
        status: "Delayed",
        courier: "Delhivery",
        estimatedDelivery: "2023-11-18",
        currentLocation: "Hyderabad Hub",
        lastUpdated: "2023-11-13T08:00:00Z",
        events: [
            { date: "2023-11-13T08:00:00Z", status: "Transit Delay", location: "Hyderabad, Telangana", description: "Heavy rain causing operational delay" },
            { date: "2023-11-12T22:45:00Z", status: "Arrived at Hub", location: "Hyderabad, Telangana", description: "Reached sorting center" },
            { date: "2023-11-10T04:20:00Z", status: "In Transit", location: "Gurugram, Haryana", description: "Departed from NCR Hub" },
        ]
    },
    {
        id: "TRK-IN-102938",
        sender: "Ajio Styles",
        recipient: "Rahul Verma",
        origin: "Surat, Gujarat",
        destination: "Andheri West, Mumbai",
        status: "Delivered",
        courier: "BlueDart",
        estimatedDelivery: "2023-11-10",
        currentLocation: "Andheri West, Mumbai",
        lastUpdated: "2023-11-10T11:20:00Z",
        events: [
            { date: "2023-11-10T11:20:00Z", status: "Delivered", location: "Mumbai, Maharashtra", description: "Delivered to Security Guard" },
            { date: "2023-11-10T08:30:00Z", status: "Out for Delivery", location: "Mumbai, Maharashtra", description: "Rider is out for delivery" },
            { date: "2023-11-09T20:15:00Z", status: "Arrived at Facility", location: "Mumbai, Maharashtra", description: "Arrived at local delivery center" },
        ]
    },
    {
        id: "TRK-IN-556677",
        sender: "AutoSpare India",
        recipient: "Mechanic Shop #42",
        origin: "Chennai, Tamil Nadu",
        destination: "Kochi, Kerala",
        status: "Pending",
        courier: "DTDC",
        estimatedDelivery: "2023-11-20",
        currentLocation: "Chennai, Tamil Nadu",
        lastUpdated: "2023-11-13T10:00:00Z",
        events: [
            { date: "2023-11-13T10:00:00Z", status: "Label Created", location: "Chennai, Tamil Nadu", description: "Shipping label created, awaiting pickup" },
        ]
    },
    {
        id: "TRK-IN-778899",
        sender: "FabIndia",
        recipient: "Sanjeev Kumar",
        origin: "Jaipur, Rajasthan",
        destination: "Salt Lake, Kolkata",
        status: "In Transit",
        courier: "XpressBees",
        estimatedDelivery: "2023-11-14",
        currentLocation: "Varanasi, UP",
        lastUpdated: "2023-11-13T16:45:00Z",
        events: [
            { date: "2023-11-13T16:45:00Z", status: "In Transit", location: "Varanasi, Uttar Pradesh", description: "Crossed state border" },
            { date: "2023-11-12T10:00:00Z", status: "Departed", location: "Jaipur, Rajasthan", description: "Dispatched from origin" },
        ]
    }
];

export const getShipmentById = async (id) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return shipments.find(s => s.id === id) || null;
};

export const getAllShipments = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return shipments;
};

export const getDashboardStats = async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Group by status
    const stats = {
        total: shipments.length,
        inTransit: shipments.filter(s => s.status === 'In Transit').length,
        delayed: shipments.filter(s => s.status === 'Delayed').length,
        delivered: shipments.filter(s => s.status === 'Delivered').length,
        pending: shipments.filter(s => s.status === 'Pending').length,
    };
    return stats;
}
