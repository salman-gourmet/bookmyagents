import Profile from "../components/pages/profile/index"
import SEO from "../components/SEO"
import Wrapper from "../layouts/Wrapper"

const ProfileMain = () => {
    return (
        <Wrapper>
            <SEO pageTitle={'Profile'} />
            <Profile />
        </Wrapper>
    )
}

export default ProfileMain
