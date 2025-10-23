import Comment from "./Comment";
import BlogSidebar from "../blog-sidebar";
import { Link, useSearchParams } from "react-router-dom";
import BlogForm from "../../forms/BlogForm";
import { useState, useEffect } from "react";
import { blogService } from "../../../services/blogService";
import { type Blog } from "../../../types/blog";

const BlogDetailsArea = () => {
   const searchParams = useSearchParams();
   const id = searchParams[0].get('id');
   const [blog, setBlog] = useState<Blog | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set());
   const [dislikedBlogs, setDislikedBlogs] = useState<Set<string>>(new Set());

   useEffect(() => {
      if (id) {
         fetchBlog();
      }
   }, [id]);

   const fetchBlog = async () => {
      try {
         setLoading(true);
         setError(null);
         const response = await blogService.getBlogById(id!);
         console.log("response blog details", response.data);
         setBlog(response.data);
      } catch (err) {
         setError('Failed to fetch blog details');
         console.error('Error fetching blog:', err);
      } finally {
         setLoading(false);
      }
   };

   const handleLike = async (blogId: string) => {
      try {
         await blogService.likeBlog(blogId);
         setLikedBlogs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(blogId)) {
               newSet.delete(blogId);
            } else {
               newSet.add(blogId);
               setDislikedBlogs(prevDisliked => {
                  const newDislikedSet = new Set(prevDisliked);
                  newDislikedSet.delete(blogId);
                  return newDislikedSet;
               });
            }
            return newSet;
         });
         // Refresh blog data to get updated like counts
         fetchBlog();
      } catch (err) {
         console.error('Error liking blog:', err);
      }
   };

   const handleDislike = async (blogId: string) => {
      try {
         await blogService.dislikeBlog(blogId);
         setDislikedBlogs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(blogId)) {
               newSet.delete(blogId);
            } else {
               newSet.add(blogId);
               setLikedBlogs(prevLiked => {
                  const newLikedSet = new Set(prevLiked);
                  newLikedSet.delete(blogId);
                  return newLikedSet;
               });
            }
            return newSet;
         });
         // Refresh blog data to get updated dislike counts
         fetchBlog();
      } catch (err) {
         console.error('Error disliking blog:', err);
      }
   };

   const formatDate = (dateString: string | Date) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric'
      });
   };

   const getAuthorName = (author: string | { _id: string; email: string }) => {
      if (typeof author === 'string') return 'Admin';
      return author.email.split('@')[0];
   };

   const getReadingTime = (content: string) => {
      const wordsPerMinute = 200;
      const wordCount = content.split(' ').length;
      const minutes = Math.ceil(wordCount / wordsPerMinute);
      return `${minutes} min read`;
   };

   if (loading) {
      return (
         <div className="tg-blog-grid-area pt-130 pb-80">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (error || !blog) {
      return (
         <div className="tg-blog-grid-area pt-130 pb-80">
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-12 text-center">
                     <div className="alert alert-danger" role="alert">
                        {error || 'Blog not found'}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="tg-blog-grid-area pt-130 pb-80">
         <div className="container">
            <div className="row">
               <div className="col-xl-9 col-lg-8">
                  <div className="tg-blog-details-wrap tg-blog-lg-spacing mr-50 mb-50">
                     <div className="tg-blog-standard-item mb-35">
                        <div className="tg-blog-standard-thumb mb-15">
                           <img
                              className="w-100"
                              src={blog.coverImage || '/assets/img/placeholder/placeholder.png'}
                              alt={blog.title}
                              style={{
                                 height: '400px',
                                 objectFit: 'cover',
                                 borderRadius: '8px'
                              }}
                           />
                        </div>
                        <div className="tg-blog-standard-content">
                           <div className="tg-blog-standard-date mb-10">
                              <span>
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.51089 15.2889C1.33312 15.2889 1.15534 15.2 1.06645 15.1111C0.977561 14.9334 0.888672 14.8445 0.888672 14.6667C0.888672 13.4222 1.24423 12.1778 1.86645 11.0222C2.48867 9.95558 3.46645 8.9778 4.53312 8.35558C4.08867 7.82225 3.73312 7.11114 3.55534 6.40003C3.46645 5.68892 3.46645 4.88892 3.64423 4.26669C3.82201 3.55558 4.26645 2.84447 4.71089 2.31114C5.24423 1.7778 5.86645 1.33336 6.48867 1.15558C7.02201 0.977805 7.55534 0.888916 8.08867 0.888916C8.26645 0.888916 8.53312 0.888916 8.71089 0.888916C9.42201 0.977805 10.1331 1.24447 10.7553 1.68892C11.3776 2.13336 11.822 2.66669 12.1776 3.28892C12.5331 3.91114 12.7109 4.62225 12.7109 5.42225C12.7109 6.48892 12.3553 7.55558 11.6442 8.35558C12.1776 8.71114 12.7109 9.06669 13.2442 9.51114C13.9553 10.2222 14.3998 10.9334 14.8442 11.8222C15.1998 12.7111 15.3776 13.6 15.3776 14.5778C15.3776 14.7556 15.2887 14.9334 15.1998 15.0222C15.1109 15.1111 14.9331 15.2 14.7553 15.2C14.6665 15.2 14.5776 15.2 14.4887 15.1111C14.3998 15.1111 14.3109 15.0222 14.3109 14.9334C14.222 14.8445 14.222 14.8445 14.1331 14.7556C14.1331 14.6667 14.0442 14.5778 14.0442 14.4889C14.0442 13.6889 13.8664 12.9778 13.5998 12.2667C13.3331 11.5556 12.8887 10.9334 12.2664 10.4C11.7331 9.95558 11.1998 9.51114 10.5776 9.24447C9.86645 9.68892 9.06645 9.95558 8.08867 9.95558C7.19978 9.95558 6.31089 9.68892 5.59978 9.24447C4.62201 9.68892 3.73312 10.4 3.11089 11.3778C2.48867 12.3556 2.13312 13.4222 2.13312 14.5778C2.13312 14.7556 2.04423 14.9334 1.95534 15.0222C1.86645 15.2 1.68867 15.2889 1.51089 15.2889ZM8.08867 2.22225C7.46645 2.22225 6.84423 2.40003 6.31089 2.75558C5.68867 3.11114 5.33312 3.64447 5.06645 4.1778C4.79978 4.80003 4.71089 5.42225 4.88867 6.13336C4.97756 6.75558 5.33312 7.37781 5.77756 7.82225C6.22201 8.26669 6.84423 8.62225 7.46645 8.71114C7.64423 8.71114 7.91089 8.80003 8.08867 8.80003C8.53312 8.80003 8.97756 8.71114 9.33312 8.53336C9.95534 8.26669 10.3998 7.91114 10.8442 7.28892C11.1998 6.75558 11.3776 6.13336 11.3776 5.51114C11.3776 4.62225 11.022 3.82225 10.3998 3.20003C9.77756 2.48892 8.97756 2.22225 8.08867 2.22225Z" fill="#560CE3" />
                                 </svg>
                                 by {getAuthorName(blog.author)}
                              </span>
                              <span>
                                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.76501 0.777771V3.26668M4.23413 0.777771V3.26668M0.777344 5.75548H13.2218M2.16006 2.02211H11.8391C12.6027 2.02211 13.2218 2.57927 13.2218 3.26656V11.9778C13.2218 12.6651 12.6027 13.2222 11.8391 13.2222H2.16006C1.39641 13.2222 0.777344 12.6651 0.777344 11.9778V3.26656C0.777344 2.57927 1.39641 2.02211 2.16006 2.02211Z" stroke="#560CE3" strokeWidth="0.977778" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 {formatDate(blog.publishedAt || blog.createdAt)}
                              </span>
                              <span>
                                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.99979 3.73329V7.99996L10.8442 9.42218M15.1109 8.00003C15.1109 11.9274 11.9271 15.1111 7.99978 15.1111C4.07242 15.1111 0.888672 11.9274 0.888672 8.00003C0.888672 4.07267 4.07242 0.888916 7.99978 0.888916C11.9271 0.888916 15.1109 4.07267 15.1109 8.00003Z" stroke="#560CE3" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                 </svg>
                                 {getReadingTime(blog.content)}
                              </span>
                           </div>
                           <h2 className="tg-blog-standard-title">{blog.title}</h2>
                           <div className="tg-blog-content" dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
                        </div>
                     </div>

                     <div className="tg-blog-details-tag mb-40 d-flex flex-wrap justify-content-between align-items-center">
                        <div className="tg-blog-sidebar-tag-list d-flex flex-wrap align-items-center">
                           <h5 className="tg-blog-sidebar-title mr-10">Tags:</h5>
                           <ul>
                              <li><Link to="#">Travel</Link></li>
                              <li><Link to="#">Blog</Link></li>
                           </ul>
                        </div>
                        <div className="tg-blog-details-social mb-10 d-flex align-items-center gap-3">
                           <div className="d-flex gap-2">
                              <button
                                 className={`btn btn-sm ${likedBlogs.has(blog._id) ? 'btn-primary' : 'btn-outline-primary'}`}
                                 onClick={() => handleLike(blog._id)}
                              >
                                 👍 {blog.likes.length}
                              </button>
                              <button
                                 className={`btn btn-sm ${dislikedBlogs.has(blog._id) ? 'btn-danger' : 'btn-outline-danger'}`}
                                 onClick={() => handleDislike(blog._id)}
                              >
                                 👎 {blog.dislikes.length}
                              </button>
                           </div>
                           <div>
                              <span>Share:</span>
                              <Link to="#"><i className="fa-brands fa-facebook-f"></i></Link>
                              <Link to="#"><i className="fa-brands fa-twitter"></i></Link>
                              <Link to="#"><i className="fa-brands fa-instagram"></i></Link>
                              <Link to="#"><i className="fa-brands fa-pinterest-p"></i></Link>
                              <Link to="#"><i className="fa-brands fa-youtube"></i></Link>
                           </div>
                        </div>
                     </div>
                     {/* <Comment />
                     <div className="tg-tour-about-review-form tg-blog-details-review-form">
                        <h4 className="tg-tour-about-title mb-10">Post a comment</h4>
                        <p>Your email address will not be published. Required fields are marked *</p>
                        <BlogForm />
                     </div> */}
                  </div>
               </div>
               <div className="col-xl-3 col-lg-4">
                  <BlogSidebar />
               </div>
            </div>
         </div>
      </div>
   )
}

export default BlogDetailsArea
