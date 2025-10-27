import React, { useState } from "react";
import Blog1 from "./blog/Blog1";
import Blog2 from "./blog/Blog2";
import Blog3 from "./blog/Blog3";
import Blog4 from "./blog/Blog4";
import Blog5 from "./blog/Blog5";
import Blog6 from "./blog/Blog6";
import Blog7 from "./blog/Blog7";
import Blog8 from "./blog/Blog8";
import Blog9 from "./blog/Blog9";
import Blog10 from "./blog/Blog10";

const styles = {
  body: {
    backgroundColor: "#000",
    color: "#e0e0e0",
    fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    lineHeight: 1.7,
    marginTop: "30px",
    padding: 0,
  },
  mainContainer: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "50px 20px",
  },
  filtersContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  filterDropdown: {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "25px",
    padding: "12px 20px",
    color: "#e0e0e0",
    fontSize: "14px",
    minWidth: "120px",
    cursor: "pointer",
    outline: "none",
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "30px",
    marginBottom: "50px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "15px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
    borderColor: "#4f46e5",
  },
  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "0",
  },
  cardContent: {
    padding: "20px",
  },
  cardDate: {
    color: "#999",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "10px",
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: "1.4em",
    fontWeight: "600",
    marginBottom: "15px",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "15px",
  },
  cardTag: {
    backgroundColor: "#333",
    color: "#4f46e5",
    padding: "4px 12px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "500",
  },
  cardReadMore: {
    color: "#4f46e5",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "auto",
  },
  arrow: {
    fontSize: "16px",
    transition: "transform 0.3s ease",
  },
  blogPost: {
    backgroundColor: "#1e1e1e",
    border: "1px solid #333",
    borderRadius: "10px",
    padding: "25px 40px",
    marginBottom: "50px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
  },
  h1: {
    color: "#ffffff",
    fontSize: "2.2em",
    textAlign: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "2px solid #4f46e5",
  },
  h2: {
    color: "#ffffff",
    fontSize: "1.8em",
    borderBottom: "1px solid #444",
    paddingBottom: "10px",
    marginTop: "30px",
    marginBottom: "20px",
  },
  strong: {
    color: "#4f46e5",
    fontWeight: 600,
  },
  a: {
    color: "#4f46e5",
    textDecoration: "none",
  },
  ctaButton: {
    display: "inline-block",
    backgroundColor: "#4f46e5",
    color: "#121212",
    padding: "12px 25px",
    borderRadius: "50px",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "20px",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s ease-in-out, filter 0.2s",
  },
  backButton: {
    backgroundColor: "#333",
    color: "#e0e0e0",
    padding: "10px 20px",
    borderRadius: "25px",
    border: "1px solid #555",
    cursor: "pointer",
    marginBottom: "20px",
    fontSize: "14px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  },
  tldrSection: {
    backgroundColor: "#252525",
    border: "1px solid #444",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "30px",
  },
  tldrHeader: {
    borderBottom: "none",
    marginTop: 0,
  },
};

const blogData = [
  {
    id: 1,
    component: Blog1,
    title:
      "How to Know If You’re Eligible for a Home Loan – Fast & Easy Checklist",
    date: "AUGUST 24TH 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog1.png",
    readTime: "5 min read",
  },
  {
    id: 2,
    component: Blog2,
    title:
      "What is the Best CIBIL Score for a Loan Approval? A Complete Guide for 2025",
    date: "JULY 21ST 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog2.png",
    readTime: "5 min read",
  },
  {
    id: 3,
    component: Blog3,
    title: "Prepay Your Home Loan or Invest in SIP? A Dilemma Solved",
    date: "JULY 18TH 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog3.png",
    readTime: "7 min read",
  },
  {
    id: 4,
    component: Blog4,
    title:
      "Home Loan Takeover Explained: RBI Guidelines Every Borrower Should Know",
    date: "JULY 15TH 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog4.png",
    readTime: "8 min read",
  },
  {
    id: 5,
    component: Blog5,
    title: "How Does Taking Out a Home Loan Affect Your Income Tax?",
    date: "JULY 12TH 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog5.png",
    readTime: "6 min read",
  },
  {
    id: 6,
    component: Blog6,
    title: "Home Loan Insurance: Essential for New Buyers in 2025",
    date: "JULY 10TH 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog6.png",
    readTime: "6 min read",
  },
  {
    id: 7,
    component: Blog7,
    title: "Which Bank or Finance Service Is Best for a Housing Loan?",
    date: "JULY 7TH 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog7.png",
    readTime: "6 min read",
  },
  {
    id: 8,
    component: Blog8,
    title: "What Documents Are Essential for Home Loan Approval?",
    date: "JUNE 4TH 2025",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog8.png",
    readTime: "6 min read",
  },
  {
    id: 9,
    component: Blog9,
    title:
      "Which Home Loan Type Should You Choose? A Simple Guide for Indian Buyers",
    date: "MAY 2ND 2024",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog9.png",
    readTime: "6 min read",
  },
  {
    id: 10,
    component: Blog10,
    title:
      "How to Pay Off Your Home Loan in 10 Years: Smart Strategies for Indian Borrowers",
    date: "APRIL 30TH 2024",
    tags: ["Sustainability", "Technology", "Future trends"],
    image: "/assets/blog10.png",
    readTime: "6 min read",
  },
];

