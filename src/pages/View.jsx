import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';

const View = () => {
  const { connected } = useConnection();
  const processId = "8Y1_tmsgxxkOnt09p1spSKq3LBSq905yB9ofTlqkBR4";
  const [isFetching, setIsFetching] = useState(false);
  const [postList, setPostList] = useState([]);

  const syncAllPosts = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "List" }],
        anchor: "1234",
      });
      console.log("Dry run result", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Filtered result", filteredResult);
      setPostList(filteredResult[0] || []);
      console.log(postList)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    syncAllPosts();
    // console.log(postList)
    setIsFetching(false);
  }, [connected]);

  return (
    <main style={styles.main}>
      <Header />
      <div style={styles.parentDiv}>
        <h2 style={styles.welcomeMessage}>Explore Posts on SocialHub</h2>
        <p style={styles.description}>Here you can view posts from others and share your own thoughts with the community.</p>
        {isFetching && <div>Fetching posts...</div>}
        <hr style={styles.horizontalRule} />
        {postList.length > 0 ? (
          postList.map((post, index) => (
            <div key={index} style={styles.postDiv}>
              <Link to={`/view/${post.ID}`} style={styles.postLink}>
                <h3 style={styles.postHeading}>{post.Title}</h3>
                <p style={styles.postContent}>Author: {post.Author}</p>
                <p style={styles.postContent}>Post ID: {post.ID}</p>
              </Link>
            </div>
          ))
        ) : (
          <p style={styles.noPostsMessage}>No posts available. Be the first to create one!</p>
        )}
        <hr style={styles.horizontalRule} />
      </div>
      <Outlet />
    </main>
  );
};

export default View;

const styles = {
  main: {
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
  },
  parentDiv: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  welcomeMessage: {
    fontSize: "36px",
    color: "#333",
    textAlign: "center",
    marginBottom: "10px",
  },
  description: {
    fontSize: "18px",
    color: "#666",
    textAlign: "center",
    marginBottom: "20px",
  },
  horizontalRule: {
    border: 0,
    height: "1px",
    backgroundColor: "#ccc",
    margin: "20px 0",
  },
  postDiv: {
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    marginBottom: "20px",
    transition: "transform 0.3s ease",
  },
  postDivHover: {
    transform: "scale(1.02)",
  },
  postHeading: {
    margin: "0 0 10px 0",
    padding: "0",
    color: "#333",
  },
  postContent: {
    margin: "0",
    padding: "0",
    color: "#555",
    fontSize: "14px",
  },
  postLink: {
    textDecoration: "none",
    color: "#333",
  },
  noPostsMessage: {
    textAlign: "center",
    color: "#999",
  },
};