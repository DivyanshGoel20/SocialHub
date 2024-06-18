import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useActiveAddress, useConnection } from "@arweave-wallet-kit/react";
import {
  createDataItemSigner,
  dryrun,
  message,
  result,
} from "@permaweb/aoconnect";
import Editor from "../Components/Editor";

const Create = () => {
  const { connected } = useConnection();
  const processId = "8Y1_tmsgxxkOnt09p1spSKq3LBSq905yB9ofTlqkBR4";
  const [isFetching, setIsFetching] = useState(false);
  const [userList, setUserList] = useState([]);

  const activeAddress = useActiveAddress();

  const syncAllUsers = async () => {
    if (!connected) {
      return;
    }

    try {
      const res = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "UserList" }],
        anchor: "1234",
      });
      console.log("Dry run User result", res);
      const filteredResult = res.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered User result", filteredResult);
      setUserList(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const registerUser = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" }],
      data: "",
      signer: createDataItemSigner(window.arweaveWallet),
    });

    console.log("Register User result", res);

    const registerResult = await result({
      process: processId,
      message: res,
    });

    console.log("Registered successfully", registerResult);

    if (
      registerResult[0].Messages[0].Data === "Successfully Registered."
    ) {
      syncAllUsers();
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllUsers();
    console.log("This is active address", activeAddress);
    console.log(
      "Includes user",
      userList.some((user) => user.PID === activeAddress)
    );
    setIsFetching(false);
  }, [connected]);

  return (
    <main style={styles.main}>
      <Header />
      <div style={styles.parentDiv}>
        <h2 style={styles.heading}>Create a New Post</h2>
        {isFetching && <div>Fetching user status...</div>}
        <hr style={styles.horizontalRule} />
        {userList && userList.some((user) => user.PID === activeAddress) ? (
          <Editor />
        ) : (
          <button style={styles.button} onClick={registerUser}>
            Register
          </button>
        )}
      </div>
    </main>
  );
};

export default Create;

const styles = {
  main: {
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
  },
  parentDiv: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    margin: "0 0 20px 0",
    padding: "0",
    color: "#333",
    fontSize: "24px",
    textAlign: "center",
  },
  horizontalRule: {
    border: 0,
    clear: "both",
    display: "block",
    width: "100%",
    backgroundColor: "#ccc",
    height: "1px",
    margin: "20px 0",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    textDecoration: "none",
    display: "block",
    margin: "0 auto",
    
  },
};
