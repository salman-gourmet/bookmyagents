import FooterFive from "../../../layouts/footers/FooterFive"
import InnerHeader from "../../../layouts/headers/InnerHeader"
import DashboardArea from "./DashboardArea"

const Dashboard = () => {
   return (
      <>
         <InnerHeader />
         <main>
            <DashboardArea />
         </main>
         <FooterFive />
      </>
   )
}

export default Dashboard
