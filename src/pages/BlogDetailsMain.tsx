import BlogDetails from "../components/blogs/blog-details"
import SEO from "../components/SEO"
import Wrapper from "../layouts/Wrapper"

const BlogDetailsMain = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'Blog Details'} />
         <BlogDetails />
      </Wrapper>
   )
}

export default BlogDetailsMain
