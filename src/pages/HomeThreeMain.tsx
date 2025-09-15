import HomeThree from "../components/homes/home-three"
import SEO from "../components/SEO"
import Wrapper from "../layouts/Wrapper"
import useAnalytics from "../utils/useAnalytics";
const GA_MEASUREMENT_ID = 'G-WS5ZX9PL4F';

const HomeThreeMain = () => {
   useAnalytics(GA_MEASUREMENT_ID);
   return (
      <Wrapper>
         <SEO pageTitle={'Home'} />
         <HomeThree />
      </Wrapper>
   )
}

export default HomeThreeMain
