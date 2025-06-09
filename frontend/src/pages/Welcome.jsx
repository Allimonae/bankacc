import { Link } from "react-router-dom";

{/*This file contains the design logic and navigation buttons of the landing page*/}

export function Welcome() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'lightgray',
        color: 'white',
        fontFamily: 'Source Code Pro, monospace',
      }}> {/* Page container. Flexbox for centering */}
        {/* Import Source Code Pro font with italic variant */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@1,700&display=swap');

            @keyframes fadeIn {
              0% {
                opacity: 0;
                transform: translateY(-20px); /* Correct spacing */
              }
              100% {
                opacity: 1;
                transform: translateY(0); /* Correct syntax */
              }
            }
          `
        }} />

        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}> {/* Inner container for content */}
          <h2 style={{
            color: 'black',
            fontSize: '60px',
            fontWeight: 'bold',
            marginBottom: '20px',
            animation: 'fadeIn 1s ease-in-out', // Apply animation
          }}>
            Bank<span style={{ fontStyle: 'italic', color: '#666666' }}>ish</span>
          </h2> {/* Title with Source Code Pro font and styled "ish" */}

          {/* Buttons container */}
          <div style={{
            display: 'flex',
            flexDirection: 'row', // Arrange buttons side by side
            justifyContent: 'center',
            gap: '20px', // Add spacing between buttons
          }}>
            <Link 
              to="/sign-in" 
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#6b7280', // Gray background
                color: 'white',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s ease', // Smooth transition
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#4b5563'; // Darker gray on hover
                e.target.style.transform = 'scale(1.05)'; // Slight zoom effect
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#6b7280'; // Reset background color
                e.target.style.transform = 'scale(1)'; // Reset zoom effect
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(2px)'; // Button goes down on click
                e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)'; // Reduced shadow
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'translateY(0px)'; // Reset position
                e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; // Reset shadow
              }}
            >
              Log In
            </Link>
             
            <Link 
              to="/sign-up" 
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: '#6b7280', // Gray background
                color: 'white',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'all 0.3s ease', // Smooth transition
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#4b5563'; // Darker gray on hover
                e.target.style.transform = 'scale(1.05)'; // Slight zoom effect
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#6b7280'; // Reset background color
                e.target.style.transform = 'scale(1)'; // Reset zoom effect
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(2px)'; // Button goes down on click
                e.target.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)'; // Reduced shadow
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'translateY(0px)'; // Reset position
                e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)'; // Reset shadow
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
}