import { useState } from "react";
import BannerFormTwo from "./BannerFormTwo";



const form_data: number[] = [1, 2, 3, 4, 5, 6];

const BannerFormFour = () => {

   const [activeTab] = useState(0);


   return (
      <div className="tg-booking-form-area tg-booking-4-form-area tg-grey-bg pb-65">
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-booking-form-wrap tg-booking-form-space">
                     <div className="tg-booking-form-tabs">
                        <div className="nav nav-tab justify-content-center" id="nav-tab" role="tablist">
                           {/* {tab_title.map((tab, index) => (
                              <button key={index} className={`nav-link ${activeTab === index ? "active" : ""}`} onClick={() => handleTabClick(index)} id="nav-platform-tab">
                                 <span className="borders"></span>
                                 <span className="icon">{tab.icon}</span>
                                 <span>{tab.title}</span>
                              </button>
                           ))} */}
                        </div>
                     </div>
                     <div className="tab-content" id="nav-tabContent">
                        {form_data.map((item, index) => (
                           <div key={item} className={`tab-pane fade ${activeTab === index ? 'show active' : ''}`} id="nav-platform">
                              <div className="tg-booking-form-item">
                                 <BannerFormTwo />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default BannerFormFour
