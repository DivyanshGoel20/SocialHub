import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import AddFollower from "../Components/AddFollower";

const Following = () => {
  const { connected } = useConnection();
  const processId = "8Y1_tmsgxxkOnt09p1spSKq3LBSq905yB9ofTlqkBR4";
  const [isFetching, setIsFetching] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const [error, setError] = useState(null);

  const syncAllFollowing = async () => {
    if (!connected) {
      return;
    }

    try {
      const addr = await window.arweaveWallet.getActiveAddress();
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "List-Following" }, { name: "userId", value: addr }],
        anchor: "1234",
      });

      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setFollowingList(filteredResult[0] || []);
    } catch (error) {
      console.error("Failed to fetch the following list", error);
      setError("Failed to fetch the following list");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllFollowing();
  }, [connected]);

  return (
    <main style={styles.main}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>See Who You Follow</h2>
        <AddFollower processId={processId} />
        <div style={styles.listContainer}>
          {isFetching && <p style={styles.loadingText}>Loading...</p>}
          {error && <p style={styles.errorText}>{error}</p>}
          {!isFetching && followingList.length === 0 && (
            <p style={styles.noFollowingText}>You are not following anyone yet.</p>
          )}
          {!isFetching && followingList.length > 0 && (
            <ul style={styles.followingList}>
              {followingList.map((follow, index) => (
                <li key={index} style={styles.followingItem}>
                  {follow.FollowingPID}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};

export default Following;

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
  listContainer: {
    width: "100%",
    maxWidth: "600px",
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  loadingText: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginTop: "20px",
  },
  errorText: {
    fontSize: "16px",
    color: "red",
    textAlign: "center",
    marginTop: "20px",
  },
  noFollowingText: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginTop: "20px",
  },
  followingList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  followingItem: {
    padding: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    color: "#555",
    marginBottom: "8px",
  },
};
