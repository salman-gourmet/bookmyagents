import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { type SearchResult, type SearchResponse } from "../../../services/searchService";

const SearchResults = () => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get search results from localStorage
        const storedResults = localStorage.getItem('searchResults');

        if (storedResults) {
            try {
                const parsedResults: SearchResponse = JSON.parse(storedResults);
                setSearchResults(parsedResults.results || []);
            } catch (error) {
                console.error('Error parsing search results:', error);
            }
        }

        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (searchResults.length === 0) {
        return (
            <div className="text-center py-5">
                <h4>No search results found</h4>
                <p>Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="tg-listing-grid-item">
            <div className="row list-card">
                {searchResults.map((result) => (
                    <div key={result.id} className="col-xxl-4 col-xl-6 col-lg-6 col-md-6 tg-grid-full">
                        <div className="tg-listing-card-item mb-30">
                            <div className="tg-listing-card-thumb fix mb-15 p-relative">
                                <Link to={`/tour-details?id=${result.id}`}>
                                    <img
                                        className="tg-card-border w-100"
                                        src={result.imageUrls && result.imageUrls.length > 0 ? result.imageUrls[0] : "/assets/img/placeholder/placeholder.png"}
                                        alt={result.name}
                                    />
                                    {result.isAd && (
                                        <span className="tg-listing-item-price-discount shape">Ad</span>
                                    )}
                                </Link>
                                <div className="tg-listing-item-wishlist">
                                    <a style={{ cursor: "pointer" }}>
                                        <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.5167 16.3416C10.2334 16.4416 9.76675 16.4416 9.48341 16.3416C7.06675 15.5166 1.66675 12.075 1.66675 6.24165C1.66675 3.66665 3.74175 1.58331 6.30008 1.58331C7.81675 1.58331 9.15841 2.31665 10.0001 3.44998C10.8417 2.31665 12.1917 1.58331 13.7001 1.58331C16.2584 1.58331 18.3334 3.66665 18.3334 6.24165C18.3334 12.075 12.9334 15.5166 10.5167 16.3416Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="tg-listing-main-content">
                                <div className="tg-listing-card-content">
                                    <h4 className="tg-listing-card-title">
                                        <Link to={`/tour-details?id=${result.id}`}>{result.name}</Link>
                                    </h4>
                                    {/* <div
                                        className="tg-listing-card-description mb-3"
                                        dangerouslySetInnerHTML={{ __html: result.description }}
                                    /> */}
                                    <div className="tg-listing-card-duration-tour">
                                        <span className="tg-listing-card-duration-map mb-5">
                                            <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.3329 6.7071C12.3329 11.2324 6.55512 15.1111 6.55512 15.1111C6.55512 15.1111 0.777344 11.2324 0.777344 6.7071C0.777344 5.16402 1.38607 3.68414 2.46962 2.59302C3.55316 1.5019 5.02276 0.888916 6.55512 0.888916C8.08748 0.888916 9.55708 1.5019 10.6406 2.59302C11.7242 3.68414 12.3329 5.16402 12.3329 6.7071Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6.55512 8.64649C7.61878 8.64649 8.48105 7.7782 8.48105 6.7071C8.48105 5.636 7.61878 4.7677 6.55512 4.7677C5.49146 4.7677 4.6292 5.636 4.6292 6.7071C4.6292 7.7782 5.49146 8.64649 6.55512 8.64649Z" stroke="currentColor" strokeWidth="1.15556" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {result.address}
                                        </span>
                                        <span className="tg-listing-card-duration-time">
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.00175 3.73329V7.99996L10.8462 9.42218M15.1128 8.00003C15.1128 11.9274 11.9291 15.1111 8.00174 15.1111C4.07438 15.1111 0.890625 11.9274 0.890625 8.00003C0.890625 4.07267 4.07438 0.888916 8.00174 0.888916C11.9291 0.888916 15.1128 4.07267 15.1128 8.00003Z" stroke="currentColor" strokeWidth="1.06667" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {result.distance ? `${Math.round(result.distance)} km away` : 'Distance N/A'}
                                        </span>
                                    </div>
                                </div>
                                <div className="tg-listing-card-price d-flex align-items-end justify-content-between">
                                    <div className="tg-listing-card-price-wrap price-bg d-flex align-items-center">
                                        <span className="tg-listing-card-currency-amount mr-5">
                                            <span className="currency-symbol">$</span>{result.service?.price || 99}
                                        </span>
                                        <span className="tg-listing-card-activity-person">/Person</span>
                                    </div>
                                    <div className="tg-listing-card-review space">
                                        <span className="tg-listing-rating-icon">
                                            <i className="fa-sharp fa-solid fa-star"></i>
                                        </span>
                                        <span className="tg-listing-rating-percent">(5 Reviews)</span>
                                    </div>
                                </div>
                                {/* {result.contactEmail && (
                                    <div className="tg-listing-card-contact mt-2">
                                        <small className="text-muted">Contact: {result.contactEmail}</small>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
