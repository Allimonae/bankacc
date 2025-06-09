# Bank Account Project

This project uses a **React + Vite** frontend and an **Express + SQLite** backend.

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)

---

## Backend Setup (Express + SQLite)

### 1. Install Dependencies

Navigate to the backend folder:

```sh
cd backend
```

Install npm dependencies:

```sh
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` folder with your database settings:

```properties
PORT=8080
DB_FILE=./database.sqlite
```

### 3. Run the Backend

```sh
node index.js
```

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