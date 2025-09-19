import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "react-toastify"

const RegisterForm = () => {
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
   })
   const [loading, setLoading] = useState(false)
   const { register } = useAuth()
   const navigate = useNavigate()

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      })
   }

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      
      if (formData.password !== formData.confirmPassword) {
         toast.error('Passwords do not match')
         return
      }

      if (formData.password.length < 6) {
         toast.error('Password must be at least 6 characters long')
         return
      }

      setLoading(true)

      try {
         await register({
            name: formData.name,
            email: formData.email,
            password: formData.password
         })
         toast.success('Registration successful!')
         navigate('/dashboard')
      } catch (error: any) {
         toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
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
               <input 
                  className="input" 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
               />
            </div>
            <div className="col-lg-12 mb-25">
               <input 
                  className="input" 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
               />
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
