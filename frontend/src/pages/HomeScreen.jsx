import { Link } from "react-router-dom";
import Runner from "../components/Runner";
import { ApiDemoButtons } from "../components/ApiDemoButtons";

{/* The runner component is included on this page */}
export function HomeScreen() {
    return(
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white px-4 font-mono"> {/* Page container */}
        <h2 className="text-2xl font-mono font-bold">Bankish</h2>
        
        <Link to="/actions" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 hover:text-white">
            Actions
        </Link>

        <Link to="/transactions" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 hover:text-white">
            Transactions
        </Link>
      </div>
    );
}