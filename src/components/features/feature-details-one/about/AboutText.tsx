
import { type ServiceDetail } from "../../../../services/searchService";

interface AboutTextProps {
   serviceDetail?: ServiceDetail | null;
}

const AboutText = ({ serviceDetail }: AboutTextProps) => {
   return (
      <>
         <div className="tg-tour-about-inner mb-25">
            <h4 className="tg-tour-about-title mb-15">About This Service</h4>
            <div
               className="text-capitalize lh-28"
               dangerouslySetInnerHTML={{ __html: serviceDetail?.description || 'No description available.' }}
            />
         </div>

         {serviceDetail?.contactDetails && (
            <div className="tg-tour-about-inner mb-40">
               <h4 className="tg-tour-about-title mb-20">Contact Information</h4>
               <div className="tg-tour-about-list">
                  <ul>
                     <li>
                        <span className="icon mr-10"><i className="fa-solid fa-phone fa-fw"></i></span>
                        <span className="text">Phone: {serviceDetail.contactDetails.phone}</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-solid fa-envelope fa-fw"></i></span>
                        <span className="text">Email: {serviceDetail.contactDetails.email}</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-solid fa-location-dot fa-fw"></i></span>
                        <span className="text">Address: {serviceDetail.contactDetails.address}</span>
                     </li>
                     {serviceDetail.contactDetails.website && (
                        <li>
                           <span className="icon mr-10"><i className="fa-solid fa-globe fa-fw"></i></span>
                           <span className="text">Website: <a href={serviceDetail.contactDetails.website} target="_blank" rel="noopener noreferrer">{serviceDetail.contactDetails.website}</a></span>
                        </li>
                     )}
                  </ul>
               </div>
            </div>
         )}

         <div className="tg-tour-about-inner mb-40">
            <h4 className="tg-tour-about-title mb-20">Service Details</h4>
            <div className="tg-tour-about-list">
               <ul>
                  <li>
                     <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                     <span className="text">Category: {serviceDetail?.category || 'N/A'}</span>
                  </li>
                  <li>
                     <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                     <span className="text">Price: ${serviceDetail?.price || 'N/A'} per person</span>
                  </li>
                  <li>
                     <span className="icon mr-10"><i className="fa-sharp fa-solid fa-check fa-fw"></i></span>
                     <span className="text">Status: {serviceDetail?.isActive ? 'Active' : 'Inactive'}</span>
                  </li>
               </ul>
            </div>
         </div>

         {serviceDetail?.userId && (
            <div className="tg-tour-about-inner mb-40">
               <h4 className="tg-tour-about-title mb-20">Service Provider</h4>
               <div className="tg-tour-about-list">
                  <ul>
                     <li>
                        <span className="icon mr-10"><i className="fa-solid fa-user fa-fw"></i></span>
                        <span className="text">Name: {serviceDetail.userId.fullName}</span>
                     </li>
                     <li>
                        <span className="icon mr-10"><i className="fa-solid fa-envelope fa-fw"></i></span>
                        <span className="text">Email: {serviceDetail.userId.email}</span>
                     </li>
                  </ul>
               </div>
            </div>
         )}
      </>
   )
}

export default AboutText
