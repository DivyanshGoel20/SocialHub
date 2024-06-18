import { useState } from "react";
import { message } from "@permaweb/aoconnect";
import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner } from "@permaweb/aoconnect";

const AddFollower = ({ processId }) => {
  const { connected } = useConnection();
  const [followerPID, setFollowerPID] = useState("");
  const [status, setStatus] = useState("");

  const handleAddFollower = async () => {
    if (!connected) {
      setStatus("Not connected");
      return;
    }

    try {
      const res = await message({
        process: processId,
        signer: createDataItemSigner(window.arweaveWallet),
        tags: [{ name: "Action", value: "Add-Follower" }],
        data: followerPID,
      });

      console.log("Response:", res);
      setStatus("Follower added successfully");
      setFollowerPID("");
    } catch (error) {
      console.log("Error:", error);
      setStatus("Failed to add follower");
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        value={followerPID}
        onChange={(e) => setFollowerPID(e.target.value)}
        placeholder="Enter address"
        style={styles.input}
      />
      <button onClick={handleAddFollower} style={styles.button}>
        Start Following
      </button>
      {status && <p style={styles.status}>{status}</p>}
    </div>
  );
};

export default AddFollower;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px",
  },
  input: {
    padding: "10px",
    marginBottom: "10px",
    width: "100%",
    maxWidth: "300px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  status: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
};
