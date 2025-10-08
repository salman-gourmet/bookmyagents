import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "./Breadcrumb"
import FeatureDetailsArea from "./FeatureDetailsArea"
import FeatureAboutArea from "./FeatureAboutArea"
import HeaderThree from "../../../layouts/headers/HeaderThree"
import FooterSix from "../../../layouts/footers/FooterSix"
import { searchService, type ServiceDetail } from "../../../services/searchService";

const FeatureDetailsOne = () => {
   const [searchParams] = useSearchParams();
   const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const serviceId = searchParams.get('id');

   useEffect(() => {
      const fetchServiceDetail = async () => {
         if (!serviceId) {
            setError('No service ID provided');
            setIsLoading(false);
            return;
         }

         try {
            setIsLoading(true);
            const detail = await searchService.getServiceDetail(serviceId);
            setServiceDetail(detail);
         } catch (err) {
            console.error('Error fetching service detail:', err);
            setError('Failed to load service details');
         } finally {
            setIsLoading(false);
         }
      };

      fetchServiceDetail();
   }, [serviceId]);

   if (isLoading) {
      return (
         <>
            <HeaderThree />
            <main>
               <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                     <span className="visually-hidden">Loading...</span>
                  </div>
               </div>
            </main>
            <FooterSix />
         </>
      );
   }

   if (error || !serviceDetail) {
      return (
         <>
            <HeaderThree />
            <main>
               <div className="text-center py-5">
                  <h4>Error</h4>
                  <p>{error || 'Service not found'}</p>
               </div>
            </main>
            <FooterSix />
         </>
      );
   }

   return (
      <>
         <HeaderThree />
         <main>
            <Breadcrumb />
            <FeatureDetailsArea />
            <FeatureAboutArea serviceDetail={serviceDetail} />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureDetailsOne
