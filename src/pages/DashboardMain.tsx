import Dashboard from "../components/pages/dashboard"
import SEO from "../components/SEO"
import Wrapper from "../layouts/Wrapper"

const DashboardMain = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'Dashboard'} />
         <Dashboard />
      </Wrapper>
   )
}

export default DashboardMain
