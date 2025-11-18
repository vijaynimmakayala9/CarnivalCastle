// BlogDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          "https://api.carnivalcastle.com/v1/carnivalApi/admin/allpublishedblogs"
        );
        const data = res.data.blogs || [];
        const found = data.find((b) => b.slug === slug);

        if (found) {
          setBlog({
            id: found._id,
            slug: found.slug,
            title: found.title,
            author: found.author,
            date: new Date(found.date).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            excerpt: found.excerpt,
            content: found.content,
            featuredImage: found.featuredImage.startsWith("http")
              ? found.featuredImage
              : `https://api.carnivalcastle.com/${found.featuredImage}`,
            metaTitle: found.metaTitle,
            metaDescription: found.metaDescription,
            tags: found.tags || [],
          });
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container py-5 text-center">
        <div className="card p-5 shadow-sm not-found-card">
          <h2 className="text-danger">Experience Not Found</h2>
          <p className="lead">This cinematic celebration doesn't exist</p>
          <Link to="/blogs" className="btn btn-outline-primary mt-3">
            ← Back to Celebrations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="home-page indexsix">
        <main className="main-wrapper">
          <Header />
          <div className="blog-detail-wrapper">
            <div className="container-fluid ">
              <div className="text-start mb-4">
                <Link to="/blogs" className="btn btn-outline-light rounded-pill mb-3 back-link">
                  ← Back
                </Link>

                <article className="blog-article bg-white rounded-4 shadow-lg p-4 p-md-5">
                  <div className="text-center mb-5">
                    <h1 className="display-5 fw-bold mb-3 title">{blog.title}</h1>
                    <div className="d-flex justify-content-center align-items-center mb-4 meta">
                      <span className="author me-3">By {blog.author}</span>
                      <span className="date">• {blog.date}</span>
                    </div>
                    <div className="featured-image rounded-3 overflow-hidden mb-5">
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-100"
                        style={{ maxHeight: "500px", objectFit: "cover" }}
                      />
                    </div>
                  </div>

                  <div
                    className="blog-content fs-5"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  <div className="text-center mt-6 pt-5 border-top border-light">
                    <h3 className="mb-4 cta-title">Ready to Create Your Moment?</h3>
                    <Link
                      to="/"
                      className="btn btn-purple btn-lg rounded-pill px-5 py-3 fw-bold"
                    >
                      Book Your Private Theatre →
                    </Link>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default BlogDetail;
