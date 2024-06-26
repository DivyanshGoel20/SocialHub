import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

const Followers = () => {
  const { connected } = useConnection();
  const processId = "8Y1_tmsgxxkOnt09p1spSKq3LBSq905yB9ofTlqkBR4";
  const [isFetching, setIsFetching] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [error, setError] = useState(null);

  const syncAllFollowers = async () => {
    if (!connected) {
      return;
    }

    try {
      const addr = await window.arweaveWallet.getActiveAddress();
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "List-Followers" },
          { name: "userId", value: addr },
        ],
        anchor: "1234",
      });

      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setFollowersList(filteredResult[0] || []);
    } catch (error) {
      console.error("Failed to fetch the followers list", error);
      setError("Failed to fetch the followers list");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllFollowers();
  }, [connected]);

  return (
    <div style={styles.main}>
      <Header />
      <main style={styles.container}>
        <div style={styles.parentDiv}>
          <h2 style={styles.heading}>Check out who follows you</h2>
          {isFetching && <p style={styles.message}>Loading...</p>}
          {error && <p style={styles.errorText}>{error}</p>}
          {!isFetching && !error && followersList.length === 0 && (
            <p style={styles.message}>No one is following you yet.</p>
          )}
          {!isFetching && followersList.length > 0 && (
            <ul style={styles.list}>
              {followersList.map((follower, index) => (
                <li key={index} style={styles.listItem}>
                  {follower.FollowerPID}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Followers;

const styles = {
  main: {
    backgroundColor: "#f0f4f8",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
  },
  parentDiv: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
    marginTop: "20px",
    padding: "40px",
    textAlign: "center",
  },
  message: {
    fontSize: "18px",
    color: "#555",
    marginBottom: "10px",
  },
  errorText: {
    fontSize: "18px",
    color: "red",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    textAlign: "left",
  },
  listItem: {
    padding: "12px 20px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "16px",
    color: "#333",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};