const BlogCard = ({ blog, onClick, isHovered, onHover, onLeave }) => (
  <div
    style={{
      ...styles.card,
      ...(isHovered ? styles.cardHover : {}),
    }}
    onClick={() => onClick(blog.id)}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
  >
    <img
      src={blog.image}
      alt={blog.title}
      style={styles.cardImage}
      onError={(e) => {
        e.target.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkJsb2cgSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==";
      }}
    />
    <div style={styles.cardContent}>
      <div style={styles.cardDate}>{blog.date}</div>
      <h3 style={styles.cardTitle}>{blog.title}</h3>
      <div style={styles.cardMeta}>
        {blog.tags.slice(0, 3).map((tag, index) => (
          <span key={index} style={styles.cardTag}>
            {tag}
          </span>
        ))}
      </div>
      <div style={styles.cardReadMore}>
        READ MORE
        <span
          style={{
            ...styles.arrow,
            transform: isHovered ? "translateX(4px)" : "translateX(0)",
          }}
        >
          →
        </span>
      </div>
    </div>
  </div>
);

function App() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [selectedYear, setSelectedYear] = useState("Years");
  const [selectedMonth, setSelectedMonth] = useState("Months");
  const [selectedTopic, setSelectedTopic] = useState("Topics");

  React.useEffect(() => {
    Object.assign(document.body.style, styles.body);
  }, []);

  const handleCardClick = (blogId) => setSelectedBlog(blogId);
  const handleBackToCards = () => setSelectedBlog(null);

  const getMonthFromDate = (dateStr) => {
    const month = dateStr.split(" ")[0];
    return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
  };

  const filteredBlogs = blogData.filter((blog) => {
    const blogYear = blog.date.split(" ").pop();
    const blogMonth = getMonthFromDate(blog.date);

    const matchYear = selectedYear === "Years" || blogYear === selectedYear;
    const matchMonth =
      selectedMonth === "Months" || blogMonth === selectedMonth;
    const matchTopic =
      selectedTopic === "Topics" ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(selectedTopic.toLowerCase())
      );

    return matchYear && matchMonth && matchTopic;
  });

  if (selectedBlog) {
    const blog = blogData.find((b) => b.id === selectedBlog);
    const BlogComponent = blog.component;

    return (
      <div style={styles.mainContainer}>
        <button style={styles.backButton} onClick={handleBackToCards}>
          ← Back
        </button>
        <div style={styles.blogPost}>
          <BlogComponent styles={styles} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <div style={styles.filtersContainer}>
        <select
          style={styles.filterDropdown}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option>Years</option>
          <option>2025</option>
          <option>2024</option>
        </select>

        <select
          style={styles.filterDropdown}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option>Months</option>
          <option>August</option>
          <option>July</option>
          <option>June</option>
          <option>May</option>
          <option>April</option>
        </select>

        <select
          style={styles.filterDropdown}
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option>Topics</option>
          <option>E-commerce</option>
          <option>Technology</option>
          <option>Innovation</option>
          <option>Corporate News</option>
          <option>Sustainability</option>
        </select>
      </div>

      <div style={styles.cardsContainer}>
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onClick={handleCardClick}
              isHovered={hoveredCard === blog.id}
              onHover={() => setHoveredCard(blog.id)}
              onLeave={() => setHoveredCard(null)}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#aaa", gridColumn: "1/-1" }}>
            No blogs found for selected filters.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
