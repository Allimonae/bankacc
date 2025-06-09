import { Link } from "react-router-dom";

{/*This file contains the design logic and navigation buttons of the landing page*/}

export function Welcome() {
    return (
      <div className="welcome-container"> {/* Page container */}
        <div className="text-center"> {/* Inner container for content */}
          <h2 className="welcome-title">
            Bank<span>ish</span>
          </h2> {/* Title with animation */}

          {/* Buttons container */}
          <div className="welcome-buttons">
            <Link 
              to="/sign-in" 
              className="welcome-button"
            >
              Log In
            </Link>
             
            <Link 
              to="/sign-up" 
              className="welcome-button"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
}