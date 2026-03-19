import carousel from '../../assets/Carousel.png'
import illustration from '../../assets/Illustrations.png'
import logo from '../../assets/OmneNest_icon.png'
import { useAuthStore } from '../../store/useAuthStore'
import { AuthContainer } from './forms/AuthContainer'
import { ForgotUseridPassword } from './forms/ForgotUseridPassword'
import { SetMpin } from './forms/SetMpin'
import { SetPassword } from './forms/SetPassword'

export const Login = () => {
    const { loginStep } = useAuthStore();
    return (
        <div className="flex flex-row w-full h-screen gap-6">
            {/* left side */}
            <div className='hidden md:flex-col md:flex md:w-1/2 h-full bg-[#0F62FE]'>
                {/* message  */}
                <div className="text-center mt-12">
                    <h1 className="text-[#FFFFFF] text-2xl  font-light">
                        Take Charge
                    </h1>
                    <h1 className="text-[#FFFFFF]  text-2xl  font-extrabold mt-1">
                        of Your Investments with Us
                    </h1>
                    <p className="text-[#FFFFFF]  text-sm  mt-3">
                        "Dummy Message"
                    </p>
                </div>

                {/* illustration */}
                <div className="flex-1 flex items-center justify-center">
                    <img
                        src={illustration}
                        alt="illustration"
                        className="w-54  object-contain drop-shadow-xl"
                    />
                </div>
                {/* carousel */}
                <div className='flex justify-center'>
                    <img src={carousel} alt="carousel" className='mb-8' />
                </div>
            </div>

            {/* right side */}
            <div className='w-full md:w-1/2 h-full bg-white flex flex-col justify-center items-center md:items-start px-6 sm:px-12 md:px-16'>
                <div className='w-full max-w-sm sm:max-w-md md:max-w-sm'>
                    <div className="flex flex-row mb-4">
                        <img src={logo} alt="logo" className="text-[#2A2A2B] w-25 h-8 -mr-16" />
                        <p className="md:hidden text-sm font-semibold ">Nt Web</p>
                    </div>
                  <h4 className="text-[#2A2A2B] text-xl md:text-2xl font-semibold mb-10 md:mb-16">
            {loginStep === 'forgot-credentials' ? 'Forgot password' :
             loginStep === 'set-password' ? 'Set password' :
             loginStep === 'unblock-user' ? 'Unblock Account' : 
                'Welcome to Nest App'}
        </h4>

                    {/* the various login/otp/forget password forms as per loginstep variable */}
                    {(loginStep === 'credentials' || loginStep === 'otp' || loginStep === 'idle'|| loginStep === 'unblock-user') && (
                        <AuthContainer />
                    )}

                    {loginStep === 'forgot-credentials' && (
                        <ForgotUseridPassword />
                    )}

                    {loginStep === 'set-password' && (
                        <SetPassword />
                    )}
                    {loginStep === 'set-mpin' && (
                        <SetMpin />
                    )}
                </div>
            </div>
        </div>
    )
}