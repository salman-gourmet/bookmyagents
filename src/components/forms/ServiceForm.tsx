import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { type Service, type CreateServiceData } from '../../types/service';

interface ServiceFormProps {
  service?: Service;
  onSubmit: (data: CreateServiceData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// interface FormData {
//   title: string;
//   description: string;
//   pictures: File[];
//   contactDetails: {
//     phone: string;
//     email: string;
//     address: string;
//     website: string;
//   };
//   category: string;
//   price: number;
//   location: {
//     city: string;
//     state: string;
//     country: string;
//     coordinates: {
//       lat: number;
//       lng: number;
//     };
//   };
// }

const schema = yup.object({
  title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  pictures: yup.array().optional(),
  contactDetails: yup.object({
    phone: yup.string().required('Phone is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    address: yup.string().required('Address is required'),
    website: yup.string().url('Invalid website URL').required('Website is required'),
  }),
  category: yup.string().required('Category is required'),
  price: yup.number().required('Price is required').min(0, 'Price must be positive'),
  location: yup.object({
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    coordinates: yup.object({
      lat: yup.number().required('Latitude is required'),
      lng: yup.number().required('Longitude is required'),
    }),
  }),
});

const categories = [
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'tours', label: 'Tours' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' },
];

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit, onCancel, isLoading = false }) => {
  const [description, setDescription] = useState(service?.description || '');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: service?.title || '',
      description: service?.description || '',
      pictures: [],
      contactDetails: {
        phone: service?.contactDetails.phone || '',
        email: service?.contactDetails.email || '',
        address: service?.contactDetails.address || '',
        website: service?.contactDetails.website || '',
      },
      category: service?.category || '',
      price: service?.price || 0,
      location: {
        city: service?.location.city || '',
        state: service?.location.state || '',
        country: service?.location.country || '',
        coordinates: {
          lat: service?.location.coordinates.lat || 0,
          lng: service?.location.coordinates.lng || 0,
        },
      },
    },
  });

  const watchedPictures = watch('pictures');

  useEffect(() => {
    if (watchedPictures && watchedPictures.length && watchedPictures.length > 0) {
      const previews = Array.from(watchedPictures).map(file => {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        }
        return '';
      }).filter(url => url !== '');
      setImagePreviews(previews);
    }
  }, [watchedPictures]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setValue('pictures', fileArray);
    }
  };

  const removeImage = (index: number) => {
    const currentFiles = watchedPictures && watchedPictures.length ? watchedPictures : [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    setValue('pictures', newFiles);
  };

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setDescription(content);
      setValue('description', content);
    }
  };

  const onFormSubmit = async (data: any) => {
    try {
      // Convert File objects to base64 or upload to server
      const pictureUrls: string[] = [];
      
      // For now, we'll use placeholder URLs - in real implementation, upload to server
      for (let i = 0; i < data.pictures.length; i++) {
        pictureUrls.push(`placeholder-image-${i + 1}.jpg`);
      }

      const serviceData: CreateServiceData = {
        title: data.title,
        description: data.description,
        pictures: pictureUrls,
        contactDetails: data.contactDetails,
        category: data.category as any,
        price: data.price,
        location: data.location,
      };

      await onSubmit(serviceData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="service-form">
      <div className="row">
        <div className="col-12">
          <div className="form-card">
            <div className="card-header">
              <h4>{service ? 'Edit Service' : 'Create New Service'}</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onFormSubmit)}>
                {/* Basic Information */}
                <div className="form-section mb-4">
                  <h5 className="section-title">Basic Information</h5>
                  
                  <div className="row g-3">
                    <div className="col-lg-8 col-md-7 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="title" className="form-label">Service Title *</label>
                        <input
                          type="text"
                          id="title"
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          {...register('title')}
                          placeholder="Enter service title"
                        />
                        {errors.title && (
                          <div className="invalid-feedback">{errors.title.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-5 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="category" className="form-label">Category *</label>
                        <select
                          id="category"
                          className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                          {...register('category')}
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <div className="invalid-feedback">{errors.category.message}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="price" className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      id="price"
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                      {...register('price', { valueAsNumber: true })}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {errors.price && (
                      <div className="invalid-feedback">{errors.price.message}</div>
                    )}
                  </div>
                </div>

                {/* Description with Rich Text Editor */}
                <div className="form-section mb-4">
                  <h5 className="section-title">Description</h5>
                  
                  <div className="rich-text-editor">
                    <div className="editor-toolbar">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => formatText('bold')}
                        title="Bold"
                      >
                        <i className="fas fa-bold"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => formatText('italic')}
                        title="Italic"
                      >
                        <i className="fas fa-italic"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => formatText('underline')}
                        title="Underline"
                      >
                        <i className="fas fa-underline"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => formatText('insertUnorderedList')}
                        title="Bullet List"
                      >
                        <i className="fas fa-list-ul"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => formatText('insertOrderedList')}
                        title="Numbered List"
                      >
                        <i className="fas fa-list-ol"></i>
                      </button>
                    </div>
                    
                    <div
                      ref={editorRef}
                      contentEditable
                      className={`form-control editor-content ${errors.description ? 'is-invalid' : ''}`}
                      style={{ minHeight: '200px', padding: '10px' }}
                      onInput={handleEditorChange}
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description.message}</div>
                    )}
                  </div>
                </div>

                {/* Images */}
                <div className="form-section mb-4">
                  <h5 className="section-title">Service Images</h5>
                  
                  <div className="form-group mb-3">
                    <label htmlFor="images" className="form-label">Upload Images *</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="images"
                      className={`form-control ${errors.pictures ? 'is-invalid' : ''}`}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                    />
                    {errors.pictures && (
                      <div className="invalid-feedback">{errors.pictures.message}</div>
                    )}
                    <small className="form-text text-muted">
                      Upload multiple images to showcase your service
                    </small>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      <div className="row">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="col-md-3 mb-3">
                            <div className="image-preview-card">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="img-fluid rounded"
                                style={{ height: '150px', objectFit: 'cover', width: '100%' }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger mt-2 w-100"
                                onClick={() => removeImage(index)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="form-section mb-4">
                  <h5 className="section-title">Contact Details</h5>
                  
                  <div className="row g-3">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="phone" className="form-label">Phone *</label>
                        <input
                          type="tel"
                          id="phone"
                          className={`form-control ${errors.contactDetails?.phone ? 'is-invalid' : ''}`}
                          {...register('contactDetails.phone')}
                          placeholder="+1 (555) 123-4567"
                        />
                        {errors.contactDetails?.phone && errors.contactDetails.phone.message && (
                          <div className="invalid-feedback">{errors.contactDetails.phone.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                          type="email"
                          id="email"
                          className={`form-control ${errors.contactDetails?.email ? 'is-invalid' : ''}`}
                          {...register('contactDetails.email')}
                          placeholder="contact@example.com"
                        />
                        {errors.contactDetails?.email && errors.contactDetails.email.message && (
                          <div className="invalid-feedback">{errors.contactDetails.email.message}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="address" className="form-label">Address *</label>
                    <textarea
                      id="address"
                      className={`form-control ${errors.contactDetails?.address ? 'is-invalid' : ''}`}
                      {...register('contactDetails.address')}
                      rows={3}
                      placeholder="Enter full address"
                    />
                    {errors.contactDetails?.address && errors.contactDetails.address.message && (
                      <div className="invalid-feedback">{errors.contactDetails.address.message}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="website" className="form-label">Website *</label>
                    <input
                      type="url"
                      id="website"
                      className={`form-control ${errors.contactDetails?.website ? 'is-invalid' : ''}`}
                      {...register('contactDetails.website')}
                      placeholder="https://www.example.com"
                    />
                    {errors.contactDetails?.website && errors.contactDetails.website.message && (
                      <div className="invalid-feedback">{errors.contactDetails.website.message}</div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="form-section mb-4">
                  <h5 className="section-title">Location</h5>
                  
                  <div className="row g-3">
                    <div className="col-lg-4 col-md-6 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="city" className="form-label">City *</label>
                        <input
                          type="text"
                          id="city"
                          className={`form-control ${errors.location?.city ? 'is-invalid' : ''}`}
                          {...register('location.city')}
                          placeholder="Enter city"
                        />
                        {errors.location?.city && errors.location.city.message && (
                          <div className="invalid-feedback">{errors.location.city.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="state" className="form-label">State *</label>
                        <input
                          type="text"
                          id="state"
                          className={`form-control ${errors.location?.state ? 'is-invalid' : ''}`}
                          {...register('location.state')}
                          placeholder="Enter state"
                        />
                        {errors.location?.state && errors.location.state.message && (
                          <div className="invalid-feedback">{errors.location.state.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="country" className="form-label">Country *</label>
                        <input
                          type="text"
                          id="country"
                          className={`form-control ${errors.location?.country ? 'is-invalid' : ''}`}
                          {...register('location.country')}
                          placeholder="Enter country"
                        />
                        {errors.location?.country && errors.location.country.message && (
                          <div className="invalid-feedback">{errors.location.country.message}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="lat" className="form-label">Latitude *</label>
                        <input
                          type="number"
                          id="lat"
                          className={`form-control ${errors.location?.coordinates?.lat ? 'is-invalid' : ''}`}
                          {...register('location.coordinates.lat', { valueAsNumber: true })}
                          placeholder="0.000000"
                          step="any"
                        />
                        {errors.location?.coordinates?.lat && errors.location.coordinates.lat.message && (
                          <div className="invalid-feedback">{errors.location.coordinates.lat.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="form-group mb-3">
                        <label htmlFor="lng" className="form-label">Longitude *</label>
                        <input
                          type="number"
                          id="lng"
                          className={`form-control ${errors.location?.coordinates?.lng ? 'is-invalid' : ''}`}
                          {...register('location.coordinates.lng', { valueAsNumber: true })}
                          placeholder="0.000000"
                          step="any"
                        />
                        {errors.location?.coordinates?.lng && errors.location.coordinates.lng.message && (
                          <div className="invalid-feedback">{errors.location.coordinates.lng.message}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <div className="d-flex justify-content-end gap-3 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-secondary flex-fill flex-md-fill-0"
                      onClick={onCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-fill flex-md-fill-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span className="d-none d-sm-inline">{service ? 'Updating...' : 'Creating...'}</span>
                          <span className="d-sm-none">{service ? 'Update...' : 'Create...'}</span>
                        </>
                      ) : (
                        <>
                          <span className="d-none d-sm-inline">{service ? 'Update Service' : 'Create Service'}</span>
                          <span className="d-sm-none">{service ? 'Update' : 'Create'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
