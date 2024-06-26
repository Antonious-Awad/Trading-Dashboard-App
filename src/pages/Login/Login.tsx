import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwapifyLogo } from '../../components/icons'
import { LoginForm } from './LoginForm'
import { checkValidToken } from '../../utils/token'
import { APP_PATHS } from '../../utils/paths'

export const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (checkValidToken()) navigate(APP_PATHS.dashboard)
  })
  return (
    <>
      <div className="absolute w-[50%] top-[6rem] right-[6.1875rem] left-[37.5rem] rounded-[1.875rem] bg-white h-[52.4375rem] flex flex-col items-start gap-[3.5rem] py-[3.5rem] px-[6rem]">
        <SwapifyLogo />
        <LoginForm />
      </div>
      <div className="flex flex-col items-center justify-center self-stretch gap-[0.75rem] text-white pl-[5rem]">
        <div className="self-stretch relative font-semibold">Hello</div>
        <div className="text-h2Regular self-stretch relative">
          Enter your info to go to your account.
        </div>
      </div>
    </>
  )
}
