// Blogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          "https://api.carnivalcastle.com/v1/carnivalApi/admin/allpublishedblogs?type=bingenjoy"
        );
        const data = res.data.blogs || [];

        const formatted = data.map((blog) => ({
          id: blog._id,
          slug: blog.slug,
          title: blog.title,
          author: blog.author,
          date: new Date(blog.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          excerpt: blog.excerpt,
          content: blog.content,
          featuredImage: blog.featuredImage.startsWith("http")
            ? blog.featuredImage
            : `https://api.carnivalcastle.com/${blog.featuredImage}`,
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
          tags: blog.tags || [],
          readTime: blog.readTime || "3 min read",
        }));

        setBlogs(formatted);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <div className="home-page indexsix">
        <main className="main-wrapper">
          <Header />
          <div className="blogs-wrapper">
            <div className="container">
              <div className="text-center mb-5">
                <h1 className="display-4 fw-bold title">Cinematic Celebrations</h1>
                <p className="lead text-muted subtitle">
                  Discover how BingeNJoy transforms ordinary moments into extraordinary memories
                </p>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center text-muted fs-5">
                  No published blogs available yet.
                </div>
              ) : (
                <div className="row g-4">
                  {blogs.map((blog) => (
                    <div key={blog.id} className="col-lg-4 col-md-6 col-sm-12">
                      <Link to={`/blogs/${blog.slug}`} className="text-decoration-none">
                        <div className="blog-card h-100">
                          <div className="blog-image">
                            <img
                              src={blog.featuredImage}
                              className="w-100"
                              alt={blog.title}
                            />
                          </div>
                          <div className="blog-content p-4">
                            <div className="d-flex justify-content-between mb-2 meta">
                              <span className="author">By {blog.author}</span>
                              <span className="date">{blog.date}</span>
                            </div>
                            <h3 className="h5 mb-3 title-sm">{blog.title}</h3>
                            <p className="excerpt mb-4">{blog.excerpt}</p>
                            <div className="d-flex justify-content-center">
                              <span className="btn btn-purple rounded-pill px-4 py-2">
                                Read Experience →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Blogs;
