import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import Header from "../Components/Header";
import { Link } from "react-router-dom";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main style={styles.main}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>Welcome to SocialHub!</h2>
        <p style={styles.description}>
          Discover, connect, and share with your friends and the world around you on SocialHub.
        </p>
        {connected ? (
          <button style={styles.viewPostsButton}>
            <Link to="/view" style={styles.viewPostsLink}>
              View Posts
            </Link>
          </button>
        ) : (
          <ConnectButton style={styles.connectButton} />
        )}
      </div>
    </main>
  );
};

export default Home;

const styles = {
  main: {
    backgroundColor: "#f0f4f8",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  description: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "40px",
    textAlign: "center",
    maxWidth: "600px",
  },
  viewPostsButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  viewPostsLink: {
    color: "#fff",
    textDecoration: "none",
  },
  connectButton: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

