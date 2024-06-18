import { Link, useParams } from "react-router-dom";
import Header from "../Components/Header";
import { useEffect, useState } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

const ViewPost = () => {
  const { postId } = useParams();
  const { connected } = useConnection();

  const processId = "8Y1_tmsgxxkOnt09p1spSKq3LBSq905yB9ofTlqkBR4";
  const [isFetching, setIsFetching] = useState(false);
  const [postContent, setPostContent] = useState();

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [
          { name: "Action", value: "Get" },
          { name: "Post-Id", value: postId },
        ],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = JSON.parse(result.Messages[0].Data);
      console.log("Filtered result", filteredResult);
      setPostContent(filteredResult[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    setIsFetching(false);
  }, [connected]);

  return (
    <main style={styles.main}>
      <Header />
      {postContent && (
        <div style={styles.parentDiv}>
          <h2 style={styles.postHeading}>{postContent.Title}</h2>
          <p style={styles.postAuthor}>Author: {postContent.Author}</p>
          <p style={styles.postId}>Post ID: {postContent.ID}</p>
          <Link to="/view" style={styles.postLink}>
            <button style={styles.button}>Back</button>
          </Link>
          <hr style={styles.horizontalRule} />
          <ReactQuill value={postContent.Body} readOnly theme="bubble" />
        </div>
      )}
    </main>
  );
};

export default ViewPost;

const styles = {
  main: {
    backgroundColor: "#f0f0f0",
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
  horizontalRule: {
    border: 0,
    clear: "both",
    display: "block",
    width: "100%",
    backgroundColor: "#ccc",
    height: "1px",
    margin: "20px 0",
  },
  postHeading: {
    margin: "0 0 10px 0",
    padding: "0",
    color: "#333",
    fontSize: "24px",
  },
  postAuthor: {
    margin: "0 0 5px 0",
    padding: "0",
    color: "#555",
    fontSize: "16px",
  },
  postId: {
    margin: "0 0 20px 0",
    padding: "0",
    color: "#777",
    fontSize: "14px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "20px",
    textDecoration: "none",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  postLink: {
    textDecoration: "none",
    display: "inline-block",
  },
};
