import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-toastify"

const RegisterForm = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
   })
   const [loading, setLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
   const { register } = useAuth()
   const navigate = useNavigate()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      })
   }

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
   }

   const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword)
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Client-side validation
      if (!formData.name.trim()) {
         toast.error('Please enter your name')
         return
      }

      if (!formData.email.trim()) {
         toast.error('Please enter your email')
         return
      }

      if (!formData.password) {
         toast.error('Please enter a password')
         return
      }

      if (formData.password !== formData.confirmPassword) {
         toast.error('Passwords do not match')
         return
      }

      if (formData.password.length < 6) {
         toast.error('Password must be at least 6 characters long')
         return
      }

      if (!formData.role) {
         toast.error('Please select a role')
         return
      }

      setLoading(true)

      try {
         await register({
            fullName: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            role: formData.role
         })
         toast.success('Registration successful! Welcome to TourEx!')
         navigate('/')
      } catch (error: any) {
         console.error('Registration error:', error)
         const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Registration failed. Please try again.'
         toast.error(errorMessage)
      } finally {
         setLoading(false)
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <div className="row">
            <div className="col-lg-12 mb-25">
               <input 
                  className="input" 
                  type="text" 
                  name="name"
                  placeholder="Enter your username" 
                  value={formData.name}
                  onChange={handleChange}
                  required
               />
            </div>
            <div className="col-lg-12 mb-25">
               <input 
                  className="input" 
                  type="email" 
                  name="email"
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
               />
            </div>
            <div className="col-lg-12 mb-25">
               <select 
                  className="input" 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  style={{ width: '100%' }}
               >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
               </select>
            </div>
            <div className="col-lg-12 mb-25">
               <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <input 
                     className="input" 
                     type={showPassword ? "text" : "password"} 
                     name="password"
                     placeholder="Password" 
                     value={formData.password}
                     onChange={handleChange}
                     required
                     style={{ paddingRight: '45px' }}
                  />
                  <button
                     type="button"
                     onClick={togglePasswordVisibility}
                     style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#666'
                     }}
                  >
                     <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
               </div>
            </div>
            <div className="col-lg-12 mb-25">
               <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <input 
                     className="input" 
                     type={showConfirmPassword ? "text" : "password"} 
                     name="confirmPassword"
                     placeholder="Confirm Password" 
                     value={formData.confirmPassword}
                     onChange={handleChange}
                     required
                     style={{ paddingRight: '45px' }}
                  />
                  <button
                     type="button"
                     onClick={toggleConfirmPasswordVisibility}
                     style={{
                        position: 'absolute',
                        right: '15px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#666'
                     }}
                  >
                     <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
               </div>
            </div>
            <div className="col-lg-12">
               <div className="d-flex align-items-center justify-content-between">
                  <div className="review-checkbox d-flex align-items-center mb-25">
                     <input className="tg-checkbox" type="checkbox" id="terms" required />
                     <label htmlFor="terms" className="tg-label">I agree to the terms and conditions</label>
                  </div>
                  <div className="tg-login-navigate mb-25">
                     <Link to="/login">Log In</Link>
                  </div>
               </div>
               <button 
                  type="submit" 
                  className="tg-btn w-100" 
                  disabled={loading}
               >
                  {loading ? 'Signing Up...' : 'Sign Up'}
               </button>
            </div>
         </div>
      </form>
   )
}

export default RegisterForm
