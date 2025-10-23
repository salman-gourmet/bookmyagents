import BlogDetailsArea from "./BlogDetailsArea"
import FooterFive from "../../../layouts/footers/FooterFive"
import HeaderThree from "../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../common/BreadCrumb"
import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { blogService } from "../../../services/blogService"
import { type Blog } from "../../../types/blog"

const BlogDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams[0].get('id');
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlogById(id!);
      console.log("response blog details", response.data);
      setBlog(response.data);
    } catch (err) {
      console.error('Error fetching blog:', err);
    }
  };

  return (
    <>
      <HeaderThree />
      <main>
        <BreadCrumb
          title="Blog Details"
          sub_title={blog?.title || "Loading..."}
        />
        <BlogDetailsArea />
      </main>
      <FooterFive />
    </>
  )
}

export default BlogDetails
