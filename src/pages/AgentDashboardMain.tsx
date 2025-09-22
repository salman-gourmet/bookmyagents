import AgentDashboard from "../components/pages/agent/AgentDashboard"
import SEO from "../components/SEO"
import Wrapper from "../layouts/Wrapper"

const AgentDashboardMain = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'Agent Dashboard'} />
         <AgentDashboard />
      </Wrapper>
   )
}

export default AgentDashboardMain
