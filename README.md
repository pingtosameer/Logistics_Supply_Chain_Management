# Logistics & Supply Chain Management Dashboard

A modern, responsive web application for managing logistics operations, tracking shipments, and overseeing driver fleets. Built with Next.js and styled with pure CSS.

## 🚀 Features

### 📊 Interactive Dashboard
- **Real-time Overview:** Visualize key metrics like Total Shipments, Revenue, Active Drivers, and Delayed Shipments.
- **Data Visualization:** Interactive charts focusing on revenue trends and activity.
- **Recent Activity:** Live feed of shipment updates and system alerts.

### 🚚 Shipment Tracking
- **Detailed Tracking:** Track shipments by ID (e.g., `TRK-IN-849201`) with a visual timeline of the journey.
- **Status Updates:** View current status, estimated delivery, and detailed shipment history.
- **Map Integration:** (Mock) Visual map representation of the shipment route.

### 👨‍✈️ Driver Fleet Management
- **Driver List:** View all active drivers in the fleet with their status and vehicle details.
- **Add Drivers:** easily onboard new drivers to the system.
- **Data Persistence:** Driver data is saved locally, ensuring your fleet list remains intact across page reloads.
- **Driver Removal:** Manually remove drivers from the fleet as needed.

### 🏢 Brand & Seller Portals
- **Brand Portal:** Dedicated interface for brands to monitor their specific shipments and performance metrics.
- **Seller View:** Tailored view for sellers to manage their outgoing logistics.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library:** React.js
- **Styling:** CSS Modules (Responsive & Modern Design)
- **Icons:** Lucide React
- **Charts:** Recharts
- **State Management:** React Context API + LocalStorage for persistence

## 🏁 Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pingtosameer/Logistics_Supply_Chain_Management.git
    cd Logistics_Supply_Chain_Management
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Project Structure

```
/app
  /brand          # Brand portal pages
  /dashboard      # Main dashboard and feature pages
  /tracking       # Public tracking page
/components       # Reusable UI components (Sidebar, Charts, etc.)
/lib              # Utility functions and mock data
/public           # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
