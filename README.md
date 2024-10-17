StockVibe
StockVibe is a responsive web application designed for managing stock portfolios. The application allows users to add their shares and stay informed with the latest news and updates on selected stocks through the integration of NewsAPI.
Features
Portfolio Management: Add and manage your stock shares seamlessly.
Latest News Updates: Receive the latest news and updates about your selected stocks with the integrated NewsAPI.
Stock Timeline: View a detailed timeline for each stock, displaying:
Buy/sell actions
User notes
Relevant news
Secure Authentication:
JWT token-based authentication and Firebase email verification ensure robust protection for user data.
Passwords are securely hashed using bcrypt, enhancing security against unauthorized access.
Data Validation: Zod is used for schema validation, ensuring data integrity and reducing runtime errors.
State Management: Recoil is used for efficient and scalable state management.
Design: The user interface is styled using Tailwind CSS and Material UI components for a modern and responsive design.
Technologies Used
Frontend: React.js, Recoil, Tailwind CSS, Material UI
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT, Firebase, bcrypt
API: NewsAPI
Validation: Zod
