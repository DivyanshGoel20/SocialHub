import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

const Discover = () => {
  const { connected } = useConnection();
  const processId = "8Y1_tmsgxxkOnt09p1spSKq3LBSq905yB9ofTlqkBR4";
  const [isFetching, setIsFetching] = useState(false);
  const [allUserList, setAllUserList] = useState([]);

  const syncAllUsers = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "UserList" }],
        anchor: "1234",
      });

      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setAllUserList(filteredResult[0] || []);
      console.log(allUserList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllUsers();
    setIsFetching(false);
  }, [connected]);

  return (
    <main style={styles.main}>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>Discover Other People!</h2>
        {isFetching ? (
          <p style={styles.loadingText}>Loading users...</p>
        ) : (
          <ul style={styles.userList}>
            {allUserList.length === 0 ? (
              <p style={styles.noUsersText}>No users found.</p>
            ) : (
              allUserList.map((user, index) => (
                <li key={index} style={styles.userItem}>
                  {user.PID}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </main>
  );
};

export default Discover;

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
  loadingText: {
    fontSize: "18px",
    color: "#555",
  },
  noUsersText: {
    fontSize: "18px",
    color: "#555",
  },
  userList: {
    listStyleType: "none",
    padding: 0,
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  userItem: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    color: "#555",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};
