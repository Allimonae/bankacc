# Bank Account Project

This project is a full-stack web application with a **React + Vite** frontend and a **Java + Spring Boot + MySQL** backend.

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Java 17** (or compatible)
- **Maven** (comes with Spring Boot projects, or use the included `mvnw` script)
- **MySQL Server** (v8+ recommended)

---

## Backend Setup (Spring Boot + MySQL)

### 1. Install Dependencies

Navigate to the backend folder:

```sh
cd backend
```

Install Maven dependencies:

```sh
./mvnw clean install
```
*(On Windows, use `mvnw.cmd` instead of `./mvnw` if needed.)*

### 2. Configure Database

- Make sure MySQL is running.
- Create a database and user (replace with your own values):

```sql
CREATE DATABASE your_db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
```

- Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
```

### 3. Run the Backend

```sh
./mvnw spring-boot:run
```
*(Or use `mvnw.cmd spring-boot:run` on Windows)*

The backend will start on [http://localhost:8080](http://localhost:8080).

---

## Frontend Setup (React + Vite)

### 1. Install Dependencies

Navigate to the frontend folder:

```sh
cd frontend
```

Install npm dependencies:

```sh
npm install
```

### 2. Configure API URL

Create a `.env` file in the `frontend` folder:

```
VITE_API_URL=http://localhost:8080
```

### 3. Run the Frontend

```sh
npm run dev
```

The frontend will start on [http://localhost:5173](http://localhost:5173).

---

## Usage

- Access the frontend in your browser at [http://localhost:5173](http://localhost:5173).
- The frontend communicates with the backend API at [http://localhost:8080](http://localhost:8080).

---

## Notes

- Make sure both backend and frontend servers are running for full functionality.
- For production, update configuration files and environment variables as needed.

---

## License

This project is for educational/demo purposes.