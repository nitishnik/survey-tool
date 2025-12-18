import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/routes/route'
import { initialValues, validationSchema } from './index.form'
import { toast } from 'sonner'
import { login as loginAction } from '@/features/auth/auth.slice'
import { LogIn } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values.email, values.password)
        if (loginAction.fulfilled.match(result)) {
          toast.success('Logged in successfully')
          navigate(ROUTES.HOME)
        } else {
          toast.error('Login failed. Please try again.')
        }
      } catch (error) {
        toast.error('Login failed. Please try again.')
      }
    },
  })

  const demoUsers = [
    {
      role: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      color: 'from-red-500 to-orange-500',
    },
    {
      role: 'Organizer',
      email: 'organizer@example.com',
      password: 'organizer123',
      color: 'from-primary to-accent',
    },
    {
      role: 'Participant',
      email: 'participant@example.com',
      password: 'participant123',
      color: 'from-green-500 to-emerald-500',
    },
    {
      role: 'Viewer',
      email: 'viewer@example.com',
      password: 'viewer123',
      color: 'from-blue-500 to-cyan-500',
    },
  ]

  const handleDemoLogin = (email: string, password: string) => {
    formik.setFieldValue('email', email)
    formik.setFieldValue('password', password)
    formik.submitForm()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12 px-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="max-w-md mx-auto w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl">
        <div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Survey + Workshop Planning Tool
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-md transition-all bg-background"
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full px-4 py-2.5 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:shadow-md transition-all bg-background"
                placeholder="Enter your password"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>
          </div>
          <div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-md hover:shadow-lg transition-all duration-200" 
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
            <p className="mt-4 text-xs text-gray-500 text-center">
              For demo purposes, any email/password will work
            </p>
          </div>
        </form>
        </div>

        {/* Demo Users Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-lg font-semibold">
              Demo Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {demoUsers.map((user) => (
                <Button
                  key={user.role}
                  onClick={() => handleDemoLogin(user.email, user.password)}
                  variant="outline"
                  className="shadow-sm hover:shadow-md transition-all"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {user.role}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

